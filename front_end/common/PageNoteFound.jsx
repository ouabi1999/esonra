import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";


function PageNoteFound() {
  const {t} = useTranslation()
  return (
    <PageContainer>

      <Content>
        <Code>404</Code>
        <Title>{t("errors.page_not_found")}</Title>
        <Description>
          {t("errors.page_not_found_description")}
        </Description>
      </Content>
    </PageContainer>
  );
}

export default PageNoteFound;

const PageContainer = styled.div`
  min-height: 70vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 20px;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Code = styled.span`
  font-size: 80px;
  font-weight: 600;
  line-height: 1;
  color: #81766b;
  letter-spacing: 4px;

  @media (max-width: 600px) {
    font-size: 60px;
  }
`;

const Title = styled.h1`
  margin: 18px 0 8px;
  font-size: 28px;
  font-weight: 500;
  color: #34312e;

  @media (max-width: 600px) {
    font-size: 23px;
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #81766b;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;