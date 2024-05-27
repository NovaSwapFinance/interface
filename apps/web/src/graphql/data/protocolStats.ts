import { StackedLineData } from 'components/Charts/StackedLineChart'
import { StackedHistogramData } from 'components/Charts/VolumeChart/renderer'
import { ChartType } from 'components/Charts/utils'
import { ChartQueryResult, checkDataQuality } from 'components/Tokens/TokenDetails/ChartSection/util'
import { UTCTimestamp } from 'lightweight-charts'
import { useMemo } from 'react'
import {
  Chain,
  HistoryDuration,
  PriceSource,
  ProtocolVersion,
  TimestampedAmount,
  useDailyProtocolTvlQuery,
  useHistoricalProtocolVolumeQuery,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'

import {useNovaSwapDayDatasQuery} from 'graphql/thegraph/__generated__/types-and-hooks'

function mapDataByTimestamp(
  v2Data?: readonly TimestampedAmount[],
  v3Data?: readonly TimestampedAmount[],
  type?: string
): Record<number, Record<ProtocolVersion, number>> {
  const dataByTime: Record<number, Record<ProtocolVersion, number>> = {}
  v2Data?.forEach((v2Point) => {
    const timestamp = v2Point.timestamp
    dataByTime[timestamp] = { [ProtocolVersion.V2]: v2Point.value, [ProtocolVersion.V3]: 0 }
  })
  v3Data?.forEach((v3Point) => {
    const timestamp = v3Point.date
    if (!dataByTime[timestamp]) {
      const value = v3Point[type];
      dataByTime[timestamp] = {  [ProtocolVersion.V3]: value? Number(value).toFixed(7):'' }
    } else {
      const value = v3Point[type];
      dataByTime[timestamp][ProtocolVersion.V3] = value? Number(value).toFixed(7):''
    }
  })
  return dataByTime
}

export function useHistoricalProtocolVolume(
  chain: Chain,
  duration: HistoryDuration
): ChartQueryResult<StackedHistogramData, ChartType.VOLUME> {
  const { data: queryData, loading } = useNovaSwapDayDatasQuery()

  return useMemo(() => {
    const dataByTime = mapDataByTimestamp([], queryData?.uniswapDayDatas,'volumeUSD')

    const entries = Object.entries(dataByTime).reduce((acc, [timestamp, values]) => {
      acc.push({
        time: Number(timestamp) as UTCTimestamp,
        values: {
          [PriceSource.SubgraphV3]: Number(values[ProtocolVersion.V3]),
        },
      })
      return acc
    }, [] as StackedHistogramData[])

    const dataQuality = checkDataQuality(entries, ChartType.VOLUME, duration)
    return { chartType: ChartType.VOLUME, entries, loading, dataQuality }
  }, [loading, queryData?.uniswapDayDatas])
}

export function useDailyProtocolTVL(chain: Chain): ChartQueryResult<StackedLineData, ChartType.TVL> {
  const { data: queryData, loading } = useNovaSwapDayDatasQuery()


  return useMemo(() => {
    const dataByTime = mapDataByTimestamp([], queryData?.uniswapDayDatas,'tvlUSD')
    const entries = Object.entries(dataByTime).map(([timestamp, values]) => ({
      time: Number(timestamp),
      values: [Number(values[ProtocolVersion.V3])],
    })) as StackedLineData[]

    const dataQuality = checkDataQuality(entries, ChartType.TVL, HistoryDuration.Year)
    return { chartType: ChartType.TVL, entries, loading, dataQuality }
  }, [loading, queryData?.uniswapDayDatas])
}
