import { InterfacePageName } from "@uniswap/analytics-events";
import { ChainId, Currency } from "@novaswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { Trace } from "analytics";
import { NetworkAlert } from "components/NetworkAlert/NetworkAlert";
import { SwitchLocaleLink } from "components/SwitchLocaleLink";
import SwapHeader from "components/swap/SwapHeader";
import { SwapTab } from "components/swap/constants";
import { PageWrapper, SwapWrapper } from "components/swap/styled";
import { asSupportedChain } from "constants/chains";
import { useCurrency } from "hooks/Tokens";
import useParsedQueryString from "hooks/useParsedQueryString";
import { useScreenSize } from "hooks/useScreenSize";
import { SendForm } from "pages/Swap/Send/SendForm";
import { ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { InterfaceTrade, TradeState } from "state/routing/types";
import { isPreviewTrade } from "state/routing/utils";
import {
  SwapAndLimitContextProvider,
  SwapContextProvider,
} from "state/swap/SwapContext";
import { queryParametersToCurrencyState } from "state/swap/hooks";
import { CurrencyState, SwapAndLimitContext } from "state/swap/types";
import { useIsDarkMode } from "../../theme/components/ThemeToggle";
import { LimitFormWrapper } from "./Limit/LimitForm";
import { SwapForm } from "./SwapForm";
import { RowBetween } from "components/Row";
import styled from "styled-components";
import { Trans } from "i18n";

const BannerContainer = styled(RowBetween)`
  width: 100%;
  height: 45px;
  padding-left: 18px;
  padding-right: 24px;
  border-radius: 8px;
  margin-bottom: 40px;
  cursor: pointer;
  background: url(/images/zklink-banner.png);
  > p {
    background: linear-gradient(90deg, #fff 0%, #84ef77 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Satoshi;
    font-size: 16px;
    font-weight: 700;
  }
`;

const Banner = () => (
  <BannerContainer>
    <p onClick={() => window.open("https://app.zklink.io", "_blank")}>
      <Trans>Join zkLink Nova Aggregation Parade to Earn</Trans>
    </p>
    <img src="/images/icon-banner-link.svg" alt="" />
  </BannerContainer>
);

export function getIsReviewableQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode,
): boolean {
  if (swapInputError) return false;
  // if the current quote is a preview quote, allow the user to progress to the Swap review screen
  if (isPreviewTrade(trade)) return true;

  return Boolean(trade && tradeState === TradeState.VALID);
}

export default function SwapPage({ className }: { className?: string }) {
  const location = useLocation();

  const { chainId: connectedChainId } = useWeb3React();
  const supportedChainId = asSupportedChain(connectedChainId);
  //TODO: P0 - Add chain id detection
  const chainId = supportedChainId || ChainId.NOVA_MAINNET;

  console.log("SwapPage", chainId, supportedChainId, connectedChainId);
  const parsedQs = useParsedQueryString();
  const parsedCurrencyState = useMemo(() => {
    return queryParametersToCurrencyState(parsedQs);
  }, [parsedQs]);

  const initialInputCurrency = useCurrency(
    parsedCurrencyState.inputCurrencyId,
    chainId,
  );
  const initialOutputCurrency = useCurrency(
    parsedCurrencyState.outputCurrencyId,
    chainId,
  );

  return (
    <Trace page={InterfacePageName.SWAP_PAGE} shouldLogImpression>
      <PageWrapper>
        <Banner />
        <Swap
          className={className}
          chainId={chainId}
          disableTokenInputs={supportedChainId === undefined}
          initialInputCurrency={initialInputCurrency}
          initialOutputCurrency={initialOutputCurrency}
          syncTabToUrl={true}
        />
        <NetworkAlert />
      </PageWrapper>
      {location.pathname === "/swap" && <SwitchLocaleLink />}
    </Trace>
  );
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  className,
  initialInputCurrency,
  initialOutputCurrency,
  chainId,
  onCurrencyChange,
  disableTokenInputs = false,
  compact = false,
  syncTabToUrl,
}: {
  className?: string;
  chainId?: ChainId;
  onCurrencyChange?: (selected: CurrencyState) => void;
  disableTokenInputs?: boolean;
  initialInputCurrency?: Currency;
  initialOutputCurrency?: Currency;
  compact?: boolean;
  syncTabToUrl: boolean;
}) {
  const isDark = useIsDarkMode();
  const screenSize = useScreenSize();

  return (
    <SwapAndLimitContextProvider
      chainId={chainId}
      initialInputCurrency={initialInputCurrency}
      initialOutputCurrency={initialOutputCurrency}
    >
      {/* TODO: Move SwapContextProvider inside Swap tab ONLY after SwapHeader removes references to trade / autoSlippage */}
      <SwapAndLimitContext.Consumer>
        {({ currentTab }) => (
          <SwapContextProvider>
            <SwapWrapper isDark={isDark} className={className} id="swap-page">
              <SwapHeader
                compact={compact || !screenSize.sm}
                syncTabToUrl={syncTabToUrl}
              />
              {currentTab === SwapTab.Swap && (
                <SwapForm
                  onCurrencyChange={onCurrencyChange}
                  disableTokenInputs={disableTokenInputs}
                />
              )}
              {currentTab === SwapTab.Limit && (
                <LimitFormWrapper onCurrencyChange={onCurrencyChange} />
              )}
              {currentTab === SwapTab.Send && (
                <SendForm
                  disableTokenInputs={disableTokenInputs}
                  onCurrencyChange={onCurrencyChange}
                />
              )}
            </SwapWrapper>
          </SwapContextProvider>
        )}
      </SwapAndLimitContext.Consumer>
    </SwapAndLimitContextProvider>
  );
}
