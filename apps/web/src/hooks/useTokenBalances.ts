import { load } from 'cheerio';
import { useWeb3React } from '@web3-react/core'
import { useTokenBalancesQuery } from 'graphql/data/apollo/TokenBalancesProvider'
import { supportedChainIdFromGQLChain } from 'graphql/data/util'
import { TokenBalances } from 'lib/hooks/useTokenList/sorting'
import { useMemo,useState,useEffect } from 'react'
import bignumber from "bignumber.js";
import { formatUnits } from "viem";
import { PortfolioTokenBalancePartsFragment } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import {NOVA_API_ADDRESS_URL} from 'constants/novaApi'
import { sourceChainMap } from 'constants/chains';


function formatBalance(balance: bigint, decimals: number, fixed: number = 8) {
  const v = new bignumber(
    new bignumber(formatUnits(balance ?? BigInt(0), decimals)).toFixed(
      fixed,
      1,
    ),
  ).toNumber(); //use 1 to round_down
  return v;
}

export function useTokenBalances(): {
  balanceMap: TokenBalances
  balanceList: readonly (PortfolioTokenBalancePartsFragment | undefined)[]
  loading: boolean
} {
  const { chainId } = useWeb3React()
  const { data, loading } = useTokenBalancesQuery()
  return useMemo(() => {
    const balanceList = data?.portfolios?.[0]?.tokenBalances ?? []
    const balanceMap =
      balanceList?.reduce((balanceMap, tokenBalance) => {
        const address =
          tokenBalance?.token?.standard === 'ERC20'
            ? tokenBalance.token?.address?.toLowerCase()
            : tokenBalance?.token?.symbol ?? 'ETH'
        if (
          tokenBalance?.token?.chain &&
          supportedChainIdFromGQLChain(tokenBalance.token?.chain) === chainId &&
          address &&
          tokenBalance.denominatedValue?.value !== undefined
        ) {
          const usdValue = tokenBalance.denominatedValue?.value
          const balance = tokenBalance.quantity
          balanceMap[address] = { usdValue, balance: balance ?? 0 }
        }
        return balanceMap
      }, {} as TokenBalances) ?? {}
    return { balanceMap, balanceList, loading }
  }, [chainId, data?.portfolios, loading])
}


export function useNovaTokenBalances() {
  const [allTokens, setAllTokens] = useState({ balances: {} });
  const [loading, setLoading] = useState(false);
  const { account,chainId } = useWeb3React();

  const url = NOVA_API_ADDRESS_URL[chainId]?NOVA_API_ADDRESS_URL[chainId]:NOVA_API_ADDRESS_URL[ChainId.NOVA_MAINNET];

  function convertJsonToPortfolioTokenBalance(jsonData) {
    const portfolioTokens = [];
    
    for (const address in jsonData.balances) {
      const balanceInfo = jsonData.balances[address];
      if(!balanceInfo.token || !balanceInfo.token?.usdPrice) continue;
      
      // Create Token object
  
        const tokenData = balanceInfo.token;
        const sourceSuffix = tokenData.networkKey ? sourceChainMap[tokenData.networkKey] :undefined
        const symbol = `${tokenData.symbol}${sourceSuffix? `.${sourceSuffix}`:''}`
        const token = {
          __typename: "Token",
          id: tokenData.l2Address,
          address: tokenData.l2Address,
          standard: tokenData.symbol === 'ETH' ? "NATIVE" : "ERC20",
          chain: "Nova Mainnet",
          symbol,
          name: tokenData.name,
          decimals: tokenData.decimals,
          project: tokenData.project ? {
            __typename: "TokenProject",
            id: tokenData.project.id,
            name: tokenData.project.name,
            logoUrl: tokenData.project.logoUrl,
            isSpam: tokenData.project.isSpam
          } : undefined
        };
      
        const formattedBalance = formatBalance(
          balanceInfo.balance ?? 0n,
          balanceInfo.token.decimals,
        )

      const usdValue = formattedBalance * balanceInfo.token.usdPrice || 0;
  
      
      // Create PortfolioTokenBalancePartsFragment object
      const portfolioToken = {
        __typename: "TokenBalance",
        id: address,
        quantity:formattedBalance,
        denominatedValue: {value:usdValue},
        token: token,
        tokenProjectMarket:{tokenProject:{isSpam:false}}
      };
      
      portfolioTokens.push(portfolioToken);
    }
    
    return portfolioTokens;
  }
  

  useEffect(() => {
    setLoading(true)
    fetch(`${url}${account}`).then((res) =>
      res.json().then((all) => {
        if(!all.error) {
          setAllTokens(all);
        }
        setLoading(false)
      }),
    );
  }, [account,chainId]);


  return useMemo(() => {
    const balanceList = convertJsonToPortfolioTokenBalance(allTokens)
    const balanceMap =
      balanceList?.reduce((balanceMap, tokenBalance) => {
        const address =
          tokenBalance?.token?.symbol !== 'ETH'
            ? tokenBalance.token?.address?.toLowerCase()
            : tokenBalance?.token?.symbol ?? 'ETH'
        if (
          address &&
          tokenBalance.denominatedValue?.value !== undefined
        ) {
          const usdValue = tokenBalance.denominatedValue?.value
          const balance = tokenBalance.quantity
          balanceMap[address] = { usdValue, balance: balance ?? 0 }
        }
        return balanceMap
      }, {} as TokenBalances) ?? {}
    return { balanceMap, balanceList, loading }
  }, [allTokens, loading])

}