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
import { useState, useEffect, useContext, useMemo } from "react";
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
import { Wrapper, RotatingArrow } from "./SwapDetailsDropdown";
import { SwapContext } from "state/swap/types";
import { useWeb3React } from "@web3-react/core";
import { nativeOnChain } from "constants/tokens";
import CurrencyLogo from "components/Logo/CurrencyLogo";
import { currencyId } from "utils/currencyId";
import { Text } from "rebass";

const StyledRow = styled(RowBetween)<{
  disabled: boolean;
  open: boolean;
}>`
  padding: 0;
  height: 36px;
  margin-top: 4px;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "initial" : "pointer")};
`;

export default function SwapGasTokenDropdown() {
  const { chainId } = useWeb3React();
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const trace = useTrace();
  const { swapState, setSwapState } = useContext(SwapContext);

  useEffect(() => {
    if (swapState && !swapState.gasToken && chainId) {
      setSwapState({ ...swapState, gasToken: nativeOnChain(chainId) });
    }
  }, [swapState, chainId]);

  const currency = useMemo(() => {
    return swapState?.gasToken;
  }, [swapState]);

  return (
    <Wrapper>
      <StyledRow data-testid="swap-gas-token-header-row" open={showDetails}>
        <RowFixed>
          <LabelText hasTooltip>Token for Gas</LabelText>
        </RowFixed>
        {currency && (
          <RowFixed gap="xs">
            {!showDetails && (
              <BaseWrapper
                tabIndex={0}
                key={currencyId(currency)}
                onClick={() => setShowDetails(!showDetails)}
                data-testid={`common-base-${currency.symbol}`}
              >
                <CurrencyLogo currency={currency} style={{ marginRight: 8 }} />
                <Text fontWeight={535} fontSize={16} lineHeight="16px">
                  {currency.symbol}
                </Text>
              </BaseWrapper>
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
