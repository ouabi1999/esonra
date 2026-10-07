import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import SEO from "../../components/SEO/SEO";
function TermsOfServices() {
  const { t, i18n } = useTranslation("terms", {
    returnObjects: true,
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const title = t("terms.title");
  const seoTitle = t("terms.seoTitle");
  const overview = t("terms.overview");
  const sections = t("terms.sections");

  const isRTL = i18n.dir() === "rtl";

  return (
    <Container dir={isRTL ? "rtl" : "ltr"}>

    <SEO
      title="Terms of Service"
      description="Read Enouza's Terms of Service covering purchases, payments, orders, returns, privacy, shipping, and the use of our website."
      canonical="/terms-of-services"
    />
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <Header>
        <Eyebrow>ENOUZA</Eyebrow>

        <Title>
          {title}
        </Title>

        <HeaderLine />

        <Intro>
          {overview.p1}
        </Intro>
      </Header>


      {/* =================================================
          OVERVIEW
      ================================================= */}

      <Section>
        <SectionNumber>01</SectionNumber>

        <Subtitle>
          {overview.title}
        </Subtitle>

        <Text>
          {overview.p1}
        </Text>

        <Text>
          {overview.p2}
        </Text>

        <Text>
          {overview.p3}
        </Text>

        <Text>
          {overview.p4}
        </Text>
      </Section>


      {/* =================================================
          TERMS SECTIONS
      ================================================= */}

      {Object.entries(sections || {}).map(
        ([key, section], index) => {

          const sectionText = section?.text || "";

          const isReturnPolicy =
            sectionText.includes("Returns Policy");

          const isPrivacyPolicy =
            sectionText.includes("Privacy Policy");

          return (
            <Section
              key={key}
              last={
                index ===
                Object.entries(sections || {}).length - 1
              }
            >

              <SectionNumber>
                {String(index + 2).padStart(2, "0")}
              </SectionNumber>

              <Subtitle>
                {section.title}
              </Subtitle>

              <Text>
                {isReturnPolicy ? (
                  <PolicyLink to="/return-policy">
                    {sectionText}
                  </PolicyLink>
                ) : isPrivacyPolicy ? (
                  <PolicyLink to="/privacy-policy">
                    {sectionText}
                  </PolicyLink>
                ) : (
                  sectionText
                )}
              </Text>

            </Section>
          );
        }
      )}

    </Container>
  );
}

export default TermsOfServices;


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
   POLICY LINKS
===================================================== */

const PolicyLink = styled(Link)`
  color: #49443e;

  text-decoration: underline;

  text-decoration-color: #b8b0a5;

  text-decoration-thickness: 1px;

  text-underline-offset: 4px;

  transition:
    color 0.25s ease,
    text-decoration-color 0.25s ease;

  &:hover {
    color: #181818;

    text-decoration-color: #181818;
  }
`;