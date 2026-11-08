import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";


import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import PaymentsIcon from '@mui/icons-material/Payments';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
const ProductTrustBanner = () => {
  const { t } = useTranslation();

  return (
    <Banner>
      {/* ================= SECURE CHECKOUT ================= */}

      <SecureCheckout>
        <SecureLine />

        <SecureContent>
          <GppGoodOutlinedIcon aria-hidden="true" />
          <span>{t("trust.secureCheckout")}</span>
        </SecureContent>

        <SecureLine />
      </SecureCheckout>

      {/* ================= PAYMENT METHODS ================= */}

      <PaymentMethods>
        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788353548/visa_payment_method_card_icon_142729_hi0vvw.svg"
          alt="Visa"
          width="45"
          height="45"
        />

        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788353547/mastercard_payment_method_card_icon_142734_xc6uqc.svg"
          alt="Mastercard"
          width="45"
          height="45"
        />

        <PaymentIcon
          src=
            "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788355836/amazon-payments_82089_f6able.png"
            
          
          alt="Amazon Pay"
          width="45"
          height="45"
        />

        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788353547/amex_payment_method_card_icon_142744_q0dtfq.svg"
          alt="American Express"
          width="45"
          height="45"
        />

        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788354390/paypal_payment_method_card_icon_142733_mdhwby.svg"
          alt="PayPal"
          width="45"
          height="45"
        />

        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788354252/discover_payment_method_card_icon_142741_y62x9b.svg"
          alt="Discover"
          width="45"
          height="45"
        />

        <PaymentIcon
          src="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1788514961/applepay_logo_icon_247576_rcv5ud.svg"
          alt="Apple Pay"
          width="45"
          height="45"
        />
      </PaymentMethods>

      {/* ================= SHOP WITH CONFIDENCE ================= */}

      <SecureCheckout>
        <SecureLine />

        <SecureContent>
          <VolunteerActivismOutlinedIcon aria-hidden="true" />
          <span>{t("trust.shopWithConfidence")}</span>
        </SecureContent>

        <SecureLine />
      </SecureCheckout>

      {/* ================= BENEFITS ================= */}

      <TrustGrid>
        

       
       <TrustItem>
          <IconWrapper>
            <WorkspacePremiumOutlinedIcon
              className="icons"
              aria-hidden="true"
            />
          </IconWrapper>

          <TrustTitle>
            {t("trust.warranty.title")}
          </TrustTitle>
        </TrustItem>
       
        <TrustItem>
          <IconWrapper>
            <PaymentsIcon className="icons" aria-hidden="true" />
          </IconWrapper>

          <TrustTitle>
            {t("buyerTrustServices.moneyBack.title")}
          </TrustTitle>
        </TrustItem>
        
        <TrustItem>
          <IconWrapper>
            <PublishedWithChangesIcon className="icons" aria-hidden="true" style={{ transform: "scaleX(-1)" }} />
          </IconWrapper>

          <TrustTitle>
            {t("trust.returns.title")}
          </TrustTitle>
        </TrustItem>
      </TrustGrid>
    </Banner>
  );
};
export default ProductTrustBanner;

/* =====================================================
   MAIN BANNER
===================================================== */

const Banner = styled.section`
  width: 100%;
  box-sizing: border-box;
  color: #3d3a36;
`;

/* =====================================================
   SECURE CHECKOUT
===================================================== */

const SecureCheckout = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 22px;
  margin-bottom: 18px;
`;

const SecureLine = styled.div`
  flex: 1;
  max-width: 420px;
  height: 1px;
  background: #d8d3ca;
`;

const SecureContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;
  white-space: nowrap;

  font-family: Georgia, serif;
  font-size: 10px;
  font-weight: 400;

  letter-spacing: 2px;
  text-transform: uppercase;

      color: #020202;


  svg {
    font-size: 15px;
      color: #020202;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    font-size: 9px;
    letter-spacing: 1.5px;

    svg {
      font-size: 14px;
    }
  }
`;

/* =====================================================
   PAYMENT METHODS
===================================================== */

const PaymentMethods = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;

  margin-top: 32px;
  margin-bottom: 32px;

  @media (max-width: 700px) {
    gap: 12px;
  }
`;

const PaymentIcon = styled.img`
  display: block;

  width: 45px;
  height: 45px;

  object-fit: contain;

  flex-shrink: 0;

  @media (max-width: 700px) {
    width: 38px;
    height: 38px;
  }

  @media (max-width: 360px) {
    width: 35px;
    height: 35px;
  }
`;

/* =====================================================
   BENEFITS
===================================================== */

const TrustGrid = styled.div`
  width: 100%;

  margin-top: 32px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-content:center;
`;

const TrustItem = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  text-align: center;

  padding: 0 15px;
`;

/* =====================================================
   ICONS
===================================================== */

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 38px;
  margin-bottom: 13px;

  svg {
    font-size: 32px;
    color: #252525;

    stroke-width: 0.8;
  }

  @media (max-width: 600px) {
    height: 25px;
    margin-bottom: 10px;

    .icons {
      font-size: 26px;
    }
  }
`;

/* =====================================================
   TEXT
===================================================== */

const TrustTitle = styled.div`
  white-space: nowrap;

  font-size: 12px;
  line-height: 1.18;

  font-weight: 400;
  letter-spacing: 0;

  color: #45413d;

  @media (max-width: 600px) {
    font-size: 9px;
  }
`;