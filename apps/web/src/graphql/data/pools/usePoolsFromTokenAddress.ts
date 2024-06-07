import { ChainId } from "@novaswap/sdk-core";
import {
  PoolTableSortState,
  TablePool,
  V2_BIPS,
  calculateOneDayApr,
  sortPools,
} from "graphql/data/pools/useTopPools";
import { chainIdToBackendName } from "graphql/data/util";
import { usePoolsByToken0IdQuery, usePoolsByToken1IdQuery } from "graphql/thegraph/__generated__/types-and-hooks";
import { useNovaTokenList } from "hooks/useNovaTokenList";
import { useCallback, useMemo, useRef } from "react";
import {
  useTopV2PairsQuery,
  useTopV3PoolsQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

const DEFAULT_QUERY_SIZE = 20;

export function usePoolsFromTokenAddress(
  tokenAddress: string,
  sortState: PoolTableSortState,
  chainId?: ChainId,
) {

  const {
    novaTokenList,
  } = useNovaTokenList();

  const {
    loading: loadingV3,
    error: errorV3,
    data: dataV3,
    fetchMore: fetchMoreV3,
  } = usePoolsByToken0IdQuery({
    variables: {
      first: DEFAULT_QUERY_SIZE,
      address: tokenAddress?.toLowerCase(),
    },
  });

  const {
    loading: loadingV2,
    error: errorV2,
    data: dataV2,
    fetchMore: fetchMoreV2,
  } = usePoolsByToken1IdQuery({
    variables: {
      first: DEFAULT_QUERY_SIZE,
      address: tokenAddress?.toLowerCase(),
    },
  });

  const loading = loadingV3 || loadingV2;

  const loadingMoreV3 = useRef(false);
  const loadingMoreV2 = useRef(false);
  const sizeRef = useRef(DEFAULT_QUERY_SIZE);
  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (
        loadingMoreV3.current ||
        (loadingMoreV2.current && chainId === ChainId.MAINNET)
      ) {
        return;
      }
      loadingMoreV3.current = true;
      loadingMoreV2.current = true;
      sizeRef.current += DEFAULT_QUERY_SIZE;
      fetchMoreV3({
        variables: {
          cursor:
            dataV3?.topV3Pools?.[dataV3.topV3Pools.length - 1]?.totalLiquidity
              ?.value,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !prev || !Object.keys(prev).length)
            return prev;
          if (!loadingMoreV2.current || chainId !== ChainId.MAINNET)
            onComplete?.();
          const mergedData = {
            topV3Pools: [
              ...(prev.topV3Pools ?? []).slice(),
              ...(fetchMoreResult.topV3Pools ?? []).slice(),
            ],
          };
          loadingMoreV3.current = false;
          return mergedData;
        },
      });
      chainId === ChainId.MAINNET &&
        fetchMoreV2({
          variables: {
            cursor:
              dataV2?.topV2Pairs?.[dataV2.topV2Pairs.length - 1]?.totalLiquidity
                ?.value,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || !prev || !Object.keys(prev).length)
              return prev;
            if (!loadingMoreV3.current) onComplete?.();
            const mergedData = {
              topV2Pairs: [
                ...(prev.topV2Pairs ?? []).slice(),
                ...(fetchMoreResult.topV2Pairs ?? []).slice(),
              ],
            };
            loadingMoreV2.current = false;
            return mergedData;
          },
        });
    },
    [chainId, dataV2?.topV2Pairs, dataV3?.topV3Pools, fetchMoreV2, fetchMoreV3],
  );

  const getProjectToken = (address:string) => {
    const item = novaTokenList.find((token) => token.l2Address.toLowerCase() === address.toLowerCase());
    return item?.iconURL || '';
  }

  return useMemo(() => {
    const topV3Pools: TablePool[] =
    dataV3?.pools?.map((pool) => {
      let volume24h = 0;
      let volumeWeek = 0;
      if(pool.poolDayData?.length > 0){ 
        volume24h = pool.poolDayData[pool.poolDayData.length -1].volumeUSD
        if (pool.poolDayData.length >= 7) {
          volumeWeek = pool.poolDayData.slice(-7).reduce((prev, curr) => prev + Number(curr.volumeUSD), 0);
        } else {
          volumeWeek = pool.poolDayData.reduce((prev, curr) => prev + Number(curr.volumeUSD), 0);
        }
      }
      const token0Project = getProjectToken(pool.token0.address);
      const token1Project = getProjectToken(pool.token1.address);
      return {
        hash: pool.id,
        token0: {...pool.token0,logoUrl:token0Project},
        token1:  {...pool.token1,logoUrl:token1Project},
        txCount: pool.txCount,
        tvl: pool.totalValueLockedUSD,
        volume24h,
        volumeWeek,
        totalLiquidity:{value:Number(pool.liquidity)},
        oneDayApr: calculateOneDayApr(
          volume24h,
          pool.totalValueLockedUSD,
          pool.feeTier,
        ),
        feeTier: pool.feeTier,
        protocolVersion: pool.protocolVersion,
      } as TablePool;
    }) ?? [];
    const topV2Pairs: TablePool[] =
      dataV2?.pools?.map((pool) => {
        let volume24h = 0;
        let volumeWeek = 0;
        if(pool.poolDayData?.length > 0){ 
          volume24h = pool.poolDayData[pool.poolDayData.length -1].volumeUSD
          if (pool.poolDayData.length >= 7) {
            volumeWeek = pool.poolDayData.slice(-7).reduce((prev, curr) => prev + Number(curr.volumeUSD), 0);
          } else {
            volumeWeek = pool.poolDayData.reduce((prev, curr) => prev + Number(curr.volumeUSD), 0);
          }
        }
        const token0Project = getProjectToken(pool.token0.address);
        const token1Project = getProjectToken(pool.token1.address);
        return {
          hash: pool.id,
          token0: {...pool.token0,logoUrl:token0Project},
          token1:  {...pool.token1,logoUrl:token1Project},
          txCount: pool.txCount,
          tvl: pool.totalValueLockedUSD,
          volume24h,
          volumeWeek,
          totalLiquidity:{value:Number(pool.liquidity)},
          oneDayApr: calculateOneDayApr(
            volume24h,
            pool.totalValueLockedUSD,
            pool.feeTier,
          ),
          feeTier: pool.feeTier,
          protocolVersion: pool.protocolVersion,
        } as TablePool;
      }) ?? [];

    const pools = sortPools([...topV3Pools, ...topV2Pairs], sortState).slice(
      0,
      sizeRef.current,
    );
    return { loading, errorV2, errorV3, pools };
  }, [
    dataV2?.pools,
    dataV3?.pools,
    errorV2,
    errorV3,
    loading,
    sortState,
    novaTokenList
  ]);
}
