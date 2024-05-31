import { ChainId, Token } from "@novaswap/sdk-core";

export const NOVA_BASE_TOKEN_SOURCE = [
  {
    address: "0x1212Cc9e6837FF5E3A99d7262297C12E05946873",
    symbol: "AGX",
    name: "AGX",
    decimals: 18,
    logurl: 'https://agx.xyz/static/media/logo_GMX.46196f814c1701d9ee3cfaf8808b69ca.svg',
  },
  {
    address: "0x000000000000000000000000000000000000800A",
    isNative: true,
    decimals: 18,
    symbol: "ETH",
    name: "Nova Ether",
    logurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x8280a4e7D5B3B658ec4580d3Bc30f5e50454F169",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    logurl:
      "https://assets.coingecko.com/coins/images/2518/large/weth.png?1696503332",
  },

  {
    address: "0xDa4AaEd3A53962c83B35697Cd138cc6df43aF71f",
    decimals: 8,
    symbol: "WBTC",
    name: "Nova Wrapped BTC",
    logurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/4023.png",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x2F8A25ac62179B31D62D7F80884AE57464699059",
    decimals: 6,
    symbol: "USDT",
    name: "Nova Tether USD",
    logurl:
      "https://assets.coingecko.com/coins/images/31271/large/usdt.jpeg?1696530095",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x1a1A3b2ff016332e866787B311fcB63928464509",
    decimals: 6,
    symbol: "USDC",
    name: "Nova USD Coin",
    logurl:
      "https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x1B49eCf1A8323Db4abf48b2F5EFaA33F7DdAB3FC",
    decimals: 18,
    symbol: "pufETH",
    name: "pufETH",
    logurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/29325.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
  },
  {
    address: "0xebc45ef3b6d7e31573daa9be81825624725939f9",
    decimals: 8,
    symbol: "WBTC.eth",
    name: "Wrapped BTC",
    logurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501629",
  },
  {
    address: "0x93d79e21a68f66d79449fbf4fb4ed025abacc2f6",
    decimals: 18,
    symbol: "nETH",
    name: "Node ETH",
    logurl:
      "https://web3-public.s3.ap-northeast-1.amazonaws.com/oss/console/1711358488472.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501630",
  },
  {
    address: "0xfa70fd01ebd5aa64f31e5d3575c444919c79275e",
    decimals: 18,
    symbol: "rnETH",
    name: "Restaking Node ETH",
    logurl: "https://zklink.io/images/token/rneth.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0xdeec33dc735baf36b473598c33bcd077a0f32049",
    decimals: 18,
    symbol: "STONE",
    name: "Manta Pacific StakeStone Ether",
    logurl:
      "https://assets.coingecko.com/coins/images/33103/large/200_200.png?1702602672",
    Source: "Manta Pacific",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
  },
  {
    address: "0x86339d32837345974609c66c52884fcb26a76b8c",
    decimals: 18,
    symbol: "WMNT",
    name: "Wrapped Mantle",
    logurl:
      "https://assets.coingecko.com/coins/images/30983/large/mantle.jpeg?1696529822",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0xf5d3953a33f78e0412a8988fd77b4920aa968b0b",
    decimals: 18,
    symbol: "MANTA",
    name: "Manta",
    logurl:
      "https://assets.coingecko.com/coins/images/34289/large/manta.jpg?1704468717",
    Source: "Manta Pacific",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
  },
  {
    address: "0x3fdb1939dab8e2d4f7a04212f142469cd52d6402",
    decimals: 18,
    symbol: "ezETH.arb",
    name: "Arbitrum One Renzo Restaked ETH",
    logurl:
      "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
    Source: "Arbitrum One",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  },
  {
    address: "0xda7fa837112511f6e353091d7e388a4c45ce7d6c",
    decimals: 18,
    symbol: "ezETH.eth",
    name: "Ethereum Renzo Restaked ETH",
    logurl:
      "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496405",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0x8fee71ab3ffd6f8aec8cd2707da20f4da2bf583d",
    decimals: 18,
    symbol: "ezETH.linea",
    name: "Linea Renzo Restaked ETH",
    logurl:
      "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496406",
    Source: "Linea",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/27657.png",
  },
  {
    address: "0xB5B8C247C740d53b6Fbab10f1C17922788baeD54",
    decimals: 18,
    symbol: "mmETH",
    name: "mmETH",
    logurl: "https://etherscan.io/token/images/mmeth_32.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0x35d5f1b41319e0ebb5a10e55c3bd23f121072da8",
    decimals: 18,
    symbol: "weETH",
    name: "Wrapped eETH",
    logurl:
      "https://assets.coingecko.com/coins/images/33033/large/weETH.png?1701438396",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0xcb70533c9635060275f1a97539dda2e3f8bfac42",
    decimals: 18,
    symbol: "ARB",
    name: "Arbitrum",
    logurl:
      "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1696516109",
    Source: "Arbitrum One",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  },
  {
    address: "0x380dd3344288bd6efd7c3597b2b6114b722a0e65",
    decimals: 18,
    symbol: "ARPA",
    name: "ARPA Token",
    logurl:
      "https://assets.coingecko.com/coins/images/8506/large/9u0a23XY_400x400.jpg?1696508685",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0xbb68f4548a1c26b6611cbb8087c25a616edd8569",
    decimals: 18,
    symbol: "mswETH",
    name: "mswETH",
    logurl: "https://etherscan.io/token/images/msweth_32.png",
    Source: "Ethereum",
    Sourceurl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501631",
  },
  {
    address: "0x829a939ee105cc3607428c237e463feb051e9780",
    decimals: 18,
    symbol: "wUSDM",
    name: "Wrapped Mountain Protocol USD",
    logurl:
      "https://assets.coingecko.com/coins/images/33785/large/wUSDM_PNG_240px.png?1702981552",
    Source: "Manta Pacific",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
  },
];



export const NOVA_TOKEN_LIST_BASE = [{
    address: "0xDa4AaEd3A53962c83B35697Cd138cc6df43aF71f",
    decimals: 8,
    symbol: "WBTC",
    name: "Nova Wrapped BTC",
    logurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/4023.png",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x2F8A25ac62179B31D62D7F80884AE57464699059",
    decimals: 6,
    symbol: "USDT",
    name: "Nova Tether USD",
    logurl:
      "https://assets.coingecko.com/coins/images/31271/large/usdt.jpeg?1696530095",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },
  {
    address: "0x1a1A3b2ff016332e866787B311fcB63928464509",
    decimals: 6,
    symbol: "USDC",
    name: "Nova USD Coin",
    logurl:
      "https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    Source: "Nova",
    Sourceurl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13039.png",
  },];
export const NOVA_BASE_TOKEN = NOVA_TOKEN_LIST_BASE.map((token) => {
  const { address, decimals, symbol, name } = token;
  return new Token(ChainId.NOVA_MAINNET, address, decimals, symbol, name);
});

export const ETH_LOGO =
  "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628";
