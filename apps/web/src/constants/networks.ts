import { ChainId } from "@novaswap/sdk-core";
import {
  NovaSupportedChainsType,
  SupportedInterfaceChain,
} from "constants/chains";

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
if (typeof INFURA_KEY === "undefined") {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`,
  );
}
const QUICKNODE_MAINNET_RPC_URL =
  process.env.REACT_APP_QUICKNODE_MAINNET_RPC_URL;
if (typeof QUICKNODE_MAINNET_RPC_URL === "undefined") {
  throw new Error(
    `REACT_APP_QUICKNODE_MAINNET_RPC_URL must be a defined environment variable`,
  );
}
const QUICKNODE_ARBITRUM_RPC_URL =
  process.env.REACT_APP_QUICKNODE_ARBITRUM_RPC_URL;
if (typeof QUICKNODE_ARBITRUM_RPC_URL === "undefined") {
  throw new Error(
    `REACT_APP_QUICKNODE_ARBITRUM_RPC_URL must be a defined environment variable`,
  );
}
const QUICKNODE_BNB_RPC_URL = process.env.REACT_APP_BNB_RPC_URL;
if (typeof QUICKNODE_BNB_RPC_URL === "undefined") {
  throw new Error(
    `REACT_APP_BNB_RPC_URL must be a defined environment variable`,
  );
}

/**
 * Public JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const PUBLIC_RPC_URLS: Record<NovaSupportedChainsType, string[]> = {
  [ChainId.NOVA_SEPOLIA]: [
    "https://sepolia.rpc.zklink.io",
    "wss://sepolia.rpc.zklink.io",
  ],
  [ChainId.NOVA_MAINNET]: ["https://rpc.zklink.io", "wss://rpc.zklink.io"],
  [ChainId.SEPOLIA]: ["https://rpc2.sepolia.org"],
};

/**
 * Application-specific JSON-RPC endpoints.
 * These are URLs which may only be used by the interface, due to origin policies, &c.
 */
export const APP_RPC_URLS: Record<NovaSupportedChainsType, string[]> = {
  [ChainId.NOVA_SEPOLIA]: ["https://sepolia.rpc.zklink.io"],
  [ChainId.NOVA_MAINNET]: ["https://rpc.zklink.io"],
  [ChainId.SEPOLIA]: [
    "https://rpc2.sepolia.org/",
    "https://rpc.sepolia.online/",
    "https://www.sepoliarpc.space/",
    "https://rpc-sepolia.rockx.com/",
    "https://rpc.bordel.wtf/sepolia",
  ],
};

export const INFURA_PREFIX_TO_CHAIN_ID: { [prefix: string]: ChainId } = {
  "nova-sepolia": ChainId.NOVA_SEPOLIA,
  "nova-mainnet": ChainId.NOVA_MAINNET,
  "sepolia": ChainId.SEPOLIA,
};
