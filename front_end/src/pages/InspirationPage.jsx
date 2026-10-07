import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const InspirationPage = () => {
  const { t } = useTranslation();

  const featuredSpaces = [
    {
      key: "livingRoom",
      image: "/images/inspiration/living-room.webp",
      link: "/shop?room=living-room",
    },
    {
      key: "diningRoom",
      image: "/images/inspiration/dining-room.webp",
      link: "/shop?room=dining-room",
    },
    {
      key: "bedroom",
      image: "/images/inspiration/bedroom.webp",
      link: "/shop?room=bedroom",
    },
  ];

  const lightingIdeas = [
    {
      key: "ambientLighting",
      image: "/images/inspiration/ambient-lighting.webp",
    },
    {
      key: "statementLighting",
      image: "/images/inspiration/statement-lighting.webp",
    },
    {
      key: "layeredLighting",
      image: "/images/inspiration/layered-lighting.webp",
    },
  ];

  return (
    <Page>

      {/* HERO */}
      <Hero>
        <HeroImage
          src="/images/inspiration/inspiration-hero.webp"
          alt=""
        />

        <HeroOverlay />

        <HeroContent>
          <HeroEyebrow>
            {t("inspirationPage.hero.catlabel")}
          </HeroEyebrow>

          <HeroTitle>
            {t("inspirationPage.hero.title")}
          </HeroTitle>

          <HeroText>
            {t("inspirationPage.hero.description")}
          </HeroText>
        </HeroContent>
      </Hero>


      {/* INTRO */}
      <Intro>
        <IntroEyebrow>
          {t("inspirationPage.intro.catlabel")}
        </IntroEyebrow>

        <IntroTitle>
          {t("inspirationPage.intro.title")}
        </IntroTitle>

        <IntroText>
          {t("inspirationPage.intro.description")}
        </IntroText>
      </Intro>


      {/* FEATURED SPACES */}
      <Section>
        <SectionHeader>
          <SectionEyebrow>
            {t("inspirationPage.spaces.catlabel")}
          </SectionEyebrow>

          <SectionTitle>
            {t("inspirationPage.spaces.title")}
          </SectionTitle>
        </SectionHeader>

        <SpacesGrid>
          {featuredSpaces.map((space, index) => (
            <SpaceCard
              href={space.link}
              key={space.key}
            >
              <SpaceImageWrapper>
                <SpaceImage
                  src={space.image}
                  alt={t(
                    `inspirationPage.spaces.items.${space.key}.title`
                  )}
                  loading="lazy"
                />

                <ImageOverlay />

                <SpaceContent>
                  <SpaceNumber>
                    0{index + 1}
                  </SpaceNumber>

                  <SpaceTitle>
                    {t(
                      `inspirationPage.spaces.items.${space.key}.title`
                    )}
                  </SpaceTitle>

                  <SpaceDescription>
                    {t(
                      `inspirationPage.spaces.items.${space.key}.description`
                    )}
                  </SpaceDescription>

                  <Explore>
                    {t("inspirationPage.explore")}
                    <Arrow>↗</Arrow>
                  </Explore>
                </SpaceContent>
              </SpaceImageWrapper>
            </SpaceCard>
          ))}
        </SpacesGrid>
      </Section>


      {/* DESIGN STATEMENT */}
      <Statement>
        <StatementInner>
          <StatementEyebrow>
            {t("inspirationPage.statement.catlabel")}
          </StatementEyebrow>

          <StatementTitle>
            {t("inspirationPage.statement.title")}
          </StatementTitle>

          <StatementText>
            {t("inspirationPage.statement.description")}
          </StatementText>
        </StatementInner>
      </Statement>


      {/* LIGHTING IDEAS */}
      <Section>
        <SectionHeader>
          <SectionEyebrow>
            {t("inspirationPage.ideas.catlabel")}
          </SectionEyebrow>

          <SectionTitle>
            {t("inspirationPage.ideas.title")}
          </SectionTitle>
        </SectionHeader>

        <IdeasGrid>
          {lightingIdeas.map((idea, index) => (
            <IdeaCard key={idea.key}>
              <IdeaImageWrapper>
                <IdeaImage
                  src={idea.image}
                  alt={t(
                    `inspirationPage.ideas.items.${idea.key}.title`
                  )}
                  loading="lazy"
                />
              </IdeaImageWrapper>

              <IdeaNumber>
                0{index + 1}
              </IdeaNumber>

              <IdeaTitle>
                {t(
                  `inspirationPage.ideas.items.${idea.key}.title`
                )}
              </IdeaTitle>

              <IdeaDescription>
                {t(
                  `inspirationPage.ideas.items.${idea.key}.description`
                )}
              </IdeaDescription>
            </IdeaCard>
          ))}
        </IdeasGrid>
      </Section>


      {/* EDITORIAL */}
      <Editorial>
        <EditorialImage
          src="/images/inspiration/editorial.webp"
          alt=""
          loading="lazy"
        />

        <EditorialOverlay />

        <EditorialContent>
          <EditorialEyebrow>
            {t("inspirationPage.editorial.catlabel")}
          </EditorialEyebrow>

          <EditorialTitle>
            {t("inspirationPage.editorial.title")}
          </EditorialTitle>

          <EditorialText>
            {t("inspirationPage.editorial.description")}
          </EditorialText>

          <EditorialLink href="/shop">
            {t("inspirationPage.editorial.link")}
            <Arrow>↗</Arrow>
          </EditorialLink>
        </EditorialContent>
      </Editorial>


      {/* NEWSLETTER */}
      <Newsletter>
        <NewsletterEyebrow>
          {t("inspirationPage.newsletter.catlabel")}
        </NewsletterEyebrow>

        <NewsletterTitle>
          {t("inspirationPage.newsletter.title")}
        </NewsletterTitle>

        <NewsletterText>
          {t("inspirationPage.newsletter.description")}
        </NewsletterText>

        <NewsletterButton href="/contact">
          {t("inspirationPage.newsletter.button")}
        </NewsletterButton>
      </Newsletter>

    </Page>
  );
};

export default InspirationPage;
const Page = styled.main`
  background: #f7f5f0;
  color: #171614;
`;

const Hero = styled.section`
  position: relative;
  height: min(82vh, 820px);
  min-height: 620px;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.05),
      rgba(0, 0, 0, 0.58)
    );
`;

const HeroContent = styled.div`
  position: absolute;
  left: 7vw;
  bottom: 8vw;
  max-width: 760px;
  color: white;
`;

const HeroEyebrow = styled.div`
  margin-bottom: 20px;

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #e0c9a9;
`;

const HeroTitle = styled.h1`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(58px, 8vw, 110px);
  font-weight: 400;
  line-height: 0.9;
`;

const HeroText = styled.p`
  max-width: 520px;
  margin: 28px 0 0;

  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.85);
`;


/* INTRO */

const Intro = styled.section`
  max-width: 850px;
  margin: 0 auto;
  padding: 130px 5vw 120px;
  text-align: center;
`;

const IntroEyebrow = styled.div`
  margin-bottom: 20px;

  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
`;

const IntroTitle = styled.h2`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(46px, 6vw, 78px);
  font-weight: 500;
  line-height: 0.98;
`;

const IntroText = styled.p`
  max-width: 650px;
  margin: 30px auto 0;

  color: #66625b;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.8;
`;


/* SECTIONS */

const Section = styled.section`
  padding: 20px 5vw 130px;
`;

const SectionHeader = styled.div`
  max-width: 700px;
  margin: 0 auto 55px;
  text-align: center;
`;

const SectionEyebrow = styled.div`
  margin-bottom: 17px;

  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(44px, 5vw, 68px);
  font-weight: 500;
  line-height: 1;
`;


/* SPACES */

const SpacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const SpaceCard = styled.a`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const SpaceImageWrapper = styled.div`
  position: relative;
  height: 650px;
  overflow: hidden;

  &:hover img {
    transform: scale(1.035);
  }

  &:hover span:last-child {
    transform: translateX(5px);
  }

  @media (max-width: 800px) {
    height: 560px;
  }
`;

const SpaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  transition: transform 900ms cubic-bezier(0.2, 0.65, 0.25, 1);
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to bottom,
    transparent 25%,
    rgba(0, 0, 0, 0.72) 100%
  );
`;

const SpaceContent = styled.div`
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 30px;

  color: white;
`;

const SpaceNumber = styled.div`
  margin-bottom: 13px;

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 2px;
  opacity: 0.65;
`;

const SpaceTitle = styled.h3`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 42px;
  font-weight: 500;
  line-height: 1;
`;

const SpaceDescription = styled.p`
  max-width: 300px;
  margin: 13px 0 20px;

  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.6;

  color: rgba(255, 255, 255, 0.85);
`;

const Explore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;

  padding-bottom: 6px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.65);

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;

  transition: transform 300ms ease;
`;

const Arrow = styled.span`
  font-size: 15px;
`;


/* STATEMENT */

const Statement = styled.section`
  background: #e9e2d7;
  padding: 150px 5vw;
`;

const StatementInner = styled.div`
  max-width: 850px;
  margin: auto;
  text-align: center;
`;

const StatementEyebrow = styled.div`
  margin-bottom: 20px;

  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
`;

const StatementTitle = styled.h2`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(48px, 6vw, 82px);
  font-weight: 400;
  line-height: 0.98;
`;

const StatementText = styled.p`
  max-width: 650px;
  margin: 30px auto 0;

  color: #66625b;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.8;
`;


/* IDEAS */

const IdeasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 45px 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const IdeaCard = styled.article`
  min-width: 0;
`;

const IdeaImageWrapper = styled.div`
  aspect-ratio: 3 / 4;
  overflow: hidden;
  margin-bottom: 22px;

  &:hover img {
    transform: scale(1.035);
  }
`;

const IdeaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  transition: transform 900ms ease;
`;

const IdeaNumber = styled.div`
  margin-bottom: 9px;

  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
`;

const IdeaTitle = styled.h3`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 32px;
  font-weight: 500;
`;

const IdeaDescription = styled.p`
  max-width: 340px;
  margin: 10px 0 0;

  color: #706c65;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.7;
`;


/* EDITORIAL */

const Editorial = styled.section`
  position: relative;
  height: 700px;
  overflow: hidden;
`;

const EditorialImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EditorialOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.05)
  );
`;

const EditorialContent = styled.div`
  position: absolute;
  top: 50%;
  left: 8vw;

  max-width: 550px;

  transform: translateY(-50%);

  color: white;
`;

const EditorialEyebrow = styled.div`
  margin-bottom: 18px;

  color: #dcc19b;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
`;

const EditorialTitle = styled.h2`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(48px, 6vw, 82px);
  font-weight: 400;
  line-height: 0.95;
`;

const EditorialText = styled.p`
  max-width: 450px;
  margin: 25px 0;

  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.75;

  color: rgba(255, 255, 255, 0.82);
`;

const EditorialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding-bottom: 7px;

  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.7px;
  text-transform: uppercase;

  text-decoration: none;
`;


/* NEWSLETTER */

const Newsletter = styled.section`
  padding: 130px 5vw;

  text-align: center;
`;

const NewsletterEyebrow = styled.div`
  margin-bottom: 18px;

  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
`;

const NewsletterTitle = styled.h2`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(45px, 5vw, 70px);
  font-weight: 500;
`;

const NewsletterText = styled.p`
  max-width: 500px;
  margin: 20px auto 30px;

  color: #706c65;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.7;
`;

const NewsletterButton = styled.a`
  display: inline-block;

  padding: 14px 28px;

  background: #171614;
  color: white;

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.7px;
  text-transform: uppercase;

  text-decoration: none;

  transition: background 250ms ease;

  &:hover {
    background: #9b815f;
  }
`;