import React, { useEffect, useMemo, useState } from "react";

import styled from "styled-components";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useTranslation } from "react-i18next";

import SEO from "../../SEO/SEO"

function FAQ() {

const { t: globalT, i18n } = useTranslation();

const [activeShipping, setActiveShipping] = useState(null);
const [activeReturn, setActiveReturn] = useState(null);

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}, []);

const getFaqItems = (key) => {
  const language = i18n.resolvedLanguage || i18n.language;
  const defaultNamespace =
    i18n.options?.defaultNS || "translation";

  // First, read arrays from the main translation file:
  // en.json, es.json, ar.json, etc.
  const mainBundle = i18n.getResourceBundle(
    language,
    defaultNamespace
  );

  if (Array.isArray(mainBundle?.[key])) {
    return mainBundle[key];
  }

  // Also support a separate namespace file if you use one.
  const namespaceBundle = i18n.getResourceBundle(
    language,
    key
  );

  if (Array.isArray(namespaceBundle)) {
    return namespaceBundle;
  }

  if (Array.isArray(namespaceBundle?.[key])) {
    return namespaceBundle[key];
  }

  // Final fallback: retrieve the array through i18next.
  const translated = globalT(key, {
    returnObjects: true,
    defaultValue: [],
  });

  return Array.isArray(translated) ? translated : [];
};

const shippingFaqData = getFaqItems("shippingFaq");
const returnFaqData = getFaqItems("returnFaq");

const isRTL = i18n.dir() === "rtl";

const toggleShipping = (key) => {
  setActiveShipping((current) =>
    current === key ? null : key
  );
};

const toggleReturn = (key) => {
  setActiveReturn((current) =>
    current === key ? null : key
  );
};

  return (

    <Container dir={isRTL ? "rtl" : "ltr"}>

     <SEO

      title="Frequently Asked Questions | ESONRA"

      description="Find answers to common questions about ESONRA orders, shipping, returns, refunds, and smart tracking products."

      canonical="/faq"

    />

      {/* =================================================

          PAGE HEADER

      ================================================= */}

      <Header>

        <Eyebrow>ESONRA</Eyebrow>

        <MainHeader>

          {globalT("profile.brand_faq", { defaultValue: "Frequently Asked Questions" })}

        </MainHeader>

        <HeaderDescription>

          {globalT("footer.help.brand_faq_description", {

            defaultValue:

              "Find answers to the questions we receive most often.",

          })}

        </HeaderDescription>

      </Header>

      {/* =================================================

          SHIPPING

      ================================================= */}

      <FAQSection>

        <SectionHeading>

          <SectionNumber>01</SectionNumber>

          <SectionTitle>

            {globalT("footer.help.shipping", {

              defaultValue: "Shipping",

            })}

          </SectionTitle>

        </SectionHeading>

        {Array.isArray(shippingFaqData) &&

          shippingFaqData.map((item, index) => {
            const itemKey = item.id ?? index;
            const isOpen = activeShipping === itemKey;

            return (

              <FAQItem

                className={isOpen ? "is-open" : ""}

                key={item.id ?? index}

              >

                <QuestionButton

                  type="button"

                  onClick={() =>

                    toggleShipping(itemKey)

                  }

                  aria-expanded={isOpen}
                    aria-controls={`shipping-answer-${item.id ?? index}`}

                >

                  <ArrowWrapper>

                    {isOpen ? (

                      <KeyboardArrowDownIcon className="arrow-icon" />

                    ) : (

                      <KeyboardArrowRightIcon className="arrow-icon" />

                    )}

                  </ArrowWrapper>

                  <Question>

                    {item.question}

                  </Question>

                </QuestionButton>

                {isOpen && (

                  <Answer id={`shipping-answer-${item.id ?? index}`}>

                    {item.answer?.paragraphe?.map(

                      (paragraph, idx) => (

                        <p key={idx}>

                          {paragraph}

                        </p>

                      )

                    )}

                    {item.answer?.list?.length > 0 && (

                      <AnswerList>

                        {item.answer.list.map(

                          (listItem, idx) => (

                            <li key={idx}>

                              {listItem}

                            </li>

                          )

                        )}

                      </AnswerList>

                    )}

                  </Answer>

                )}

              </FAQItem>

            );

          })}

      </FAQSection>

      {/* =================================================

          RETURNS

      ================================================= */}

      <FAQSection className="return-section">

        <SectionHeading>

          <SectionNumber>02</SectionNumber>

          <SectionTitle>

            {globalT("footer.help.returns", {

              defaultValue: "Returns",

            })}

          </SectionTitle>

        </SectionHeading>

        {Array.isArray(returnFaqData) &&

          returnFaqData.map((item, index) => {
            const itemKey = item.id ?? index;
            const isOpen = activeReturn === itemKey;

            return (

              <FAQItem

                className={isOpen ? "is-open" : ""}

                key={item.id ?? index}

              >

                <QuestionButton

                  type="button"

                  onClick={() =>

                    toggleReturn(itemKey)

                  }

                  aria-expanded={isOpen}
                    aria-controls={`return-answer-${item.id ?? index}`}

                >

                  <ArrowWrapper>

                    {isOpen ? (

                      <KeyboardArrowDownIcon className="arrow-icon" />

                    ) : (

                      <KeyboardArrowRightIcon className="arrow-icon" />

                    )}

                  </ArrowWrapper>

                  <Question>

                    {item.question}

                  </Question>

                </QuestionButton>

                {isOpen && (

                  <Answer id={`return-answer-${item.id ?? index}`}>

                    {item.answer?.paragraphe?.map(

                      (paragraph, idx) => (

                        <p key={idx}>

                          {paragraph}

                        </p>

                      )

                    )}

                    {item.answer?.list?.length > 0 && (

                      <AnswerList>

                        {item.answer.list.map(

                          (listItem, idx) => (

                            <li key={idx}>

                              {listItem}

                            </li>

                          )

                        )}

                      </AnswerList>

                    )}

                  </Answer>

                )}

              </FAQItem>

            );

          })}

      </FAQSection>

    </Container>

  );

}

export default FAQ;

/* =====================================================

   MAIN CONTAINER

\===================================================== */

const Container = styled.main`

  width: min(100% - 48px, 1080px);

  margin: 0 auto;

  padding: 52px 0 100px;

  color: #1c1c1c;

  @media (max-width: 700px) {

    width: calc(100% - 30px);

    padding: 38px 0 65px;

  }

  @media (max-width: 460px) {

    width: calc(100% - 24px);

    padding-top: 28px;

  }

`;

/* =====================================================

   HEADER

\===================================================== */

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

const MainHeader = styled.h1`

  margin: 0;

  font-family:

    Georgia,

    "Times New Roman",

    serif;

  font-size: 40px;

  font-weight: 400;

  line-height: 1.18;

  letter-spacing: 0.2px;

  color: #171717;

  @media (max-width: 700px) {

    font-size: 31px;

  }

  @media (max-width: 460px) {

    font-size: 27px;

  }

`;

const HeaderDescription = styled.p`

  max-width: 540px;

  margin: 18px auto 0;

  color: #8a857d;

  font-size: 13px;

  font-weight: 400;

  line-height: 1.8;

  @media (max-width: 460px) {

    max-width: 330px;

    font-size: 12px;

  }

`;

/* =====================================================

   FAQ SECTION

\===================================================== */

const FAQSection = styled.section`

  width: 100%;

  &.return-section {

    margin-top: 92px;

  }

  @media (max-width: 700px) {

    &.return-section {

      margin-top: 65px;

    }

  }

  @media (max-width: 460px) {

    &.return-section {

      margin-top: 55px;

    }

  }

`;

/* =====================================================

   SECTION HEADING

\===================================================== */

const SectionHeading = styled.div`

  display: flex;

  align-items: baseline;

  gap: 18px;

  margin-bottom: 27px;

  @media (max-width: 460px) {

    gap: 13px;

    margin-bottom: 22px;

  }

`;

const SectionNumber = styled.span`

  flex-shrink: 0;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 2.5px;

  color: #aaa297;

`;

const SectionTitle = styled.h2`

  margin: 0;

  font-family:

    Georgia,

    "Times New Roman",

    serif;

  font-size: 26px;

  font-weight: 400;

  line-height: 1.2;

  color: #242424;

  @media (max-width: 700px) {

    font-size: 23px;

  }

  @media (max-width: 460px) {

    font-size: 21px;

  }

`;

/* =====================================================

   FAQ ITEM

\===================================================== */

const FAQItem = styled.div`

  border-top: 1px solid #e9e5df;

  &:last-child {

    border-bottom: 1px solid #e9e5df;

  }

  &.is-open {

    .arrow-icon {

      color: #242424;

    }

  }

`;

/* =====================================================

   QUESTION BUTTON

\===================================================== */

const QuestionButton = styled.button`

  width: 100%;

  min-height: 88px;

  padding: 0 8px;

  display: grid;

  grid-template-columns: 30px 1fr;

  align-items: center;

  column-gap: 22px;

  border: none;

  outline: none;

  background: transparent;

  cursor: pointer;

  color: #1c1c1c;

  text-align: left;

  transition:

    color 0.35s ease,

    padding 0.35s ease;

  &:hover {

    color: #77736d;

    padding-left: 16px;

    .arrow-icon {

      color: #1c1c1c;

      transform: translateX(4px);

    }

  }

  &:focus-visible {

    outline: 1px solid #c9c3ba;

    outline-offset: -1px;

  }

  @media (max-width: 700px) {

    min-height: 76px;

    grid-template-columns: 27px 1fr;

    column-gap: 14px;

    padding: 0 4px;

    &:hover {

      padding-left: 9px;

    }

  }

  @media (max-width: 460px) {

    min-height: 70px;

    grid-template-columns: 25px 1fr;

    column-gap: 10px;

    padding: 0 2px;

    &:hover {

      padding-left: 6px;

    }

  }

  [dir="rtl"] & {

    text-align: right;

    &:hover {

      padding-left: 8px;

      padding-right: 16px;

      .arrow-icon {

        transform: translateX(-4px);

      }

    }

    @media (max-width: 700px) {

      &:hover {

        padding-left: 4px;

        padding-right: 9px;

      }

    }

    @media (max-width: 460px) {

      &:hover {

        padding-left: 2px;

        padding-right: 6px;

      }

    }

  }

`;

/* =====================================================

   ARROW

\===================================================== */

const ArrowWrapper = styled.span`

  width: 27px;

  height: 27px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  .arrow-icon {

    font-size: 20px;

    color: #928c83;

    transition:

      color 0.35s ease,

      transform 0.35s ease;

  }

  @media (max-width: 700px) {

    width: 25px;

    height: 25px;

    .arrow-icon {

      font-size: 19px;

    }

  }

  @media (max-width: 460px) {

    width: 23px;

    height: 23px;

    .arrow-icon {

      font-size: 18px;

    }

  }

`;

/* =====================================================

   QUESTION

\===================================================== */

const Question = styled.span`

  font-family:

    Georgia,

    "Times New Roman",

    serif;

  font-size: 16px;

  font-weight: 400;

  line-height: 1.55;

  letter-spacing: 0.15px;

  color: inherit;

  @media (max-width: 700px) {

    font-size: 14.5px;

  }

  @media (max-width: 460px) {

    font-size: 13.5px;

  }

`;

/* =====================================================

   ANSWER

\===================================================== */

const Answer = styled.div`

  max-width: 720px;

  margin-left: 52px;

  padding: 0 28px 34px 0;

  color: #6e6961;

  font-size: 14px;

  font-weight: 400;

  line-height: 1.9;

  animation: answerReveal 0.35s ease both;

  p {

    margin: 0 0 14px;

  }

  p:last-child {

    margin-bottom: 0;

  }

  @keyframes answerReveal {

    from {

      opacity: 0;

      transform: translateY(-5px);

    }

    to {

      opacity: 1;

      transform: translateY(0);

    }

  }

  @media (max-width: 700px) {

    margin-left: 41px;

    padding-right: 10px;

    padding-bottom: 27px;

    font-size: 13.5px;

    line-height: 1.8;

  }

  @media (max-width: 460px) {

    margin-left: 35px;

    padding-right: 5px;

    padding-bottom: 23px;

    font-size: 12.8px;

    line-height: 1.8;

  }

  [dir="rtl"] & {

    margin-left: 0;

    margin-right: 52px;

    padding-left: 28px;

    padding-right: 0;

    text-align: right;

    @media (max-width: 700px) {

      margin-right: 41px;

      padding-left: 10px;

    }

    @media (max-width: 460px) {

      margin-right: 35px;

      padding-left: 5px;

    }

  }

`;

/* =====================================================

   ANSWER LIST

\===================================================== */

const AnswerList = styled.ul`

  margin: 15px 0 0;

  padding-left: 20px;

  li {

    margin-bottom: 8px;

    padding-left: 5px;

  }

  [dir="rtl"] & {

    padding-left: 0;

    padding-right: 20px;

    li {

      padding-left: 0;

      padding-right: 5px;

    }

  }

`;