import React from "react";
import styled from "styled-components";
import bg from "../../assets/header/background.webp";
import bgMobile from "../../assets/header/bgMobile.webp";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  max-height: 1009px;
  width: 100vw;
  height: 945px;
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  @media (max-width: 600px) {
    height: 695px;
    padding: 0 24px;
    background-image: url(${bgMobile});
    background-position: center -50px;
  }
`;
const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  padding-top: 137px;
  text-align: center;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    text-align: left;
  }
`;
const Title = styled.h2`
  max-width: 1186px;
  margin: 0;
  margin-block: 0;
  color: #fff;
  font-size: 56px;
  font-weight: 600;
  line-height: 72px; /* 128.571% */
  @media (max-width: 900px) {
    max-width: 313px;
    font-size: 30px;
    line-height: 38px; /* 126.667% */
  }
`;
const Desc = styled.p`
  max-width: 817px;
  margin: 32px 0 48px;
  color: #c5c9bc;
  font-size: 18px;
  font-weight: 400;
  @media (max-width: 900px) {
    max-width: 318px;
    margin: 16px 0 32px;
    font-size: 14px;
    line-height: 22px; /* 157.143% */
  }
`;
const ButtonWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Button = styled(Link)`
  width: 232px;
  height: 56px;
  font-size: 19px;
  text-align: center;
  line-height: 56px;
  border-radius: 9px;
  color: #fff;
  border: 1px solid #9ed697;
  background: rgba(14, 14, 14, 0.2);
  text-decoration: none;
  transition: background 0.2s;

  &.normal {
    background: #8cd383;
  }

  &.normal:hover {
    background: #9ceb92;
  }

  &:hover {
    background: #8cd383;
  }

  &:active {
    background: #80bf78;
  }

  @media (max-width: 600px) {
    width: 100%;
    &.normal,
    &.bridge {
      position: fixed;
      bottom: 20px;
      z-index: 2;
      width: 43%;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
    }

    &.normal {
      left: 5%;
    }

    &.bridge {
      right: 5%;
    }
  }
`;

const Index = () => {
  return (
    <Wrap>
      <Container>
        <Title>
          Swap all the L2’s assets in NovaSwap <br /> of zkLink Nova
        </Title>
        <Desc>
          NovaSwap is an innovative multi-chain assets aggregated AMM DEX built
          on zkLink Nova <br /> that offers ultimate security, multi-layer
          yields, and fair distribution.
        </Desc>
        <ButtonWrap>
          <Button className={"normal"} to={"/swap"}>
            Launch APP
          </Button>
          <Button
            className={"bridge"}
            to={"https://portal.zklink.io/"}
            target={"_blank"}
          >
            Bridge Assets
          </Button>
        </ButtonWrap>
      </Container>
    </Wrap>
  );
};

export default Index;
