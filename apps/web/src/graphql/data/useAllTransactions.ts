import {useEffect, useState,useCallback, useMemo, useRef } from 'react'
import {
  Chain,
  PoolTransaction,
  PoolTransactionType,
  useV2TransactionsQuery,
  useV3TransactionsQuery,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'


import {useRecentSwapsQuery} from 'graphql/thegraph/__generated__/types-and-hooks'

export enum TransactionType {
  SWAP = 'Swap',
  MINT = 'Add',
  BURN = 'Remove',
}

export const BETypeToTransactionType: { [key: string]: TransactionType } = {
  [PoolTransactionType.Swap]: TransactionType.SWAP,
  [PoolTransactionType.Remove]: TransactionType.BURN,
  [PoolTransactionType.Add]: TransactionType.MINT,
}

const ALL_TX_DEFAULT_QUERY_SIZE = 20

export function useAllTransactions(
  chain: Chain,
  filter: TransactionType[] = [TransactionType.SWAP, TransactionType.MINT, TransactionType.BURN]
) {
  const {
    data: dataV3,
    loading: loadingV3,
    error: errorV3,
    fetchMore: fetchMoreV3,
  } = useRecentSwapsQuery({
    variables: { chain, first: ALL_TX_DEFAULT_QUERY_SIZE },
  })

  const [allTokens,setAllTokens] = useState<any[]>([])

  useEffect(()=>{
    fetch(`https://explorer-api.zklink.io/tokens?limit=300`).then((res) =>
      res.json().then((all) => {
        if(!all.error) {
          setAllTokens(all.items);
        }
      }),
    );
  },[])

  console.log('useTopTransactionsQuery===>',dataV3)
  // const {
  //   data: dataV2,
  //   loading: loadingV2,
  //   error: errorV2,
  //   fetchMore: fetchMoreV2,
  // } = useV2TransactionsQuery({
  //   variables: { first: ALL_TX_DEFAULT_QUERY_SIZE },
  //   skip: chain !== Chain.Ethereum,
  // })

  const getProjectToken = (address:string) => {
    const item = allTokens.find((token) => token.l2Address.toLowerCase() === address.toLowerCase());
    return item?.iconURL || '';
  }


  const formatterTransactions = (arr) => {
    if(arr.length>0){
      return arr.map((tx) => {
        const {id,amount0,amount1,amountUSD,origin,timestamp,token0,token1,transaction} = tx|| {};
        const {id:hx} = transaction;
       
        const token0Logo = getProjectToken(token0.address||'');
        const token1Logo = getProjectToken(token1.address||'');

        const result = {
          account:origin,
          hash:hx, 
          id,
          protocolVersion: "V3",
          type: "SWAP",
          timestamp,
          token0: token0Logo ?{...token0,project:{logo:{url:token0Logo}}, chain:'NOVAMAINNET',}:{...token0, chain:'NOVAMAINNET',},
          token0Quantity:amount0,
          token1: token1Logo? {...token1,project:{logo:{url:token1Logo}}, chain:'NOVAMAINNET',}: {...token1, chain:'NOVAMAINNET',},
          token1Quantity:amount1,
          usdValue:{value:amountUSD}
        }

        return result
      })
    }
    return []
  }

  const loadingMoreV3 = useRef(false)
  const loadingMoreV2 = useRef(false)
  const querySizeRef = useRef(ALL_TX_DEFAULT_QUERY_SIZE)
  const loadMore = useCallback(
    ({ onComplete }: { onComplete?: () => void }) => {
      if (loadingMoreV3.current || (loadingMoreV2.current && chain === Chain.Ethereum)) {
        return
      }
      loadingMoreV3.current = true
      // loadingMoreV2.current = true
      querySizeRef.current += ALL_TX_DEFAULT_QUERY_SIZE
      fetchMoreV3({
        variables: {
          cursor: dataV3?.swaps?.[dataV3.swaps.length - 1]?.timestamp,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          if (!loadingMoreV2.current || chain !== Chain.Ethereum) onComplete?.()
          const mergedData = {
            v3Transactions: [...(prev.swaps ?? []), ...(fetchMoreResult.swaps ?? [])],
          }
          loadingMoreV3.current = false
          return mergedData
        },
      })
      // chain === Chain.Ethereum &&
      //   fetchMoreV2({
      //     variables: {
      //       cursor: dataV2?.v2Transactions?.[dataV2.v2Transactions.length - 1]?.timestamp,
      //     },
      //     updateQuery: (prev, { fetchMoreResult }) => {
      //       if (!fetchMoreResult) return prev
      //       !loadingMoreV3.current && onComplete?.()
      //       const mergedData = {
      //         v2Transactions: [...(prev.v2Transactions ?? []), ...(fetchMoreResult.v2Transactions ?? [])],
      //       }
      //       loadingMoreV2.current = false
      //       return mergedData
      //     },
      //   })
    },
    [chain, dataV3?.swaps, fetchMoreV3]
  )

  const transactions: PoolTransaction[] = useMemo(() => {
   return formatterTransactions(dataV3?.swaps||[])
  }, [dataV3?.swaps, allTokens])




  return {
    transactions,
    loading: loadingV3,
    errorV2:null,
    errorV3,
    loadMore,
  }
}
