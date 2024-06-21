// @ts-nocheck
import { useWeb3React } from "@web3-react/core";
import { formatUnits } from "viem";
import bignumber from "bignumber.js";
import { useMemo, useEffect, useState } from "react";
import { ChainId } from "@novaswap/sdk-core";
import { sourceChainMap} from "constants/chains";
import { NOVA_API_ADDRESS_URL} from "constants/novaApi";

// TODO change fetchUrl and ChainId hainId.NOVA_SEPOLIA,

function formatBalance(balance: bigint, decimals: number, fixed: number = 8) {
  const v = new bignumber(
    new bignumber(formatUnits(balance ?? BigInt(0), decimals)).toFixed(
      fixed,
      1,
    ),
  ).toNumber(); //use 1 to round_down
  return v;
}

export const useTokenBalanceList = () => {
  
  const [allTokens, setAllTokens] = useState({ balances: {} });
  const { account,chainId } = useWeb3React();

  const url = NOVA_API_ADDRESS_URL[chainId]?NOVA_API_ADDRESS_URL[chainId]:NOVA_API_ADDRESS_URL[ChainId.NOVA_MAINNET];

  useEffect(() => {
    fetch(`${url}${account}`).then((res) =>
      res.json().then((all) => {
        if(!all.error) {
          setAllTokens(all);
        }
      }),
    );
    const timer = setInterval(() => {
      fetch(`${url}${account}`).then((res) =>
        res.json().then((all) => {
          if(!all.error) {
            setAllTokens(all);
          }
        }),
      );
    }, 1000 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [account,chainId]);

  const tokensWithBalance = useMemo(() => {
    const hasBalanceList = Object.values(allTokens?.balances||{})
      .filter((balances) => balances.token)
      .map((balances) => {
        const {symbol, networkKey} = balances.token;
        const sourceSuffix = networkKey ? sourceChainMap[networkKey] :undefined
      const sourceSymbol = `${symbol}${sourceSuffix? `.${sourceSuffix}`:''}`
      const formattedBalance = formatBalance(
        balances.balance ?? 0n,
        balances.token.decimals,
      );
      const balanceText = formattedBalance >= 0.001 ? formattedBalance.toFixed(3) : '<0.001';
        const token = {
          id: balances.token.l2Address,
          chainId: [ChainId.NOVA_SEPOLIA, ChainId.NOVA_MAINNET].includes(chainId)?chainId :ChainId.NOVA_MAINNET,
          address: balances.token.l2Address,
          formattedBalance,
          balanceText,
          usdValue:0,
          ...balances.token,
          symbol:sourceSymbol
        };
        if (token.usdPrice) {
          const usdValue = token.formattedBalance * token.usdPrice || 0;
          token.usdValue = usdValue;
          if (usdValue >= 0.01) {
            token.usdValueText = `$${usdValue.toFixed(2, 1)}`;
          } else {
            token.usdValueText = '<$0.01'
          }
        }

        // if(balances.token.l2Address ===   '0xA8A59Bb7fe9fE2364ae39a3B48E219fAB096c852') {
        //   console.log("balancestoken====>",balances.balance, balances.token.decimals, token);
        // }
        return token;
      });

    return hasBalanceList.filter(
      (token) => parseFloat(token.formattedBalance) > 0.00001,
    ).sort((a, b) => b.usdValue - a.usdValue);;
  }, [allTokens,chainId]);

  const totalUsdValue = tokensWithBalance.reduce((total, token) => total + (token.usdValue || 0 ), 0);

  console.log("tokensWithBalance====>", tokensWithBalance);
  console.log("tokensWithBalance====>totalUsdValue", totalUsdValue);
  return { tokensWithBalance  ,totalUsdValue};
};
