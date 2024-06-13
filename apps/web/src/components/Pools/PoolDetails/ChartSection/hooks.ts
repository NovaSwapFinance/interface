import { Token } from "@novaswap/sdk-core";
import { PriceChartData } from "components/Charts/PriceChart";
import { SingleHistogramData } from "components/Charts/VolumeChart/renderer";
import { ChartType } from "components/Charts/utils";
import {
  ChartQueryResult,
  DataQuality,
  checkDataQuality,
  withUTCTimestamp,
} from "components/Tokens/TokenDetails/ChartSection/util";
import { PoolData } from "graphql/data/pools/usePoolData";
import { UTCTimestamp } from "lightweight-charts";
import { useMemo } from "react";
import {
  Chain,
  HistoryDuration,
  TimestampedAmount,
  TimestampedPoolPrice,
  usePoolPriceHistoryQuery,
  usePoolVolumeHistoryQuery,
} from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

import {usePoolHourDataQuery} from 'graphql/thegraph/__generated__/types-and-hooks' 

type PDPChartQueryVars = {
  address: string;
  chain: Chain;
  duration: HistoryDuration;
  isV3: boolean;
};
export function usePDPPriceChartData(
  variables: PDPChartQueryVars,
  poolData: PoolData | undefined,
  tokenA: Token | undefined,
  tokenB: Token | undefined,
  isReversed: boolean,
): ChartQueryResult<PriceChartData, ChartType.PRICE> {
  const {address,duration} = variables;
  const getTime =  {
    [HistoryDuration.Day]:() => Math.floor((new Date().getTime() - 24 * 60 * 60 * 1000) /1000 ),
    [HistoryDuration.Week]:() => Math.floor((new Date().getTime() - 7 * 24 * 60 * 60 * 1000) /1000 ),
    [HistoryDuration.Month]:() => Math.floor((new Date().getTime() - 30 * 24 * 60 * 60 * 1000) /1000 ),
  }
  const { data, loading } = usePoolHourDataQuery({variables :{ address , time:getTime[duration]() }});

  console.log('data=======>',duration,data)

  return useMemo(() => {
    const { poolHourData } =  data?.pool ?? {};
    const referenceToken = isReversed ? tokenA : tokenB;

    const entries =
    poolHourData?.map((price) => {
          const value =
            poolData?.token0.address === referenceToken?.address.toLowerCase()
              ? Number(price?.token0Price)
              : Number(price?.token1Price);

          return {
            time: price.timestamp as UTCTimestamp,
            value,
            open: value,
            high: value,
            low: value,
            close: value,
          };
        }) ?? [];

    // TODO(WEB-3769): Append current price based on active tick to entries
    /* const dataQuality = checkDataQuality(entries, ChartType.PRICE, variables.duration) */
    const dataQuality =
      loading || !poolHourData ? DataQuality.INVALID : DataQuality.VALID;

    return { chartType: ChartType.PRICE, entries, loading, dataQuality };
  }, [
    data?.pool,
    isReversed,
    loading,
    poolData?.token0.address,
    tokenA,
    tokenB,
  ]);
}

export function usePDPVolumeChartData(
  variables: PDPChartQueryVars,
): ChartQueryResult<SingleHistogramData, ChartType.VOLUME> {
  const {address,duration} = variables;
  const getTime =  {
    [HistoryDuration.Day]:() => Math.floor((new Date().getTime() - 24 * 60 * 60 * 1000) /1000 ),
    [HistoryDuration.Week]:() => Math.floor((new Date().getTime() - 7 * 24 * 60 * 60 * 1000) /1000 ),
    [HistoryDuration.Month]:() => Math.floor((new Date().getTime() - 30 * 24 * 60 * 60 * 1000) /1000 ),
  }
  const { data, loading } = usePoolHourDataQuery({variables :{ address , time:getTime[duration]() }});

  return useMemo(() => {
    const { poolHourData } = data?.pool ?? {};
    const entries = poolHourData?.map(withUTCTimestamp) ?? [];

    const dataQuality = checkDataQuality(
      entries,
      ChartType.VOLUME,
      variables.duration,
    );

    return { chartType: ChartType.VOLUME, entries, loading, dataQuality };
  }, [data?.pool, loading, variables.duration]);
}
