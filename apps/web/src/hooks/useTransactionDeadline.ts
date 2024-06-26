import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { ChainId } from "@novaswap/sdk-core";
import { L2_CHAIN_IDS } from "constants/chains";
import {
  L2_DEADLINE_FROM_NOW,
  DEFAULT_DEADLINE_FROM_NOW,
  NOVA_SEPOLIA_DEADLINE_FROM_NOW
} from "constants/misc";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "state/hooks";

import { useInterfaceMulticall } from "hooks/useContract";
import useCurrentBlockTimestamp from "./useCurrentBlockTimestamp";

export default function useTransactionDeadline(): BigNumber | undefined {
  const { chainId } = useWeb3React();
  const ttl = useAppSelector((state) => state.user.userDeadline);
  const blockTimestamp = useCurrentBlockTimestamp();
  return useMemo(
    () => timestampToDeadline(chainId, blockTimestamp, ttl),
    [blockTimestamp, chainId, ttl],
  );
}

/**
 * Returns an asynchronous function which will get the block timestamp and combine it with user settings for a deadline.
 * Should be used for any submitted transactions, as it uses an on-chain timestamp instead of a client timestamp.
 */
export function useGetTransactionDeadline(): () => Promise<
  BigNumber | undefined
> {
  const { chainId } = useWeb3React();
  const ttl = useAppSelector((state) => state.user.userDeadline);
  const multicall = useInterfaceMulticall();
  return useCallback(async () => {
    const blockTimestamp = await multicall.getCurrentBlockTimestamp();
    console.log(
      "deadline====>blockTimestamp",
      blockTimestamp.toString(10),
      new Date(blockTimestamp.toString(10) * 1000),
    );
    return timestampToDeadline(chainId, blockTimestamp, ttl);
  }, [chainId, multicall, ttl]);
}

function timestampToDeadline(
  chainId?: number,
  blockTimestamp?: BigNumber,
  ttl?: number,
) {
  if (blockTimestamp && chainId && L2_CHAIN_IDS.includes(chainId))
    return blockTimestamp.add(L2_DEADLINE_FROM_NOW);
  // TODO: Nova Mainnet need to check deadline
  if (blockTimestamp && chainId && chainId === ChainId.NOVA_SEPOLIA)
    return blockTimestamp.add(NOVA_SEPOLIA_DEADLINE_FROM_NOW);
  if (blockTimestamp && ttl)
    return blockTimestamp.add(DEFAULT_DEADLINE_FROM_NOW);
  return undefined;
}
