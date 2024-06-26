import { ChainId } from "@novaswap/sdk-core";
import { DynamicConfigs } from "uniswap/src/features/statsig/configs";
import { useDynamicConfig } from "uniswap/src/features/statsig/hooks";

export const QUICK_ROUTE_CONFIG_KEY = "quick_route_chains";

export function useQuickRouteChains(): ChainId[] {
  const statsigConfig = useDynamicConfig(DynamicConfigs.QuickRouteChains);
  const chains = statsigConfig.get(QUICK_ROUTE_CONFIG_KEY, []) as ChainId[];
  if (chains.every((c) => Object.values(ChainId).includes(c))) {
    return chains;
  } else {
    console.error("dynamic config chains contain invalid ChainId");
    return [];
  }
}
