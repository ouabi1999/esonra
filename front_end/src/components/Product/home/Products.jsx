import React from "react";
import styled from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Products({
  products,
  scrollTo,
  columsNumber,
  placeItems,
}) {
  const { t, i18n } = useTranslation();

  return (
    <ProductContainer
      colums_number={columsNumber}
      place_items={placeItems}
    >
      <div className="grid-container">
        {products?.map((item) => {
        const mainSku = item.skuInfo?.[0];
         const comparePrice = Number(
                  mainSku?.comparePrice || 0
                );

          const hasDiscount =
                  comparePrice > mainSku.sellingPrice &&
                  mainSku.sellingPrice > 0;
        const image = item.multimediaInfo?.main_image


          const sumRatings = item.ratings;

          const avgRating =
            sumRatings?.length > 0
              ? (
                  sumRatings.reduce(
                    (total, r) => total + r.stars,
                    0
                  ) / sumRatings.length
                ).toFixed(1)
              : null;

          const ordersCount =
            item?.orders?.length +
              item?.ratings?.length || 0;

          return (
            <div
              key={item.id}
              className="product-container"
            >
              {/* PRODUCT IMAGE */}

              <Link reloadDocument
                to={`/product/${item.id}`}
                className="image-container"
              >
                <img
                loading="lazy"
                  src={image}
                  alt={item.name?.en || "product"}
                />

                {hasDiscount && (
                  <div className="discount-badge" dir = {i18n.language === "ar"? "rtl": "ltr"}>
                    {t("productInfo.save")}{" "}
                    <bdi>
                      {(
                        ((mainSku?.comparePrice -
                          mainSku?.sellingPrice) /
                          mainSku?.comparePrice) *
                        100
                      ).toFixed(0)}
                      %
                    </bdi>
                  </div>
                )}
              </Link>

              {/* PRODUCT INFORMATION */}

              <ProductInfo>
                <FirstSection>
                  <p className="product-title">
                    {item.name[i18n.language]
                      ? item.name[i18n.language]
                      : item.name["en"]}
                  </p>
                </FirstSection>

                <SecondSection>
                  {/* 
                  <div className="orders">
                    {t("common.orders")}({ordersCount})
                  </div>
                  */}

                 
                </SecondSection>

                <ThirdSection>
                  <div className="price-wrapper">
                    <span className="product-price">
                      ${mainSku?.sellingPrice}
                    </span>

                    {mainSku?.comparePrice > 0 && (
                      <span className="compare-price">
                        ${mainSku?.comparePrice}
                      </span>
                    )}
                  </div>
                   {avgRating && (
                    <div className="reviews-container">
                      <StarIcon className="star-icon" />

                      <span className="reviews">
                        {avgRating}
                      </span>
                    </div>
                  )}
                </ThirdSection>

                {item.available_shipping?.map(
                  (ship, index) =>
                    ship.type === "Free" && (
                      <span
                        key={index}
                        className="shipping"
                      >
                        {t("common.free_shipping")}
                      </span>
                    )
                )}
              </ProductInfo>
            </div>
          );
        })}
      </div>

      <div ref={scrollTo} />
    </ProductContainer>
  );
}

export default Products;


/* =====================================
   MAIN CONTAINER
===================================== */

const ProductContainer = styled.div`
  width: 100%;

  font-family: Arial, sans-serif;

  .grid-container {
  width: min(1300px, calc(100% - 40px));
  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(
    ${(props) => props.colums_number},
    minmax(0, 1fr)
  );

  gap: 30px 20px;

  align-items: start;
}
  /* =====================================
     PRODUCT CARD
  ===================================== */

  .product-container {
    width: 100%;
    min-width: 0;

    padding-bottom: 12px;

    background: #fff;
  }


  /* =====================================
     IMAGE
  ===================================== */

  .image-container {
    position: relative;

    display: block;

    width: 100%;
    

    aspect-ratio: 1 / 1;

    overflow: hidden;

    background: #f7f6f3;

    text-decoration: none;
  }

  .image-container img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;

    background: #fff;

    transition: transform 0.45s ease;
  }

  .image-container:hover img {
    transform: scale(1.025);
  }


  /* =====================================
     DISCOUNT
  ===================================== */

  .discount-badge {
    position: absolute;

    top: 12px;
    left: 12px;

    padding: 5px 8px;

    background: #9a7743;

    color: #fff;

    font-family: Arial, sans-serif;

    font-size: 0.65rem;

    font-weight: 500;

    letter-spacing: 0.04em;

    text-transform: uppercase;
  }


  /* =====================================
     TABLET
  ===================================== */

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


  /* =====================================
     MOBILE
  ===================================== */

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

    .discount-badge {
      top: 8px;
      left: 8px;

      padding: 4px 6px;

      font-size: 0.55rem;
    }
  }
`;


/* =====================================
   PRODUCT INFO
===================================== */

const ProductInfo = styled.div`
  display: flex;

  flex-direction: column;

  padding-top: 11px;

  .shipping {
    margin: 7px 0 0 4px;

    color: #496b52;

    font-size: 10px;

    font-weight: 400;

    letter-spacing: 0.02em;
  }

  @media (max-width: 490px) {
    padding-top: 8px;

    .shipping {
      margin-top: 6px;

      font-size: 9px;
    }
  }
`;


/* =====================================
   TITLE
===================================== */

const FirstSection = styled.div`
  .product-title {
    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

    margin: 0;

    padding: 0 5px;

    color: #292929;

    font-family: "Playfair Display", serif;

    font-size: 0.92rem;

    font-weight: 400;

    line-height: 1.4;
  }

  @media (max-width: 600px) {
    .product-title {
      font-size: 0.78rem;
    }
  }

  @media (max-width: 360px) {
    .product-title {
      font-size: 0.72rem;
    }
  }
`;


/* =====================================
   RATING
===================================== */

const SecondSection = styled.div`
  display: flex;

  align-items: center;

  min-height: 21px;

  margin-top: 6px;

  .orders {
    padding: 0 5px;

    font-size: 0.7rem;
  }

 `


/* =====================================
   PRICE
===================================== */

const ThirdSection = styled.div`
  margin-top: 7px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  .price-wrapper {
    display: flex;

    align-items: baseline;

    gap: 8px;

    padding: 0 5px;
  }

  .product-price {
    color: #222;

   font-family: 'Trebuchet MS', sans-serif;

    font-size: 1.15rem;

    font-weight: 500;

    line-height: 1;

    white-space: nowrap;
  }

  .compare-price {
    color: #999;

    font-family: 'Trebuchet MS', sans-serif;

    font-size: 0.72rem;

    text-decoration: line-through;

    white-space: nowrap;
  }

  @media (max-width: 600px) {
    margin-top: 6px;

    .price-wrapper {
      gap: 6px;
    }

    .product-price {
      font-size: 0.95rem;
    }

    .compare-price {
      font-size: 0.62rem;
    }
  }

  @media (max-width: 360px) {
    .product-price {
      font-size: 0.88rem;
    }

    .compare-price {
      font-size: 0.58rem;
    }
  }
     .reviews-container {
    display: flex;

    align-items: center;

    gap: 3px;

    margin: 0 15px;
  }

  .reviews {
    color: #555;

    font-size: 13px;

    line-height: 1;
  }

  .star-icon {
    color: #cc9d51;

    font-size: 15px;
  }

  @media (max-width: 600px) {
    min-height: 19px;

    .reviews-container {
      margin: 0 5px;
    }

    .reviews {
      font-size: 10px;
    }

    .star-icon {
      font-size: 13px;
    }
  }

`;