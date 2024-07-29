import { ContractTransaction } from '@ethersproject/contracts'
import { InterfaceEventName } from '@uniswap/analytics-events'
import { CurrencyAmount, MaxUint256, Token } from "@novaswap/sdk-core";
import { sendAnalyticsEvent, useTrace as useAnalyticsTrace } from 'analytics'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useCallback, useEffect, useMemo, useState, useContext } from 'react'
import { ApproveTransactionInfo, TransactionType } from 'state/transactions/types'
import { trace } from 'tracing/trace'
import { UserRejectedRequestError } from 'utils/errors'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'
import { SwapContext } from "state/swap/types";
import { APP_RPC_URLS } from "constants/networks";
import { encodeFunctionData } from 'viem';
import { zkSyncProvider } from 'novaProvider/zksync-provider';
import {
  utils,
  Signer as ZksyncSigner,
  Provider,
  Wallet,
  Web3Provider,
  Contract,
} from "zksync-web3";
import { PAYMASTER_CNOTRACTS } from "constants/routing";
import { calculateGasMargin } from "utils/calculateGasMargin";
import { useWeb3React } from "@web3-react/core";
import ERC20_ABI from 'uniswap/src/abis/erc20.json'
import { ethers } from "ethers";
import toast from 'react-hot-toast';

const MAX_ALLOWANCE = MaxUint256.toString()

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): {
  tokenAllowance?: CurrencyAmount<Token>
  isSyncing: boolean
} {
  const contract = useTokenContract(token?.address, false)
  const inputs = useMemo(() => [owner, spender], [owner, spender])

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the tokenAllowance is marked isSyncing upon approval and updated upon being synced.
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>()
  const { result, syncing: isSyncing } = useSingleCallResult(contract, 'allowance', inputs, { blocksPerFetch }) as {
    result?: Awaited<ReturnType<NonNullable<typeof contract>['allowance']>>
    syncing: boolean
  }

  const rawAmount = result?.toString() // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount]
  )
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance])

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing }), [allowance, isSyncing])
}

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const contract = useTokenContract(amount?.currency.address)
  const analyticsTrace = useAnalyticsTrace()
  const { swapState, setSwapState } = useContext(SwapContext);
  const { account, chainId } = useWeb3React()
  const novaRpc: string | undefined = useMemo(() => {
    if (chainId) {
      if (Object.keys(APP_RPC_URLS).includes(chainId?.toString())) {
        return APP_RPC_URLS[chainId?.toString()][0];
      }
      return undefined;
    }
    return undefined;
  }, [chainId]);

  return useCallback(
    () =>
      trace({ name: 'Allowance', op: 'permit.allowance' }, async (trace) => {
        try {
          if (!amount) throw new Error('missing amount')
          if (!contract) throw new Error('missing contract')
          if (!spender) throw new Error('missing spender')

          const usePaymster =  swapState.gasToken?.symbol !== "ETH";


          const allowance = amount.equalTo(0) ? '0' : MAX_ALLOWANCE
          const response = await trace.child({ name: 'Approve', op: 'wallet.approve' }, async (walletTrace) => {
            try {
              if(usePaymster) {
                const txData = encodeFunctionData({
                  abi: ERC20_ABI,
                  functionName: 'approve',
                  args: [spender, ethers.BigNumber.from(MAX_ALLOWANCE)]
                })
                const tx = {
                  from: account as `0x${string}`,
                  to: contract.address as `0x${string}`,
                  data: txData,
                }
                const fee = await zkSyncProvider.attachEstimateFee(novaRpc)(tx)
                const paymasterContract = PAYMASTER_CNOTRACTS[chainId];
                const paymasterParams = utils.getPaymasterParams(paymasterContract, {
                  type: "ApprovalBased",
                  token: swapState.gasToken.address,
                  minimalAllowance:  ethers.BigNumber.from(MAX_ALLOWANCE),
                  // empty bytes as testnet paymaster does not use innerInput
                  innerInput: new Uint8Array(),
                });

                const zksyncProvider = new Web3Provider(contract.provider.provider);
                const zksyncSigner = ZksyncSigner.from({
                  ...contract.signer,
                  provider: zksyncProvider,
                });
                const res = await zksyncSigner.sendTransaction({
                  ...tx,
                  customData: {
                    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                    paymasterParams,
                  },
                  maxFeePerGas: fee.maxFeePerGas.toBigInt(),
                  maxPriorityFeePerGas: ethers.BigNumber.from(0), // must set 0
                  gasLimit: fee.gasLimit.mul(200).div(100),
                });
                return res;
              }
              return await contract.approve(spender, allowance)
            } catch (error) {
              if (didUserReject(error)) {
                walletTrace.setStatus('cancelled')
                const symbol = amount?.currency.symbol ?? 'Token'
                throw new UserRejectedRequestError(`${symbol} token allowance failed: User rejected`)
              } else {
                throw error
              }
            }
          })
          sendAnalyticsEvent(InterfaceEventName.APPROVE_TOKEN_TXN_SUBMITTED, {
            chain_id: amount.currency.chainId,
            token_symbol: amount.currency.symbol,
            token_address: amount.currency.address,
            ...analyticsTrace,
          })
          return {
            response,
            info: {
              type: TransactionType.APPROVAL,
              tokenAddress: contract.address,
              spender,
              amount: allowance,
            },
          }
        } catch (error: unknown) {
          if (error instanceof UserRejectedRequestError) {
            trace.setStatus('cancelled')
            throw error
          } else {
            const symbol = amount?.currency.symbol ?? 'Token'
            if(error.data && error.data.message && error.data.message.includes('transfer amount exceeds balance')) {
              toast(`Not enough ${symbol} for gas fee.`)
            }
            throw new Error(`${symbol} token allowance failed: ${error instanceof Error ? error.message : error}`)
          }
        }
      }),
    [amount, contract, spender, analyticsTrace, swapState]
  )
}

export function useRevokeTokenAllowance(
  token: Token | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const amount = useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, 0) : undefined), [token])

  return useUpdateTokenAllowance(amount, spender)
}
