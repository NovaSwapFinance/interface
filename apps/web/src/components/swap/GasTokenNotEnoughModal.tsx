import { CurrencyAmount } from "@novaswap/sdk-core";
import Modal from "../Modal";
import { AutoColumn } from "components/Column";
import { Text } from "rebass";
import { ButtonPrimary } from "components/Button";
import { Trans } from "i18n";
import styled, { useTheme } from "styled-components";
import { EstimatePaymasterGasUsd } from "./SwapGasTokenDropdown";
import AlertTriangleFilled from "components/Icons/AlertTriangleFilled";
import { DialogButtonType, DialogContent } from "components/Dialog/Dialog";
import { ColumnCenter } from "components/Column";

interface IProps {
  open: boolean;
  gasTokenAmount: CurrencyAmount;
  onCancel: () => void;
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
  margin-bottom: 15px;
`;

const IconContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.surface3};
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 20px;
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
}: IProps) {
  const theme = useTheme();

  const gasTokenSymbol = gasTokenAmount?.currency.symbol;
  const gasUsd = EstimatePaymasterGasUsd;
  const gasTokenAmountStr = gasTokenAmount?.toExact();
  return (
    <Modal
      isOpen={isOpen}
      $scrollOverlay
      onDismiss={onCancel}
      maxHeight={90}
      slideIn
    >
      <Wrapper>
        <DialogContent
          isVisible={true}
          icon={
            <AlertTriangleFilled
              data-testid="pending-modal-failure-icon"
              fill={theme.neutral2}
              size="24px"
            />
          }
          title={<Trans>Swap failed</Trans>}
          description={
            <Trans>Try adjusting from amount to a lower value.</Trans>
          }
          body={
            <ColumnCenter gap="md">
              <InfoText style={{ marginBottom: 20 }}>
                Not enough {gasTokenSymbol} for gas. Gas fee:{" "}
                {gasTokenAmountStr}
                {gasTokenSymbol} (${gasUsd})
              </InfoText>
            </ColumnCenter>
          }
          buttonsConfig={{
            left: {
              type: DialogButtonType.Accent,
              title: <Trans>Close</Trans>,
              onClick: onCancel,
            },
          }}
          onCancel={onCancel}
        />
      </Wrapper>
    </Modal>
  );
}
