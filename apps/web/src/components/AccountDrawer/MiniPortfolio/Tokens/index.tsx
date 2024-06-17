import { BrowserEvent, InterfaceElementName, SharedEventName } from '@uniswap/analytics-events'
import { TraceEvent } from 'analytics'
import { hideSpamAtom } from 'components/AccountDrawer/SpamToggle'
import Row from 'components/Row'
import { DeltaArrow } from 'components/Tokens/TokenDetails/Delta'
import { PortfolioToken } from 'graphql/data/portfolios'
import { getTokenDetailsURL, gqlToCurrency, logSentryErrorForUnsupportedChain } from 'graphql/data/util'
import { useAtomValue } from 'jotai/utils'
import { EmptyWalletModule } from 'nft/components/profile/view/EmptyWalletContent'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { EllipsisStyle, ThemedText } from 'theme/components'
import { PortfolioTokenBalancePartsFragment } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { NumberType, useFormatter } from 'utils/formatNumbers'
import { splitHiddenTokens } from 'utils/splitHiddenTokens'

import { useTokenBalancesQuery } from 'graphql/data/apollo/TokenBalancesProvider'
import { hideSmallBalancesAtom } from '../../SmallBalanceToggle'
import { ExpandoRow } from '../ExpandoRow'
import { PortfolioLogo } from '../PortfolioLogo'
import PortfolioRow, { PortfolioSkeleton, PortfolioTabWrapper } from '../PortfolioRow'
import { useAccountDrawer, useToggleAccountDrawer } from '../hooks'
import {useTokenBalanceList} from './TokenHooks/useTokenList'

import { ExplorerDataType, getExplorerLink } from '../../../../utils/getExplorerLink'

export default function Tokens() {
  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer()
  const hideSmallBalances = useAtomValue(hideSmallBalancesAtom)
  const hideSpam = useAtomValue(hideSpamAtom)
  const [showHiddenTokens, setShowHiddenTokens] = useState(false)
  
  const {tokensWithBalance} = useTokenBalanceList()

  // const { data } = useTokenBalancesQuery({ skip: !accountDrawerOpen })

  // const tokenBalances = data?.portfolios?.[0]?.tokenBalances

  // const { visibleTokens, hiddenTokens } = useMemo(
  //   () => splitHiddenTokens(tokenBalances ?? [], { hideSmallBalances, hideSpam }),
  //   [hideSmallBalances, tokenBalances, hideSpam]
  // )

  // if (!data) {
  //   return <PortfolioSkeleton />
  // }

  // if (tokenBalances?.length === 0) {
  //   // TODO: consider launching moonpay here instead of just closing the drawer
  //   return <EmptyWalletModule type="token" onNavigateClick={toggleAccountDrawer} />
  // }

  const toggleHiddenTokens = () => setShowHiddenTokens((showHiddenTokens) => !showHiddenTokens)

  return (
    <PortfolioTabWrapper>
      {tokensWithBalance.map(
        (tokenBalance) =>
         <TokenRow key={tokenBalance.id} {...tokenBalance} token={tokenBalance} />
      )}
      {/* <ExpandoRow isExpanded={showHiddenTokens} toggle={toggleHiddenTokens} numItems={hiddenTokens.length}>
        {hiddenTokens.map(
          (tokenBalance) =>
            tokenBalance.token && <TokenRow key={tokenBalance.id} {...tokenBalance} token={tokenBalance.token} />
        )}
      </ExpandoRow> */}
    </PortfolioTabWrapper>
  )
}

const TokenBalanceText = styled(ThemedText.BodySecondary)`
  ${EllipsisStyle}
`
const TokenNameText = styled(ThemedText.SubHeader)`
  ${EllipsisStyle}
`

function TokenRow({
  token,
  quantity,
  denominatedValue,
  tokenProjectMarket,
}: PortfolioTokenBalancePartsFragment & { token: PortfolioToken }) {
  const { formatDelta } = useFormatter()
  const percentChange = tokenProjectMarket?.pricePercentChange?.value ?? 0

  const navigate = useNavigate()
  const toggleWalletDrawer = useToggleAccountDrawer()

  const navigateToTokenDetails = useCallback(async () => {
    const url = getExplorerLink(token?.chainId, token?.address, ExplorerDataType.TOKEN)
    window.open(url, '_blank');
  }, [navigate, token, toggleWalletDrawer])
  const { formatNumber } = useFormatter()


  

  const currency = gqlToCurrency(token)
  // if (!currency) {
  //   logSentryErrorForUnsupportedChain({
  //     extras: { token },
  //     errorMessage: 'Token from unsupported chain received from Mini Portfolio Token Balance Query',
  //   })
  //   return null
  // }
  return (
    <TraceEvent
      events={[BrowserEvent.onClick]}
      name={SharedEventName.ELEMENT_CLICKED}
      element={InterfaceElementName.MINI_PORTFOLIO_TOKEN_ROW}
      properties={{ chain_id: currency?.chainId, token_name: token?.name, address: token?.address }}
    >
      <PortfolioRow
        left={<PortfolioLogo images={[token?.iconURL]} size="40px" />}
        title={<TokenNameText>{token?.symbol}</TokenNameText>}
        descriptor={
          <TokenBalanceText>
            {/* {formatNumber({
              input: quantity,
              type: NumberType.TokenNonTx,
            })}{' '} */}
            {token?.formattedBalance}
            {token?.symbol}
          </TokenBalanceText>
        }
        onClick={navigateToTokenDetails}
        right={
        (
            <>
              <ThemedText.SubHeader>
                {/* {formatNumber({
                  input: denominatedValue?.value,
                  type: NumberType.PortfolioBalance,
                })} */}
                {token?.usdValueText||""}
              </ThemedText.SubHeader>
              {/* <Row justify="flex-end">
                <DeltaArrow delta={percentChange} />
                <ThemedText.BodySecondary>{formatDelta(percentChange)}</ThemedText.BodySecondary>
              </Row> */}
            </>
          )
        }
      />
    </TraceEvent>
  )
}
