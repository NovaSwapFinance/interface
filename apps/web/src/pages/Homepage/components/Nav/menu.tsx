import styled from "styled-components";
import { Link } from "react-router-dom";
import { useScreenSize } from "../../../../hooks/useScreenSize";
import React, { useState } from "react";
import arrowIcon from "../../assets/nav/arrow.svg";
import { NavProps } from "../Footer/data";

const Menu = styled.div<{ isOpen: boolean }>`
  height: ${(props) => (props.isOpen ? "initial" : "50px")};
  border-bottom: 1px solid;
  overflow: hidden;
  transition: all 2s;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Ul = styled.ul`
  display: none;
  @media (max-width: 900px) {
    display: block;
    margin: 0;
    padding: 14px 0 0;
  }
`;

const Li = styled.li`
  height: 50px;
  list-style: none;
`;

const Span = styled.span``;
const Href = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.5px;
  text-decoration: none;
`;

const Index = (props: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu
      isOpen={isOpen}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div>
        <Span>{props.title}</Span>
        <Icon
          src={arrowIcon}
          style={{
            transform: `rotate(${isOpen ? 180 : 0}deg)`,
          }}
          className={"arrow"}
        />
      </div>
      <Ul className={"sub-menu"}>
        {props.children.map((item, idx) => (
          <Li key={idx}>
            <Href to={item.href} target={item.isBlank ? "_blank" : "_self"}>
              <Span>{item.name}</Span>
            </Href>
          </Li>
        ))}
      </Ul>
    </Menu>
  );
};

export default Index;
