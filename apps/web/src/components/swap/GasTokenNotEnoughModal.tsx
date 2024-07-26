import { CurrencyAmount } from "@novaswap/sdk-core";
import Modal from "../Modal";
import { AutoColumn } from "components/Column";
import { Text } from "rebass";
import { ButtonPrimary } from "components/Button";
import { Trans } from "i18n";
import styled from "styled-components";
import { InterfaceTrade } from "state/routing/types";

interface IProps {
  open: boolean;
  gasTokenAmount: CurrencyAmount;
  onCancel: () => void;
  trade?: InterfaceTrade;
}
const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 32px 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
`;
const InfoText = styled(Text)`
  padding: 0 12px 0 12px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const StyledButton = styled(ButtonPrimary)`
  margin-top: 24px;
  width: 100%;
  font-weight: 535;
`;

export default function GasTokenNotEnoughModal({
  isOpen,
  onCancel,
  gasTokenAmount,
  trade,
}: IProps) {
  const gasTokenSymbol = gasTokenAmount?.currency.symbol;
  const gasUsd = trade?.totalGasUseEstimateUSD ?? 0;
  const gasTokenAmountStr = gasTokenAmount?.toExact();
  return (
    <Modal isOpen={isOpen} onDismiss={onCancel}>
      <Wrapper>
        <InfoText>
          Not enough {gasTokenSymbol} for gas. Gas fee: {gasTokenAmountStr}
          {gasTokenSymbol} (${gasUsd})
        </InfoText>

        <StyledButton onClick={onCancel}>
          <Trans>Close</Trans>
        </StyledButton>
      </Wrapper>
    </Modal>
  );
}
