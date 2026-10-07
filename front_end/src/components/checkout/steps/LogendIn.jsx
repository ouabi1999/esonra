import React from "react";
import styled from "styled-components";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function LogendIn({ t }) {
  return (
    <Wrapper>
      <IconCircle>
        <CheckCircleOutlineIcon />
      </IconCircle>

      <Content>
        <Title>{t("common.you_are_logged_in")}</Title>

        <SubText>
          {t("checkout.loggedInContinue")}
        </SubText>
      </Content>
    </Wrapper>
  );
}

export default LogendIn;


/* =====================================================
   STYLES
===================================================== */

const Wrapper = styled.div`
  width: 100%;
  max-width: 300px;
  min-height: 210px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 35px 30px;
  margin:30px 0;
  background: #f7f5f0;

  border: 1px solid #e4ded4;

  text-align: center;

  box-sizing: border-box;
`;

const IconCircle = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #b39a76;

  border-radius: 50%;

  margin-bottom: 20px;

  svg {
    font-size: 28px;
    color: #8d6c32;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.span`
  font-family: Georgia, serif;

  font-size: 15px;
  font-weight: 400;

  letter-spacing: 1.5px;
  text-transform: uppercase;

  color: #1d1c1a;
`;

const SubText = styled.span`
  margin-top: 10px;

  font-size: 12px;
  font-weight: 400;

  line-height: 1.6;

  color: #77736b;

  max-width: 280px;
`;