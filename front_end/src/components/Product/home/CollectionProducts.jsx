import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CurrencyPrice from "../../../../common/CurrencyPrice";

function CollectionProducts({
  products,
  scrollTo,
  columsNumber,
  placeItems,
}) {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.dir() === "rtl";

  const optimizeCloudinaryImage = (url, width = 600) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    if (!url.includes("/image/upload/")) return url;

    return url.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width}/`
    );
  };

  return (
    <ProductContainer
      colums_number={columsNumber}
      place_items={placeItems}
    >
      <div className="grid-container">
        {products?.flatMap((item) => {
          const skus = Array.isArray(item.skuInfo)
            ? item.skuInfo
            : [];

          return skus.map((skuItem, skuIndex) => {
            /* =========================
               SKU PRICE
            ========================= */

            const sellingPrice = Number(
              skuItem?.sellingPrice || 0
            );

            const comparePrice = Number(
              skuItem?.comparePrice || 0
            );

            const hasDiscount =
              comparePrice > sellingPrice &&
              sellingPrice > 0;

            /* =========================
               SKU IMAGE
            ========================= */

            const skuAttributes =
              skuItem?.attributes || {};

            const skuImage = Object.values(
              skuAttributes
            )
              .map(
                (attribute) => attribute?.image
              )
              .find((image) => image);

            const image =
              skuImage ||
              item.multimediaInfo?.main_image;

            /* =========================
               PRODUCT NAME
            ========================= */

            const language = i18n.language;

            const productName =
              item.name?.[language] ||
              item.name?.en ||
              "Product";

            /* =========================
               SKU VARIATION
            ========================= */

            const skuVariation = Object.values(
              skuAttributes
            )
              .map(
                (attribute) => attribute?.value
              )
              .filter(Boolean)
              .join(" • ");

            /* =========================
               SECONDARY IMAGE
            ========================= */

            const imageUrls = Array.isArray(
              item.multimediaInfo?.image_urls
            )
              ? item.multimediaInfo.image_urls
              : [];

            const secondaryImage =
              imageUrls.find(
                (img) => img && img !== image
              ) || null;

            /* =========================
               DISCOUNT
            ========================= */

            const discountPercentage =
              hasDiscount
                ? Math.round(
                    ((comparePrice -
                      sellingPrice) /
                      comparePrice) *
                      100
                  )
                : 0;

            /* =========================
               SHIPPING
            ========================= */

            const shippingOptions =
              item?.available_shipping;

            const hasFreeShipping =
              Array.isArray(shippingOptions)
                ? shippingOptions.some(
                    (shipping) => {
                      if (
                        typeof shipping ===
                        "string"
                      ) {
                        return shipping
                          .toLowerCase()
                          .includes("free");
                      }

                      return (
                        shipping?.free === true ||
                        shipping?.is_free ===
                          true ||
                        String(
                          shipping?.price ?? ""
                        ) === "0"
                      );
                    }
                  )
                : typeof shippingOptions ===
                    "string"
                  ? shippingOptions
                      .toLowerCase()
                      .includes("free")
                  : false;

            /* =========================
               RATINGS
            ========================= */

            const sumRatings =
              item.ratings || [];

            const avgRating =
              sumRatings.length > 0
                ? (
                    sumRatings.reduce(
                      (total, r) =>
                        total +
                        Number(
                          r.stars || 0
                        ),
                      0
                    ) /
                    sumRatings.length
                  ).toFixed(1)
                : null;

            /* =========================
               ORDERS
            ========================= */

            const ordersCount =
              (item?.orders?.length || 0) +
              (item?.ratings?.length || 0);

            /*
             * This index is used only for the
             * visual number on the product image.
             */
            const index = skuIndex;

            return (
              <ProductCard key={`${item.id}-${skuIndex}`}>
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
                        800
                      )}
                      alt={productName}
                      loading="lazy"
                      decoding="async"
                      width="800"
                      height="976"
                      $secondary={false}
                    />

                    {/* SECONDARY IMAGE */}

                    {secondaryImage && (
                      <ProductImage
                        src={optimizeCloudinaryImage(
                          secondaryImage,
                          800
                        )}
                        alt={`${productName} alternate view`}
                        loading="lazy"
                        decoding="async"
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
                        <bdi>
                        <SaveLabel>
                          -{discountPercentage}%
                        </SaveLabel>
                        </bdi>
                      )}

                       
                      
                    </ProductLabels>

                   
                  </ImageWrapper>
                </ProductLink>

                {/* ============================
                    PRODUCT INFO
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

                  {avgRating && (
                    <Rating>
                      <span>★</span>

                      <span>
                        {avgRating}
                      </span>

                      <ReviewCount>
                        {sumRatings.length}
                      </ReviewCount>
                    </Rating>
                  )}

                  {hasFreeShipping && (
                    <Shipping>
                      {t(
                        "common.free_shipping"
                      )}
                    </Shipping>
                  )}
                </ProductInfo>
              </ProductCard>
            );
          });
        })}
      </div>

      <div ref={scrollTo} />
    </ProductContainer>
  );
}

export default CollectionProducts;

/* =========================================================
   MAIN CONTAINER
========================================================= */

const ProductContainer = styled.div`
  width: 100%;

  font-family: Arial, sans-serif;

  .grid-container {
    width: min(
      1300px,
      calc(100% - 40px)
    );

    margin: 0 auto;

    display: grid;

    grid-template-columns: repeat(
      ${(props) => props.colums_number},
      minmax(0, 1fr)
    );

    gap: 30px 20px;

    align-items: start;
  }

  @media (max-width: 1200px) {
    .grid-container {
      grid-template-columns: repeat(
        4,
        minmax(0, 1fr)
      );

      gap: 28px 16px;
    }
  }

  @media (max-width: 950px) {
    .grid-container {
      grid-template-columns: repeat(
        3,
        minmax(0, 1fr)
      );

      gap: 28px 14px;
    }
  }

  @media (max-width: 730px) {
    .grid-container {
      grid-template-columns: repeat(
        2,
        minmax(0, 1fr)
      );

      gap: 25px 10px;

      padding: 6px;
    }
  }

  @media (max-width: 490px) {
    .grid-container {
      gap: 22px 7px;

      padding: 4px;
    }
  }
`;

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = styled.article`
  width: 100%;

  position: relative;
`;

/* =========================================================
   PRODUCT LINK
========================================================= */

const ProductLink = styled(Link)`
  display: block;

  color: inherit;

  text-decoration: none;
`;

/* =========================================================
   IMAGE
========================================================= */

const ImageWrapper = styled.div`
  position: relative;

  width: 100%;

  aspect-ratio: 0.82;

  overflow: hidden;

  background: #ebe7df;

  isolation: isolate;

  cursor: pointer;
`;

const ProductImage = styled.img`
  position: absolute;

  inset: 0;

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    opacity 0.8s
      cubic-bezier(
        0.16,
        1,
        0.3,
        1
      ),
    transform 1.1s
      cubic-bezier(
        0.16,
        1,
        0.3,
        1
      );

  opacity: ${({ $secondary }) =>
    $secondary ? 0 : 1};

  transform: scale(1);

  ${ProductCard}:hover & {
    transform: scale(1.08);

  }

  @media (max-width: 768px) {
    transition: none;

    ${ProductCard}:hover & {
      transform: none;

      opacity: ${({ $secondary }) =>
        $secondary ? 0 : 1};
    }
  }
`;

/* =========================================================
   PRODUCT LABELS
========================================================= */

const ProductLabels = styled.div`
  position: absolute;

  top: 15px;

  ${({ $isArabic }) =>
    $isArabic
      ? `
        right: 15px;
      `
      : `
        left: 15px;
      `}

  display: flex;

  align-items: center;

  gap: 7px;

  z-index: 4;

  pointer-events: none;
`;

const Label = styled.span`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  min-height: 25px;

  padding: 0 10px;

  background: rgba(
    37,
    34,
    31,
    0.94
  );

  color: #ffffff;

  font-family: Arial, sans-serif;

  font-size: 0.58rem;

  font-weight: 500;

  letter-spacing: 0.11em;

  line-height: 1;

  text-transform: uppercase;

  white-space: nowrap;
`;

const SaveLabel = styled.span`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  min-height: 25px;

  padding: 0 10px;

  background: #ad9270;

  color: #ffffff;

  font-family: Arial, sans-serif;

  font-size: 0.58rem;

  font-weight: 500;

  letter-spacing: 0.09em;

  line-height: 1;

  white-space: nowrap;
`;

/* =========================================================
   PRODUCT INDEX
========================================================= */

const ProductIndex = styled.span`
  position: absolute;

  right: 15px;
  bottom: 14px;

  z-index: 3;

  color: rgba(
    255,
    255,
    255,
    0.85
  );

  font-family: Arial, sans-serif;

  font-size: 0.55rem;

  font-weight: 400;

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

/* =========================================================
   PRODUCT INFO
========================================================= */

const ProductInfo = styled.div`
  padding-top: 20px;

  text-align: center;

  display: flex;

  flex-direction: column;

  align-items: center;
`;

const ProductName = styled.h3`
  margin: 0;

  max-width: 95%;

  color: #292622;

  font-family:
    Arial,
    sans-serif;

  font-size: 0.82rem;

  font-weight: 500;

  line-height: 1.5;

  letter-spacing: 0.005em;

  text-align: center;
`;

/* =========================================================
   PRICE
========================================================= */

const PriceGroup = styled.div`
  display: flex;

  align-items: baseline;

  justify-content: center;

  gap: 9px;

  margin-top: 9px;
`;

const CurrentPrice = styled.span`
  color: #25221f;

  font-family:
    Arial,
    sans-serif;

  font-size: 0.82rem;

  font-weight: 600;

  letter-spacing: 0.01em;

  white-space: nowrap;
`;

const ComparePrice = styled.span`
  color: #aaa39b;

  font-family:
    Arial,
    sans-serif;

  font-size: 0.68rem;

  font-weight: 400;

  text-decoration: line-through;

  white-space: nowrap;
`;

/* =========================================================
   RATING
========================================================= */

const Rating = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 4px;

  margin-top: 9px;

  color: #777067;

  font-family: Arial, sans-serif;

  font-size: 0.62rem;

  svg {
    width: 11px;
    height: 11px;

    color: #a58c68;
  }
`;

const ReviewCount = styled.span`
  color: #aaa29a;

  &::before {
    content: "(";
  }

  &::after {
    content: ")";
  }
`;

/* =========================================================
   SHIPPING
========================================================= */

const Shipping = styled.div`
  margin-top: 7px;

  color: #918980;

  font-family:
    Arial,
    sans-serif;

  font-size: 0.59rem;

  font-weight: 400;

  letter-spacing: 0.045em;

  text-transform: uppercase;
`;