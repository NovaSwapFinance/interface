import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import DataPanel from "./components/DataPanel";
import Introduce from "./components/Introduce";
import adorn from "./assets/adorn.png";
import Footer from "./components/Footer";

const Wrap = styled.div`
  font-family: Poppins;
  padding-bottom: 223px;
  background: #0e0e0e url(${adorn}) no-repeat bottom center/contain;
`;
const Container = styled.div`
  display: grid;
  gap: 120px;
  max-width: 1213px;
  margin: 0 auto;
`;
const Index = () => {
  return (
    <>
      <Wrap>
        <Header />
        <Container>
          <DataPanel />
          <Introduce />
        </Container>
      </Wrap>
      <Footer />
    </>
  );
};

export default Index;
