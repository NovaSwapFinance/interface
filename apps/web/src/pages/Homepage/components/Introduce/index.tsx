import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import adorn from "../../assets/introduce/adorn.png";
import adorn2 from "../../assets/introduce/adorn2.png";
import adorn3 from "../../assets/introduce/adorn3.png";
import { useScreenSize } from "../../../../hooks/useScreenSize";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "a  b"
    "c  b"
    "d  d";
  gap: 32px;
  @media (max-width: 900px) {
    grid-template-areas:
      "a"
      "d"
      "b"
      "c";
    gap: 20px;
  }
`;
const Item = styled.div`
  height: 236px;
  padding: 40px 51px 40px 64px;
  text-align: left;
  border-radius: 16px;
  background: #181918;

  &:nth-child(1) {
    grid-area: a;
    background: #181918 url(${adorn}) no-repeat right center/contain;
  }

  &:nth-child(2) {
    grid-area: b;
    max-width: 400px;
    height: auto;
    background: #181918 url(${adorn2}) no-repeat right bottom/contain;
  }

  &:nth-child(3) {
    grid-area: c;
  }

  &:nth-child(4) {
    grid-area: d;
    background: #181918 url(${adorn3}) no-repeat right center/contain;
  }

  @media (max-width: 900px) {
    position: relative;
    z-index: 1;
    height: 167px;
    padding: 20px 0 24px 24px;
    background: #181918 !important;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      height: 100%;
      width: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      z-index: -1;
    }

    &:nth-child(1) {
      &::before {
        background-image: url(${adorn});
      }
    }

    &:nth-child(2) {
      &::before {
        background-image: url(${adorn2});
      }
    }

    &:nth-child(4) {
      &::before {
        background-image: url(${adorn3});
      }
    }

    &:nth-child(2) {
      max-width: 100%;
    }
  }
`;
const Title = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 22px;
    line-height: 32px; /* 145.455% */
  }
`;
const Desc = styled.p`
  margin: 8px 0 16px;
  color: #c5c9bc;
  font-size: 18px;
  font-weight: 400;

  @media (max-width: 600px) {
    max-width: 271px;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.75);
    font-size: 12px;
  }
`;
const Button = styled(Link)`
  color: #8cd383;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;

  &.btn {
    max-width: 110px;
    max-height: 39px;
    padding: 6px 24px;
    font-size: 18px;
    text-align: center;
    line-height: 39px;
    border-radius: 9px;
    border: 1px solid #9ed697;
    color: #fff;
    background: #8cd383;
  }

  &.btn:hover {
    color: #fff;
    background: #9ceb92;
  }

  &.btn:active {
    color: #fff;
    background: #80bf78;
  }

  &:hover {
    color: #6e9769;
  }

  &:active {
    background: #80bf78;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Index = () => {
  const isScreenSize = useScreenSize();
  const isMobile = !isScreenSize["sm"];
  return (
    <Wrap>
      <Item>
        <Title>Innovation</Title>
        <Desc
          style={{
            maxWidth: isMobile ? 240 : 580,
          }}
        >
          Trade a diverse array of digital assets originating from multiple
          blockchain networks within a single DEX platform.
        </Desc>
        <Button
          to={"https://docs.novaswap.fi/welcome-to-novaswap/why-novaswap"}
          target={"_blank"}
        >{`More >`}</Button>
      </Item>
      <Item>
        <Title>Security</Title>
        <Desc>
          Adopt the well-tested core code of Uniswap v3 in addition to being
          built on zkLink Nova, which inherits the security of Ethereum.
        </Desc>
        <Button to={"https://github.com/NovaSwapFinance"} target={"_blank"}>
          {`GitHub >`}
        </Button>
      </Item>
      <Item>
        <Title>Fair Distribution</Title>
        <Desc
          style={{
            maxWidth: isMobile ? 240 : 580,
          }}
        >
          We’re committed to fostering a fair distribution model via fair launch
          which targets to place community at the forefront of our endeavors
        </Desc>
        <Button
          to={"https://docs.novaswap.fi/future/tokenomics"}
          target={"_blank"}
        >{`Tokenomics >`}</Button>
      </Item>
      <Item>
        <Title>Multi-layer Yields</Title>
        <Desc>
          L2 Points + LSD Yield + LRT Points+ Nova Points + Trading Fee + $NOVA
          Rewards... <br /> There are even more higher-yield L2 "Lego"s waiting
          for you to explore!
        </Desc>
        <Button
          to={
            "https://docs.novaswap.fi/support/user-guide/how-to-get-higher-yield"
          }
          target={"_blank"}
        >{`How to get >`}</Button>
      </Item>
    </Wrap>
  );
};

export default Index;
