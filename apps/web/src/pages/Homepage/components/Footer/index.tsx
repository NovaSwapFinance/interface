import React from "react";
import styled from "styled-components";
import novaIcon from "../../assets/NovaSwap@2x.png";
import powerIcon from "../../assets/poweredby@2x.png";
import { mediaData, nav } from "./data";

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1213px;
  margin: 46px auto 0;
  @media (max-width: 1213px) {
    max-width: 1213px;
    width: inherit;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 0 21px;
  }
`;
const BlockL = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 900px) {
    margin-bottom: 12px;
  }
`;
const LWrap = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 900px) {
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
    width: 183px;
    height: auto;
    margin: 9px 0 33px;
  }

  &.media {
    width: 25px;
    height: auto;
  }

  @media (max-width: 900px) {
    width: 131px;
    height: 33px;
  }
`;
const P = styled.p`
  color: #c0c0c0;
  font-size: 16px;
  font-weight: 400;
  line-height: 32px; /* 200% */
  letter-spacing: -0.5px;
  text-align: center;
  @media (max-width: 900px) {
    margin: 0;
    font-size: 12px;
    letter-spacing: -0.5px;
  }
`;

const BlockR = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 90px;
  @media (max-width: 900px) {
    gap: 27px;
  }
`;

const RWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 17px;
`;
const Title = styled.h3`
  margin: 0 0 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.5px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Link = styled.a`
  margin: 0 0 6px;
  color: #b8b8b8;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.5px;
  text-decoration: none;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Index = () => {
  return (
    <>
      <Wrap>
        <BlockL>
          <LWrap className={"desc"}>
            <Icon src={novaIcon} alt={""}></Icon>
          </LWrap>
          <Icon className={"power"} src={powerIcon} alt={""}></Icon>
          <LWrap>
            {mediaData.map((item, idx) => (
              <A key={idx} href={item.link} target={"_blank"}>
                <Icon className={"media"} src={item.icon} />
              </A>
            ))}
          </LWrap>
        </BlockL>
        <BlockR>
          {nav.map((v) => (
            <RWrap key={v.title}>
              <Title>{v.title}</Title>
              {v.children.map((item, idx) => (
                <Link key={idx} href={item.href} target={"_blank"}>
                  {item.name}
                </Link>
              ))}
            </RWrap>
          ))}
        </BlockR>
      </Wrap>
      <P>Copyright © 2024 NovaSwap. All rights reserved.</P>
    </>
  );
};

export default Index;
