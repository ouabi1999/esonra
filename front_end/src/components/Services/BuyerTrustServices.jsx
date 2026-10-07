import React from "react";
import styled from "styled-components";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useTranslation } from "react-i18next";

const BuyerTrustServices = ({ divRef }) => {
  const { t, i18n } = useTranslation();

  return (
    <Container dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <Service ref={divRef}>
        <IconWrapper>
          <SupportAgentIcon className="icon" />
        </IconWrapper>

        <ServiceTitle>
          {t("buyerTrustServices.help_center.title")}
        </ServiceTitle>

        <ServiceDescription>
          {t("buyerTrustServices.help_center.description")}
        </ServiceDescription>
      </Service>

      <Service>
        <IconWrapper>
          <LocalShippingIcon className="icon" />
        </IconWrapper>

        <ServiceTitle>
          {t("buyerTrustServices.worldwide_shipping.title")}
        </ServiceTitle>

        <ServiceDescription>
          {t("buyerTrustServices.worldwide_shipping.description")}
        </ServiceDescription>
      </Service>

      <Service>
        <IconWrapper>
          <CreditScoreIcon className="icon" />
        </IconWrapper>

        <ServiceTitle>
          {t("buyerTrustServices.safe_Payment.title")}
        </ServiceTitle>

        <ServiceDescription>
          {t("buyerTrustServices.safe_Payment.description")}
        </ServiceDescription>
      </Service>

      <Service>
        <IconWrapper>
          <AdminPanelSettingsIcon className="icon" />
        </IconWrapper>

        <ServiceTitle>
          {t("buyerTrustServices.Shop_with_confidence.title")}
        </ServiceTitle>

        <ServiceDescription>
          {t("buyerTrustServices.Shop_with_confidence.description")}
        </ServiceDescription>
      </Service>
    </Container>
  );
};

export default BuyerTrustServices;


/* =========================================================
   CONTAINER
========================================================= */

const Container = styled.section`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  background: #faf9f6;

  border-top: 1px solid #ebe6df;
  border-bottom: 1px solid #ebe6df;

  box-sizing: border-box;


  /* ===============================
     TABLET — 2 COLUMNS
  =============================== */

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }


  /* ===============================
     MOBILE — 1 COLUMN
  =============================== */

 
`;


/* =========================================================
   SERVICE
========================================================= */

const Service = styled.div`
  position: relative;

  min-width: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 32px 20px;

  box-sizing: border-box;


  /* =====================================================
     DESKTOP — 4 COLUMNS

     Vertical separators:
     1 | 2 | 3 | 4
  ===================================================== */

  &:not(:last-child)::after {
    content: "";

    position: absolute;

    top: 50%;
    inset-inline-end: 0;

    width: 1px;
    height: 52px;

    transform: translateY(-50%);

    background: #ddd6cd;
  }


  /* =====================================================
     TABLET — 2 × 2

     1 | 2
     -----
     3 | 4
  ===================================================== */

  @media (max-width: 900px) {

    /* Remove desktop separators first */
    &::after {
      display: none;
    }


    /*
      Vertical separator only
      after item 1 and item 3
    */

    &:nth-child(odd)::after {
      content: "";

      display: block;

      position: absolute;

      top: 50%;
      inset-inline-end: 0;

      width: 1px;
      height: 52px;

      transform: translateY(-50%);

      background: #ddd6cd;
    }


    /*
      Horizontal separator
      after first row
    */

    &:nth-child(-n + 2)::before {
      content: "";

      position: absolute;

      bottom: 0;

      left: 50%;

      width: 65%;

      height: 1px;

      transform: translateX(-50%);

      background: #e5dfd7;
    }
  }


 
`;


/* =========================================================
   ICON
========================================================= */

const IconWrapper = styled.div`
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  margin-bottom: 13px;

  border: 1px solid #ded5ca;
  border-radius: 50%;

  background: #ffffff;

  box-sizing: border-box;

  .icon {
    font-size: 21px;

    color: #9b815f;

    transition: transform 250ms ease;
  }

  ${Service}:hover & .icon {
    transform: translateY(-2px);
  }


  @media (max-width: 600px) {
    width: 42px;
    height: 42px;

    margin-bottom: 11px;

    .icon {
      font-size: 19px;
    }
  }
`;


/* =========================================================
   TITLE
========================================================= */

const ServiceTitle = styled.span`
  margin-bottom: 7px;

  color: #26221e;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 17px;

  font-weight: 600;

  line-height: 1.2;

  letter-spacing: 0.02em;


  @media (max-width: 600px) {
    font-size: 16px;
  }
`;


/* =========================================================
   DESCRIPTION
========================================================= */

const ServiceDescription = styled.p`
  width: min(160px, 100%);

  margin: 0;

  color: #817970;

  font-size: 10px;

  font-weight: 400;

  line-height: 1.7;

  letter-spacing: 0.04em;

  text-align: center;


  @media (max-width: 600px) {
    width: min(240px, 100%);

    font-size: 10px;
  }
`;