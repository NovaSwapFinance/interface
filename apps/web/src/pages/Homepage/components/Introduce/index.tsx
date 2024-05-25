import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import adorn from "../../assets/introduce/adorn.png";
import adorn2 from "../../assets/introduce/adorn2.png";
import adorn3 from "../../assets/introduce/adorn3.png";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "a  b"
    "c  b"
    "d  d";
  gap: 32px;
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
`;
const Title = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 32px;
  font-weight: 600;
`;
const Desc = styled.p`
  margin: 8px 0 16px;
  color: #c5c9bc;
  font-size: 18px;
  font-weight: 400;
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
`;

const Index = () => {
  return (
    <Wrap>
      <Item>
        <Title>Innovation</Title>
        <Desc>
          Trade a diverse array of digital assets originating from multiple
          <br />
          blockchain networks within a single DEX platform.
        </Desc>
        <Button to={"/"}>{`More >`}</Button>
      </Item>
      <Item>
        <Title>Security</Title>
        <Desc>
          Adopt the well-tested core code <br /> of Uniswap v3 in addition
          <br /> to being built on zkLink Nova,
          <br /> which inherits the security of <br /> Ethereum.
        </Desc>
        <Button className={"btn"} to={"/"}>
          GitHub
        </Button>
      </Item>
      <Item>
        <Title>Fair Distribution</Title>
        <Desc>
          We’re committed to fostering a fair distribution model via fair launch
          <br />
          which targets to place community at the forefront of our endeavors
        </Desc>
        <Button to={"/"}>{`Tokenomics >`}</Button>
      </Item>
      <Item>
        <Title>Multi-layer Yields</Title>
        <Desc>
          L2 Points + LSD Yield + LRT Points+ Nova Points + Trading Fee + $NOVA
          Rewards... <br /> There are even more higher-yield L2 "Lego"s waiting
          for you to explore!
        </Desc>
        <Button to={"/"}>{`How to get >`}</Button>
      </Item>
    </Wrap>
  );
};

export default Index;
