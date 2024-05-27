import  { useEffect, useState } from 'react'
import { ChainId, Percent } from "@novaswap/sdk-core";
import { exploreSearchStringAtom } from "components/Tokens/state";
import { BIPS_BASE } from "constants/misc";
import { OrderDirection, chainIdToBackendName } from "graphql/data/util";
import { useAtomValue } from "jotai/utils";
import { useMemo } from "react";
import {
  ProtocolVersion,
  Token,
  useTopV2PairsQuery,
  useTopV3PoolsQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

import {
  useTokenListToken,
} from "hooks/Tokens";

import {useTopPoolsQuery} from 'graphql/thegraph/__generated__/types-and-hooks'

import {NOVA_API_TOKEN_INFO_URL} from 'constants/novaApi'

export function sortPools(pools: TablePool[], sortState: PoolTableSortState) {
  return pools.sort((a, b) => {
    switch (sortState.sortBy) {
      case PoolSortFields.TxCount:
        return sortState.sortDirection === OrderDirection.Desc
          ? b.txCount - a.txCount
          : a.txCount - b.txCount;
      case PoolSortFields.Volume24h:
        return sortState.sortDirection === OrderDirection.Desc
          ? b.volume24h - a.volume24h
          : a.volume24h - b.volume24h;
      case PoolSortFields.VolumeWeek:
        return sortState.sortDirection === OrderDirection.Desc
          ? b.volumeWeek - a.volumeWeek
          : a.volumeWeek - b.volumeWeek;
      case PoolSortFields.OneDayApr:
        return sortState.sortDirection === OrderDirection.Desc
          ? b.oneDayApr.greaterThan(a.oneDayApr)
            ? 1
            : -1
          : a.oneDayApr.greaterThan(b.oneDayApr)
            ? 1
            : -1;
      default:
        return sortState.sortDirection === OrderDirection.Desc
          ? b.tvl - a.tvl
          : a.tvl - b.tvl;
    }
  });
}

/**
 * Calculate the 1 day APR of a pool/pair which is the ratio of 24h fees to TVL expressed as a percent
 * @param volume24h the 24h volume of the pool/pair
 * @param tvl the pool/pair's TVL
 * @param feeTier the feeTier of the pool or 300 for a v2 pair
 * @returns 1 day APR expressed as a percent
 */
export function calculateOneDayApr(
  volume24h?: number,
  tvl?: number,
  feeTier?: number,
): Percent {
  if (!volume24h || !feeTier || !tvl || !Math.round(tvl)) return new Percent(0);
  return new Percent(
    Math.round(volume24h * (feeTier / BIPS_BASE)),
    Math.round(tvl),
  );
}

export const V2_BIPS = 3000;

export interface TablePool {
  hash: string;
  token0: Token;
  token1: Token;
  txCount: number;
  tvl: number;
  volume24h: number;
  volumeWeek: number;
  oneDayApr: Percent;
  feeTier: number;
  protocolVersion: ProtocolVersion;
}

export enum PoolSortFields {
  TVL = "TVL",
  Volume24h = "1 day volume",
  VolumeWeek = "7 day volume",
  OneDayApr = "1 day APR",
  TxCount = "Transactions",
}

export type PoolTableSortState = {
  sortBy: PoolSortFields;
  sortDirection: OrderDirection;
};

function useFilteredPools(pools: TablePool[]) {
  const filterString = useAtomValue(exploreSearchStringAtom);

  const lowercaseFilterString = useMemo(
    () => filterString.toLowerCase(),
    [filterString],
  );

  return useMemo(
    () =>
      pools.filter((pool) => {
        const addressIncludesFilterString = pool.hash
          .toLowerCase()
          .includes(lowercaseFilterString);
        const token0IncludesFilterString = pool.token0?.symbol
          ?.toLowerCase()
          .includes(lowercaseFilterString);
        const token1IncludesFilterString = pool.token1?.symbol
          ?.toLowerCase()
          .includes(lowercaseFilterString);
        const token0HashIncludesFilterString = pool.token0?.address
          ?.toLowerCase()
          .includes(lowercaseFilterString);
        const token1HashIncludesFilterString = pool.token1?.address
          ?.toLowerCase()
          .includes(lowercaseFilterString);
        const poolName =
          `${pool.token0?.symbol}/${pool.token1?.symbol}`.toLowerCase();
        const poolNameIncludesFilterString = poolName.includes(
          lowercaseFilterString,
        );
        return (
          token0IncludesFilterString ||
          token1IncludesFilterString ||
          addressIncludesFilterString ||
          token0HashIncludesFilterString ||
          token1HashIncludesFilterString ||
          poolNameIncludesFilterString
        );
      }),
    [lowercaseFilterString, pools],
  );
}

export function useTopPools(sortState: PoolTableSortState, chainId?: ChainId) {
  

  const [allTokens,setAllTokens] = useState<any[]>([])

  useEffect(()=>{
    fetch(`https://explorer-api.zklink.io/tokens?limit=300`).then((res) =>
      res.json().then((all) => {
        if(!all.error) {
          setAllTokens(all.items);
        }
      }),
    );
  },[])


  const getProjectToken = (address:string) => {
    const item = allTokens.find((token) => token.l2Address.toLowerCase() === address.toLowerCase());
    return item?.iconURL || '';
  }

  const {
    loading: loadingV3,
    error: errorV3,
    data: dataV3,
  } = useTopPoolsQuery({
    variables: { first: 100, chain: chainIdToBackendName(chainId) },
  });
  // const {
  //   loading: loadingV2,
  //   error: errorV2,
  //   data: dataV2,
  // } = useTopV2PairsQuery({
  //   variables: { first: 100 },
  //   skip: chainId !== ChainId.MAINNET,
  // });
  // const loading = loadingV3 || loadingV2;

  const unfilteredPools = useMemo(() => {
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
          tvl: pool.liquidity,
          volume24h,
          volumeWeek,
          totalLiquidity:{value:Number(pool.liquidity)},
          oneDayApr: calculateOneDayApr(
            volume24h,
            pool.liquidity,
            pool.feeTier,
          ),
          feeTier: pool.feeTier,
          protocolVersion: pool.protocolVersion,
        } as TablePool;
      }) ?? [];
    

    return sortPools([...topV3Pools], sortState);
  }, [dataV3?.pools, sortState]);

  const filteredPools = useFilteredPools(unfilteredPools).slice(0, 100);
  return { topPools: filteredPools, loading:loadingV3, errorV3, errorV2:null };
}
