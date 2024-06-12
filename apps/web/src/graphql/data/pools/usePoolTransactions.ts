import { ChainId } from "@novaswap/sdk-core";
import { chainIdToBackendName } from "graphql/data/util";
import { useCallback, useMemo, useRef } from "react";
import {
  PoolTransactionType,
  ProtocolVersion,
  Token,
  V2PairTransactionsQuery,
  V3PoolTransactionsQuery,
  useV2PairTransactionsQuery,
  useV3PoolTransactionsQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

import {usePoolTransactionQuery} from 'graphql/thegraph/__generated__/types-and-hooks'
import { use } from "i18next";
import { timestamp } from "nft/components/explore/Explore.css";

export enum PoolTableTransactionType {
  BUY = "Buy",
  SELL = "Sell",
  BURN = "Burn",
  MINT = "Mint",
}

export interface PoolTableTransaction {
  timestamp: number;
  transaction: string;
  pool: {
    token0: {
      id: string;
      symbol: string;
    };
    token1: {
      id: string;
      symbol: string;
    };
  };
  maker: string;
  amount0: number;
  amount1: number;
  amountUSD: number;
  type: PoolTableTransactionType;
}

const PoolTransactionDefaultQuerySize = 25;

export function usePoolTransactions(
  address: string,
  chainId?: ChainId,
  // sortState: PoolTxTableSortState, TODO(WEB-3706): Implement sorting when BE supports
  filter: PoolTableTransactionType[] = [
    PoolTableTransactionType.BUY,
    PoolTableTransactionType.SELL,
    PoolTableTransactionType.BURN,
    PoolTableTransactionType.MINT,
  ],
  token0?: Token,
  protocolVersion: ProtocolVersion = ProtocolVersion.V3,
  first = PoolTransactionDefaultQuerySize,
) {
  const {
    loading,
    error,
    data,
    fetchMore
  } = usePoolTransactionQuery({
    variables: { first, time: Math.floor(new Date().getTime() / 1000), address },
    skip: protocolVersion !== ProtocolVersion.V3,
  });
  // const {
  //   loading: loadingV2,
  //   error: errorV2,
  //   data: dataV2,
  //   fetchMore: fetchMoreV2,
  // } = useV2PairTransactionsQuery({
  //   variables: { first, address },
  //   skip: protocolVersion !== ProtocolVersion.V2 || chainId !== ChainId.MAINNET,
  // });
  const loadingMore = useRef(false);
  // const { transactions, loading, fetchMore, error } =
  //   {
  //         transactions: dataV3?.v3Pool?.transactions,
  //         loading: loadingV3,
  //         fetchMore: fetchMoreV3,
  //         error: errorV3,
  //       };

  

const transactions = useMemo(() => {

  if(data && data?.pool) {
    const {burns,swaps,mints } = data.pool;
    const burnsTx = burns.map((burn) => {
      const {id} = burn;
      const hx = id?.split('-')[0];
      const item = {
        account:burn.origin,
        hash:hx,
        timestamp:burn.timestamp,
        token0:burn.token0,
        token0Quantity:burn.amount0,
        token1:burn.token1,
        token1Quantity:burn.amount1,
        type:PoolTransactionType.Remove,
        usdValue:{
          value:burn.amountUSD
        }
      }
      return item;
    })
    const swapsTx = swaps.map((swap) => {
      const {id} = swap;
      const hx = id?.split('-')[0];
      const item = {
        account:swap.origin,
        hash:hx,
        timestamp:swap.timestamp,
        token0:swap.token0,
        token0Quantity:swap.amount0,
        token1:swap.token1,
        token1Quantity:swap.amount1,
        type:PoolTransactionType.Swap,
        usdValue:{
          value:swap.amountUSD
        }
      }
      return item;
    })

    const mintsTx = mints.map((mint) => {
      const {id} = mint;
      const hx = id?.split('-')[0];
      const item = {
        account:mint.origin,
        hash:hx,
        timestamp:mint.timestamp,
        token0:mint.token0,
        token0Quantity:mint.amount0,
        token1:mint.token1,
        token1Quantity:mint.amount1,
        type:PoolTransactionType.Add,
        usdValue:{
          value:mint.amountUSD
        }
      }
      return item;
    })
    const transactions = burnsTx.concat(swapsTx).concat(mintsTx).sort((a,b) => b.timestamp - a.timestamp);
    return transactions;
  }

  return [];
}, [data])


  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (loadingMore.current) {
        return;
      }
      loadingMore.current = true;
      fetchMore({
        variables: {
          time: transactions?.[transactions.length - 1]?.timestamp,
        },
        updateQuery: (prev, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;
          onComplete?.();
          const mergedData ={
                  pool: {
                    ...fetchMoreResult.v3Pool,
                    swaps: [
                      ...(prev.pool?.swaps ?? []),
                      ...fetchMoreResult.pool.swaps,
                    ],
                    mints: [
                      ...(prev.pool?.mints ?? []),
                      ...fetchMoreResult.pool.mints,
                    ],
                    burns: [
                      ...(prev.pool?.burns ?? []),
                      ...fetchMoreResult.pool.burns,
                    ],
                  },
                };
          loadingMore.current = false;
          return mergedData;
        },
      });
    },
    [fetchMore, transactions, protocolVersion],
  );

  const filteredTransactions = useMemo(() => {
    return (transactions ?? [])
      ?.map((tx) => {
        if (!tx) {
          return undefined;
        }
        const tokenIn =
          parseFloat(tx.token0Quantity) > 0 ? tx.token0 : tx.token1;
        const isSell =
          tokenIn?.address?.toLowerCase() === token0?.address?.toLowerCase();
        const type =
          tx.type === PoolTransactionType.Swap
            ? isSell
              ? PoolTableTransactionType.SELL
              : PoolTableTransactionType.BUY
            : tx.type === PoolTransactionType.Remove
              ? PoolTableTransactionType.BURN
              : PoolTableTransactionType.MINT;
        if (!filter.includes(type)) return undefined;
        return {
          timestamp: tx.timestamp,
          transaction: tx.hash,
          pool: {
            token0: {
              id: tx.token0.address ?? "",
              symbol: tx.token0.symbol ?? "",
            },
            token1: {
              id: tx.token1.address ?? "",
              symbol: tx.token1.symbol ?? "",
            },
          },
          maker: tx.account,
          amount0: parseFloat(tx.token0Quantity),
          amount1: parseFloat(tx.token1Quantity),
          amountUSD: tx.usdValue.value,
          type,
        };
      })
      .filter(
        (
          value: PoolTableTransaction | undefined,
        ): value is PoolTableTransaction => value !== undefined,
      );
  }, [transactions, filter, token0?.address]);

  return useMemo(() => {
    return {
      transactions: filteredTransactions,
      loading,
      loadMore,
      error,
    };
  }, [filteredTransactions, loading, loadMore, error]);
}
