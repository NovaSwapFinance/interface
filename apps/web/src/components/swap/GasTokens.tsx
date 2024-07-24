import { AutoRow } from "components/Row";
import { Column } from "components/Column";
import { useWeb3React } from "@web3-react/core";
import { GAS_TOKENS } from "constants/routing";
import styled from "styled-components";
import CurrencyLogo from "components/Logo/CurrencyLogo";
import { Text } from "rebass";
import { currencyId } from "utils/currencyId";
import { ThemedText } from "theme/components";
import { useEffect, useContext, useMemo } from "react";
import { SwapContext } from "state/swap/types";
import { nativeOnChain } from "constants/tokens";

const Container = styled(AutoRow)`
  border: 1px solid ${({ theme }) => theme.surface3};
  padding: 5px;
  border-radius: 15px;
  margin-top: 5px;
  gap: 6px;
`;
export const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme }) => theme.surface4};
  border-radius: 18px;
  display: flex;
  padding: 6px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 12px;
  line-height: 0px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme }) => theme.deprecated_hoverDefault};
  }

  color: ${({ theme, disable }) => disable && theme.neutral1};
  background-color: ${({ theme, disable }) => disable && theme.surface4};
`;
export const LabelText = styled(ThemedText.BodySmall)<{ hasTooltip?: boolean }>`
  cursor: ${({ hasTooltip }) => (hasTooltip ? "help" : "auto")};
  color: ${({ theme }) => theme.neutral2};
`;
export function GasTokens({ onSelect }: { onSelect: () => void }) {
  const { chainId } = useWeb3React();
  const tokens = chainId ? GAS_TOKENS[chainId] ?? [] : [];
  const { swapState, setSwapState } = useContext(SwapContext);

  useEffect(() => {
    if (swapState && !swapState.gasToken) {
      setSwapState({ ...swapState, gasToken: nativeOnChain(chainId) });
    }
  }, [swapState, chainId]);

  return (
    <Column>
      <Container>
        {tokens.map((currency, index) => (
          <BaseWrapper
            tabIndex={0}
            onClick={() => {
              setSwapState({ ...swapState, gasToken: currency });
              onSelect();
            }}
            disable={currency?.symbol === swapState?.gasToken?.symbol}
            key={currencyId(currency)}
            data-testid={`common-base-${currency.symbol}`}
          >
            <CurrencyLogo currency={currency} style={{ marginRight: 8 }} />
            <Text fontWeight={535} fontSize={16} lineHeight="16px">
              {currency.symbol}
            </Text>
          </BaseWrapper>
        ))}
      </Container>
    </Column>
  );
}
