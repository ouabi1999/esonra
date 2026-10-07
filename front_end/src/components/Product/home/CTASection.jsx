import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const COLORS = {
  cream: "#F6F3ED",
  white: "#FFFFFF",
  ink: "#1D1C1A",
  muted: "#77736B",
  gold: "#B39A76",
  border: "#E4DED4",
};

const CTASection = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  return (
    <Section dir={isRTL ? "rtl" : "ltr"}>
      <Container>
        <CTA>

          <Eyebrow>
            <EyebrowLine />
            <span>{t("ctaSection.eyebrow")}</span>
            <EyebrowLine />
          </Eyebrow>

          <Title>
            {t("ctaSection.titleLeft")}
          </Title>

          <Description>
            {t("ctaSection.description")}
          </Description>

          <Button
            as={Link}
            to="/contact-us"
          >
            <ButtonText>
              {t("ctaSection.button")}
            </ButtonText>

            <ButtonIcon>
              <ArrowForwardIcon
                sx={{
                  transform: isRTL
                    ? "rotate(180deg)"
                    : "none",
                }}
              />
            </ButtonIcon>
          </Button>

        </CTA>
      </Container>
    </Section>
  );
};

export default CTASection;


/* ============================================================
   SECTION
============================================================ */

const Section = styled.section`
  width: 100%;

  padding: 90px 0;

  background: ${COLORS.cream};

  @media (max-width: 700px) {
    padding: 65px 0;
  }

  @media (max-width: 480px) {
    padding: 50px 0;
  }
`;


/* ============================================================
   CONTAINER
============================================================ */

const Container = styled.div`
  width: min(1180px, calc(100% - 48px));

  margin: 0 auto;

  @media (max-width: 600px) {
    width: calc(100% - 28px);
  }
`;


/* ============================================================
   CTA
============================================================ */

const CTA = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 430px;

  padding: 70px 40px;

  text-align: center;

  background: ${COLORS.white};

  border: 1px solid ${COLORS.border};

  overflow: hidden;

  @media (max-width: 700px) {
    min-height: 380px;

    padding: 55px 25px;
  }

  @media (max-width: 480px) {
    min-height: 350px;

    padding: 45px 20px;
  }
`;


/* ============================================================
   EYEBROW
============================================================ */

const Eyebrow = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  margin-bottom: 25px;

  color: ${COLORS.gold};

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.2em;

  text-transform: uppercase;
`;

const EyebrowLine = styled.span`
  width: 28px;

  height: 1px;

  background: ${COLORS.gold};

  opacity: 0.7;

  @media (max-width: 480px) {
    width: 18px;
  }
`;


/* ============================================================
   TITLE
============================================================ */

const Title = styled.h2`
  max-width: 720px;

  margin: 0;

  color: ${COLORS.ink};

  font-family:
    "Times New Roman",
    Georgia,
    serif;

  font-size: clamp(40px, 5vw, 62px);

  font-weight: 400;

  line-height: 1.05;

  letter-spacing: -0.04em;

  @media (max-width: 600px) {
    font-size: 40px;
  }

  @media (max-width: 420px) {
    font-size: 35px;
  }
`;


/* ============================================================
   DESCRIPTION
============================================================ */

const Description = styled.p`
  max-width: 510px;

  margin: 22px auto 32px;

  color: ${COLORS.muted};

  font-size: 14px;

  line-height: 1.8;

  @media (max-width: 480px) {
    margin-top: 18px;

    font-size: 13px;

    line-height: 1.7;
  }
`;


/* ============================================================
   BUTTON
============================================================ */

const Button = styled(Link)`
  display: inline-flex;

  align-items: center;

  gap: 16px;

  padding: 6px 7px 6px 22px;

  border-radius: 999px;

  background: ${COLORS.ink};

  color: ${COLORS.white};

  text-decoration: none;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  transition:
    transform 0.25s ease,
    background 0.25s ease,
    gap 0.25s ease;

  &:hover {
    background: #2B2926;

    transform: translateY(-2px);

    gap: 21px;
  }

  @media (max-width: 480px) {
    padding-left: 18px;

    gap: 13px;
  }
`;

const ButtonText = styled.span`
  white-space: nowrap;
`;

const ButtonIcon = styled.span`
  width: 36px;

  height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: ${COLORS.gold};

  svg {
    width: 17px;
    height: 17px;
  }
`;