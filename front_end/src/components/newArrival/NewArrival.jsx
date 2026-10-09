import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { optimizeCloudinaryImage } from "../../utilis/cloudinary";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {colors} from "../../utilis/colors"
import "swiper/css";
import CurrencyPrice from "../../../common/CurrencyPrice";

function NewArrival({
  products = [],
  name,
  label,
  isAuto = false,
}) {
  const { t, i18n } = useTranslation();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const isArabic = i18n.dir() === "rtl";



  return (
    <Section dir="ltr">
      <Container>

        {/* ============================
            HEADER
        ============================ */}

        <Header>
          <Title>
            {t(`homePage.${name}`)}
          </Title>
        </Header>

        {/* ============================
            NAVIGATION
        ============================ */}

        <NavigationArea>
          <button
            ref={prevRef}
            type="button"
            className="best-sellers-prev"
            aria-label="Previous products"
            onClick={() => {
              swiperRef.current?.slidePrev();
            }}
          >
            <Arrow $direction="prev" />
          </button>

          <button
            ref={nextRef}
            type="button"
            className="best-sellers-next"
            aria-label="Next products"
            onClick={() => {
              swiperRef.current?.slideNext();
            }}
          >
            <Arrow $direction="next" />
          </button>
        </NavigationArea>

        {/* ============================
            PRODUCTS
        ============================ */}

        <SwiperWrapper>
          <Swiper
            className="mySwiper"
            loop={products.length > 4}
            autoplay={
              isAuto
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                  }
                : false
            }
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1.25}
            spaceBetween={16}
            breakpoints={{
              480: {
                slidesPerView: 1.6,
                spaceBetween: 18,
              },

              600: {
                slidesPerView: 2,
                spaceBetween: 20,
              },

              768: {
                slidesPerView: 3,
                spaceBetween: 22,
              },

              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },

              1440: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
            }}
          >
            {products.length > 0 ? (
              products.map((item, index) => {
                const mainSku = item.skuInfo?.[0];

                const image =
                  item.multimediaInfo?.main_image;

                const imageUrls =
                  item.multimediaInfo?.image_urls || [];

                const secondaryImage =
                  imageUrls.find(
                    (img) => img && img !== image
                  ) || image;

                const productName =
                  item.name?.[i18n.language] ||
                  item.name?.en ||
                  "ENSORA TRACKER";

                const ratings = item.ratings || [];

                const avgRating =
                  ratings.length > 0
                    ? (
                        ratings.reduce(
                          (total, rating) =>
                            total +
                            Number(rating.stars || 0),
                          0
                        ) / ratings.length
                      ).toFixed(1)
                    : null;

                const sellingPrice = Number(
                  mainSku?.sellingPrice || 0
                );

                const comparePrice = Number(
                  mainSku?.comparePrice || 0
                );

                const hasDiscount =
                  comparePrice > sellingPrice &&
                  sellingPrice > 0;

                const discountPercentage = hasDiscount
                  ? Math.round(
                      ((comparePrice - sellingPrice) /
                        comparePrice) *
                        100
                    )
                  : null;

                const hasFreeShipping =
                  item.available_shipping?.some(
                    (shipping) =>
                      shipping.type === "Free"
                  );

                return (
                  <SwiperSlide key={item.id}>
                    <ProductCard>

                      {/* ============================
                          IMAGE
                      ============================ */}

                      <ProductLink
                        to={`/product/${item.slug}`}
                      >
                        <ImageWrapper>

                          {/* PRIMARY IMAGE */}

                          <ProductImage
                            src={optimizeCloudinaryImage(
                              image,
                              {width: 800}
                            )}
                            alt={productName}
                            width="800"
                            height="976"
                            $secondary={false}
                            fetchpriority="high"
                          />

                          {/* SECONDARY IMAGE */}

                          {secondaryImage && (
                            <ProductImage
                              src={optimizeCloudinaryImage(
                                secondaryImage,
                                {width: 800}
                              )}
                              alt={`${productName} alternate view`}
                              fetchpriority="high"
                              width="800"
                              height="976"
                              $secondary
                            />
                          )}

                          {/* ============================
                              TOP LABELS
                          ============================ */}

                          <ProductLabels
                            $isArabic={isArabic}
                          >
                            {hasDiscount && (
                              <SaveLabel>
                                -{discountPercentage}%
                              </SaveLabel>
                            )}

                            {label && (
                              <Label>
                                {t(
                                  `homePage.${label}`
                                )}
                              </Label>
                            )}
                          </ProductLabels>

                         

                        

                         

                        </ImageWrapper>
                      </ProductLink>

                      {/* ============================
                          CENTERED PRODUCT INFO
                      ============================ */}

                      <ProductInfo>

                        <ProductName>
                          {productName}
                        </ProductName>

                        <PriceGroup>
                          <CurrentPrice>
                            <CurrencyPrice
                              price={sellingPrice}
                            />
                          </CurrentPrice>

                          {hasDiscount && (
                            <ComparePrice>
                              <CurrencyPrice
                                price={comparePrice}
                              />
                            </ComparePrice>
                          )}
                        </PriceGroup>
                       {/*  {avgRating && (
                          <Rating>
                            <StarIcon />

                            <span>
                              {avgRating}
                            </span>

                            <ReviewCount>
                              {ratings.length}
                            </ReviewCount>
                          </Rating>
                        )}
                        */}

                        {hasFreeShipping && (
                          <Shipping>
                            {t(
                              "common.free_shipping"
                            )}
                          </Shipping>
                        )}

                      </ProductInfo>

                    </ProductCard>
                  </SwiperSlide>
                );
              })
            ) : (
              <>
                {[1, 2, 3, 4, 5].map((item) => (
                  <SwiperSlide key={item}>
                    <SkeletonCard>

                      <SkeletonImage />

                      <SkeletonInfo>
                        <SkeletonName />

                        <SkeletonBottom>
                          <SkeletonPrice />
                          <SkeletonRating />
                        </SkeletonBottom>
                      </SkeletonInfo>

                    </SkeletonCard>
                  </SwiperSlide>
                ))}
              </>
            )}
          </Swiper>
        </SwiperWrapper>

      </Container>
    </Section>
  );
}

export default NewArrival;


/* SECTION */
const Section = styled.section`
  width: 100%;
  background: ${colors.background};
  padding: 96px 0 105px;
  overflow: hidden;

  @media (max-width: 600px) {
    padding: 56px 0 64px;
  }
`;

/* CONTAINER */
const Container = styled.div`
  width: min(1440px, calc(100% - 64px));
  margin: 0 auto;

  @media (max-width: 600px) {
    width: calc(100% - 32px);
  }
`;

/* HEADER */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 34px;

  @media (max-width: 600px) {
    margin-bottom: 24px;
  }
`;

/* TITLE */
const Title = styled.h2`
  margin: 0;
  color: ${colors.primary};
  font-family: Arial, sans-serif;

  font-size: clamp(1.4rem, 2vw, 3rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.04em;
  text-align: center;
  text-wrap: balance;
`;

/* NAVIGATION */
const NavigationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 20px;
  direction: ltr;

  button {
    position: relative;
    width: 42px;
    height: 42px;
    padding: 0;
    border: 1px solid ${colors.border};
    border-radius: 50%;
    background: ${colors.surface};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${colors.primary};
    transition:
      background 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease,
      transform 0.25s ease;

    &:hover {
      background: ${colors.accent};
      border-color: ${colors.accent};
      color: ${colors.primary};
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus-visible {
      outline: 2px solid ${colors.accent};
      outline-offset: 3px;
    }
  }

  @media (max-width: 400px) {
    display: none;
  }
`;

/* ARROW */
const Arrow = styled.span`
  width: 7px;
  height: 7px;
  border-top: 1px solid currentColor;
  border-right: 1px solid currentColor;

  transform: ${({ $direction }) =>
    $direction === "prev" ? "rotate(-135deg)" : "rotate(45deg)"};

  ${({ $direction }) =>
    $direction === "prev"
      ? "margin-left: 3px;"
      : "margin-right: 3px;"}
`;

/* SWIPER */
const SwiperWrapper = styled.div`
  width: 100%;

  .swiper {
    width: 100%;
    overflow: visible;
  }

  .swiper-wrapper {
    display: flex;
  }

  .swiper-slide {
    height: auto;
    flex-shrink: 0;
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
`;

/* PRODUCT CARD */
const ProductCard = styled.article`
  position: relative;
  width: 100%;
`;

/* PRODUCT LINK */
const ProductLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

/* IMAGE WRAPPER */
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 0.82;
  overflow: hidden;
  background: ${colors.surfaceHover || colors.background};
  isolation: isolate;
  cursor: pointer;
`;

/* PRODUCT IMAGE */
const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  opacity: ${({ $secondary }) => ($secondary ? 0 : 1)};
  transform: scale(1);

  ${ProductCard}:hover & {
    transform: scale(1.025);

    ${({ $secondary }) =>
      $secondary
        ? `
          opacity: 1;
        `
        : `
          opacity: 0;
        `}
  }

  @media (max-width: 768px) {
    transition: none;

    ${ProductCard}:hover & {
      transform: none;
      opacity: ${({ $secondary }) => ($secondary ? 0 : 1)};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* PRODUCT LABELS */
const ProductLabels = styled.div`
  position: absolute;
  top: 15px;

  ${({ $isArabic }) =>
    $isArabic
      ? "right: 15px;"
      : "left: 15px;"}

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  z-index: 4;
  pointer-events: none;
`;

/* PRODUCT LABEL */
const Label = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 25px;
  padding: 0 10px;
  background: ${colors.primary};
  color: ${colors.surface};
  font-family: "Inter", Arial, sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
`;

/* DISCOUNT LABEL */
const SaveLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 25px;
  padding: 0 10px;
  background: ${colors.accent};
  color: ${colors.primary};
  font-family: "Inter", Arial, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  white-space: nowrap;
`;

/* PRODUCT INDEX */
const ProductIndex = styled.span`
  position: absolute;
  right: 15px;
  bottom: 14px;
  z-index: 3;
  color: ${colors.surface};
  font-family: "Inter", Arial, sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.12em;
  mix-blend-mode: difference;
  pointer-events: none;
  transition: opacity 0.3s ease;

  ${ProductCard}:hover & {
    opacity: 0;
  }

  @media (max-width: 768px) {
    opacity: 0.8;
  }
`;

/* PRODUCT INFORMATION */
const ProductInfo = styled.div`
  padding-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* PRODUCT NAME */
const ProductName = styled.h3`
  margin: 0;
  max-width: 95%;
  color: ${colors.text};
  font-family: "Inter", Arial, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.005em;
  text-align: center;
  text-wrap: balance;
`;

/* PRICE GROUP */
const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 9px;
`;

/* CURRENT PRICE */
const CurrentPrice = styled.span`
  color: ${colors.primary};
  font-family: "Inter", Arial, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
`;

/* COMPARE PRICE */
const ComparePrice = styled.span`
  color: ${colors.textSecondary};
  font-family: "Inter", Arial, sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  text-decoration: line-through;
  white-space: nowrap;
`;

/* RATING */
const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 9px;
  color: ${colors.textSecondary};
  font-family: "Inter", Arial, sans-serif;
  font-size: 0.68rem;

  svg {
    width: 12px;
    height: 12px;
    color: ${colors.accent};
  }
`;

/* REVIEW COUNT */
const ReviewCount = styled.span`
  color: ${colors.textSecondary};

  &::before {
    content: "(";
  }

  &::after {
    content: ")";
  }
`;

/* FREE SHIPPING */
const Shipping = styled.div`
  margin-top: 8px;
  color: ${colors.success};
  font-family: "Inter", Arial, sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/* SKELETON CARD */
const SkeletonCard = styled.div`
  width: 100%;
`;

/* SKELETON IMAGE */
const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 0.82;
  background: ${colors.border};
  animation: pulse 1.7s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.55;
    }

    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* SKELETON INFORMATION */
const SkeletonInfo = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* SKELETON NAME */
const SkeletonName = styled.div`
  width: 62%;
  height: 10px;
  border-radius: 3px;
  background: ${colors.border};
`;

/* SKELETON PRICE ROW */
const SkeletonBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 13px;
`;

/* SKELETON PRICE */
const SkeletonPrice = styled.div`
  width: 65px;
  height: 9px;
  border-radius: 3px;
  background: ${colors.border};
`;

/* SKELETON RATING */
const SkeletonRating = styled.div`
  width: 38px;
  height: 9px;
  border-radius: 3px;
  background: ${colors.border};
`;
