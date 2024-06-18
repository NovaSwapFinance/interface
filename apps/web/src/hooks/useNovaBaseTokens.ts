import { useState } from "react";
import { NOVA_BASE_TOKEN_SOURCE } from "constants/NovaBaseToken";
import { sourceChainMap} from "constants/chains";

export function useNovaBaseTokens() {
  const [novaBaseTokens, setNovaBaseTokens] = useState(NOVA_BASE_TOKEN_SOURCE);
  const convertJsonToTokenObjects = (jsonData) => {
    const tokens = [];
    for (const entry of jsonData) {
      const sourceSuffix = entry.networkKey ? sourceChainMap[entry.networkKey] :undefined
      const symbol = `${entry.symbol}${sourceSuffix? `.${sourceSuffix}`:''}`
      const token = {
        __typename: "Token",
        id: entry.address,
        address: entry.address,
        chain: "Nova Mainnet",
        symbol,
        name: entry.name,
        decimals: entry.decimals,
        standard: entry.isNative ? "NATIVE" : "ERC20",
        project: {
          __typename: "TokenProject",
          id: entry.address,
          name: entry.name,
          logoUrl: entry.logurl,
          logo: null,
        },
      };

      tokens.push(token);
    }
    return tokens;
  };

  return {
    data: {
      __typename: "Query",
      topTokens: convertJsonToTokenObjects(novaBaseTokens),
    },
    loading: false,
  };
}
