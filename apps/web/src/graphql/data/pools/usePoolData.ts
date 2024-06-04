import { tab } from './../../../nft/components/details/AssetDetails.css';
import { ChainId } from "@novaswap/sdk-core";
import { V2_BIPS } from "graphql/data/pools/useTopPools";
import { chainIdToBackendName } from "graphql/data/util";
import ms from "ms";
import { useMemo } from "react";
import {
  ProtocolVersion,
  Token,
  useV2PairQuery,
  useV3PoolQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

import {usePoolDataQuery} from 'graphql/thegraph/__generated__/types-and-hooks'
import { useNovaTokenList } from "hooks/useNovaTokenList";

export interface PoolData {
  // basic pool info
  address: string;
  feeTier?: number;
  txCount?: number;
  protocolVersion?: ProtocolVersion;

  // token info
  token0: Token;
  tvlToken0?: number;
  token0Price?: number;

  token1: Token;
  tvlToken1?: number;
  token1Price?: number;

  // volume
  volumeUSD24H?: number;
  volumeUSD24HChange?: number;

  // liquidity
  tvlUSD?: number;
  tvlUSDChange?: number;
}

type VolumeChange = { value: number; timestamp: number };

/**
 * Given an array of historical volume, calculate the 24h % change in volume
 */
function calc24HVolChange(historicalVolume?: (VolumeChange | undefined)[]) {
  if (!historicalVolume) {
    return undefined;
  }
  const currentTime = new Date().getTime();
  const dayAgo = (currentTime - ms("1d")) / 1000;
  const twoDaysAgo = (currentTime - ms("2d")) / 1000;

  const volume24h = historicalVolume
    .filter(
      (entry): entry is VolumeChange =>
        entry?.timestamp !== undefined && entry.timestamp >= dayAgo,
    )
    .reduce((acc, cur) => acc + cur.value, 0);
  const volume48h = historicalVolume
    .filter(
      (entry): entry is VolumeChange =>
        entry?.timestamp !== undefined &&
        entry.timestamp >= twoDaysAgo &&
        entry.timestamp < dayAgo,
    )
    .reduce((acc, cur) => acc + cur.value, 0);
  return ((volume24h - volume48h) / volume48h) * 100;
}


function calc24hChange(a: number, b: number): number {
  if (b === 0) {
    return 100;
  }
  return (a - b)/ b * 100;
}



/**
 * Queries both v3 and v2 for pool data
 * @param poolAddress
 * @param chainId
 * @returns
 */
export function usePoolData(
  poolAddress: string,
  chainId?: ChainId,
): {
  loading: boolean;
  error: boolean;
  data?: PoolData;
} {
  const {
    loading: loadingV3,
    error: errorV3,
    data: dataV3,
  } = usePoolDataQuery({
    variables: { address: poolAddress },
    errorPolicy: "all",
  });

  const { novaTokenList } = useNovaTokenList()
  // const {
  //   loading: loadingV2,
  //   error: errorV2,
  //   data: dataV2,
  // } = useV2PairQuery({
  //   variables: { address: poolAddress },
  //   skip: chainId !== ChainId.MAINNET,
  //   errorPolicy: "all",
  // });
  const getProjectToken = (address:string) => {
    const item = novaTokenList.find((token) => token.l2Address.toLowerCase() === address.toLowerCase());
    return item?.iconURL || '';
  }

  console.log('dataV3=====>',dataV3)

  return useMemo(() => {
    const anyError = Boolean(
      errorV3
    );
    const anyLoading = Boolean(
      loadingV3
    );

    const pool = dataV3?.pool ?? undefined;
    const feeTier = dataV3?.pool?.feeTier ?? V2_BIPS;
    if(!pool) {
      return {
        data: undefined,
        error: anyError,
        loading: anyLoading,
      }
    }


    const token0Project = getProjectToken(pool.token0.address);
    const token1Project = getProjectToken(pool.token1.address);
    const {poolDayData} = pool;
    const volume24h = poolDayData?.length > 0 ? poolDayData[0].volumeUSD : 0;
    let volumeUSD24HChange = 0;
    let tvlUSDChange = 0
    if(poolDayData?.length > 1) { 
      const volume48h = poolDayData[1].volumeUSD;
      const tvl24h = poolDayData[0].tvlUSD;
      const tvl48h = poolDayData[1].tvlUSD;
      volumeUSD24HChange = calc24hChange(volume24h, volume48h);
      tvlUSDChange = calc24hChange(tvl24h, tvl48h);
    }

    return {
      data: pool
        ? {
            address: pool.id,
            txCount: pool.txCount,
            protocolVersion: 'V3',
            token0: {...pool.token0,project: {logo:{url:token0Project}},chain:"Nova Mainnet"} as Token,
            tvlToken0: pool.totalValueLockedToken0,
            token0Price: pool.token0Price,
            token1: {...pool.token1,project:{logo:{url:token1Project}},chain:'Nova Mainnet'} as Token,
            tvlToken1: pool.totalValueLockedToken1,
            token1Price: pool.token1Price,
            feeTier,
            volumeUSD24H: volume24h,
            volumeUSD24HChange: volumeUSD24HChange,
            tvlUSD: pool.totalValueLockedUSD,
            tvlUSDChange: tvlUSDChange,
          }
        : undefined,
      error: anyError,
      loading: anyLoading,
    };
  }, [
    novaTokenList,
    chainId,
    dataV3?.pool,
    errorV3,
    loadingV3,
  ]);
}
