import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import SEO from "../../components/SEO/SEO";
function PrivacyPolicy() {
  const { t, i18n } = useTranslation("privacy");

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const isRTL = i18n.dir() === "rtl";

  return (
    <Container dir={isRTL ? "rtl" : "ltr"}>
          <SEO
      title="Privacy Policy"
      description="Read Enouza's Privacy Policy to learn how we collect, use, protect, and manage your personal information when you use our website."
      canonical="/privacy-policy"
    />
     
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Header>
        <Eyebrow>ENOUZA</Eyebrow>

        <Title>
          {t("privacyPolicy.title")}
        </Title>

        <HeaderLine />

        <Intro>
          {t("privacyPolicy.intro")}
        </Intro>
      </Header>


      {/* =================================================
          01 — COLLECTING PERSONAL INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>01</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.collectingPersonalInfo.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.collectingPersonalInfo.description"
          )}
        </Text>
      </Section>


      {/* =================================================
          02 — DEVICE INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>02</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.deviceInfo.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.deviceInfo.examples")}
        </Text>

        <Text>
          {t("privacyPolicy.deviceInfo.purpose")}
        </Text>

        <Text>
          {t("privacyPolicy.deviceInfo.source")}
        </Text>

        <Text>
          {t("privacyPolicy.deviceInfo.disclosure")}
        </Text>
      </Section>


      {/* =================================================
          03 — ORDER INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>03</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.orderInfo.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.orderInfo.examples")}
        </Text>

        <Text>
          {t("privacyPolicy.orderInfo.purpose")}
        </Text>

        <Text>
          {t("privacyPolicy.orderInfo.source")}
        </Text>

        <Text>
          {t("privacyPolicy.orderInfo.disclosure")}
        </Text>
      </Section>


      {/* =================================================
          04 — CUSTOMER SUPPORT INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>04</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.customerSupportInfo.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.customerSupportInfo.examples"
          )}
        </Text>

        <Text>
          {t(
            "privacyPolicy.customerSupportInfo.purpose"
          )}
        </Text>

        <Text>
          {t(
            "privacyPolicy.customerSupportInfo.source"
          )}
        </Text>
      </Section>


      {/* =================================================
          05 — SHARING PERSONAL INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>05</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.sharingPersonalInfo.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.sharingPersonalInfo.text"
          )}
        </Text>
      </Section>


      {/* =================================================
          06 — BEHAVIORAL ADVERTISING
      ================================================= */}

      <Section>
        <SectionNumber>06</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.behavioralAdvertising.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.behavioralAdvertising.text"
          )}
        </Text>
      </Section>


      {/* =================================================
          07 — USING PERSONAL INFORMATION
      ================================================= */}

      <Section>
        <SectionNumber>07</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.usingPersonalInfo.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.usingPersonalInfo.text"
          )}
        </Text>
      </Section>


      {/* =================================================
          08 — LAWFUL BASIS
      ================================================= */}

      <Section>
        <SectionNumber>08</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.lawfulBasis.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.lawfulBasis.text"
          )}
        </Text>
      </Section>


      {/* =================================================
          09 — RETENTION
      ================================================= */}

      <Section>
        <SectionNumber>09</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.retention.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.retention.text")}
        </Text>
      </Section>


      {/* =================================================
          10 — AUTOMATIC DECISION MAKING
      ================================================= */}

      <Section>
        <SectionNumber>10</SectionNumber>

        <Subtitle>
          {t(
            "privacyPolicy.automaticDecisionMaking.title"
          )}
        </Subtitle>

        <Text>
          {t(
            "privacyPolicy.automaticDecisionMaking.text"
          )}
        </Text>
      </Section>


      {/* =================================================
          11 — YOUR RIGHTS
      ================================================= */}

      <Section>
        <SectionNumber>11</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.yourRights.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.yourRights.gdpr")}
        </Text>

        <Text>
          {t("privacyPolicy.yourRights.ccpa")}
        </Text>
      </Section>


      {/* =================================================
          12 — COOKIES
      ================================================= */}

      <Section>
        <SectionNumber>12</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.cookies.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.cookies.text")}
        </Text>
      </Section>


      {/* =================================================
          13 — DO NOT TRACK
      ================================================= */}

      <Section>
        <SectionNumber>13</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.doNotTrack.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.doNotTrack.text")}
        </Text>
      </Section>


      {/* =================================================
          14 — CHANGES
      ================================================= */}

      <Section>
        <SectionNumber>14</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.changes.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.changes.text")}
        </Text>
      </Section>


      {/* =================================================
          15 — CONTACT
      ================================================= */}

      <Section last>
        <SectionNumber>15</SectionNumber>

        <Subtitle>
          {t("privacyPolicy.contact.title")}
        </Subtitle>

        <Text>
          {t("privacyPolicy.contact.text")}
        </Text>

        <Updated>
          {t("privacyPolicy.lastUpdated")}
        </Updated>
      </Section>

    </Container>
  );
}

export default PrivacyPolicy;


/* =====================================================
   MAIN CONTAINER
===================================================== */

const Container = styled.main`
  width: min(100% - 48px, 960px);

  margin: 0 auto;

  padding: 52px 0 110px;

  color: #1c1c1c;

  @media (max-width: 700px) {
    width: calc(100% - 30px);

    padding: 38px 0 70px;
  }

  @media (max-width: 460px) {
    width: calc(100% - 24px);

    padding-top: 28px;
  }
`;


/* =====================================================
   HEADER
===================================================== */

const Header = styled.header`
  max-width: 760px;

  margin: 0 auto 78px;

  text-align: center;

  @media (max-width: 700px) {
    margin-bottom: 58px;
  }

  @media (max-width: 460px) {
    margin-bottom: 48px;
  }
`;

const Eyebrow = styled.div`
  margin-bottom: 15px;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 4px;

  text-transform: uppercase;

  color: #978f84;
`;

const Title = styled.h1`
  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 40px;
  font-weight: 400;

  line-height: 1.2;

  letter-spacing: 0.2px;

  color: #181818;

  @media (max-width: 700px) {
    font-size: 31px;
  }

  @media (max-width: 460px) {
    font-size: 27px;
  }
`;

const HeaderLine = styled.div`
  width: 42px;

  height: 1px;

  margin: 23px auto 25px;

  background: #aaa298;
`;

const Intro = styled.p`
  max-width: 650px;

  margin: 0 auto;

  color: #777169;

  font-size: 14px;

  line-height: 1.9;

  @media (max-width: 700px) {
    font-size: 13.5px;
  }

  @media (max-width: 460px) {
    font-size: 12.8px;

    line-height: 1.8;
  }
`;


/* =====================================================
   SECTIONS
===================================================== */

const Section = styled.section`
  position: relative;

  max-width: 780px;

  margin: 0 auto 55px;

  padding-left: 62px;

  &:not(:last-child) {
    padding-bottom: 55px;

    border-bottom: 1px solid #ebe7e1;
  }

  @media (max-width: 700px) {
    margin-bottom: 42px;

    padding-left: 45px;

    &:not(:last-child) {
      padding-bottom: 42px;
    }
  }

  @media (max-width: 460px) {
    margin-bottom: 35px;

    padding-left: 34px;

    &:not(:last-child) {
      padding-bottom: 35px;
    }
  }

  [dir="rtl"] & {
    padding-left: 0;

    padding-right: 62px;

    @media (max-width: 700px) {
      padding-right: 45px;
    }

    @media (max-width: 460px) {
      padding-right: 34px;
    }
  }
`;


/* =====================================================
   SECTION NUMBER
===================================================== */

const SectionNumber = styled.span`
  position: absolute;

  top: 4px;
  left: 0;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 2.5px;

  color: #aaa297;

  @media (max-width: 700px) {
    font-size: 9px;
  }

  [dir="rtl"] & {
    left: auto;
    right: 0;
  }
`;


/* =====================================================
   SECTION TITLE
===================================================== */

const Subtitle = styled.h2`
  margin: 0 0 18px;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 24px;
  font-weight: 400;

  line-height: 1.35;

  letter-spacing: 0.1px;

  color: #222;

  @media (max-width: 700px) {
    font-size: 21px;
  }

  @media (max-width: 460px) {
    font-size: 19px;

    margin-bottom: 14px;
  }
`;


/* =====================================================
   BODY TEXT
===================================================== */

const Text = styled.p`
  margin: 0 0 15px;

  color: #69645d;

  font-size: 14px;
  font-weight: 400;

  line-height: 1.95;

  letter-spacing: 0.05px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 700px) {
    font-size: 13.5px;

    line-height: 1.85;
  }

  @media (max-width: 460px) {
    font-size: 12.8px;

    line-height: 1.8;
  }

  [dir="rtl"] & {
    text-align: right;
  }
`;


/* =====================================================
   LAST UPDATED
===================================================== */

const Updated = styled.p`
  margin: 24px 0 0;

  padding-top: 18px;

  color: #aaa298;

  font-size: 11px;

  line-height: 1.7;

  letter-spacing: 0.3px;

  [dir="rtl"] & {
    text-align: right;
  }
`;