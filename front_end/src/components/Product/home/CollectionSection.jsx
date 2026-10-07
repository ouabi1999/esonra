import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleCategory } from "../../../features/filterSlice"
import { Link } from "react-router-dom";
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { optimizeCloudinaryImage } from "../../../utilis/cloudinary"
const CollectionSection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()

  const collections = [
    {
      key: "wall_lamps",
      image: "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1790005276/nano-banana-free-nano-pro-6JWakrel8kripcoDnlxNnx_jzugzs.png",
      link: "/collections?category=wall_lamps",
    },
    {
      key: "pendant_lights",
      image: "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1789772276/enouza/products/cf9x7hm6kfetpdhrqusc.png",
      link: "/collections?category=pendant_lights",
    },
    {
      key: "table_lamps",
      image: "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1789477155/enouza/products/rjhymixoknxkfjpywh2c.png",
      link: "/collections?category=table_lamps",
    },
    /*
    {
      key: "ceiling_lamps",
      image: "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1790548888/ChatGPT_Image_Sep_28_2026_12_39_52_AM_snui6f.png",
      link: "/collections?category=ceiling-lamps",
    },*/
  ];

  return (
    <Section>
      <Header>
        <bdi>
          <Eyebrow>
            {t("collectionSection.title")}
          </Eyebrow>
        </bdi>


      </Header>

      <CollectionGrid>
        {collections.map((collection, index) => (
          <Link
            to={collection.link}
            onClick={() => dispatch(toggleCategory(collection.key))

            }
            key={collection.key}
          >
            <ImageWrapper>
              <CollectionImage
                src={optimizeCloudinaryImage(collection.image, { width: 800 })}
                alt={t(
                  `collectionSection.categories.${collection.key}.title`
                )}
                fetchpriority="high"
              />

              <Overlay />

              <CardContent>
                <CardNumber>
                  0{index + 1}
                </CardNumber>

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
                        transform: i18n.language === "ar" ? "rotate(180deg)" : "none",
                      }}
                    />
                  </Explore>
                </bdi>
              </CardContent>
            </ImageWrapper>
          </Link>
        ))}
      </CollectionGrid>
    </Section>
  );
};

export default CollectionSection;

const Section = styled.section`
  background: #f7f5f0;
  padding: 0px 4vw 0px;
`;

const Header = styled.div`
  max-width: 700px;
  margin: 0 auto 55px;
  text-align: center;
`;

const Eyebrow = styled.div`
  color: #9b815f;
  font-family: Arial, sans-serif;
  font-size: clamp(35px, 2vw, 50px);
  letter-spacing: 3px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  color: #171614;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(40px, 4vw, 50px);
  font-weight: 500;
  line-height: 1;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CollectionCard = styled.button`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 560px;
  overflow: hidden;

  @media (max-width: 600px) {
    height: 470px;
  }

  &:hover img {
    transform: scale(1.04);
  }

  &:hover span:last-child {
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
    rgba(0, 0, 0, 0) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

const CardContent = styled.div`
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 30px;
  color: #fff;
`;

const CardNumber = styled.div`
  margin-bottom: 12px;
  font-size: 10px;
  letter-spacing: 2px;
  opacity: 0.7;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 38px;
  font-weight: 500;
  line-height: 1;
`;

const CardDescription = styled.p`
  max-width: 260px;
  margin: 12px 0 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.6;
  opacity: 0.85;
`;

const Explore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 6px;
  margin-top:15px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.65);

  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  transition: transform 300ms ease;
  .arrow-icon{
  font-size: 15px;
  }
`;

