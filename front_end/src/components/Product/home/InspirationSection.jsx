import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const InspirationSection = () => {
  const { t } = useTranslation();

  const inspirations = [
    {
      key: "livingSpaces",
      image: "/images/inspiration/living-spaces.webp",
      link: "/shop?room=living-room",
    },
    {
      key: "diningSpaces",
      image: "/images/inspiration/dining-spaces.webp",
      link: "/shop?room=dining-room",
    },
    {
      key: "quietCorners",
      image: "/images/inspiration/quiet-corners.webp",
      link: "/shop?room=bedroom",
    },
  ];

  return (
    <Section>
      <Header>
        <Eyebrow>{t("inspirationSection.catlabel")}</Eyebrow>

        <Title>
          {t("inspirationSection.title")}
        </Title>
      </Header>

      <InspirationGrid>
        {inspirations.map((item, index) => (
          <InspirationCard href={item.link} key={item.key}>
            <ImageWrapper>
              <InspirationImage
                src={item.image}
                alt={t(
                  `inspirationSection.categories.${item.key}.title`
                )}
                loading="lazy"
              />

              <Overlay />

              <CardContent>
                <CardNumber>
                  {String(index + 1).padStart(2, "0")}
                </CardNumber>

                <CardTitle>
                  {t(
                    `inspirationSection.categories.${item.key}.title`
                  )}
                </CardTitle>

                <CardDescription>
                  {t(
                    `inspirationSection.categories.${item.key}.description`
                  )}
                </CardDescription>

                <Discover>
                  {t("inspirationSection.discover")}
                  <Arrow>↗</Arrow>
                </Discover>
              </CardContent>
            </ImageWrapper>
          </InspirationCard>
        ))}
      </InspirationGrid>
    </Section>
  );
};

export default InspirationSection;

const Section = styled.section`
  background: #f7f5f0;
  padding: 110px 5vw 120px;
`;

const Header = styled.div`
  max-width: 760px;
  margin: 0 auto 60px;
  text-align: center;
`;

const Eyebrow = styled.div`
  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 3px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  color: #171614;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(44px, 5vw, 70px);
  font-weight: 500;
  line-height: 1.02;
`;

const InspirationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);

    & > a:last-child {
      grid-column: span 2;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    & > a:last-child {
      grid-column: span 1;
    }
  }
`;

const InspirationCard = styled.a`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 620px;
  overflow: hidden;

  &:hover img {
    transform: scale(1.035);
  }

  &:hover span:last-child {
    transform: translateX(5px);
  }

  @media (max-width: 900px) {
    height: 560px;
  }

  @media (max-width: 600px) {
    height: 520px;
  }
`;

const InspirationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  transition:
    transform 1000ms cubic-bezier(0.2, 0.65, 0.25, 1);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.02) 25%,
    rgba(0, 0, 0, 0.08) 48%,
    rgba(0, 0, 0, 0.72) 100%
  );
`;

const CardContent = styled.div`
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 32px;
  color: #fff;
`;

const CardNumber = styled.div`
  margin-bottom: 14px;

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 2px;

  opacity: 0.65;
`;

const CardTitle = styled.h3`
  margin: 0;

  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(34px, 3vw, 44px);
  font-weight: 500;
  line-height: 1;
`;

const CardDescription = styled.p`
  max-width: 310px;

  margin: 14px 0 22px;

  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.65;

  color: rgba(255, 255, 255, 0.86);
`;

const Discover = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding-bottom: 7px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.65);

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.7px;
  text-transform: uppercase;

  transition: transform 300ms ease;
`;

const Arrow = styled.span`
  font-size: 15px;
  line-height: 1;
`;