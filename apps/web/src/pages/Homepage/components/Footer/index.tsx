import React from "react";
import styled from "styled-components";
import novaIcon from "../../assets/NovaSwap@2x.png";
import powerIcon from "../../assets/poweredby@2x.png";
import { mediaData, nav } from "./data";

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1213px;
  margin: 46px auto 0;
`;
const BlockL = styled.div`
  display: flex;
  flex-direction: column;
`;
const LWrap = styled.div`
  display: flex;
  align-items: center;
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
`;
const P = styled.p`
  margin: 0 165px 0 47px;
  color: #c0c0c0;
  font-size: 16px;
  font-weight: 400;
  line-height: 32px; /* 200% */
  letter-spacing: -0.5px;
`;

const BlockR = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 90px;
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
`;
const Link = styled.a`
  margin: 0 0 6px;
  color: #b8b8b8;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.5px;
  text-decoration: none;
`;

const Index = () => {
  return (
    <Wrap>
      <BlockL>
        <LWrap>
          <Icon src={novaIcon} alt={""}></Icon>
          <P>Swap all the L2’s assets in NovaSwap of zkLink Nova</P>
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
  );
};

export default Index;
