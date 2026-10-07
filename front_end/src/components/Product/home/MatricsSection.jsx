import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import {optimizeCloudinaryVideo} from "../../../utilis/cloudinary"

const MetricsSection = () => {
  const { t, i18n } = useTranslation();

 const vedeoUrl = "https://res.cloudinary.com/dzpzy1o1y/video/upload/v1786567618/About_iiabi5.mp4"
  
  
  

  return (
    <Section>
      {/* =========================
          WHY CHOOSE ENOUZA
      ========================= */}
{/*
      <SectionHeader
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <SectionTitle>
          {t("matricsSection.why_us")}
        </SectionTitle>

        <TitleDecoration>
          <DecorationLine />
          <DecorationDot />
          <DecorationLine />
        </TitleDecoration>
      </SectionHeader>

      {/* =========================
          VIDEO
      ========================= */}

      <VideoSection
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
          <Video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Enouza luxury lighting and premium home decor"
          >
            <source
              src={optimizeCloudinaryVideo(  vedeoUrl, {width: 1600} )}
              type="video/mp4"
            />
          </Video>
        
        

        <VideoOverlay />

        <VideoContent>
          

          <VideoDescription>
            {t("matricsSection.description")}
          </VideoDescription>
        </VideoContent>

        <ShopButton  to={"/product/liora-marble-ambient-table-lamp"}>
          {t("common.buyNow")}

          <Arrow $rtl={i18n.dir() === "rtl"}>
            <ArrowForward />
          </Arrow>
        </ShopButton>
      </VideoSection>
    </Section>
  );
};

export default MetricsSection;

/* =========================
   COLORS
========================= */

const COLORS = {
  background: "#F7F5F0",
  white: "#FFFFFF",
  text: "#1D1C1A",
  muted: "#77736B",
  gold: "#B39A76",
  softGold: "#DED4C4",
  border: "#E4DED4",
};

/* =========================
   SECTION
========================= */

const Section = styled.section`
  width: 100%;
  background: ${COLORS.background};
`;

/* =========================
   HEADER
========================= */

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    margin-bottom: 55px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;

  color: ${COLORS.text};

  font-family: "Playfair Display", serif;
  font-size: clamp(1.4rem, 1vw, 2rem);
  font-weight: 400;

  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 1.3rem;
    letter-spacing: 0.08em;
  }
`;

/* =========================
   TITLE DECORATION
========================= */

const TitleDecoration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 22px;
`;

const DecorationLine = styled.span`
  width: 55px;
  height: 1px;

  background: ${COLORS.softGold};

  @media (max-width: 480px) {
    width: 40px;
  }
`;

const DecorationDot = styled.span`
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: ${COLORS.gold};
`;

/* =========================
   VIDEO SECTION
========================= */

const VideoSection = styled.div`
  position: relative;

  width: 100%;
  height: 580px;

  overflow: hidden;

  @media (max-width: 700px) {
    height: 500px;
  }

  @media (max-width: 500px) {
    height: 450px;
  }
`;

/* =========================
   VIDEO
========================= */

const Video = styled.video`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
`;

/*
 * Lightweight placeholder.
 *
 * It keeps the section's exact dimensions while the video
 * is not loaded, preventing layout shifts.
 */
const VideoPlaceholder = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      120deg,
      #d9d0c2 0%,
      #eee8df 45%,
      #d4c8b8 100%
    );
`;

/* =========================
   VIDEO OVERLAY
========================= */

const VideoOverlay = styled.div`
  position: absolute;

  inset: 0;

  background: rgba(0, 0, 0, 0.3);

 
`;

/* =========================
   VIDEO CONTENT
========================= */

const VideoContent = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  width: min(700px, 85%);

  text-align: center;

  color: white;

  z-index:1;
`;

const VideoTitle = styled.h2`
  margin: 0;

  font-family: "Playfair Display", serif;

  font-size: clamp(2rem, 4vw, 3.8rem);

  font-weight: 400;

  line-height: 1.15;

  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;

const VideoDescription = styled.p`
  margin: 20px auto 0;

  max-width: 580px;

  font-family: "Playfair Display", serif;
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);

  line-height: 1.9;

  opacity: 0.92;

  @media (max-width: 500px) {
    font-size: 0.75rem;

    margin-top: 15px;
  }
`;

/* =========================
   BUTTON
========================= */

const ShopButton = styled(Link)`
  position: absolute;

  right: 7%;
  bottom: 20px;

  padding: 15px 20px;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: white;

  text-decoration: none;

  font-family: Arial, sans-serif;

  font-size: 0.8rem;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  transition: 0.25s ease;

  z-index: 1;

  &:hover {
    color: #d4bd91;
  }

  @media (max-width: 700px) {
    right: 50%;

    transform: translateX(50%);

    bottom: 30px;

    font-size: 0.7rem;
  }
`;

/* =========================
   ARROW
========================= */

const Arrow = styled.span`
  display: flex;

  transform: ${({ $rtl }) =>
    $rtl ? "rotate(180deg)" : "none"};

  svg {
    font-size: 17px;
  }
`;