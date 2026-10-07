import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";

function Description() {
  const productData = useSelector(
    (state) => state.product.productData
  );

  const { i18n, t } = useTranslation();

  const descriptions = productData?.description;

  const language = i18n.language?.split("-")[0] || "en";

  const description =
    descriptions?.[language] ||
    descriptions?.en ||
    "";

  if (!description?.trim()) return null;

  return (
    <Container dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}>
      <SectionHeader>
        <Eyebrow>ENOUZA</Eyebrow>

        <Title>
          {t(
            "customer_reviews.description",
            "Product Description"
          )}
        </Title>

        <Accent />
      </SectionHeader>

      <DescriptionContent
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </Container>
  );
}

export default Description;

/* =========================================================
   ENOUZA — PRODUCT DESCRIPTION
========================================================= */

const Container = styled.section`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 30px 32px 64px;
  box-sizing: border-box;
  color: #3f3932;

  @media (max-width: 768px) {
    padding: 42px 22px 52px;
  }

  @media (max-width: 480px) {
    padding: 36px 17px 44px;
  }
`;

/* =========================================================
   HEADER
========================================================= */

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 38px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    margin-bottom: 26px;
  }
`;

const Eyebrow = styled.span`
  margin-bottom: 7px;
  color: #a88a62;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 8px;
  font-weight: 500;

  letter-spacing: 0.34em;
  text-transform: uppercase;
`;

const Title = styled.h2`
  margin: 0;
  color: #211e1a;

  font-family:
    "Cormorant Garamond",
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(20px, 1.5vw, 37px);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: 0.01em;
`;

const Accent = styled.span`
  width: 30px;
  height: 1px;
  margin-top: 13px;
  background: #b39a76;
`;

/* =========================================================
   DESCRIPTION CONTENT
========================================================= */

const DescriptionContent = styled.div`
    width: 100%;
 max-width: 940px; 
margin: 0 auto;
 color: #514a42;
  font-family: Arial, Helvetica, sans-serif;
   font-size: 15px;
    font-weight: 400; 
    line-height: 1.72;
     letter-spacing: 0.005em;
  h1, h2, h3, h4, h5, h6 {
   margin-top: 30px; 
   margin-bottom: 10px;
    color: #29251f;
     font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif; 
     font-weight: 500; 
     line-height: 1.25;
      letter-spacing: 0.01em;
       &:first-child { margin-top: 0; } } 
      
         img { display: block;
          width: auto;
           max-width: 100%;
            height: auto; 
            margin: 24px auto;
             object-fit: contain;
              border-radius: 0; 
 ul,             }
li {
    list-style: initial;
    padding:0;
    margin:0;
}


@media (max-width: 480px) {
 font-size: 14.5px; 
 line-height: 1.68; 
 
  img { margin: 20px auto; } `;

