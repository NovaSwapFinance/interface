import { user } from "@uniswap/analytics";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -85px;
  padding: 40px 80px 56px;
  border-radius: 16px;
  background: #181918;
  @media (max-width: 900px) {
    display: grid;
    grid-auto-columns: 1fr;
    gap: 20px;
    padding: 32px 0;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

const Dec = styled.span`
  margin-bottom: 27px;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: -0.5px;
  @media (max-width: 600px) {
    margin: 0;
    font-size: 12px;
    line-height: 20px; /* 166.667% */
    letter-spacing: -0.5px;
  }
`;

const Info = styled.div`
  color: #fff;
  text-align: center;
  font-size: 42px;
  font-weight: 600;
  line-height: 24px; /* 57.143% */
  letter-spacing: 1px;
  white-space: break-spaces;
  word-break: break-all;
  @media (max-width: 600px) {
    font-size: 30px;
    line-height: 40px; /* 133.333% */
    letter-spacing: 1px;
  }
`;
const StartBuilding = () => {
  const [tvl, setTvl] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [volumeUSD, setVolumeUSD] = useState(0);
  const [userCount, setUserCount] = useState(0);

  function formatNumber(num) {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    } else {
      return Number(num).toFixed(2);
    }
  }

  const fetchTVL = async () => {
    const query = `
    {
      uniswapDayDatas(orderBy: date, orderDirection: desc) {
        tvlUSD
        date
      }
    }
  `;
      const response = await fetch(
        "https://graph.zklink.io/subgraphs/name/novaswap",
        {
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            extensions: {},
          }),
          method: "POST",
        },
      );
      const data = await response.json();
      if (!data.errors) {
        const { tvlUSD } =
          data.data.uniswapDayDatas[0];
          setTvl(formatNumber(tvlUSD));
      }
  };

  const fetchDailyDatas = async () => {
    const query = `
  {
    uniswapDayDatas {
      txCount
      volumeUSD
    }
  }
`;
    const response = await fetch(
      "https://graph.zklink.io/subgraphs/name/novaswap",
      {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          extensions: {},
        }),
        method: "POST",
      },
    );
    const data = await response.json();
    if (!data.errors) {
      const { volumeUSD } =
        data.data.uniswapDayDatas[data.data.uniswapDayDatas.length - 1];
      const totalTxCount = data.data.uniswapDayDatas.reduce(
        (total, item) => total + Number(item.txCount),
        0,
      );
      setTxCount(totalTxCount);
      setVolumeUSD(formatNumber(volumeUSD));
    }
  };

  const fetchUserCount = async (id) => {
    const query = `
    {
      swaps(first: 1000, where: {id_gt: "${id}"}) {
        origin
        id
      }
    }
  `;
    const response = await fetch(
      "https://graph.zklink.io/subgraphs/name/novaswap",
      {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          extensions: {},
        }),
        method: "POST",
      },
    );
    const res = await response.json();

    if (res.errors) {
      console.error("Error:", res.errors);
      return [];
    } else {
      const data = res.data.swaps;
      console.log(data[data.length - 1].id);
      if (data.length < 1000) {
        return data;
      } else {
        const nextData = await fetchUserCount(data[data.length - 1].id);
        return data.concat(nextData);
      }
    }
  };

  useEffect(() => {
    fetchTVL();
    fetchDailyDatas();
    fetchUserCount("").then((data) => {
      const uniqueData = data.filter((v, i, a) => a.map(e => e.origin).indexOf(v.origin) === i);
      setUserCount(uniqueData?.length ?? 0)
    });
  }, []);

  return (
    <Container>
      <Box>
        <Dec>Total Value Locked</Dec>
        <Info>{`$${tvl}`}</Info>
      </Box>
      <Box>
        <Dec>24hrs Trading Volume</Dec>
        <Info>{`$${volumeUSD}`}</Info>
      </Box>
      <Box>
        <Dec>History Txn</Dec>
        <Info>{txCount.toLocaleString()}</Info>
      </Box>
      <Box>
        <Dec>History Users</Dec>
        <Info>{userCount.toLocaleString()}</Info>
      </Box>
    </Container>
  );
};

export default StartBuilding;
