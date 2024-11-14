import { ChainId } from "@novaswap/sdk-core";
import { chainIdToBackendName } from "graphql/data/util";
import { useTokenSwapsTxQuery } from "graphql/thegraph/__generated__/types-and-hooks";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Chain,
  PoolTransaction,
  PoolTransactionType,
  useV2TokenTransactionsQuery,
  useV3TokenTransactionsQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";
import { useNovaTokenList } from "hooks/useNovaTokenList";
export enum TokenTransactionType {
  BUY = "Buy",
  SELL = "Sell",
}

const TokenTransactionDefaultQuerySize = 500;
const Time = Math.floor(new Date().getTime() / 1000);
export function useTokenTransactions(
  address: string,
  chainId: ChainId,
  filter: TokenTransactionType[] = [
    TokenTransactionType.BUY,
    TokenTransactionType.SELL,
  ],
) {
  const [list, setList] = useState<any[]>([]);
  const { novaTokenList } = useNovaTokenList();
  const {
    data: dataV3,
    loading: loadingV3,
    fetchMore: fetchMoreV3,
    error: errorV3,
  } = useTokenSwapsTxQuery({
    variables: {
      address: address.toLowerCase(),
      first: TokenTransactionDefaultQuerySize,
      time: Time,
    },
  });

  // const {
  //   data: dataV2,
  //   loading: loadingV2,
  //   error: errorV2,
  //   fetchMore: fetchMoreV2,
  // } = useV2TokenTransactionsQuery({
  //   variables: {
  //     address: address.toLowerCase(),
  //     first: TokenTransactionDefaultQuerySize,
  //   },
  //   skip: chainId !== ChainId.MAINNET,
  // });
  const loadingMoreV3 = useRef(false);
  const loadingMoreV2 = useRef(false);
  const querySizeRef = useRef(TokenTransactionDefaultQuerySize);
  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (loadingMoreV3.current) {
        return;
      }
      loadingMoreV3.current = true;
      querySizeRef.current += TokenTransactionDefaultQuerySize;

      fetchMoreV3({
        variables: {
          address: address.toLowerCase(),
          first: TokenTransactionDefaultQuerySize,
          time: dataV3?.swaps2?.[dataV3.swaps2.length - 1]?.timestamp,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          onComplete?.();
          const mergedData = {
            token: {
              ...prev.token,
            },
            swaps: [...(prev.swaps ?? []), ...(fetchMoreResult.swaps ?? [])],
            swaps2: [...(prev.swaps2 ?? []), ...(fetchMoreResult.swaps2 ?? [])],
          };
          loadingMoreV3.current = false;
          setList([...mergedData.swaps, ...mergedData.swaps2]);
          return mergedData;
        },
      });
    },
    [setList, chainId, dataV3?.swaps, fetchMoreV3],
  );

  const getProjectToken = (address: string) => {
    const item = novaTokenList?.find(
      (token) => token.l2Address.toLowerCase() === address.toLowerCase(),
    );
    return item?.iconURL || "";
  };

  const transactions = useMemo(() => {
    // console.log('dataV3?.swaps',dataV3?.swaps)
    const swapMerge =
      list.length > 0
        ? list
        : [...(dataV3?.swaps || []), ...(dataV3?.swaps2 || [])].sort(
            (a, b) => b.timestamp - a.timestamp,
          );
    const swaps = swapMerge?.map((swap) => {
      const token0Logo = getProjectToken(swap.token0.address || "");
      const token1Logo = getProjectToken(swap.token1.address || "");
      const hash = swap.hash?.split("-")[0];
      return {
        ...swap,
        usdValue: {
          value: swap.usdValue,
        },
        hash,
        token0: token0Logo
          ? {
              ...swap.token0,
              project: { logo: { url: token0Logo } },
              chain: "NOVAMAINNET",
            }
          : { ...swap.token0, chain: "NOVAMAINNET" },
        token1: token1Logo
          ? {
              ...swap.token1,
              project: { logo: { url: token1Logo } },
              chain: "NOVAMAINNET",
            }
          : { ...swap.token1, chain: "NOVAMAINNET" },
      };
    });
    return [
      ...(swaps?.filter((tx) => {
        if (!tx) {
          return false;
        }
        const tokenBeingSold =
          parseFloat(tx.token0Quantity) < 0 ? tx.token0 : tx.token1;
        const isSell =
          tokenBeingSold.address?.toLowerCase() === address.toLowerCase();
        return filter.includes(
          isSell ? TokenTransactionType.SELL : TokenTransactionType.BUY,
        );
      }) ?? []),
    ];
    // .sort((a, b): number =>
    //   a?.timestamp && b?.timestamp
    //     ? b.timestamp - a.timestamp
    //     : a?.timestamp === null
    //       ? -1
    //       : 1,
    // )
    // .slice(0, querySizeRef.current)
  }, [list, address, dataV3, filter, novaTokenList]);

  return useMemo(() => {
    return {
      transactions: transactions as PoolTransaction[],
      loading: loadingV3,
      loadMore,
      errorV2: null,
      errorV3,
    };
  }, [transactions, loadingV3, loadMore, errorV3]);
}
