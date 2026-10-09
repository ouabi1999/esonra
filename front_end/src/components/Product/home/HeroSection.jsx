
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import ApiInstance from "../../../../common/baseUrl";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { optimizeCloudinaryImage } from "../../../utilis/cloudinary";
import DecorationLine from "../../../../common/DecorationLine";
import { createProductSlug } from "../../../utilis/CreateSlug";
import { colors } from "../../../utilis/colors";

export default function HeroSection() {
  const [product, setProduct] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getHeroProduct = async () => {
      try {
        const res = await ApiInstance.get("/products/hero");
        setProduct(res.data);
      } catch (error) {
        setProduct(null);
        console.error(error);
      }
    };

    getHeroProduct();
  }, []);

  const imageUrl = optimizeCloudinaryImage(
    product?.multimediaInfo?.image_urls?.[2],
    { width: 620 }
  );

  if (!imageUrl) return null;

  const isRTL = i18n.dir() === "rtl";

  return (
    <HeroBox $rtl={isRTL}>
      <HeroContainer>
        {/* LEFT / TEXT SIDE */}
        <Content dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}>
          <Title>{t("heroSection.title")}</Title>

          <Description>{t("heroSection.description")}</Description>

          <QualityTitle>
            Esonra
          </QualityTitle>
          <DecorationLine />

          {/* STATS */}
        </Content>

        {/* IMAGE SIDE */}
        <ImageSide>
          <ImageContainer>
            <HeroImage
              src={imageUrl}
              alt={t("heroSection.title")}
              fetchpriority="high"
              width="700"
              height="620"
            />

            {/* SHOP BUTTON */}
            <ShopButton
              to={`/product/${createProductSlug(product.name?.en)}`}
              $rtl={isRTL}
              dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}
            >
              <span>{t("heroSection.ctaLabel")}</span>

              <Arrow $rtl={isRTL}>
                <ArrowForwardIcon />
              </Arrow>
            </ShopButton>
          </ImageContainer>
        </ImageSide>
      </HeroContainer>
    </HeroBox>
  );
}

/* =========================
   ANIMATIONS
========================= */

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
`;

/* =========================
   HERO
========================= */

const HeroBox = styled.section`
  min-height: 600px;

  padding: 54px 32px;

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${colors.background};
  color: ${colors.text};

  @media (max-width: 1100px) {
    padding: 48px 28px;
  }

  @media (max-width: 900px) {
    min-height: auto;
    padding: 72px 24px;
  }

  @media (max-width: 600px) {
    padding: 56px 18px;
  }

  @media (max-width: 420px) {
    padding: 46px 14px;
  }
`;

const HeroContainer = styled.div`
  width: 100%;
  max-width: 1240px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);

  gap: clamp(42px, 6vw, 78px);

  align-items: center;

  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  @media (max-width: 600px) {
    gap: 42px;
  }
`;

/* =========================
   LEFT CONTENT
========================= */

const Content = styled.div`
  animation: ${fadeInUp} 0.8s ease-out both;

  text-align: center;

  max-width: 570px;

  @media (max-width: 900px) {
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
  }
`;

const Title = styled.h1`
  margin: 0 0 37px;

  max-width: 570px;

  color: ${colors.primary};

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(2.45rem, 4.2vw, 3.55rem);

  font-weight: 400;

  line-height: 1.06;

  letter-spacing: -0.025em;

  text-align: center;

  @media (max-width: 900px) {
    max-width: 700px;
  }

  @media (max-width: 600px) {
    margin-bottom: 20px;

    font-size: clamp(2rem, 9vw, 2.45rem);

    line-height: 1.1;
  }
`;

const Description = styled.p`
  max-width: 535px;

  margin: 0 0 37px;

  color: ${colors.textSecondary};

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: clamp(1rem, 1.4vw, 1.17rem);

  font-weight: 400;

  line-height: 1.78;

  text-align: center;

  @media (max-width: 600px) {
    margin-bottom: 23px;

    font-size: 0.96rem;

    line-height: 1.72;
  }
`;

const QualityTitle = styled.p`
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin: 0 0 21px;

  color: ${colors.accent};

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 0.78rem;

  font-weight: 500;

  letter-spacing: 0.11em;

  line-height: 1.4;

  text-align: start;

  text-transform: uppercase;

  @media (max-width: 600px) {
    gap: 8px;

    margin-bottom: 18px;

    font-size: 0.68rem;

    letter-spacing: 0.08em;
  }
`;

/* =========================
   IMAGE
========================= */

const ImageSide = styled.div`
  width: 100%;

  animation:
    ${fadeInUp}
    0.8s
    ease-out
    0.2s
    both;

  @media (max-width: 900px) {
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;

  width: 100%;

  overflow: hidden;

  background: ${colors.secondary};

  box-shadow:
    0 26px 65px rgba(7, 27, 27, 0.13),
    0 8px 22px rgba(7, 27, 27, 0.06);

  animation:
    ${floatAnimation}
    8s
    ease-in-out
    infinite;

  &::after {
    content: "";

    position: absolute;

    inset: 0;

    border: 1px solid rgba(255, 255, 255, 0.4);

    pointer-events: none;

    z-index: 2;
  }

  @media (max-width: 600px) {
    box-shadow:
      0 20px 45px rgba(7, 27, 27, 0.12),
      0 6px 18px rgba(7, 27, 27, 0.05);
  }
`;

const HeroImage = styled.img`
  display: block;
  width: 100%;

  height: clamp(470px, 46vw, 620px);
  aspect-ratio: 700 / 620;

  max-width: 100%;

  object-fit: cover;

  position: relative;

  transition:
    transform 0.9s cubic-bezier(0.2, 0.65, 0.25, 1);

  ${ImageContainer}:hover & {
    transform: scale(1.018);
  }

  @media (max-width: 900px) {
    height: min(68vw, 540px);
  }

  @media (max-width: 600px) {
    height: min(115vw, 470px);
  }

  @media (max-width: 420px) {
    height: 105vw;
    min-height: 350px;
  }
`;

/* =========================
   SHOP BUTTON
========================= */

const Arrow = styled.span`
  display: flex;

  svg {
    font-size: 10px;
  }

  transform: ${({ $rtl }) =>
    $rtl ? "rotate(180deg)" : "none"};
`;

const ShopButton = styled(Link)`
  position: absolute;
  right: 7%;
  border: 2px solid ${colors.accent};
  padding: 10px 15px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: ${colors.surface};
  text-decoration: none;
  background: rgba(7, 27, 27, 0.82);

  font-wieght: 500;
  font-size: 0.7rem;

  white-space: nowrap;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  z-index: 5;
  transition: color 0.25s ease, border-color 0.25s ease, gap 0.25s ease;

  &:hover {
    color: ${colors.primary};
    border-color: ${colors.accent};
    background: ${colors.accent};
    gap: 12px;
  }

  &:focus-visible {
    outline: 1px solid ${colors.surface};
    outline-offset: 5px;
  }

  /* RTL support */
  [dir="rtl"] & {
    left: auto;
    right: 7%;
  }

  @media (max-width: 700px) {
    left: auto;
    right: 50%;
    transform: translateX(50%);
    bottom: 30px;
    font-size: 0.7rem;

    /* RTL fix for mobile */
    [dir="rtl"] & {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      font-size: 10rem;
    }
  }

  @media (max-width: 420px) {
    bottom: 24px;
  }
`;
