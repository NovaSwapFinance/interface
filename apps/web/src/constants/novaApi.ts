import { ChainId } from "@novaswap/sdk-core";


//nova api
export const NOVA_API_ADDRESS_URL = {
  [ChainId.NOVA_MAINNET]: "https://explorer-api.zklink.io/address/",
  [ChainId.NOVA_SEPOLIA]: "https://sepolia.explorer-api.zklink.io/address/",
};
export const NOVA_API_TOKENS_URL = {
  [ChainId.NOVA_MAINNET]: "https://explorer-api.zklink.io/tokens/tvl",
  [ChainId.NOVA_SEPOLIA]: "https://sepolia.explorer-api.zklink.io/tokens/tvl",
};
