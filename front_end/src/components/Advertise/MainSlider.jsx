import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleCategory } from "../../features/filterSlice";
  import { optimizeCloudinaryImage, optimizeCloudinaryVideo } from "../../utilis/cloudinary";

import { Link } from "react-router-dom";
const MainSlider = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  const videoUrl = "https://res.cloudinary.com/dzpzy1o1y/video/upload/v1790536327/Aure_Portable_Lamp_Travertine_Stone_Linen_-_Blossholm_3_c7eahz.mp4"

  // Optimized Cloudinary poster
  const posterUrl =
    "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1790529844/ChatGPT_Image_Sep_27_2026_07_23_04_PM_csaple.png";

 




  return (
    <Container>
        <video
        className="video"
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={optimizeCloudinaryImage(posterUrl, {width: 1820})}
          aria-label="Enouza luxury home lighting and interior design"
        >
          <source src={optimizeCloudinaryVideo(videoUrl)} type="video/mp4" />
        </video>
   
      <Poster
        src={optimizeCloudinaryImage(
          posterUrl, {width: 1820}
         
        )}
          alt="Enouza luxury home lighting and interior design"
          width="1200"
          height="675"
          className="poster"
          fetchpriority="high"
        />
 
      <Overlay>
        <h1>{t("mainSlider.title")}</h1>

        <span>{t("mainSlider.description")}</span>

        <bdi>
          <h5>{t("mainSlider.welcome")}</h5>
        </bdi>
      </Overlay>
      <ShopNowButton
       to = "/collections?category=table_lamps"
       onClick={()=> dispatch(toggleCategory("table_lamps"))}>
        {t("profile.start_shopping")}
      </ShopNowButton>
    </Container>
  );
};

export default MainSlider;

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 200px;
  height: 550px;
  overflow: hidden;
  video{
    display:none;
   
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media only screen and (max-width: 850px) {
    min-width: 315px;
    height: 500px;
  }

  @media only screen and (max-width: 445px) {
    min-width: 290px;
    height: 450px;

    img{
    display:none;
    }
    video{
    display:block;
     width: 100%;
    height: 100%;
    object-fit: cover;
    }
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 1;

  width: 90%;

  color: #fff;
  text-align: center;

  font-family: "Playfair Display", serif;

  h1 {
    margin: 0 0 12px;
  }

  span {
    display: block;
  }

  h5 {
    margin-top: 18px;
    text-transform: uppercase;
  }
`;

const ShopNowButton = styled(Link)` 
  color: #ffffff;
    font-family: "Playfair Display", serif;

  padding: 8px 15px;
  border: 2px solid #ffffff;
  position: absolute;
  cursor: pointer;
  text-wrap: nowrap;
  text-transform: uppercase;
  font-size:14px;
   z-index: 1;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    &:hover {
    color: #e6e6e6;
    border: 2px solid #e6e6e6;

}
    

`