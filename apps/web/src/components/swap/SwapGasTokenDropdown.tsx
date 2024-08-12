import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
} from "@uniswap/analytics-events";
import { Percent } from "@novaswap/sdk-core";
import { TraceEvent, useTrace } from "analytics";
import AnimatedDropdown from "components/AnimatedDropdown";
import Column from "components/Column";
import { LoadingOpacityContainer } from "components/Loader/styled";
import { RowBetween, RowFixed } from "components/Row";
import { Trans } from "i18n";
import { formatCommonPropertiesForTrade } from "lib/utils/analytics";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { ChevronDown } from "react-feather";
import { InterfaceTrade } from "state/routing/types";
import { isSubmittableTrade } from "state/routing/utils";
import styled, { useTheme } from "styled-components";
import { ThemedText } from "theme/components";
import { useFormatter } from "utils/formatNumbers";
import { GasTokens, LabelText, BaseWrapper } from "./GasTokens";
import GasEstimateTooltip from "./GasEstimateTooltip";
import SwapLineItem, { SwapLineItemType } from "./SwapLineItem";
import TradePrice from "./TradePrice";
import { RotatingArrow } from "./SwapDetailsDropdown";
import { SwapContext } from "state/swap/types";
import { useWeb3React } from "@web3-react/core";
import { nativeOnChain } from "constants/tokens";
import CurrencyLogo from "components/Logo/CurrencyLogo";
import { currencyId } from "utils/currencyId";
import { Text, Link } from "rebass";
import { MouseoverTooltip, TooltipSize } from "components/Tooltip";
import { Protocol } from "@novaswap/router-sdk";
import { BigNumber, ethers } from "ethers";
import { USDC_NOVA, USDC_NOVA_MAINNET } from "providers/token-provider";
import { TradeType } from "@novaswap/sdk-core";

export function fromReadableAmount(
  amount: number,
  decimals: number,
): BigNumber {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

const StyledRow = styled(RowBetween)<{
  disabled: boolean;
  open: boolean;
}>`
  padding: 0;
  height: 28px;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "initial" : "pointer")};
`;

const Wrapper = styled(Column)`
  border-radius: 16px;
  padding: 0px 16px;
`;

const CurrencyWrapper = styled(BaseWrapper)`
  padding-right: 0;
  border: none;
  &:hover {
    background-color: transparent;
  }
`;

const ExternalLink = styled(Link)`
  color: #84ef77;
`;

interface IProps {
  trade?: InterfaceTrade;
}

/**
 * TODO get estiamte gas with paymaster from api or contract
 * set it to average $0.2 for simple calculation.
 */
export const EstimatePaymasterGasUsd = "0.2"; //

export default function SwapGasTokenDropdown(props: IProps) {
  const { trade } = props;
  const { chainId } = useWeb3React();
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const trace = useTrace();
  const {
    swapState,
    setSwapState,
    setGasAsFromToken,
    setQuotingGasAsFromToken,
  } = useContext(SwapContext);

  console.log("trade: ", trade);

  const fetchSwapFromTokenAmountAsGasToken = useCallback(async () => {
    if (
      swapState.gasToken?.symbol === "USDC" ||
      swapState.gasToken?.symbol === "USDT"
    ) {
      setGasAsFromToken({
        token: swapState.gasToken,
        amountDecimals: Number(EstimatePaymasterGasUsd),
      });
      return;
    }
    setQuotingGasAsFromToken(true);
    const CLIENT_PARAMS = {
      protocols: [Protocol.V3, Protocol.MIXED],
    };
    const tokenFrom = trade.routes[0].input;
    const tokenIn = USDC_NOVA[chainId] || USDC_NOVA_MAINNET;
    const tokenOut = swapState.gasToken;
    const args = {
      tokenInAddress: tokenIn.address,
      tokenInChainId: tokenIn.chainId,
      tokenInDecimals: tokenIn.decimals,
      tokenInSymbol: tokenIn.symbol,
      tokenOutAddress: tokenOut.address,
      tokenOutChainId: tokenOut?.chainId,
      tokenOutDecimals: tokenOut?.decimals,
      tokenOutSymbol: tokenOut?.symbol,
      amount: fromReadableAmount(EstimatePaymasterGasUsd, tokenIn.decimals),
      tradeType: TradeType.EXACT_INPUT,
    };
    const { getClientSideQuote, getRouter } = await import(
      "lib/hooks/routing/clientSideSmartOrderRouter"
    );
    const router = await getRouter(args.tokenInChainId);

    const quoteResult = await getClientSideQuote(args, router, CLIENT_PARAMS);
    console.log("fetchSwapFromTokenAmountAsGasToken====>", quoteResult);
    const amountOut = quoteResult.data?.quote.quoteDecimals;

    setGasAsFromToken({
      token: swapState.gasToken,
      amountDecimals: amountOut,
    });
    setQuotingGasAsFromToken(false);
  }, [trade, swapState]);

  useEffect(() => {
    if (swapState && !swapState.gasToken && chainId) {
      setSwapState({ ...swapState, gasToken: nativeOnChain(chainId) });
      return;
    } else if (swapState && swapState.gasToken && trade) {
      const tokenIn = trade.routes[0].input;
      if (swapState.gasToken.symbol !== "ETH") {
        fetchSwapFromTokenAmountAsGasToken();
      }
    }
  }, [swapState, chainId, trade]);

  const currency = useMemo(() => {
    return swapState?.gasToken;
  }, [swapState]);

  return (
    <Wrapper>
      <StyledRow
        data-testid="swap-gas-token-header-row"
        open={showDetails}
        style={{ marginTop: trade ? 0 : "6px" }}
      >
        <RowFixed>
          <MouseoverTooltip
            size={TooltipSize.Small}
            text={
              <ThemedText.LabelMicro>
                On NovaSwap, you can utilize tokens other than ETH to pay for
                gas, and the system will automatically enable the{" "}
                <ExternalLink href="">Paymaster</ExternalLink> functionality for
                you.
              </ThemedText.LabelMicro>
            }
            placement="right"
          >
            <ThemedText.BodySmall>Token for Gas</ThemedText.BodySmall>
          </MouseoverTooltip>
        </RowFixed>
        {currency && (
          <RowFixed gap="xs">
            {!showDetails && (
              <CurrencyWrapper
                tabIndex={0}
                key={currencyId(currency)}
                onClick={() => setShowDetails(!showDetails)}
                data-testid={`common-base-${currency.symbol}`}
              >
                <CurrencyLogo
                  currency={currency}
                  style={{
                    marginRight: 8,
                    height: 18,
                    width: 18,
                  }}
                />
                <Text fontWeight={535} fontSize={14} lineHeight="14px">
                  {currency.symbol}
                </Text>
              </CurrencyWrapper>
            )}
            <RotatingArrow
              stroke={theme.neutral3}
              open={showDetails}
              onClick={() => setShowDetails(!showDetails)}
            />
          </RowFixed>
        )}
      </StyledRow>

      <AdvancedGasTokenDetails
        open={showDetails}
        onSelect={() => setShowDetails(false)}
      />
    </Wrapper>
  );
}

function AdvancedGasTokenDetails({
  open,
  onSelect,
}: {
  open: boolean;
  onSelect: () => void;
}) {
  return (
    <AnimatedDropdown open={open}>
      <GasTokens onSelect={onSelect} />
    </AnimatedDropdown>
  );
}
