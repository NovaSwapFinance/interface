import React from "react";
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
  return (
    <Container>
      <Box>
        <Dec>Total Value Locked</Dec>
        <Info>$318.41M</Info>
      </Box>
      <Box>
        <Dec>24hrs Trading Volume</Dec>
        <Info>$6.58M</Info>
      </Box>
      <Box>
        <Dec>History Txn</Dec>
        <Info>2345,678</Info>
      </Box>
      <Box>
        <Dec>History Users</Dec>
        <Info>12,345</Info>
      </Box>
    </Container>
  );
};

export default StartBuilding;
