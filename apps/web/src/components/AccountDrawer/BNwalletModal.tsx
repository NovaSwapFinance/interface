import { InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { WalletConnect as WalletConnectv2 } from '@web3-react/walletconnect-v2'
import { sendAnalyticsEvent } from 'analytics'
import Column, { AutoColumn } from 'components/Column'
import Modal from 'components/Modal'
import { RowBetween } from 'components/Row'
import { bnwalletWCV2ConnectConnection } from 'connection'
import { BnwalletConnect } from 'connection/WalletConnectV2'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { ConnectionType } from 'connection/types'
import { Trans } from 'i18n'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { CloseIcon, ThemedText } from 'theme/components'
import { isWebAndroid, isWebIOS } from 'uniswap/src/utils/platform'

import bnPng from '../../assets/images/bnwallet.png'
import { DownloadButton } from './DownloadButton'

const UniwalletConnectWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: column;
  padding: 20px 16px 16px;
`
const HeaderRow = styled(RowBetween)`
  display: flex;
`
const QRCodeWrapper = styled(RowBetween)`
  aspect-ratio: 1;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.white};
  margin: 24px 32px 20px;
  padding: 10px;
`
const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.surface3};
  width: 100%;
`

export default function BnwalletModal() {
  const { activationState, cancelActivation } = useActivationState()
  const [uri, setUri] = useState<string>()

  // Displays the modal if not on iOS/Android, a Uniswap Wallet Connection is pending, & qrcode URI is available
  const onLaunchedMobilePlatform = isWebIOS || isWebAndroid
  const open =
    !onLaunchedMobilePlatform &&
    activationState.status === ActivationStatus.PENDING &&
    activationState.connection.type === ConnectionType.BINANCE_WALLET_V2 &&
    !!uri

    // console.log('open ====>',!onLaunchedMobilePlatform,activationState.status === ActivationStatus.PENDING,activationState.connection.type === ConnectionType.BINANCE_WALLET_V2, !!uri )

  useEffect(() => {
    const connectorV2 = bnwalletWCV2ConnectConnection.connector as WalletConnectv2
    connectorV2.events.addListener(BnwalletConnect.BN_URI_AVAILABLE, (uri: string) => {
      uri && setUri(uri)
    })
  }, [])

  useEffect(() => {
    if (open) sendAnalyticsEvent(InterfaceEventName.UNIWALLET_CONNECT_MODAL_OPENED)
  }, [open])

  const theme = useTheme()
  return (
    <Modal isOpen={open} onDismiss={cancelActivation}>
      <UniwalletConnectWrapper>
        <HeaderRow>
          <ThemedText.SubHeader>
            <Trans>Scan with Binance Wallet</Trans>
          </ThemedText.SubHeader>
          <CloseIcon onClick={cancelActivation} />
        </HeaderRow>
        <QRCodeWrapper>
          {uri && (
            <QRCodeSVG
              value={uri}
              width="100%"
              height="100%"
              level="M"
              fgColor={theme.darkMode ? theme.surface1 : theme.black}
              imageSettings={{
                src: bnPng,
                height: 33,
                width: 33,
                excavate: false,
              }}
            />
          )}
        </QRCodeWrapper>
        <Divider />
      </UniwalletConnectWrapper>
    </Modal>
  )
}

const InfoSectionWrapper = styled(RowBetween)`
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  gap: 20px;
`