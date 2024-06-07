import { Currency } from "@novaswap/sdk-core";
import { TokenInfo } from "@uniswap/token-lists";

import AssetLogo, { AssetLogoBaseProps } from "./AssetLogo";
import {ETH_LOGO} from 'constants/NovaBaseToken'
import { useMemo } from "react";
import {useNovaTokenList} from 'hooks/useNovaTokenList'
import {NOVA_BASE_TOKEN_SOURCE} from 'constants/NovaBaseToken'

export default function CurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: Currency | null;
  },
) {

  const {novaTokenList} = useNovaTokenList()

  const tokenImg = useMemo(() => {
    if(props.currency?.isNative || (props.currency?.address ||props.currency?.wrapped.address||'').toLowerCase() === '0x8280a4e7d5b3b658ec4580d3bc30f5e50454f169') return ETH_LOGO;
    let novaBaseToken = novaTokenList.find((token) => token.l2Address.toLowerCase() === (props.currency?.address ||props.currency?.wrapped.address||'').toLowerCase());
    let novaSourceToken = NOVA_BASE_TOKEN_SOURCE.find((token) => token.address.toLowerCase() === (props.currency?.address ||props.currency?.wrapped.address||'').toLowerCase());

    return novaBaseToken?.iconURL || novaSourceToken?.logurl || '';
  }, [props.currency,novaTokenList])
  return (
    <AssetLogo
      currency={props.currency}
      isNative={props.currency?.isNative}
      chainId={props.currency?.chainId}
      address={props.currency?.address ||props.currency?.wrapped.address}
      symbol={props.symbol ?? props.currency?.symbol}
      primaryImg={(props.currency as TokenInfo)?.logoURI}
      images={tokenImg?[tokenImg]:[]}
      {...props}
    />
  );
}
