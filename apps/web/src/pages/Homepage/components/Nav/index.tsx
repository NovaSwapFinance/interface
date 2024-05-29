import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { mediaData, nav, NavProps } from "../Footer/data";
import { useScreenSize } from "hooks/useScreenSize";
import NovaSwapPNG from "../../assets/NovaSwap@2x.png";
import NovaSwapSm from "../../assets/NovaSwapSm.png";
import showIcon from "../../assets/nav/show.png";
import closeIcon from "../../assets/nav/close.png";
import Menu from "./menu";

const Wrap = styled.div<{ isShow: boolean }>`
  // padding: 15px 172px;
  max-width: 1330px;
  width: 100%;
  height: 78px;
  flex-shrink: 0;
  background: #131313;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;

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
  @media (max-width: 600px) {
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

  &.menu-toggle {
    width: 20px;
    height: 20px;
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

  &.mobile {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.176px;
    padding: 12px 0;
    background: #8cd383;

    &::before {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 29px;
      height: 4px;
      content: "";
      border-radius: 4px;
      background: #d9d9d9;
    }
  }

  &:hover {
    background: #8cd383;
  }

  &:active {
    background: #80bf78;
  }

  @media (max-width: 600px) {
    width: 85px;
    height: 25px;
    line-height: 25px;
    border-radius: 4px;
    font-size: 13px;
  }
`;

const MobileWrap = styled.div`
  position: fixed;
  top: 62px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 62px);
  padding: 0 24px;
  background: #131313;
`;

const Mobiles = styled.div`
  margin: 194px 0 31px;
  text-align: center;
`;

const Index = () => {
  const isScreenSize = useScreenSize();
  const [isShow, setIsShow] = useState(true);

  const isMobile = !isScreenSize["sm"];

  console.log("isMobile", isMobile);
  return (
    <Wrap isShow={isShow}>
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
      {isMobile ? (
        <>
          <Icon
            onClick={() => {
              setIsShow(!isShow);
            }}
            src={isShow ? showIcon : closeIcon}
            className={"menu-toggle"}
            alt={""}
          />
        </>
      ) : null}

      {isMobile && !isShow ? (
        <MobileWrap>
          {nav.map((item: NavProps, index) => (
            <Menu key={index} {...item} />
          ))}
          <Mobiles>
            {mediaData.map((item, idx) => (
              <A key={idx} href={item.link} target={"_blank"}>
                <Icon className={"media"} src={item.icon} />
              </A>
            ))}
          </Mobiles>
          <Button className={"mobile"} to={"/swap"}>
            Launch APP
          </Button>
        </MobileWrap>
      ) : null}
    </Wrap>
  );
};

export default Index;
