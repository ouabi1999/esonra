import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import SEO from "../../components/SEO/SEO.jsx";
function RefundPolicy() {
  const { t, i18n } = useTranslation("refund", {
    returnObjects: true,
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const isRTL = i18n.dir() === "rtl";

  const rejectedRefundItems = t(
    "returnPolicy.rejectedRefunds.items",
    {
      returnObjects: true,
    }
  );

  return (
    <Container dir={isRTL ? "rtl" : "ltr"}>

       <SEO
      title="Refund & Return Policy"
      description="Learn about Enouza's refund and return policy, including eligible returns, refund conditions, return shipping, damaged items, and refund processing."
      canonical="/return-policy"
    />

      {/* PAGE HEADER */}
      <Header>
        <Eyebrow>ENOUZA</Eyebrow>

        <Title>
          {t("returnPolicy.title")}
        </Title>

        <HeaderLine />
      </Header>


      {/* RETURNS */}
      <Section>
        <SectionNumber>01</SectionNumber>

        <Subtitle>
          {t("returnPolicy.returns.heading")}
        </Subtitle>

        <Text>
          {t("returnPolicy.returns.text")}
        </Text>
      </Section>


      {/* REJECTED REFUNDS */}
      <Section>
        <SectionNumber>02</SectionNumber>

        <Subtitle>
          {t(
            "returnPolicy.rejectedRefunds.heading"
          )}
        </Subtitle>

        {Array.isArray(rejectedRefundItems) && (
          <OrderedList>
            {rejectedRefundItems.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </OrderedList>
        )}
      </Section>


      {/* EXCEPTIONS */}
      <Section>
        <SectionNumber>03</SectionNumber>

        <Subtitle>
          {t("returnPolicy.exceptions.heading")}
        </Subtitle>

        <Text>
          {t("returnPolicy.exceptions.text")}
        </Text>
      </Section>


      {/* RETURN SHIPPING */}
      <Section>
        <SectionNumber>04</SectionNumber>

        <Subtitle>
          {t(
            "returnPolicy.returnShipping.heading"
          )}
        </Subtitle>

        <Text>
          {t(
            "returnPolicy.returnShipping.text"
          )}
        </Text>
      </Section>


      {/* DAMAGES */}
      <Section>
        <SectionNumber>05</SectionNumber>

        <Subtitle>
          {t(
            "returnPolicy.damagesIssues.heading"
          )}
        </Subtitle>

        <Text>
          {t(
            "returnPolicy.damagesIssues.text"
          )}
        </Text>
      </Section>


      {/* REFUNDS */}
      <Section last>
        <SectionNumber>06</SectionNumber>

        <Subtitle>
          {t("returnPolicy.refunds.heading")}
        </Subtitle>

        <Text>
          {t("returnPolicy.refunds.text")}
        </Text>
      </Section>

    </Container>
  );
}

export default RefundPolicy;


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
  text-align: center;

  margin-bottom: 78px;

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

  margin: 23px auto 0;

  background: #aaa298;
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

  top: 3px;
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
   SUBTITLE
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
  margin: 0;

  color: #69645d;

  font-size: 14px;
  font-weight: 400;

  line-height: 1.95;

  letter-spacing: 0.05px;

  @media (max-width: 700px) {
    font-size: 13.5px;

    line-height: 1.85;
  }

  @media (max-width: 460px) {
    font-size: 12.8px;

    line-height: 1.8;
  }
`;


/* =====================================================
   ORDERED LIST
===================================================== */

const OrderedList = styled.ol`
  margin: 0;

  padding-left: 23px;

  color: #69645d;

  font-size: 14px;

  line-height: 1.9;

  li {
    padding-left: 7px;

    margin-bottom: 12px;
  }

  li:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 700px) {
    font-size: 13.5px;

    line-height: 1.8;

    padding-left: 21px;

    li {
      padding-left: 5px;

      margin-bottom: 10px;
    }
  }

  @media (max-width: 460px) {
    font-size: 12.8px;

    padding-left: 19px;

    li {
      padding-left: 4px;

      margin-bottom: 8px;
    }
  }

  [dir="rtl"] & {
    padding-left: 0;
    padding-right: 23px;

    text-align: right;

    li {
      padding-left: 0;
      padding-right: 7px;
    }

    @media (max-width: 700px) {
      padding-right: 21px;

      li {
        padding-right: 5px;
      }
    }

    @media (max-width: 460px) {
      padding-right: 19px;

      li {
        padding-right: 4px;
      }
    }
  }
`;