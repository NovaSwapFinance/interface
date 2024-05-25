import React from "react";
import styled from "styled-components";
import bg from "../../assets/header/background.webp";
import NovaSwapPNG from "../../assets/NovaSwap@2x.png";
import NovaSwapSm from "../../assets/NovaSwapSm.png";
import { Link } from "react-router-dom";

import { mediaData } from "../Footer/data";
import { useScreenSize } from "hooks/useScreenSize";

const Wrap = styled.div`
  padding: 15px 172px;
  width: 100vw;
  height: 78px;
  flex-shrink: 0;
  background: #131313;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    height: 62px;
    padding: 18px 24px;
  }
`;
const NavLogo = styled.div`
  width: 182px;
  height: 46px;
  background: url(${NovaSwapPNG}) no-repeat;
  background-size: cover;
  @media (max-width: 600px) {
    width: 26px;
    height: 26px;
    background: url(${NovaSwapSm}) no-repeat;
    background-size: cover;
  }
`;

const Group = styled.div`

    @media (max-width: 600px) {
        display: none;
    }
`;

const LWrap = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 900px) {
    display: none;
    &.desc {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const A = styled.a`
  margin-right: 22px;
  text-decoration: none;
`;

const Icon = styled.img`
  width: 182px;
  height: 46px;

  &.power {
    width: fit-content;
    height: 32px;
    margin: 9px 0 33px;
  }

  &.media {
    width: fit-content;
    height: 25px;
  }

  @media (max-width: 900px) {
    width: 131px;
    height: 33px;
  }
`;

const Button = styled(Link)`
  width: 132px;
  height: 40px;
  text-align: center;
  line-height: 40px;
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

  @media (max-width: 900px) {
    width: 85px;
    height: 25px;
    line-height: 25px;
    border-radius: 4px;
    font-size: 13px
  }
`;

const Index = () => {
  const isScreenSize = useScreenSize();
  const isMobile = !isScreenSize["sm"];

  console.log("isMobile", isMobile);
  return (
    <Wrap>
      <NavLogo />
      <Group />
      <LWrap>
        {mediaData.map((item, idx) => {
          if (idx === mediaData.length - 1) {
            return null;
          }
          return (
            <A key={idx} href={item.link} target={"_blank"}>
              <Icon className={"media"} src={item.icon} />
            </A>
          );
        })}
        <Button className={"normal"} to={"/swap"}>
          Launch APP
        </Button>
      </LWrap>
      {isMobile? <Button className={"normal"} to={"/swap"}>
          Launch APP
        </Button>:null}
    </Wrap>
  );
};

export default Index;
