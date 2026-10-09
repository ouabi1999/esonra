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
import { optimizeCloudinaryImage } from "../../../utilis/cloudinary";
import { colors } from "../../../utilis/colors";

const DesignSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const principles = [
    {
      icon: <DesignServicesIcon />,
      title: t("designSection.principles.minimalism.title"),
      description: t("designSection.principles.minimalism.description"),
    },
    {
      icon: <StarIcon />,
      title: t("designSection.principles.materials.title"),
      description: t("designSection.principles.materials.description"),
    },
    {
      icon: <SpaIcon />,
      title: t("designSection.principles.ambient.title"),
      description: t("designSection.principles.ambient.description"),
    },
  ];

  const imageURL =
    "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791561951/esonra_smart_tracking_concept_d36elo.webp";

  return (
    <DesignContainer maxWidth={false}>
      <DesignGrid container spacing={4} wrap="wrap-reverse">
        {/* BRAND IMAGE */}
        <Grid item xs={12} md={6}>
          <ImageWrapper>
            <img
              src={optimizeCloudinaryImage(imageURL, { width: 1200 })}
              alt="ESONRA design"
              fetchPriority="high"
              width="600"
              height="580"
              decoding="async"
            />
          </ImageWrapper>

          <div className="collection-button1">
            <CollectionButton
              dir={isRTL ? "rtl" : "ltr"}
              to="/about-us"
            >
              {t("designSection.catlabel", {
                defaultValue: "Discover our brand",
              })}

              <Arrow $rtl={isRTL}>
                <ArrowForwardIcon />
              </Arrow>
            </CollectionButton>
          </div>
        </Grid>

        {/* DESIGN CONTENT */}
        <Grid
          item
          xs={12}
          md={6}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Typography
            align="center"
            variant="h3"
            sx={{
              color: colors.text,
              mb: 6,
              fontFamily: "'Playfair Display', serif",
              fontSize: {
                xs: "2rem",
                md: "2.5rem",
              },
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
            }}
          >
            {t("designSection.title")}
          </Typography>

          {principles.map((principle, index) => (
            <DesignPrinciple key={index}>
              <PrincipleIcon>{principle.icon}</PrincipleIcon>

              <PrincipleContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text,
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
                    color: colors.textSecondary,
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

          <div className="collection-button2">
            <CollectionButton
              dir={isRTL ? "rtl" : "ltr"}
              to="/about-us"
            >
              {t("designSection.catlabel", {
                defaultValue: "Discover our brand",
              })}

              <Arrow $rtl={isRTL}>
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

/* ==========================================
   MAIN CONTAINER
========================================== */

const DesignContainer = styled(Container)`
  && {
    width: 100%;
    max-width: none;
    display: flex;
    justify-content: center;
    position: relative;
    padding: 54px 32px;
    background: ${colors.background};
    color: ${colors.text};
    overflow: hidden;
    isolation: isolate;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(
        circle at 8% 15%,
        rgba(24, 200, 120, 0.07),
        transparent 28%
      ),
      radial-gradient(
        circle at 92% 85%,
        rgba(12, 51, 53, 0.06),
        transparent 28%
      );
    pointer-events: none;
  }

  .collection-button1 {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }

  .collection-button2 {
    display: none;
  }

  @media (max-width: 900px) {
    .collection-button1 {
      display: flex;
      justify-content: center;
    }

    .collection-button2 {
      display: none;
    }
  }

  @media (max-width: 600px) {
    && {
      padding: 5rem 1rem;
    }
  }

  @media (max-width: 420px) {
    && {
      padding: 4rem 0.75rem;
    }
  }
`;

/* ==========================================
   GRID
========================================== */

const DesignGrid = styled(Grid)`
  position: relative;
  width: 100%;
  max-width: 1300px;
  z-index: 1;
  align-items: center;
`;

/* ==========================================
   IMAGE
========================================== */

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 600 / 580;
  margin: 0 auto;
  overflow: hidden;
  background: ${colors.secondary};
  border: 1px solid ${colors.border};

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  &:hover img {
    transform: scale(1.015);
  }
`;

/* ==========================================
   COLLECTION BUTTON
========================================== */

const Arrow = styled.span`
  display: flex;
  align-items: center;

  svg {
    font-size: 16px;
  }

  transform: ${({ $rtl }) =>
    $rtl ? "rotate(180deg)" : "none"};
`;

const CollectionButton = styled(Link)`
  border: 1px solid ${colors.accent};
  padding: 12px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: ${colors.primary};
  text-decoration: none;
  background: transparent;

  font-weight: 500;
  font-size: 0.7rem;
  white-space: nowrap;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    gap 0.25s ease;

  &:hover {
    color: ${colors.primary};
    border-color: ${colors.accentHover};
    background: ${colors.accent};
    gap: 12px;
  }

  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 5px;
  }
`;

/* ==========================================
   DESIGN PRINCIPLE
========================================== */

const DesignPrinciple = styled(Box)`
  padding: 0.75rem 0;
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 2.4rem;
  border-inline-start: 2px solid transparent;
  border-radius: 0 6px 6px 0;

  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: rgba(24, 200, 120, 0.045);
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

/* ==========================================
   PRINCIPLE ICON
========================================== */

const PrincipleIcon = styled(Box)`
  width: 44px;
  height: 44px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-inline-end: 1rem;
  margin-top: 1px;

  background: ${colors.surface};
  color: ${colors.accent};
  border: 1px solid ${colors.border};
  border-radius: 50%;

  box-shadow: 0 3px 12px rgba(7, 27, 27, 0.045);

  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;

  ${DesignPrinciple}:hover & {
    color: ${colors.primary};
    border-color: ${colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(7, 27, 27, 0.08);
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

/* ==========================================
   PRINCIPLE CONTENT
========================================== */

const PrincipleContent = styled(Box)`
  flex: 1;
  min-width: 0;
`;
