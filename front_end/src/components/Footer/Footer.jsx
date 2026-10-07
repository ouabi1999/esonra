import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewsLetter from "./NewsLetter";
import PaymentMethods from "../../../common/PaymentMethods";
import GppGoodIcon from "@mui/icons-material/GppGood";
import FooterPreferences from "./FooterPreferences";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  return (
    <FooterContainer  >
      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <NewsletterSection>
        <NewsletterInner>
          <NewsletterText>
            <NewsletterEyebrow>
              {t("footer.newsletter.eyebrow")}
            </NewsletterEyebrow>

            <NewsletterTitle>
              {t("footer.newsletter.title")}
            </NewsletterTitle>

            <NewsletterDescription>
              {t("footer.newsletter.description")}
            </NewsletterDescription>
          </NewsletterText>

          <NewsletterForm>
            <NewsLetter />
          </NewsletterForm>
        </NewsletterInner>
      </NewsletterSection>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <MainFooter>
        <FooterGrid>
          {/* BRAND */}

          <BrandSection>
            <BrandLogo>
            <bdi style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <img src="../enouza_logo_black.png" alt="logo" style={{height:"26px"}}/>
           
            <span > NOUZA</span>
            </bdi>
            </BrandLogo>

            <BrandDescription>
              {t("footer.brand.description")}
            </BrandDescription>
            <BrandAccent />
          </BrandSection>

          {/* HELP */}

          <FooterColumn>
            <ColumnTitle>
              {t("footer.help.title")}
            </ColumnTitle>

            <Links>
              <FooterLink to="/contact-us">
                {t("footer.help.contactUs")}
              </FooterLink>

              <FooterLink to="/about-us">
                {t("footer.help.aboutUs")}
              </FooterLink>

              <FooterLink to="/Faq">
                {t("footer.help.faq")}
              </FooterLink>
            </Links>
          </FooterColumn>

          {/* FOLLOW */}

          <FooterColumn>
            <ColumnTitle>
              {t("footer.followUs.title")}
            </ColumnTitle>

            <Links>
              <SocialLink
                href="https://www.facebook.com/profile.php?id=61571681156358"
                target="_blank"
                rel="noreferrer"
              >
                <SocialMark>f</SocialMark>

                <span>
                  {t("footer.followUs.facebook")}
                </span>
              </SocialLink>

              <SocialLink
                href="https://www.instagram.com/en.ouza"
                target="_blank"
                rel="noreferrer"
              >
                <SocialMark>◎</SocialMark>

                <span>
                  {t("footer.followUs.instagram")}
                </span>
              </SocialLink>

              <SocialLink
                href="https://www.tiktok.com/@en.ouza"
                target="_blank"
                rel="noreferrer"
              >
                <SocialMark>♪</SocialMark>

                <span>
                  {t("footer.followUs.tiktok")}
                </span>
              </SocialLink>
            </Links>
          </FooterColumn>

          {/* POLICIES */}

          <FooterColumn>
            <ColumnTitle>
              {t("footer.policies.title")}
            </ColumnTitle>

            <Links>
              <FooterLink to="/terms-of-services">
                {t("footer.policies.termsOfService")}
              </FooterLink>

              <FooterLink to="/privacy-policy">
                {t("footer.policies.privacyPolicy")}
              </FooterLink>

              <FooterLink to="/shipping-policy">
                {t("footer.policies.shippingPolicy")}
              </FooterLink>

              <FooterLink to="/return-policy">
                {t("footer.policies.refundPolicy")}
              </FooterLink>
            </Links>
          </FooterColumn>
        </FooterGrid>
          <div className="langueges" style={{display:"flex", justifyContent:"center"}}>
            <FooterPreferences/>
            </div>
        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}
        

        <BottomBar>
          <SecureText>
            <GppGoodIcon style={{ fontSize: "1.2rem" }} />

            {t("footer.payment.secure")}
          </SecureText>

          <PaymentMethodsContainer dir="ltr">
            <PaymentMethods />
          </PaymentMethodsContainer>
          <CopyrightContainer >
            <Copyright dir="ltr">
              © {new Date().getFullYear()} ENOUZA,{" "}
              {t("footer.newsletter.all_rights_reserved")}
            </Copyright>
          </CopyrightContainer>
        </BottomBar>
      </MainFooter>
    </FooterContainer>
  );
};

export default Footer;


/* =========================================================
   CONTAINER
========================================================= */

const FooterContainer = styled.footer`
  width: 100%;

  background: #f8f6f1;

  color: #22211f;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;


/* =========================================================
   NEWSLETTER SECTION
========================================================= */

const NewsletterSection = styled.section`
  width: 100%;

  padding: 40px 30px 70px;

  background: #f8f6f1;

  @media (max-width: 600px) {
    padding: 16px 16px 50px;
  }
`;

const NewsletterInner = styled.div`
  max-width: 1240px;

  min-height: 220px;

  margin: 0 auto;

  padding: 42px 50px;

  display: grid;

  grid-template-columns:
    minmax(280px, 0.85fr)
    minmax(400px, 1.15fr);

  align-items: center;

  gap: 70px;

  background: #ebe7dd;

  border: 1px solid rgba(35, 33, 29, 0.08);

  position: relative;

  &::before {
    content: "";

    position: absolute;

    top: 18px;
    bottom: 18px;

    left: 18px;
    right: 18px;

    border: 1px solid rgba(35, 33, 29, 0.045);

    pointer-events: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    gap: 28px;

    padding: 40px;
  }

  @media (max-width: 600px) {
    padding: 34px 25px;

    gap: 24px;

    &::before {
      top: 10px;
      bottom: 10px;

      left: 10px;
      right: 10px;
    }
  }
`;


/* =========================================================
   NEWSLETTER TEXT
========================================================= */

const NewsletterText = styled.div`
  position: relative;

  z-index: 1;
`;

const NewsletterEyebrow = styled.span`
  display: block;

  margin-bottom: 10px;

  color: #9b7b45;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 0.2em;

  text-transform: uppercase;
`;

const NewsletterTitle = styled.h2`
  margin: 0;

  color: #24221f;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(27px, 3vw, 37px);

  font-weight: 400;

  line-height: 1.15;

  letter-spacing: -0.02em;
`;

const NewsletterDescription = styled.p`
  max-width: 440px;

  margin: 13px 0 0;

  color: #777168;

  font-size: 12px;

  line-height: 1.75;
`;


/* =========================================================
   NEWSLETTER FORM
========================================================= */

const NewsletterForm = styled.div`
  position: relative;

  z-index: 2;

  width: 100%;

  form {
    width: 100%;
  }
`;


/* =========================================================
   MAIN FOOTER
========================================================= */

const MainFooter = styled.div`
  max-width: 1240px;

  margin: 0 auto;

  padding: 0 30px;

  @media (max-width: 600px) {
    padding: 0 22px;
  }
`;


/* =========================================================
   FOOTER GRID
========================================================= */

const FooterGrid = styled.div`
  padding: 0 0 62px;

  display: grid;

  grid-template-columns:
    1.55fr
    1fr
    1fr
    1.15fr;

  gap: 55px;

  border-bottom: 1px solid
    rgba(35, 33, 29, 0.11);

  @media (max-width: 900px) {
    grid-template-columns:
      1.4fr 1fr 1fr;

    gap: 45px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr 1fr;

    gap: 45px 30px;

    padding-bottom: 45px;
  }

  @media (max-width: 430px) {
    gap: 40px 20px;
  }
`;


/* =========================================================
   BRAND
========================================================= */

const BrandSection = styled.div`
  max-width: 270px;
  

  @media (max-width: 650px) {
    grid-column: 1 / -1;

    max-width: 100%;

    padding-bottom: 5px;
  }
`;

const BrandLogo = styled.div`
  color: #20201d;
   display:flex;
   align-items:center;
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 27px;

  font-weight: 400;

  letter-spacing: 0.17em;

  line-height: 1;
`;

const BrandDescription = styled.p`
  max-width: 250px;

  margin: 20px 0 0;

  color: #77736b;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 12px;

  font-style: italic;

  line-height: 1.75;
`;

const BrandAccent = styled.div`
  width: 32px;

  height: 1px;

  margin-top: 20px;

  background: #b8955b;
`;


/* =========================================================
   COLUMN
========================================================= */

const FooterColumn = styled.div`
  min-width: 0;

  display: flex;

  flex-direction: column;

  align-items: flex-start;
`;

const ColumnTitle = styled.h3`
  margin: 0 0 21px;

  color: #25231f;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.16em;

  text-transform: uppercase;
`;

const Links = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-start;
`;


/* =========================================================
   LINKS
========================================================= */

const FooterLink = styled(Link)`
  margin-bottom: 12px;

  color: #77736b;

  font-size: 13px;

  line-height: 1.5;

  text-decoration: none;

  transition:
    color 0.25s ease,
    padding 0.25s ease;

  &:hover {
    color: #1e1d1a;

    padding-inline-start: 4px;
  }
`;


/* =========================================================
   SOCIAL
========================================================= */

const SocialLink = styled.a`
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 12px;

  color: #77736b;

  font-size: 13px;

  text-decoration: none;

  transition: color 0.25s ease;

  &:hover {
    color: #1e1d1a;
  }
`;

const SocialMark = styled.span`
  width: 21px;
  height: 21px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid
    rgba(35, 33, 29, 0.18);

  color: #5f5b54;

  font-size: 10px;

  transition:
    border-color 0.25s ease,
    color 0.25s ease;

  ${SocialLink}:hover & {
    border-color: #b8955b;

    color: #9b7b45;
  }
`;


/* =========================================================
   COPYRIGHT
========================================================= */

const CopyrightContainer = styled.div`
  flex: 1;

  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: flex-end;

  text-align: end;
`;

const Copyright = styled.span`
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 10px;

  letter-spacing: 0.4px;

  color: #77736b;

  white-space: nowrap;
`;


/* =========================================================
   PAYMENT METHODS
========================================================= */

const PaymentMethodsContainer = styled.div`
  flex: 1;

  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  /*
    Payment logos should always remain
    in their natural LTR order.
  */
  direction: ltr;
`;


/* =========================================================
   SECURE PAYMENT
========================================================= */

const SecureText = styled.div`
  flex: 1;

  min-width: 0;

  display: flex;

  align-items: center;

  justify-content: flex-start;

  gap: 8px;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 10px;

  font-weight: 400;

  letter-spacing: 1.3px;

  text-transform: uppercase;

  color: #716c64;

  white-space: nowrap;

  svg {
    flex-shrink: 0;

    color: #b39a76;
  }
`;


/* =========================================================
   BOTTOM BAR
========================================================= */

const BottomBar = styled.div`
  width: 100%;

  min-height: 82px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 28px;

  padding: 18px 0;

  border-top: 1px solid #e4ded4;


  /* =====================================================
     RTL / LTR LAYOUT
  ===================================================== */

  &[dir="rtl"] {
    ${SecureText} {
      justify-content: flex-start;
    }

    ${CopyrightContainer} {
      justify-content: flex-end;
    }
  }


  /* =====================================================
     TABLET
  ===================================================== */

  @media (max-width: 1100px) {
    gap: 18px;
  }


  /* =====================================================
     MOBILE
  ===================================================== */

  @media (max-width: 900px) {
    min-height: auto;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    gap: 16px;

    padding: 24px 0;

    text-align: center;


    ${SecureText} {
      flex: none;

      width: 100%;

      justify-content: center;

      white-space: normal;
    }


    ${PaymentMethodsContainer} {
      flex: none;

      width: 100%;

      justify-content: center;
    }


    ${CopyrightContainer} {
      flex: none;

      width: 100%;

      justify-content: center;

      text-align: center;
    }


    ${Copyright} {
      white-space: normal;
    }
  }


  /* =====================================================
     SMALL MOBILE
  ===================================================== */

  @media (max-width: 400px) {
    gap: 14px;

    padding: 20px 0;

    ${SecureText},
    ${Copyright} {
      font-size: 9px;
    }
  }
`;
