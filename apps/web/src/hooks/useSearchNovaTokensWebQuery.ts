import { useNovaTokenList } from "hooks/useNovaTokenList";
import { useMemo } from "react";
import { isAddress } from "utilities/src/addresses";
import { sourceChainMap} from "constants/chains";

export function useSearchNovaTokensWebQuery(searchQuery) {
  const { novaTokenList } = useNovaTokenList();


  const convertJsonToTokenObjects = (jsonData) => {
    const tokens = [];
    for (const entry of jsonData) {
      const sourceSuffix = entry.networkKey ? sourceChainMap[entry.networkKey] :undefined
      const symbol = `${entry.symbol}${sourceSuffix? `.${sourceSuffix}`:''}`
      const token = {
        __typename: "Token",
        id: entry.l2Address,
        address: entry.l2Address,
        chain: "Nova Mainnet",
        symbol,
        name: entry.name,
        decimals: entry.decimals,
        standard: entry.symbol === 'ETH' ? "NATIVE" : "ERC20",
        project: {
          __typename: "TokenProject",
          id: entry.l2Address,
          name: entry.name,
          logoUrl: entry.iconURL,
          logo: null,
        },
      };

      tokens.push(token);
    }
    return tokens;
  };

  const searchTokens = useMemo(() => {
    if(!searchQuery || isAddress(searchQuery)) {
        return  [];
    } 
   const searchSource =  novaTokenList.filter((token) => {
        return token.symbol.toLowerCase().includes(searchQuery.toLowerCase())||token.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    const result = convertJsonToTokenObjects(searchSource)
    return result;
  }, [searchQuery, novaTokenList]);

  return {
    data: {
        __typename: "Query",
        searchTokens,
      },
    loading: false,
  };
}
