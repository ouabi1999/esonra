import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AutoAwesome from "@mui/icons-material/AutoAwesome";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";
import LightMode from "@mui/icons-material/LightMode";
import DiamondOutlined from "@mui/icons-material/DiamondOutlined";

import SEO from "../components/SEO/SEO";

/* =========================================================
   ENOUZA COLORS
========================================================= */

const COLORS = {
  background: "#F7F5F0",
  white: "#FFFFFF",
  text: "#1D1C1A",
  muted: "#77736B",
  gold: "#B39A76",
  softGold: "#DED4C4",
  border: "#E4DED4",
  dark: "#292723",
};

/* =========================================================
   ABOUT US
========================================================= */

const AboutUs = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar");

  /* =====================================================
     SCROLL TO TOP
  ===================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  /* =====================================================
     FEATURES
  ===================================================== */

  const features = [
    {
      icon: <AutoAwesome />,
      title: t("aboutus.approach.curated.title"),
      description: t("aboutus.approach.curated.description"),
    },
    {
      icon: <WorkspacePremium />,
      title: t("aboutus.approach.refined.title"),
      description: t("aboutus.approach.refined.description"),
    },
    {
      icon: <LightMode />,
      title: t("aboutus.approach.atmospheric.title"),
      description: t("aboutus.approach.atmospheric.description"),
    },
    {
      icon: <DiamondOutlined />,
      title: t("aboutus.approach.distinctive.title"),
      description: t("aboutus.approach.distinctive.description"),
    },
  ];

  return (
    <Page dir={isArabic ? "rtl" : "ltr"}>
      <SEO
        title={t("aboutus.seo.title")}
        description={t("aboutus.seo.description")}
        canonical="/about-us"
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <Hero>
        <HeroInner>
          <HeroEyebrow>
            {t("aboutus.hero.eyebrow")}
          </HeroEyebrow>

          <HeroTitle>
            {t("aboutus.hero.title")}
          </HeroTitle>

          <HeroDescription>
            {t("aboutus.hero.description")}
          </HeroDescription>

          <HeroLine />
        </HeroInner>
      </Hero>

      {/* =====================================================
          STORY
      ===================================================== */}

      <StorySection>
        <StoryGrid>
          <StoryIntro>
            <Eyebrow>
              {t("aboutus.story.eyebrow")}
            </Eyebrow>

            <StoryTitle>
              {t("aboutus.story.title")}
            </StoryTitle>
          </StoryIntro>

          <StoryContent>
            <StoryLead>
              {t("aboutus.story.lead")}
            </StoryLead>

            <StoryText>
              {t("aboutus.story.text")}
            </StoryText>

            <StoryText>
              {t("aboutus.story.text2")}
            </StoryText>
          </StoryContent>
        </StoryGrid>
      </StorySection>

      {/* =====================================================
          BRAND STATEMENT
      ===================================================== */}

      <StatementSection>
        <StatementInner>
          <StatementMark>✦</StatementMark>

          <Statement>
            {t("aboutus.statement.title")}
          </Statement>

          <StatementDescription>
            {t("aboutus.statement.description")}
          </StatementDescription>
        </StatementInner>
      </StatementSection>

      {/* =====================================================
          ENOUZA APPROACH
      ===================================================== */}

      <ApproachSection>
        <SectionHeader>
          <Eyebrow>
            {t("aboutus.approach.eyebrow")}
          </Eyebrow>

          <SectionTitle>
            {t("aboutus.approach.title")}
          </SectionTitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <Feature key={index}>
              <IconCircle>
                <FeatureIcon>
                  {React.cloneElement(feature.icon, {
                    fontSize: "inherit",
                  })}
                </FeatureIcon>
              </IconCircle>

              <FeatureTitle>
                {feature.title}
              </FeatureTitle>

              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </Feature>
          ))}
        </FeaturesGrid>
      </ApproachSection>

      {/* =====================================================
          SELECTION
      ===================================================== */}

      <SelectionSection>
        <SelectionHeader>
          <Eyebrow>
            {t("aboutus.selection.eyebrow")}
          </Eyebrow>

          <SelectionTitle>
            {t("aboutus.selection.title")}
          </SelectionTitle>
        </SelectionHeader>

        <SelectionList>
          {/* 01 */}
          <SelectionItem>
            <SelectionNumber>01</SelectionNumber>

            <SelectionContent>
              <SelectionItemTitle>
                {t("aboutus.selection.form.title")}
              </SelectionItemTitle>

              <SelectionText>
                {t("aboutus.selection.form.description")}
              </SelectionText>
            </SelectionContent>
          </SelectionItem>

          {/* 02 */}
          <SelectionItem>
            <SelectionNumber>02</SelectionNumber>

            <SelectionContent>
              <SelectionItemTitle>
                {t("aboutus.selection.material.title")}
              </SelectionItemTitle>

              <SelectionText>
                {t("aboutus.selection.material.description")}
              </SelectionText>
            </SelectionContent>
          </SelectionItem>

          {/* 03 */}
          <SelectionItem>
            <SelectionNumber>03</SelectionNumber>

            <SelectionContent>
              <SelectionItemTitle>
                {t("aboutus.selection.light.title")}
              </SelectionItemTitle>

              <SelectionText>
                {t("aboutus.selection.light.description")}
              </SelectionText>
            </SelectionContent>
          </SelectionItem>
        </SelectionList>
      </SelectionSection>

      {/* =====================================================
          PROMISE
      ===================================================== */}

      <PromiseSection>
        <PromiseInner>
          <Eyebrow>
            {t("aboutus.promise.eyebrow")}
          </Eyebrow>

          <PromiseTitle>
            {t("aboutus.promise.title")}
          </PromiseTitle>

          <PromiseText>
            {t("aboutus.promise.description")}
          </PromiseText>
        </PromiseInner>
      </PromiseSection>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <FinalSection>
        <FinalInner>
          <FinalEyebrow>
            {t("aboutus.final.eyebrow")}
          </FinalEyebrow>

          <FinalTitle>
            {t("aboutus.final.title")}
          </FinalTitle>

          <FinalText>
            {t("aboutus.final.description")}
          </FinalText>

          <CollectionLink to="/collections">
            <span>
              {t("aboutus.final.cta")}
            </span>

            <Arrow>
              {isArabic ? "←" : "→"}
            </Arrow>
          </CollectionLink>
        </FinalInner>
      </FinalSection>
    </Page>
  );
};

export default AboutUs;

/* =========================================================
   PAGE
========================================================= */

const Page = styled.main`
  width: 100%;
  overflow: hidden;

  background: ${COLORS.background};
  color: ${COLORS.text};

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;
`;

/* =========================================================
   SHARED EYEBROW
========================================================= */

const Eyebrow = styled.span`
  display: block;

  margin-bottom: 14px;

  color: #a8895e;

  font-family:
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.22em;
  line-height: 1.4;

  text-transform: uppercase;

  @media (max-width: 600px) {
    margin-bottom: 12px;

    font-size: 8px;
    letter-spacing: 0.18em;
  }
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  min-height: 58vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 100px 24px;

  background:
    linear-gradient(
      145deg,
      #f9f7f3 0%,
      #f1eee7 55%,
      #e9e3da 100%
    );

  text-align: center;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 72px 22px 76px;
  }

  @media (max-width: 480px) {
    padding: 62px 20px 66px;
  }
`;

const HeroInner = styled.div`
  width: 100%;
  max-width: 720px;

  margin: 0 auto;
`;

const HeroEyebrow = styled(Eyebrow)`
  margin-bottom: 20px;

  @media (max-width: 600px) {
    margin-bottom: 17px;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;

  color: #211f1c;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(2.8rem, 6vw, 5.2rem);
  font-weight: 400;

  line-height: 0.98;
  letter-spacing: -0.045em;

  @media (max-width: 600px) {
    max-width: 390px;
    margin-inline: auto;

    font-size: clamp(2.6rem, 12vw, 3.65rem);
    line-height: 1;
  }
`;

const HeroDescription = styled.p`
  max-width: 480px;

  margin: 24px auto 0;

  color: #68625a;

  font-size: 14px;
  line-height: 1.7;

  @media (max-width: 600px) {
    max-width: 360px;

    margin-top: 20px;

    font-size: 13px;
    line-height: 1.7;
  }
`;

const HeroLine = styled.span`
  display: block;

  width: 38px;
  height: 1px;

  margin: 27px auto 0;

  background: #ad9067;

  @media (max-width: 600px) {
    margin-top: 23px;
  }
`;

/* =========================================================
   STORY
========================================================= */

const StorySection = styled.section`
  padding: 100px 7vw;

  background: ${COLORS.background};

  @media (max-width: 768px) {
    padding: 70px 24px;
  }

  @media (max-width: 480px) {
    padding: 64px 20px;
  }
`;

const StoryGrid = styled.div`
  width: 100%;
  max-width: 1080px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(240px, 0.8fr)
    minmax(0, 1.2fr);

  gap: clamp(45px, 8vw, 110px);

  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;

    gap: 30px;
  }
`;

const StoryIntro = styled.div`
  position: static;
`;

const StoryTitle = styled.h2`
  max-width: 390px;

  margin: 0;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2rem,
    3.5vw,
    3.2rem
  );

  font-weight: 400;

  line-height: 1.08;
  letter-spacing: -0.03em;

  @media (max-width: 600px) {
    max-width: 100%;

    font-size: clamp(
      2rem,
      9vw,
      2.8rem
    );
  }
`;

const StoryContent = styled.div`
  max-width: 570px;

  @media (max-width: 800px) {
    max-width: 650px;
  }
`;

const StoryLead = styled.p`
  margin: 0 0 20px;

  color: #302d29;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    1.15rem,
    1.8vw,
    1.45rem
  );

  font-weight: 400;

  line-height: 1.45;
`;

const StoryText = styled.p`
  margin: 0 0 16px;

  color: #6b655d;

  font-size: 14px;
  line-height: 1.8;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    line-height: 1.8;
  }
`;

/* =========================================================
   STATEMENT
========================================================= */

const StatementSection = styled.section`
  padding: 100px 24px;

  background: ${COLORS.dark};

  color: ${COLORS.background};

  text-align: center;

  @media (max-width: 600px) {
    padding: 76px 22px;
  }
`;

const StatementInner = styled.div`
  max-width: 700px;

  margin: 0 auto;
`;

const StatementMark = styled.div`
  margin-bottom: 22px;

  color: #b89a6b;

  font-size: 12px;

  @media (max-width: 600px) {
    margin-bottom: 18px;
  }
`;

const Statement = styled.h2`
  max-width: 680px;

  margin: 0 auto;

  color: ${COLORS.background};

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2rem,
    4vw,
    3.6rem
  );

  font-weight: 400;

  line-height: 1.1;
  letter-spacing: -0.03em;

  @media (max-width: 600px) {
    font-size: clamp(
      2rem,
      9vw,
      2.8rem
    );
  }
`;

const StatementDescription = styled.p`
  max-width: 510px;

  margin: 22px auto 0;

  color: rgba(247, 245, 240, 0.65);

  font-size: 14px;
  line-height: 1.8;

  @media (max-width: 600px) {
    margin-top: 18px;

    font-size: 13px;
    line-height: 1.75;
  }
`;

/* =========================================================
   ENOUZA APPROACH
========================================================= */

const ApproachSection = styled.section`
  padding: 100px 7vw 105px;

  background: ${COLORS.background};

  @media (max-width: 768px) {
    padding: 72px 22px 78px;
  }

  @media (max-width: 480px) {
    padding: 64px 20px 68px;
  }
`;

const SectionHeader = styled.div`
  width: 100%;
  max-width: 1080px;

  margin: 0 auto 52px;

  @media (max-width: 600px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2`
  max-width: 540px;

  margin: 0;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2rem,
    3.8vw,
    3.5rem
  );

  font-weight: 400;

  line-height: 1.08;
  letter-spacing: -0.03em;

  @media (max-width: 600px) {
    max-width: 100%;

    font-size: clamp(
      2rem,
      10vw,
      2.75rem
    );
  }
`;

const FeaturesGrid = styled.div`
  width: 100%;
  max-width: 1080px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 48px 24px;
  }

  @media (max-width: 520px) {
    gap: 38px 16px;
  }
`;

const Feature = styled.article`
  min-width: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  @media (min-width: 901px) {
    padding: 0 12px;
  }
`;

const IconCircle = styled.div`
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 21px;

  border: 1px solid rgba(179, 154, 118, 0.8);

  border-radius: 40%;

  color: #a8895e;

  transition:
    transform 0.3s ease,
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;

  @media (hover: hover) {
    ${Feature}:hover & {
      transform: translateY(-3px);

      background: #292723;
      border-color: #292723;

      color: #f7f5f0;
    }
  }

  @media (max-width: 520px) {
    width: 58px;
    height: 58px;

    margin-bottom: 16px;
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 19px;

  svg {
    font-size: inherit;
  }

  @media (max-width: 520px) {
    font-size: 17px;
  }
`;

const FeatureTitle = styled.h3`
  margin: 0;

  color: ${COLORS.text};

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: 0.8rem;
  font-weight: 500;

  line-height: 1.35;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  @media (max-width: 520px) {
    font-size: 0.72rem;

    letter-spacing: 0.1em;
  }
`;

const FeatureDescription = styled.p`
  width: 100%;
  max-width: 190px;

  margin: 10px auto 0;

  color: #777168;

  font-family:
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 0.72rem;
  font-weight: 400;

  line-height: 1.65;

  @media (max-width: 520px) {
    max-width: 145px;

    margin-top: 8px;

    font-size: 0.67rem;
    line-height: 1.55;
  }
`;

/* =========================================================
   SELECTION
========================================================= */

const SelectionSection = styled.section`
  padding: 100px 7vw;

  background: #ece8e0;

  @media (max-width: 768px) {
    padding: 70px 22px;
  }

  @media (max-width: 480px) {
    padding: 64px 20px;
  }
`;

const SelectionHeader = styled.div`
  max-width: 1080px;

  margin: 0 auto 45px;

  @media (max-width: 600px) {
    margin-bottom: 35px;
  }
`;

const SelectionTitle = styled.h2`
  max-width: 570px;

  margin: 0;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2rem,
    3.8vw,
    3.5rem
  );

  font-weight: 400;

  line-height: 1.08;
  letter-spacing: -0.03em;

  @media (max-width: 600px) {
    max-width: 100%;

    font-size: clamp(
      2rem,
      10vw,
      2.75rem
    );
  }
`;

const SelectionList = styled.div`
  max-width: 1080px;

  margin: 0 auto;

  border-top: 1px solid
    rgba(41, 39, 35, 0.18);
`;

const SelectionItem = styled.div`
  display: grid;

  grid-template-columns: 65px 1fr;

  gap: 25px;

  padding: 27px 0;

  border-bottom: 1px solid
    rgba(41, 39, 35, 0.18);

  @media (max-width: 600px) {
    grid-template-columns: 40px 1fr;

    gap: 15px;

    padding: 23px 0;
  }
`;

const SelectionNumber = styled.span`
  padding-top: 3px;

  color: #a8895e;

  font-size: 9px;

  letter-spacing: 0.14em;
`;

const SelectionContent = styled.div`
  display: grid;

  grid-template-columns:
    minmax(150px, 0.5fr)
    minmax(0, 1fr);

  gap: 30px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;

    gap: 7px;
  }
`;

const SelectionItemTitle = styled.h3`
  margin: 0;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: 21px;
  font-weight: 400;

  line-height: 1.2;

  @media (max-width: 600px) {
    font-size: 19px;
  }
`;

const SelectionText = styled.p`
  max-width: 480px;

  margin: 0;

  color: #6b655d;

  font-size: 13px;
  line-height: 1.7;

  @media (max-width: 600px) {
    font-size: 12px;
    line-height: 1.7;
  }
`;

/* =========================================================
   PROMISE
========================================================= */

const PromiseSection = styled.section`
  padding: 105px 24px;

  background: ${COLORS.background};

  text-align: center;

  @media (max-width: 600px) {
    padding: 76px 22px;
  }
`;

const PromiseInner = styled.div`
  max-width: 650px;

  margin: 0 auto;
`;

const PromiseTitle = styled.h2`
  max-width: 620px;

  margin: 0 auto;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2rem,
    4vw,
    3.6rem
  );

  font-weight: 400;

  line-height: 1.08;
  letter-spacing: -0.03em;

  @media (max-width: 600px) {
    font-size: clamp(
      2rem,
      9vw,
      2.8rem
    );
  }
`;

const PromiseText = styled.p`
  max-width: 500px;

  margin: 20px auto 0;

  color: #6b655d;

  font-size: 14px;
  line-height: 1.8;

  @media (max-width: 600px) {
    margin-top: 17px;

    font-size: 13px;
    line-height: 1.75;
  }
`;

/* =========================================================
   FINAL CTA
========================================================= */

const FinalSection = styled.section`
  padding: 95px 24px;

  background:
    linear-gradient(
      135deg,
      #e9e3d9,
      #f5f2ec
    );

  text-align: center;

  @media (max-width: 600px) {
    padding: 70px 22px;
  }
`;

const FinalInner = styled.div`
  max-width: 720px;

  margin: 0 auto;
`;

const FinalEyebrow = styled(Eyebrow)`
  margin-bottom: 18px;

  @media (max-width: 600px) {
    margin-bottom: 15px;
  }
`;

const FinalTitle = styled.h2`
  max-width: 700px;

  margin: 0 auto;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    2.2rem,
    4.5vw,
    4rem
  );

  font-weight: 400;

  line-height: 1.05;
  letter-spacing: -0.035em;

  @media (max-width: 600px) {
    font-size: clamp(
      2.2rem,
      10vw,
      3rem
    );

    line-height: 1.05;
  }
`;

const FinalText = styled.p`
  max-width: 480px;

  margin: 20px auto 28px;

  color: #6b655d;

  font-size: 14px;
  line-height: 1.75;

  @media (max-width: 600px) {
    margin: 18px auto 25px;

    font-size: 13px;
    line-height: 1.7;
  }
`;

const CollectionLink = styled(Link)`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  min-height: 46px;

  padding: 0 24px;

  background: #292723;

  color: #f7f5f0;

  text-decoration: none;

  font-size: 9px;
  font-weight: 500;

  letter-spacing: 0.15em;

  text-transform: uppercase;

  transition:
    background 0.25s ease,
    gap 0.25s ease,
    transform 0.25s ease;

  &:hover {
    background: #a8895e;

    gap: 16px;

    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    min-height: 44px;

    padding: 0 20px;

    font-size: 8px;
  }
`;

const Arrow = styled.span`
  font-size: 14px;

  line-height: 1;
`;