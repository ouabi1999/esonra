import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleCategory } from "../../../features/filterSlice";
import { Link } from "react-router-dom";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { optimizeCloudinaryImage } from "../../../utilis/cloudinary";
import { colors } from "../../../utilis/colors";

const CollectionSection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const collections = [
    {
      key: "keychain_trackers",
      image:
"https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791509858/esonra-keychain-trackers-category_rne5z5.webp",
      link: "/collections?category=keychain_trackers",
    },
    {
      key: "necklace_trackers",
      image:
        "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791509859/esonra-necklace-trackers-category_qaljrw.webp",
      link: "/collections?category=necklace_trackers",
    },
    {
      key: "card_trackers",
      image:
        "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1791509859/esonra-card-trackers-category_2_rmsfhq.webp",
      link: "/collections?category=card_trackers",
    },
  ];

  return (
    <Section>
      <Header>
        <bdi>
          <Eyebrow>{t("collectionSection.title")}</Eyebrow>
        </bdi>
      </Header>

      <CollectionGrid>
        {collections.map((collection, index) => (
          <CollectionLink
            to={collection.link}
            onClick={() => dispatch(toggleCategory(collection.key))}
            key={collection.key}
          >
            <ImageWrapper>
              <CollectionImage
                src={optimizeCloudinaryImage(collection.image, {
                  width: 800,
                })}
                alt={t(
                  `collectionSection.categories.${collection.key}.title`
                )}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />

              <Overlay />

              <CardContent>
                <CardNumber>0{index + 1}</CardNumber>

                <CardTitle>
                  {t(
                    `collectionSection.categories.${collection.key}.title`
                  )}
                </CardTitle>

                <bdi>
                  <Explore>
                    {t("collectionSection.catlabel")}
                    <TrendingFlatIcon
                      className="arrow-icon"
                      style={{
                        transform:
                          i18n.language === "ar"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </Explore>
                </bdi>
              </CardContent>
            </ImageWrapper>
          </CollectionLink>
        ))}
      </CollectionGrid>
    </Section>
  );
};

export default CollectionSection;

const Section = styled.section`
  background: ${colors.background};
  padding: 0 4vw;
`;

const Header = styled.div`
  max-width: 700px;
  margin: 0 auto 55px;
  text-align: center;
`;

const Eyebrow = styled.div`
  color: ${colors.secondary};
  font-family: Arial, sans-serif;
  font-size: clamp(35px, 2vw, 50px);
  letter-spacing: 3px;
  margin-bottom: 18px;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CollectionLink = styled(Link)`
  display: block;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 4px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 560px;
  overflow: hidden;
  background: ${colors.secondary};

  @media (max-width: 600px) {
    height: 470px;
  }

  &:hover img {
    transform: scale(1.04);
  }

  &:hover .arrow-icon {
    transform: translateX(5px);
  }
`;

const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 900ms cubic-bezier(0.2, 0.65, 0.25, 1);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(7, 27, 27, 0.02) 20%,
    rgba(7, 27, 27, 0.18) 50%,
    rgba(7, 27, 27, 0.88) 100%
  );
`;

const CardContent = styled.div`
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 30px;
  color: ${colors.surface};

  @media (max-width: 600px) {
    left: 22px;
    right: 22px;
    bottom: 24px;
  }
`;

const CardNumber = styled.div`
  margin-bottom: 12px;
  color: ${colors.accent};
  font-size: 10px;
  letter-spacing: 2px;
`;

const CardTitle = styled.h3`
  margin: 0;
    font-family: Arial, sans-serif;

  font-size: 38px;
  font-weight: 500;
  line-height: 1.1;

  @media (max-width: 600px) {
    font-size: 34px;
  }
`;

const Explore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 6px;
  margin-top: 15px;
  border-bottom: 1px solid ${colors.accent};

  color: ${colors.surface};
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  .arrow-icon {
    font-size: 15px;
    color: ${colors.accent};
    transition: transform 300ms ease;
  }
`;
