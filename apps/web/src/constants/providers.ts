import { ChainId } from "@novaswap/sdk-core";
import AppJsonRpcProvider from "rpc/AppJsonRpcProvider";

import ConfiguredJsonRpcProvider from "rpc/ConfiguredJsonRpcProvider";
import { CHAIN_IDS_TO_NAMES, NovaSupportedChainsType } from "./chains";
import { APP_RPC_URLS } from "./networks";

function getAppProvider(chainId: NovaSupportedChainsType) {
  return new AppJsonRpcProvider(
    APP_RPC_URLS[chainId].map(
      (url) =>
        new ConfiguredJsonRpcProvider(url, {
          chainId,
          name: CHAIN_IDS_TO_NAMES[chainId],
        }),
    ),
  );
}

/** These are the only JsonRpcProviders used directly by the interface. */
export const RPC_PROVIDERS = {
  [ChainId.NOVA_SEPOLIA]: getAppProvider(ChainId.NOVA_SEPOLIA),
} satisfies Record<NovaSupportedChainsType, AppJsonRpcProvider>;
