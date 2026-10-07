import React from "react";
import styled from "styled-components";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import StarIcon from "@mui/icons-material/Star";
import SpaIcon from "@mui/icons-material/Spa";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {optimizeCloudinaryImage} from "../../../utilis/cloudinary"



// ==========================================
// COLORS
// ==========================================

const COLORS = {
  cream: "#F7F5F0",
  white: "#FFFFFF",
  ink: "#1D1C1A",
  muted: "#77736B",
  gold: "#B39A76",
  softGold: "#DED4C4",
  border: "#E4DED4",
};



// ==========================================
// COMPONENT
// ==========================================

const DesignSection = () => {
  const { t, i18n } = useTranslation();



  // ========================================
  // DESIGN PRINCIPLES
  // ========================================

  const principles = [
    {
      icon: <DesignServicesIcon />,
      title: t(
        "designSection.principles.minimalism.title"
      ),
      description: t(
        "designSection.principles.minimalism.description"
      ),
    },
    {
      icon: <StarIcon />,
      title: t(
        "designSection.principles.materials.title"
      ),
      description: t(
        "designSection.principles.materials.description"
      ),
    },
    {
      icon: <SpaIcon />,
      title: t(
        "designSection.principles.ambient.title"
      ),
      description: t(
        "designSection.principles.ambient.description"
      ),
    },
  ];

  
 

  // ========================================
  // PRODUCTS
  // ========================================



  // ========================================
  // RETURN
  // ========================================
  const ImageuRL ="https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791234356/enouza_lighting_sketch_web_zdo8oe.jpg"

  return (
    <DesignContainer maxWidth={false}>
      <DesignGrid
        container
        spacing={2}
        wrap="wrap-reverse"
      >
        {/* ==================================
            PRODUCT IMAGE SLIDER
        ================================== */}

        <Grid item xs={12} md={6}>
            <ImageWrapper>
                

                  

                    <div>
                      <img
                        src= {optimizeCloudinaryImage(ImageuRL, {width: 1200})}
                        alt={
                         
                          "Luxury lamp DESIGN"
                        }
                         fetchpriority="high"
                        width="600"
                        height="580"
                        style={{
                          width: "100%",
                          height: "100%",
                          maxHeight: "580px",
                          maxWidth: "600px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                

            
            </ImageWrapper>
            <div
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "600px",
                maxWidth: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: COLORS.muted,
                }}
              />
            </div>
            {/* ==================================
                  DISCOVER COLLECTION
              ================================== */}
               <div className="collection-button1">
              <CollectionButton
                dir={
                  i18n.dir() === "rtl"
                    ? "rtl"
                    : "ltr"
                }
                as={Link}
                to="/about-us"
              >
                {t(
                  "designSection.catlabel",
                  {
                    defaultValue:
                      "Discover our brand",
                  }
                )}

                <Arrow
                  $rtl={i18n.dir() === "rtl"}
                >
                  <ArrowForwardIcon />
                </Arrow>
              </CollectionButton>
              </div>
        </Grid>

        {/* ==================================
            DESIGN CONTENT
        ================================== */}

        <Grid
          item
          xs={12}
          md={6}
          dir={
            i18n.dir() === "rtl"
              ? "rtl"
              : "ltr"
          }
        >
          <Typography
            align="center"
            variant="h3"
            sx={{
              color: COLORS.ink,
              mb: 6,
              fontFamily:
                "'Playfair Display', serif",

              fontSize: {
                xs: "2rem",
                md: "2.5rem",
              },

              fontWeight: 400,

              lineHeight: 1.15,

              letterSpacing: "-0.025em",
            }}
          >
            {t("designSection.title")}
          </Typography>

          {principles.map((principle, index) => (
            <DesignPrinciple key={index}>
              <PrincipleIcon>
                {principle.icon}
              </PrincipleIcon>

              <PrincipleContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.ink,

                    mb: 0.8,

                    fontSize: {
                      xs: "0.95rem",
                      md: "1rem",
                    },

                    fontWeight: 600,

                    letterSpacing: "0.01em",

                    lineHeight: 1.35,
                  }}
                >
                  {principle.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: COLORS.muted,

                    fontSize: {
                      xs: "0.83rem",
                      md: "0.86rem",
                    },

                    lineHeight: 1.75,
                  }}
                >
                  {principle.description}
                </Typography>
              </PrincipleContent>
            </DesignPrinciple>
          ))}
            {/* ==================================
                  DISCOVER COLLECTION
              ================================== */}
               <div className="collection-button2">
              <CollectionButton
                dir={
                  i18n.dir() === "rtl"
                    ? "rtl"
                    : "ltr"
                }
                as={Link}
                to="/about-us"
              >
                {t(
                  "designSection.catlabel",
                  {
                    defaultValue:
                      "Discover our brand",
                  }
                )}

                <Arrow
                  $rtl={i18n.dir() === "rtl"}
                >
                  <ArrowForwardIcon />
                </Arrow>
              </CollectionButton>
              </div>
        </Grid>
      </DesignGrid>
    </DesignContainer>
  );
};

export default DesignSection;

// ==========================================
// MAIN CONTAINER
// ==========================================

const DesignContainer = styled(Container)`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  padding: 54px 32px;

  background: ${COLORS.cream};

  color: ${COLORS.ink};

  overflow: hidden;

  /* very subtle luxury texture */
  &:before {
    content: "";

    position: absolute;

    inset: 0;

    background:
      radial-gradient(
        circle at 8% 15%,
        rgba(222, 212, 196, 0.32),
        transparent 24%
      ),
      radial-gradient(
        circle at 92% 85%,
        rgba(222, 212, 196, 0.22),
        transparent 24%
      );

    pointer-events: none;
  }


 .collection-button1{
      display:flex;
      justify-content:center;
      padding-top:20px;

  
  }

  .collection-button2{
      display:none;

  }

  @media (max-width: 900px) {
      .collection-button1{
      display:flex;
      justify-content:center;
      
      }
       .collection-button2{
      display:none;
    
      
      }
           
  }

  @media (max-width: 600px) {
    padding: 5rem 1rem !important;
  }

  @media (max-width: 420px) {
    padding: 4rem 0.75rem !important;
  }

 
`;

// ==========================================
// GRID
// ==========================================

const DesignGrid = styled(Grid)`
  position: relative;

  max-width: 1300px;

  z-index: 1;

  align-items: center;
`;

// ==========================================
// IMAGE WRAPPER
// ==========================================

const ImageWrapper = styled.div`
  position: relative;

  width: 100%;

  max-width: 600px;

  margin: 0 auto;

  overflow: hidden;

  background: ${COLORS.white};

  

  img {
    width: 100%;

    display: block;

    object-fit: cover;

    transition: transform 0.8s ease;
  }

  &:hover img {
    transform: scale(1.015);
  }
`;

// ==========================================
// COLLECTION BUTTON
// ==========================================

const Arrow = styled.span`
  display: flex;

  svg {
    font-size: 10px;
  }

  transform: ${({ $rtl }) =>
    $rtl ? "rotate(180deg)" : "none"};
`;

const CollectionButton = styled(Link)`
  border: 2px solid #000000;
  padding:10px 15px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
 
  gap: 9px;
  color: #000000;
  text-decoration: none;
  background: #00000000;
 
  font-wieght:500;
    font-size: 0.7rem;

  white-space: nowrap; /* ✅ fixed */
  letter-spacing: 0.12em;
  text-transform: uppercase;
  z-index: 5; /* ✅ prevents hiding behind image */
  transition: color 0.25s ease, border-color 0.25s ease, gap 0.25s ease; /* ✅ explicit + gap */

  &:hover {
    color: #000000;
    border-color: #000000;
    gap: 12px; /* optional: makes arrow move on hover */
  }

  &:focus-visible {
    outline: 1px solid white;
    outline-offset: 5px;
  }


 
`;
// ==========================================
// DESIGN PRINCIPLE
// ==========================================

const DesignPrinciple = styled(Box)`
  padding: 0.5rem 0;

  position: relative;

  display: flex;

  align-items: flex-start;

  margin-bottom: 2.4rem;


  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;

  &:hover {
    border-inline-start-color: ${COLORS.gold};

    background: rgba(255, 255, 255, 0.42);

    transform: translateX(3px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    margin-bottom: 2rem;

    padding-inline-start: 0.9rem;
  }
`;

// ==========================================
// PRINCIPLE ICON
// ==========================================

const PrincipleIcon = styled(Box)`
  width: 44px;

  height: 44px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-inline-end: 1rem;

  margin-top: 1px;

  background: ${COLORS.white};

  color: ${COLORS.gold};

  border: 1px solid ${COLORS.softGold};

  border-radius: 50%;

  box-shadow:
    0 3px 12px rgba(29, 28, 26, 0.045);

  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  ${DesignPrinciple}:hover & {
    color: ${COLORS.ink};

    border-color: ${COLORS.gold};

    transform: translateY(-2px);

    box-shadow:
      0 6px 16px rgba(29, 28, 26, 0.07);
  }

  svg {
    width: 19px;

    height: 19px;
  }

  @media (max-width: 600px) {
    width: 40px;

    height: 40px;

    margin-inline-end: 0.85rem;

    svg {
      width: 17px;

      height: 17px;
    }
  }
`;

// ==========================================
// PRINCIPLE CONTENT
// ==========================================

const PrincipleContent = styled(Box)`
  flex: 1;

  min-width: 0;
`;
