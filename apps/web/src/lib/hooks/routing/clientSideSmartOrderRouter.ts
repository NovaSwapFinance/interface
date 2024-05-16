import {
  BigintIsh,
  ChainId,
  CurrencyAmount,
  Token,
  TradeType,
} from "@novaswap/sdk-core";
// This file is lazy-loaded, so the import of smart-order-router is intentional.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { asSupportedChain } from "constants/chains";
import { RPC_PROVIDERS } from "constants/providers";
import { nativeOnChain } from "constants/tokens";
import JSBI from "jsbi";
// import { NodeJSCache } from "providers/cache-node";
import { CachingGasStationProvider } from "providers/caching-gas-provider";
import { EIP1559GasPriceProvider } from "providers/eip-1559-gas-price-provider";
import { LegacyGasPriceProvider } from "providers/legacy-gas-price-provider";
import { UniswapMulticallProvider } from "providers/multicall-uniswap-provider";
import { OnChainGasPriceProvider } from "providers/on-chain-gas-price-provider";
import { OnChainQuoteProvider } from "providers/on-chain-quote-provider";
import { V3PoolProvider } from "providers/pool-provider";
import { PortionProvider } from "providers/portion-provider";
import { TokenProvider } from "providers/token-provider";
import { V2PoolProvider } from "providers/v2/pool-provider";
import { AlphaRouter, AlphaRouterConfig } from "routers/alpha-router";
import NodeCache from "node-cache";
import { LegacyRouter } from "routers/legacy-router";
import {
  GetQuoteArgs,
  QuoteResult,
  QuoteState,
  SwapRouterNativeAssets,
} from "state/routing/types";
import { transformSwapRouteToGetQuoteResult } from "utils/transformSwapRouteToGetQuoteResult";
import { GasPrice } from "providers/gas-price-provider";
import { CachingV3PoolProvider } from "providers/v3/caching-pool-provider";
import { EthEstimateGasSimulator } from "providers/eth-estimate-gas-provider";
import { TokenPropertiesProvider } from "providers/token-properties-provider";
import { OnChainTokenFeeFetcher } from "providers/token-fee-fetcher";
import {
  FallbackTenderlySimulator,
  TenderlySimulator,
} from "providers/tenderly-simulation-provider";
import { GasPriceCache } from "providers/cache-node";

const CLIENT_SIDE_ROUTING_ALLOW_LIST = [
  ChainId.MAINNET,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_GOERLI,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
  ChainId.GOERLI,
  ChainId.SEPOLIA,
  ChainId.NOVA_SEPOLIA,
  ChainId.CELO_ALFAJORES,
  ChainId.CELO,
  ChainId.BNB,
  ChainId.AVALANCHE,
  ChainId.BASE,
];

const routers = new Map<ChainId, AlphaRouter>();
export async function getRouter(chainId: ChainId): Promise<AlphaRouter> {
  const router = routers.get(chainId);
  // console.log(router, "router_____res");
  if (router) return router;
  console.log("router-passed_______________________");
  const supportedChainId = asSupportedChain(chainId);
  if (supportedChainId && CLIENT_SIDE_ROUTING_ALLOW_LIST.includes(chainId)) {
    // const cache = new LocalStorageCache(60);
    console.log("router-in_______________________");
    const provider = RPC_PROVIDERS[supportedChainId];
    const multicall2Provider = new UniswapMulticallProvider(chainId, provider);

    const v3PoolProvider = new V3PoolProvider(chainId, multicall2Provider);
    const v2PoolProvider = new V2PoolProvider(
      chainId,
      multicall2Provider,
      {} as any,
    );
    const portionProvider = new PortionProvider();
    const tenderlySimulator = new TenderlySimulator(
      chainId,
      "https://api.tenderly.co",
      process.env.TENDERLY_USER!,
      process.env.TENDERLY_PROJECT!,
      process.env.TENDERLY_ACCESS_KEY!,
      v2PoolProvider,
      v3PoolProvider,
      provider,
      portionProvider,
      { [ChainId.ARBITRUM_ONE]: 1 },
    );
    const ethEstimateGasSimulator = new EthEstimateGasSimulator(
      chainId,
      provider,
      v2PoolProvider,
      v3PoolProvider,
      portionProvider,
    );
    const simulator = new FallbackTenderlySimulator(
      chainId,
      provider,
      portionProvider,
      tenderlySimulator,
      ethEstimateGasSimulator,
    );
    const gasPriceCache = new GasPriceCache(15);
    const router = new AlphaRouter({
      provider,
      chainId,
      multicall2Provider: multicall2Provider,
      gasPriceProvider: new CachingGasStationProvider(
        chainId,
        new OnChainGasPriceProvider(
          chainId,
          new EIP1559GasPriceProvider(provider),
          new LegacyGasPriceProvider(provider),
        ),
        gasPriceCache,
      ),
      onChainQuoteProvider: new OnChainQuoteProvider(
        chainId,
        provider,
        multicall2Provider,
      ),
      simulator,
    });
    routers.set(chainId, router);
    return router;
  }

  throw new Error(`Router does not support this chain (chainId: ${chainId}).`);
}

async function getQuote(
  {
    tradeType,
    tokenIn,
    tokenOut,
    amount: amountRaw,
  }: {
    tradeType: TradeType;
    tokenIn: {
      address: string;
      chainId: number;
      decimals: number;
      symbol?: string;
    };
    tokenOut: {
      address: string;
      chainId: number;
      decimals: number;
      symbol?: string;
    };
    amount: BigintIsh;
  },
  router: AlphaRouter,
  routerConfig: Partial<AlphaRouterConfig>,
): Promise<QuoteResult> {
  const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(
    tokenIn.address as SwapRouterNativeAssets,
  );
  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(
    tokenOut.address as SwapRouterNativeAssets,
  );

  const currencyIn = tokenInIsNative
    ? nativeOnChain(tokenIn.chainId)
    : new Token(
        tokenIn.chainId,
        tokenIn.address,
        tokenIn.decimals,
        tokenIn.symbol,
      );
  const currencyOut = tokenOutIsNative
    ? nativeOnChain(tokenOut.chainId)
    : new Token(
        tokenOut.chainId,
        tokenOut.address,
        tokenOut.decimals,
        tokenOut.symbol,
      );

  const baseCurrency =
    tradeType === TradeType.EXACT_INPUT ? currencyIn : currencyOut;
  const quoteCurrency =
    tradeType === TradeType.EXACT_INPUT ? currencyOut : currencyIn;

  const amount = CurrencyAmount.fromRawAmount(
    baseCurrency,
    JSBI.BigInt(amountRaw),
  );
  // TODO (WEB-2055): explore initializing client side routing on first load (when amountRaw is null) if there are enough users using client-side router preference.
  const swapRoute = await router.route(
    amount,
    quoteCurrency,
    tradeType,
    /*swapConfig=*/ undefined,
    routerConfig,
  );

  if (!swapRoute) {
    return { state: QuoteState.NOT_FOUND };
  }

  console.log(swapRoute, "swapRoute", tradeType, "tradeType", amount, "amount");
  return transformSwapRouteToGetQuoteResult(tradeType, amount, swapRoute);
}

export async function getClientSideQuote(
  {
    tokenInAddress,
    tokenInChainId,
    tokenInDecimals,
    tokenInSymbol,
    tokenOutAddress,
    tokenOutChainId,
    tokenOutDecimals,
    tokenOutSymbol,
    amount,
    tradeType,
  }: GetQuoteArgs,
  router: AlphaRouter,
  config: Partial<AlphaRouterConfig>,
) {
  console.log("getClientSideQuote");
  return getQuote(
    {
      tradeType,
      tokenIn: {
        address: tokenInAddress,
        chainId: tokenInChainId,
        decimals: tokenInDecimals,
        symbol: tokenInSymbol,
      },
      tokenOut: {
        address: tokenOutAddress,
        chainId: tokenOutChainId,
        decimals: tokenOutDecimals,
        symbol: tokenOutSymbol,
      },
      amount,
    },
    router,
    config,
  );
}
