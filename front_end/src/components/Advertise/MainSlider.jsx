
import React, { useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleCategory } from "../../features/filterSlice";
import {
  optimizeCloudinaryImage,
  optimizeCloudinaryVideo,
} from "../../utilis/cloudinary";
import { colors } from "../../utilis/colors";

const MainSlider = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  const videoUrl =
    "https://res.cloudinary.com/dzpzy1o1y/video/upload/v1790536327/Aure_Portable_Lamp_Travertine_Stone_Linen_-_Blossholm_3_c7eahz.mp4";

  const posterUrl =
    "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791561476/esonra_cover_1_gvhdsk.webp";

  const optimizedPoster = optimizeCloudinaryImage(posterUrl, {
    width: 1820,
  });

  return (
    <Container>
      <video
        className="video"
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={optimizedPoster}
        aria-label="ESONRA smart tracking products"
      >
        <source
          src={optimizeCloudinaryVideo(videoUrl)}
          type="video/mp4"
        />
      </video>

      <Poster
        src={optimizedPoster}
        alt="ESONRA product collection"
        width="1200"
        height="675"
        className="poster"
        fetchPriority="high"
        decoding="async"
      />

      <Overlay>
        <h1>{t("mainSlider.title")}</h1>
        <span>{t("mainSlider.description")}</span>
        <bdi>
          <h5>{t("mainSlider.welcome")}</h5>
        </bdi>
      </Overlay>

      <ShopNowButton
        to="/collections?category=table_lamps"
        onClick={() => dispatch(toggleCategory("table_lamps"))}
      >
        {t("profile.start_shopping")}
      </ShopNowButton>
    </Container>
  );
};

export default MainSlider;

/* HERO CONTAINER */

const Container = styled.section`
  position: relative;
  isolation: isolate;
  width: 100%;
  min-width: 0;
  height: 550px;
  overflow: hidden;
  background: ${colors.primary};

  video,
  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    display: none;
  }

  /* Subtle contrast for text readability */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(7, 27, 27, 0.16) 0%,
      rgba(7, 27, 27, 0.34) 55%,
      rgba(7, 27, 27, 0.5) 100%
    );
  }

  @media (max-width: 850px) {
    height: 500px;
  }

  @media (max-width: 445px) {
    height: 450px;

    .poster {
      display: none;
    }

    video {
      display: block;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    video {
      display: none;
    }

    .poster {
      display: block;
    }
  }
`;

/* POSTER */

const Poster = styled.img`
  z-index: -1;
`;

/* HERO CONTENT */

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: min(90%, 760px);
  transform: translate(-50%, -50%);
  color: ${colors.surface};
  text-align: center;
font-family: Arial, sans-serif;


  h1 {
    margin: 0 0 16px;
    font-size: clamp(30px, 4.5vw, 54px);
    line-height: 1.15;
    font-weight: 500;
    text-wrap: balance;
  }

  span {
    display: block;
    max-width: 620px;
    margin: 0 auto;
    font-size: clamp(14px, 1.5vw, 17px);
    line-height: 1.7;
    text-wrap: balance;
  }

  h5 {
    margin: 20px 0 0;
    color: ${colors.accent};
    font-family: "Inter", Arial, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    line-height: 1.6;
    text-transform: uppercase;
  }

  @media (max-width: 445px) {
    width: 88%;

    h1 {
      font-size: clamp(27px, 8vw, 36px);
    }

    span {
      font-size: 14px;
      line-height: 1.6;
    }
  }
`;

/* CTA BUTTON */

const ShopNowButton = styled(Link)`
  position: absolute;
  top: 88%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 22px;
  box-sizing: border-box;
  border: 1px solid ${colors.accent};
  border-radius: 3px;
  background: ${colors.accent};
  color: ${colors.surface};
  font-family: "Inter", Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${colors.accentHover};
    border-color: ${colors.accentHover};
    transform: translate(-50%, calc(-50% - 2px));
  }

  &:focus-visible {
    outline: 2px solid ${colors.surface};
    outline-offset: 4px;
  }

  @media (max-width: 445px) {
    top: 86%;
    min-height: 42px;
    padding: 9px 18px;
    font-size: 10px;
  }
`;
