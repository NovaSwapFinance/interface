import { BrowserEvent, InterfaceElementName, InterfaceEventName, InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { Trace, TraceEvent } from 'analytics'
import { useToggleAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { ButtonGray, ButtonPrimary, ButtonText } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { FlyoutAlignment, Menu } from 'components/Menu'
import PositionList from 'components/PositionList'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { isSupportedChain } from 'constants/chains'
import { useFilterPossiblyMaliciousPositions } from 'hooks/useFilterPossiblyMaliciousPositions'
import { useNetworkSupportsV2 } from 'hooks/useNetworkSupportsV2'
import { useLegacyV3Positions, useV3Positions } from 'hooks/useV3Positions'
import { Trans } from 'i18n'
import { PoolVersionMenu } from 'pages/Pool/shared'
import { useMemo } from 'react'
import { AlertTriangle, BookOpen, ChevronDown, ChevronsRight, Inbox, Info, Layers, X } from 'react-feather'
import { Link } from 'react-router-dom'
import { ApplicationModal } from 'state/application/reducer'
import { useUserHideClosedPositions } from 'state/user/hooks'
import styled, { css, useTheme } from 'styled-components'
import { HideSmall, ThemedText } from 'theme/components'
import { PositionDetails } from 'types/position'
import { ProtocolVersion } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import CTACards from './CTACards'
import { LoadingRows } from './styled'

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    max-width: 800px;
    padding-top: 48px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    max-width: 500px;
    padding-top: 20px;
  }
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.neutral2};
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  }
`
const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`
const PoolMenu = styled(Menu)`
  margin-left: 0;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex: 1 1 auto;
    width: 50%;
  }

  a {
    width: 100%;
  }
`
const PoolMenuItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 535;
`
const MoreOptionsButton = styled(ButtonGray)`
  border-radius: 12px;
  flex: 1 1 auto;
  padding: 6px 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.surface1};
  border: 1px solid ${({ theme }) => theme.surface3};
  margin-right: 8px;
`

const MoreOptionsText = styled(ThemedText.BodyPrimary)`
  align-items: center;
  display: flex;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 12px;
  font-size: 16px;
  padding: 6px 8px;
  width: fit-content;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex: 1 1 auto;
    width: 50%;
  }
`

const MainContentWrapper = styled.main`
  background-color: ${({ theme }) => theme.surface1};
  border: 1px solid ${({ theme }) => theme.surface3};
  padding: 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const NoticeContainer = styled.div`
  background-color: #2c1a1a;
  border: 1px solid #4b2b2b;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  max-width: 100%;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const IconContainer = styled.div`
  margin-right: 12px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
`;

const Title = styled.h3`
  color: #f87171;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const Message = styled.p`
  color: #fecaca;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #f87171;
  margin-left: 12px;
  &:hover {
    color: #fecaca;
  }
`;

const WebsiteLink = styled.a`
  color: #fca5a5;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #f87171;
  }
`;

const MigrationNotice = ({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) => (
  <NoticeContainer>
    <IconContainer>
      <Info size={24} color="#F87171" />
    </IconContainer>
    <ContentContainer>
      <Title>{title}</Title>
      <Message>
        {message}
        <br />
        <WebsiteLink
          href="https://legacy.novaswap.fi/#/pool"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Novaswap Legacy V1 interface
        </WebsiteLink>
      </Message>
    </ContentContainer>
  </NoticeContainer>
);

function PositionsLoadingPlaceholder() {
  return (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  )
}

function WrongNetworkCard() {
  const theme = useTheme()
  const {account} = useWeb3React()
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <ThemedText.H1Large>
                <Trans>Positions</Trans>
              </ThemedText.H1Large>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <ThemedText.BodyPrimary color={theme.neutral3} textAlign="center">
                <InboxIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">
                    <Trans>{account?'Switch your network to zkLink Nova, your positions will appear here':'Connect your wallet to add liquidity positions.'}</Trans>
                  </div>
                </ThemedText.BodyPrimary>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}

export default function Pool() {
  const { account, chainId } = useWeb3React();
  const networkSupportsV2 = useNetworkSupportsV2();
  const toggleWalletDrawer = useToggleAccountDrawer();

  const theme = useTheme();
  const [userHideClosedPositions, setUserHideClosedPositions] =
    useUserHideClosedPositions();
  //useLegacyV3Positions
  const { positions:legacyPositions, loading: legacyPositionsLoading } = useLegacyV3Positions(account);


  const { positions, loading: positionsLoading } = useV3Positions(account);

  const [openPositions, closedPositions] = positions?.reduce<
    [PositionDetails[], PositionDetails[]]
  >(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p);
      return acc;
    },
    [[], []],
  ) ?? [[], []];

  const [legacyOpenPositions, legacyClosedPositions] = legacyPositions?.reduce<
    [PositionDetails[], PositionDetails[]]
  >(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p);
      return acc;
    },
    [[], []],
  ) ?? [[], []];

  console.log(legacyOpenPositions, "legacyOpenPositions---->");

  const hasLegacyContractOpenPositions = legacyOpenPositions.length > 0;

  const userSelectedPositionSet = useMemo(
    () => [
      ...openPositions,
      ...(userHideClosedPositions ? [] : closedPositions),
    ],
    [closedPositions, openPositions, userHideClosedPositions],
  );

  const filteredPositions = useFilterPossiblyMaliciousPositions(
    userSelectedPositionSet,
  );

  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />;
  }

  const showConnectAWallet = Boolean(!account);

  const menuItems = [
    {
      content: (
        <PoolMenuItem>
          <Trans>Migrate</Trans>
          <ChevronsRight size={16} />
        </PoolMenuItem>
      ),
      link: "/migrate/v2",
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>V2 liquidity</Trans>
          <Layers size={16} />
        </PoolMenuItem>
      ),
      link: "/pools/v2",
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>Learn</Trans>
          <BookOpen size={16} />
        </PoolMenuItem>
      ),
      link: "https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-",
      external: true,
    },
  ];

  return (
    <Trace page={InterfacePageName.POOL_PAGE} shouldLogImpression>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: "100%" }}>
            <TitleRow padding="0">
              <Row gap="md" width="min-content">
                <ThemedText.LargeHeader>
                  <Trans>Positions</Trans>
                </ThemedText.LargeHeader>
                {/* <PoolVersionMenu protocolVersion={ProtocolVersion.V3} /> */}
              </Row>
              <ButtonRow>
                {/* {networkSupportsV2 && (
                  <PoolMenu
                    modal={ApplicationModal.POOL_OVERVIEW_OPTIONS}
                    menuItems={menuItems}
                    flyoutAlignment={FlyoutAlignment.LEFT}
                    ToggleUI={(props: any) => (
                      <MoreOptionsButton {...props}>
                        <MoreOptionsText>
                          <Trans>More</Trans>
                          <ChevronDown size={15} />
                        </MoreOptionsText>
                      </MoreOptionsButton>
                    )}
                  />
                )} */}
                <ResponsiveButtonPrimary
                  data-cy="join-pool-button"
                  id="join-pool-button"
                  as={Link}
                  to="/add/ETH"
                >
                  + <Trans>New position</Trans>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>
            <TitleRow>
              {hasLegacyContractOpenPositions && (
                <MigrationNotice
                  title="Migration Required"
                  message="Dear users, due to a contract upgrade, we kindly request that
                you migrate your liquidity to the NovaSwap V2 platform. The
                liquidity you had previously provided will no longer be eligible
                to earn trading fee revenue. Therefore, we ask that you withdraw
                your liquidity from V1 and add it to the current V2 version of
                the platform. We apologize for any inconvenience this upgrade
                may have caused you."
                  onClose={() => {}}
                />
              )}
            </TitleRow>

            <MainContentWrapper>
              {positionsLoading ? (
                <PositionsLoadingPlaceholder />
              ) : filteredPositions &&
                closedPositions &&
                filteredPositions.length > 0 ? (
                <PositionList
                  positions={filteredPositions}
                  setUserHideClosedPositions={setUserHideClosedPositions}
                  userHideClosedPositions={userHideClosedPositions}
                />
              ) : (
                <ErrorContainer>
                  <ThemedText.BodyPrimary
                    color={theme.neutral3}
                    textAlign="center"
                  >
                    <InboxIcon strokeWidth={1} style={{ marginTop: "2em" }} />
                    <div style={{ marginTop: "0.5em" }}>
                      <Trans>Your active liquidity positions will.</Trans>
                    </div>
                    <div style={{ marginTop: "0.5em", fontSize: "2em" }}>
                      <Trans>appear here.</Trans>
                    </div>
                  </ThemedText.BodyPrimary>
                  {!showConnectAWallet && closedPositions.length > 0 && (
                    <ButtonText
                      style={{ marginTop: ".5rem" }}
                      onClick={() =>
                        setUserHideClosedPositions(!userHideClosedPositions)
                      }
                    >
                      <Trans>Show closed positions</Trans>
                    </ButtonText>
                  )}
                  {showConnectAWallet && (
                    <TraceEvent
                      events={[BrowserEvent.onClick]}
                      name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
                      properties={{ received_swap_quote: false }}
                      element={InterfaceElementName.CONNECT_WALLET_BUTTON}
                    >
                      <ButtonPrimary
                        style={{
                          marginTop: "2em",
                          marginBottom: "2em",
                          padding: "8px 16px",
                        }}
                        onClick={toggleWalletDrawer}
                      >
                        <Trans>Connect a wallet</Trans>
                      </ButtonPrimary>
                    </TraceEvent>
                  )}
                </ErrorContainer>
              )}
            </MainContentWrapper>
            {/* <HideSmall>
              <CTACards />
            </HideSmall> */}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </Trace>
  );
}
