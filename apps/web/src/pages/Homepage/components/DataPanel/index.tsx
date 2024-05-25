import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -85px;
  padding: 40px 80px 56px;
  border-radius: 16px;
  background: #181918;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
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
`;
const Dec = styled.span`
  margin-bottom: 27px;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
  letter-spacing: -0.5px;
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
