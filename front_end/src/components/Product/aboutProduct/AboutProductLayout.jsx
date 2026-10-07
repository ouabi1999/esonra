import React, { useState } from "react";
import styled from "styled-components";
import Description from "./Description";
import ReviewsLayout from "./reviews/ReviewsLayout";
import { useTranslation } from "react-i18next";

function AboutProductLayout() {
  const [isOpen, setIsOpen] = useState(1);
  const { t, i18n } = useTranslation();

  return (
    <Container id="reviews">
      <TabsWrapper>
        <Tabs dir = {i18n.dir() === "rtl" ? "rtl" : "ltr"}>
          <Tab
            type="button"
            $active={isOpen === 1}
            onClick={() => setIsOpen(1)}
          >
            {t("productInfo.CostumerReviews")}
          </Tab>

          <Tab
            type="button"
            $active={isOpen === 3}
            onClick={() => setIsOpen(3)}
          >
            {t("productInfo.description")}
          </Tab>
        </Tabs>
      </TabsWrapper>

      <Content>
        {isOpen === 1 && <ReviewsLayout />}
        {isOpen === 3 && <Description />}
      </Content>
    </Container>
  );
}

export default AboutProductLayout;

const Container = styled.section`
  width: 100%;
  
`;

const TabsWrapper = styled.div`
  position: sticky;
  top: 94px;
  z-index:1;
  display:flex;
  justify-content:center;
  width: 100%;
  background:#F6F3ED;



  @media (max-width: 700px) {
    top: 70px;
    padding: 16px 0;
  }
`;

const Tabs = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1.5px solid #eee9e2;


  width: 100%;

 
`;

const Tab = styled.button`
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  padding: 15px 0;

  border: none;
  background: transparent;
  flex:1;
  color: ${({ $active }) =>
    $active ? "#211e1a" : "#8b8278"};

  font-family:
    Georgia,
    serif;

  font-size: clamp(18px, 1vw, 23px);
  font-weight: ${({ $active }) => ($active ? 500 : 400)};

  line-height: 1.2;

  letter-spacing: 0.015em;

  white-space: nowrap;

  cursor: pointer;

  transition:
    color 220ms ease,
    opacity 220ms ease;

  &::after {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    bottom: -1px;

    height: 1.5px;

    background: #000000;

    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: center;

    transition: transform 280ms
      cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    color: #211e1a;
  }

  &:focus-visible {
    outline: 1px solid #a88a62;
    outline-offset: 6px;
  }

  @media (max-width: 550px) {
    font-size: 17px;
  }

  @media (max-width: 400px) {
    font-size: 15px;
  }
`;

const Content = styled.div`
  width: 100%;
  padding-top: 10px;
`;