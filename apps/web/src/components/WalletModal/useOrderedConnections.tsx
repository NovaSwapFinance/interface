import { connections, eip6963Connection } from 'connection'
import { useInjectedProviderDetails } from 'connection/eip6963/providers'
import { Connection, ConnectionType, RecentConnectionMeta } from 'connection/types'
import { shouldUseDeprecatedInjector } from 'connection/utils'
import { useMemo } from 'react'
import { useAppSelector } from 'state/hooks'
import { FeatureFlags } from 'uniswap/src/features/statsig/flags'
import { useFeatureFlag } from 'uniswap/src/features/statsig/hooks'
import Option from './Option'

export function useEIP6963Connections() {
  const eip6963Injectors = useInjectedProviderDetails()
  const eip6963Enabled = useFeatureFlag(FeatureFlags.Eip6936Enabled)

  return useMemo(() => {
    if (!eip6963Enabled) return { eip6963Connections: [], showDeprecatedMessage: false }

    const eip6963Connections = eip6963Injectors.flatMap((injector) => eip6963Connection.wrap(injector.info) ?? [])

    // Displays ui to activate window.ethereum for edge-case where we detect window.ethereum !== one of the eip6963 providers
    const showDeprecatedMessage = eip6963Connections.length > 0 && shouldUseDeprecatedInjector(eip6963Injectors)

    return { eip6963Connections, showDeprecatedMessage }
  }, [eip6963Injectors, eip6963Enabled])
}

export function useBybitConnections() {
  const eip6963Injectors = useInjectedProviderDetails()
  const bybit = eip6963Injectors.find((i) => i.info.name.includes('Bybit'))
  if(bybit) {
    const bybitConnection= eip6963Connection.wrap(bybit.info)
    return bybitConnection
  }
}

function mergeConnections(connections: Connection[], eip6963Connections: Connection[]) {
  const hasEip6963Connections = eip6963Connections.length > 0
  const displayedConnections = connections.filter((c) => c.shouldDisplay())

  if (!hasEip6963Connections) return displayedConnections

  const allConnections = [...displayedConnections.filter((c) => c.type !== ConnectionType.INJECTED)]
  // By default, injected options should appear second in the list (below Uniswap wallet)
  allConnections.splice(1, 0, ...eip6963Connections)

  return allConnections
}

// TODO(WEB-3244) Improve ordering logic to make less brittle, as it is spread across connections/index.ts and here
/** Returns an array of all connection Options that should be displayed, where the recent connection is first in the array */
function getOrderedConnections(
  connections: Connection[],
  recentConnection: RecentConnectionMeta | undefined,
  excludeUniswapConnections: boolean
) {
  const list: JSX.Element[] = []
  for (const connection of connections) {
    if (!connection.shouldDisplay()) continue
    const { name, rdns } = connection.getProviderInfo()

    // Uniswap options may be displayed separately
    if (excludeUniswapConnections && name.includes('Uniswap')) {
      continue
    }

    // For eip6963 injectors, we need to check rdns in addition to connection type to ensure it's the recent connection
    const isRecent = connection.type === recentConnection?.type && (!rdns || rdns === recentConnection.rdns)

    const option = <Option key={name} connection={connection} isRecent={isRecent} />

    // Place recent connection at top of list
    isRecent ? list.unshift(option) : list.push(option)
  }
  console.log('List=====>' ,list)

  return list
}

export function useOrderedConnections(excludeUniswapConnections?: boolean) {
  const { eip6963Connections, showDeprecatedMessage } = useEIP6963Connections()
  const bybitConnection = useBybitConnections()
  const recentConnection = useAppSelector((state) => state.user.recentConnectionMeta)
  const orderedConnections = useMemo(() => {
    const allConnections = mergeConnections([...connections,bybitConnection].filter(c=>!!c), eip6963Connections)
    return getOrderedConnections(allConnections, recentConnection, excludeUniswapConnections ?? false)
  }, [eip6963Connections, excludeUniswapConnections, recentConnection])

  return { orderedConnections, showDeprecatedMessage }
}
