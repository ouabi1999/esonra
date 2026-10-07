import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import StarIcon from "@mui/icons-material/Star";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import { useTranslation } from "react-i18next";

import SideCart from "./SideCart";
import CurrencyPrice from "../../../../common/CurrencyPrice";

function ProductInfo({
  productData,
  ratings,
  sum_stars,

  selectedAttributes,
  setSelectedAttributes,

  availableAttributes,
  setAvailableAttributes,

  currentSku,
  setCurrentSku,

  selectColor,

  quantity,
  addQuantity,
  subtractQuantity,

  maxOrderWorning,
  setMaxOrderWorning,

  shippingInfo,
  add_item_to_cart,
  buy_Now_item,

  setIsPopUpShippingOpen,
  isPopUpShippingOpen,

  shippingMethodIndex,
  setShippingInfo,
}) {
  const { t, i18n } = useTranslation();

  const skuInfo = Array.isArray(productData?.skuInfo)
    ? productData.skuInfo
    : [];

    const [searchParams] = useSearchParams();

const skuIndexParam = searchParams.get("index");

const initialSkuIndex =
  skuIndexParam !== null
    ? Number(skuIndexParam)
    : null;

  /*
  
   * =========================================================
   * HELPERS
   * =========================================================
   *
   * IMPORTANT:
   *
   * New SKU:
   *
   * value: "green"
   * definitionName: "White Jazz White"
   * valueId: 175
   *
   * Old SKU:
   *
   * value: "Silver"
   * image: "..."
   *
   * Therefore:
   *
   * - valueId = strongest identity
   * - value = fallback identity
   * - definitionName = display name
   */

  const getAttributeId = (attr) => {
    if (!attr) return "";

    if (
      attr.valueId !== undefined &&
      attr.valueId !== null &&
      attr.valueId !== ""
    ) {
      return String(attr.valueId);
    }

    if (
      attr.property_value_id !== undefined &&
      attr.property_value_id !== null &&
      attr.property_value_id !== ""
    ) {
      return String(attr.property_value_id);
    }

    return String(attr.value ?? "");
  };

  const getAttributeDisplayValue = (attr) => {
    if (!attr) return "";

    /*
     * Prefer definitionName because this is the real
     * AliExpress option name.
     *
     * Example:
     *
     * value = green
     * definitionName = White Jazz White
     *
     * We display:
     *
     * White Jazz White
     */

    if (
      attr.definitionName &&
      String(attr.definitionName).trim()
    ) {
      return String(attr.definitionName).trim();
    }

    return String(attr.value ?? "");
  };

  const getAttributeRawValue = (attr) => {
    return String(attr?.value ?? "");
  };

  /*
   * =========================================================
   * BUILD AVAILABLE ATTRIBUTES
   * =========================================================
   *
   * We keep the complete option object instead of only
   * storing strings.
   *
   * This allows us to preserve:
   *
   * value
   * definitionName
   * valueId
   * image
   */

  const normalizedAttributes = useMemo(() => {
    const result = {};

    skuInfo.forEach((sku) => {
      Object.entries(sku?.attributes || {}).forEach(
        ([attributeName, attr]) => {
          if (!result[attributeName]) {
            result[attributeName] = new Map();
          }

          const id = getAttributeId(attr);

          if (!id) return;

          /*
           * If multiple SKUs contain the same option,
           * keep only one option object.
           */

          if (!result[attributeName].has(id)) {
            result[attributeName].set(id, {
              id,

              value: getAttributeRawValue(attr),

              displayValue:
                getAttributeDisplayValue(attr),

              definitionName:
                attr?.definitionName || "",

              image:
                attr?.image ||
                attr?.sku_image ||
                null,

              sku_image:
                attr?.sku_image ||
                attr?.image ||
                null,

              propertyId:
                attr?.propertyId ?? null,

              valueId:
                attr?.valueId ?? null,
            });
          }
        }
      );
    });

    const finalResult = {};

    Object.entries(result).forEach(
      ([attributeName, options]) => {
        finalResult[attributeName] =
          Array.from(options.values());
      }
    );

    return finalResult;
  }, [skuInfo]);

  /*
   * =========================================================
   * INITIALIZE AVAILABLE ATTRIBUTES
   * =========================================================
   */

  useEffect(() => {
    setAvailableAttributes(normalizedAttributes);
  }, [
    normalizedAttributes,
    setAvailableAttributes,
  ]);

  /*
   * =========================================================
   * INITIAL DEFAULT SELECTION
   * =========================================================
   *
   * selectedAttributes will contain:
   *
   * {
   *   "Body Color": "193",
   *   "Lampshade Color": "175"
   * }
   *
   * The IDs are used internally.
   */
useEffect(() => {
  if (!skuInfo.length) {
    return;
  }

  if (!Object.keys(normalizedAttributes).length) {
    return;
  }

  setSelectedAttributes((previous) => {
    const next = {};

    /*
     * =====================================================
     * 1. TRY TO SELECT THE SKU FROM THE URL
     * =====================================================
     */

    const initialSku =
      initialSkuIndex !== null &&
      Number.isInteger(initialSkuIndex)
        ? skuInfo[initialSkuIndex]
        : null;

   if (initialSku) {
  if (selectColor) {
    selectColor();
  }

  Object.entries(
    initialSku.attributes || {}
  ).forEach(
    ([attributeName, attr]) => {
      const id = getAttributeId(attr);

      if (id) {
        next[attributeName] = id;
      }
    }
  );
}
    /*
     * =====================================================
     * 2. FILL ANY MISSING ATTRIBUTES
     * =====================================================
     *
     * This is useful if the URL SKU does not contain
     * every possible attribute.
     */

    Object.entries(normalizedAttributes).forEach(
      ([attributeName, options]) => {
        if (!options.length) return;

        /*
         * Keep the SKU selection if it exists.
         */
        if (next[attributeName]) {
          return;
        }

        /*
         * Otherwise keep the previous selection
         * if it is still valid.
         */
        const previousSelection =
          previous?.[attributeName];

        const stillExists = options.some(
          (option) =>
            option.id === previousSelection
        );

        if (stillExists) {
          next[attributeName] =
            previousSelection;
        } else {
          /*
           * Final fallback:
           * select the first option.
           */
          next[attributeName] =
            options[0].id;
        }
      }
    );

    return next;
  });
}, [
  skuInfo,
  normalizedAttributes,
  initialSkuIndex,
  setSelectedAttributes,
  
]);

  /*
   * =========================================================
   * FIND CURRENT SKU
   * =========================================================
   *
   * THIS IS THE IMPORTANT FIX.
   *
   * We compare valueId/value identity instead of
   * comparing the random display value.
   */

  useEffect(() => {
    if (!skuInfo.length) {
      setCurrentSku(null);
      return;
    }

    const selectedEntries =
      Object.entries(selectedAttributes || {});

    if (!selectedEntries.length) {
      setCurrentSku(skuInfo[0] || null);
      return;
    }

    const foundSku = skuInfo.find((sku) => {
      return selectedEntries.every(
        ([attributeName, selectedId]) => {
          const attr =
            sku?.attributes?.[attributeName];

          if (!attr) {
            return false;
          }

          return (
            getAttributeId(attr) ===
            String(selectedId)
          );
        }
      );
    });

    setCurrentSku(foundSku || null);
  }, [
    skuInfo,
    selectedAttributes,
    setCurrentSku,
  ]);

  /*
   * =========================================================
   * SELECT ATTRIBUTE
   * =========================================================
   */

  const selectAttribute = (
    attributeName,
    option
  ) => {
    if (!option) return;

    setSelectedAttributes((previous) => ({
      ...previous,
      [attributeName]: option.id,
    }));
  };

  /*
   * =========================================================
   * CHECK WHETHER OPTION IS AVAILABLE
   * =========================================================
   *
   * Example:
   *
   * Body Color = black
   *
   * We check whether there is a SKU containing:
   *
   * Body Color = black
   *
   * AND all the other currently selected options.
   *
   * This prevents invalid combinations.
   */

  const isOptionAvailable = (
    attributeName,
    option
  ) => {
    if (!option) return false;

    return skuInfo.some((sku) => {
      const currentAttr =
        sku?.attributes?.[attributeName];

      if (!currentAttr) {
        return false;
      }

      /*
       * First check the option itself.
       */

      if (
        getAttributeId(currentAttr) !==
        String(option.id)
      ) {
        return false;
      }

      /*
       * Then check all other selected attributes.
       */

      return Object.entries(
        selectedAttributes || {}
      ).every(
        ([otherAttributeName, selectedId]) => {
          if (
            otherAttributeName ===
            attributeName
          ) {
            return true;
          }

          const otherAttr =
            sku?.attributes?.[
            otherAttributeName
            ];

          if (!otherAttr) {
            return false;
          }

          return (
            getAttributeId(otherAttr) ===
            String(selectedId)
          );
        }
      );
    });
  };

  /*
   * =========================================================
   * FIND IMAGE FOR OPTION
   * =========================================================
   *
   * IMPORTANT:
   *
   * We don't simply use .find() on the first matching
   * color anymore.
   *
   * We respect the current selections.
   */

  const getOptionImage = (
    attributeName,
    option
  ) => {
    if (!option) return null;

    /*
     * First try the currently selected combination.
     */

    const matchingSku = skuInfo.find((sku) => {
      const attr =
        sku?.attributes?.[attributeName];

      if (!attr) return false;

      if (
        getAttributeId(attr) !==
        String(option.id)
      ) {
        return false;
      }

      return Object.entries(
        selectedAttributes || {}
      ).every(
        ([otherAttributeName, selectedId]) => {
          if (
            otherAttributeName ===
            attributeName
          ) {
            return true;
          }

          const otherAttr =
            sku?.attributes?.[
            otherAttributeName
            ];

          if (!otherAttr) {
            return false;
          }

          return (
            getAttributeId(otherAttr) ===
            String(selectedId)
          );
        }
      );
    });

    const exactImage =
      matchingSku?.attributes?.[
        attributeName
      ]?.image ||
      matchingSku?.attributes?.[
        attributeName
      ]?.sku_image;

    if (exactImage) {
      return exactImage;
    }

    /*
     * Fallback:
     *
     * If there is no exact combination image,
     * find the first SKU containing this option
     * that has an image.
     */

    const fallbackSku = skuInfo.find((sku) => {
      const attr =
        sku?.attributes?.[attributeName];

      return (
        attr &&
        getAttributeId(attr) ===
        String(option.id) &&
        attr.image
      );
    });

    return (
      fallbackSku?.attributes?.[
        attributeName
      ]?.image ||
      fallbackSku?.attributes?.[
        attributeName
      ]?.sku_image ||
      null
    );
  };

  /*
   * =========================================================
   * PRODUCT INFORMATION
   * =========================================================
   */

  const productName =
    productData?.name?.[i18n.language] ||
    productData?.name?.en ||
    "Product";

  /*
   * =========================================================
   * RATINGS
   * =========================================================
   */

  const stars = Array(5).fill(0);

  const ratingList = Array.isArray(ratings)
    ? ratings
    : [];

  const ratingCount =
    ratingList.length;

  const averageRating =
    ratingCount > 0
      ? (
        Number(sum_stars || 0) /
        ratingCount
      ).toFixed(1)
      : "0.0";

  const roundedRating = Math.round(
    Number(averageRating)
  );

  /*
   * =========================================================
   * PRICE
   * =========================================================
   */

  const sellingPrice =
    Number(currentSku?.sellingPrice) > 0
      ? currentSku.sellingPrice
      : productData?.price;

  const comparePrice =
    Number(currentSku?.comparePrice) > 0
      ? currentSku.comparePrice
      : productData?.discount;

  const savePercentage =
    Number(currentSku?.comparePrice) > 0 &&
      Number(currentSku?.sellingPrice) > 0
      ? (
        ((Number(currentSku.comparePrice) -
          Number(currentSku.sellingPrice)) /
          Number(currentSku.comparePrice)) *
        100
      ).toFixed(0)
      : null;

  /*
   * =========================================================
   * CURRENT SELECTED DISPLAY VALUES
   * =========================================================
   */

  const getSelectedDisplayValue = (
    attributeName
  ) => {
    const selectedId =
      selectedAttributes?.[attributeName];

    const option =
      normalizedAttributes?.[
        attributeName
      ]?.find(
        (item) =>
          item.id === String(selectedId)
      );

    return (
      option?.displayValue ||
      ""
    );
  };


  const handleReviewsClick = () => {
    document.getElementById("reviews")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  /*
   * =========================================================
   * RENDER
   * =========================================================
   */
  return (
    <Container
      dir={
        i18n.language === "ar"
          ? "rtl"
          : "ltr"
      }
    >
      {/* =====================================================
          PRODUCT HEADER
      ===================================================== */}

      <ProductHeader>
        <Eyebrow>
          {productData?.category
            ? t(
              `productInfo.${productData.category}`
            )
            : t(
              "footer.newsletter.eyebrow"
            )}
        </Eyebrow>

        <ProductTitle>
          {productName}
        </ProductTitle>

        <RatingRow>
          <Stars
            aria-label={`${averageRating} out of 5 stars`}
          >
            {stars.map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < roundedRating
                    ? "active"
                    : ""
                }
              />
            ))}
          </Stars>

          <RatingNumber>
            {averageRating}
          </RatingNumber>

          {ratingCount > 0 && (
            <>
              <RatingDivider />

              <RatingCount   type="button" onClick={handleReviewsClick}>
                {ratingCount === 1
                  ? t(
                    "customer_reviews.customer_review",
                    "Customer Review"
                  )
                  : t(
                    "customer_reviews.customer_reviews",
                    "Customer Reviews"
                  )}

                {" "}({ratingCount})
              </RatingCount>
            </>
          )}
        </RatingRow>
      </ProductHeader>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <PriceBlock>
        <PriceLine>
          <ProductPrice>
            <CurrencyPrice price = {sellingPrice}/> 

          </ProductPrice>

          {comparePrice && (
            <ComparePrice>
              <CurrencyPrice price= {comparePrice}/> 
            </ComparePrice>
          )}

          {comparePrice > 0 && (
            <SaveBadge dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              {t("productInfo.save")}{" "}
              <bdi style={{ margin: "0 2px" }}>
                {savePercentage}%
              </bdi>
            </SaveBadge>
          )}
        </PriceLine>

        <PriceNote>
          <VerifiedOutlinedIcon />

          <span>
            {t(
              "productInfo.secure_purchase_premium_quality"
            )}
          </span>
        </PriceNote>
      </PriceBlock>

      {/* =====================================================
          ATTRIBUTES
      ===================================================== */}

      <AttributesWrapper>
        {Object.entries(
          normalizedAttributes
        ).map(
          ([
            attributeName,
            options,
          ]) => {
            const selectedId =
              selectedAttributes?.[
              attributeName
              ];

            return (
              <ProductAttribute
                key={attributeName}
              >
                <AttributeHeader>
                  <AttributeTitle>
                    {t(
                      `productInfo.${attributeName}`,
                      attributeName
                    )}
                  </AttributeTitle>

                  <SelectedValue>
                    {getSelectedDisplayValue(
                      attributeName
                    )}
                  </SelectedValue>
                </AttributeHeader>

                <AttributeValues>
                  {options.map(
                    (option) => {
                      const available =
                        isOptionAvailable(
                          attributeName,
                          option
                        );

                      const active =
                        String(
                          selectedId
                        ) ===
                        String(
                          option.id
                        );

                      /*
                       * Find image for this option.
                       */

                      const image =
                        getOptionImage(
                          attributeName,
                          option
                        );

                      /*
                       * COLOR ATTRIBUTE
                       */

                      const isColor =
                        attributeName
                          .toLowerCase()
                          .includes(
                            "color"
                          );

                      if (
                        isColor &&
                        image
                      ) {
                        return (
                          <ColorItem
                            key={
                              option.id
                            }
                            type="button"
                            $active={
                              active
                            }
                            $available={
                              available
                            }
                            disabled={
                              !available
                            }
                            onClick={() => {
                              if (
                                !available
                              ) {
                                return;
                              }

                              selectAttribute(
                                attributeName,
                                option
                              );

                              /*
                               * Keep your existing
                               * MainImages behavior.
                               */

                              if (
                                selectColor
                              ) {
                                selectColor();
                              }
                            }}
                          >
                            <ColorImageWrapper
                              $active={
                                active
                              }
                            >
                              <ColorImage
                                src={
                                  image
                                }
                                alt={
                                  option.displayValue
                                }
                              />
                            </ColorImageWrapper>
                          </ColorItem>
                        );
                      }

                      /*
                       * NORMAL ATTRIBUTE
                       */

                      return (
                        <AttributeButton
                          key={
                            option.id
                          }
                          type="button"
                          $active={
                            active
                          }
                          disabled={
                            !available
                          }
                          onClick={() => {
                            if (
                              !available
                            ) {
                              return;
                            }

                            selectAttribute(
                              attributeName,
                              option
                            );
                          }}
                        >
                          {
                            option.displayValue
                          }
                        </AttributeButton>
                      );
                    }
                  )}
                </AttributeValues>
              </ProductAttribute>
            );
          }
        )}
      </AttributesWrapper>

      {/* =====================================================
          PURCHASE INFORMATION
      ===================================================== */}

      <PurchaseInformation>
        <PurchaseHeading>
          <span>
            {t(
              "productInfo.purchase_information",
              "Purchase Information"
            )}
          </span>
        </PurchaseHeading>

        <SideCart
          shippingInfo={shippingInfo}
          addQuantity={addQuantity}
          maxOrderWorning={
            maxOrderWorning
          }
          setMaxOrderWorning={
            setMaxOrderWorning
          }
          subtractQuantity={
            subtractQuantity
          }
          quantity={quantity}
          add_item_to_cart={
            add_item_to_cart
          }
          buy_Now_item={
            buy_Now_item
          }
          setIsPopUpShippingOpen={
            setIsPopUpShippingOpen
          }
          isPopUpShippingOpen={
            isPopUpShippingOpen
          }
          shippingMethodIndex={
            shippingMethodIndex
          }
          currentSku={currentSku}
          setShippingInfo={
            setShippingInfo
          }
        />
      </PurchaseInformation>
    </Container>
  );
}

export default ProductInfo;


/* =========================================================
   MAIN
========================================================= */

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;

  padding: 4px 10px 35px;

  color: #202020;

  @media (max-width: 600px) {
    padding: 5px 5px 25px;
  }
`;


/* =========================================================
   PRODUCT HEADER
========================================================= */

const ProductHeader = styled.div`
  padding-bottom: 18px;

  border-bottom: 1px solid #e9e3da;
`;

const Eyebrow = styled.div`
  margin-bottom: 9px;

  font-size: 0.68rem;
  font-weight: 600;

  letter-spacing: 0.18em;

  color: #9b815f;

  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 0.66rem;
  }
`;

const ProductTitle = styled.h1`
  margin: 0;

  max-width: 720px;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: clamp(
    1.35rem,
    2.2vw,
    2rem
  );

  font-weight: 500;

  line-height: 1.3;

  letter-spacing: -0.025em;

  color: #181818;
`;


/* =========================================================
   RATING
========================================================= */

const RatingRow = styled.div`
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 13px;
`;

const Stars = styled.div`
  display: inline-flex;
  align-items: center;

  gap: 2px;

  svg {
    display: block;

    width: 16px;
    height: 16px;

    color: #d8d2ca;
  }

  svg.active {
    color: #b59771;
  }

  @media (max-width: 600px) {
    gap: 1px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const RatingNumber = styled.span`
  font-size: 0.75rem;

  font-weight: 600;

  color: #333;

  @media (max-width: 600px) {
    font-size: 0.72rem;
  }
`;

const RatingDivider = styled.span`
  width: 1px;
  height: 13px;

  flex: 0 0 1px;

  background: #d8d2ca;
`;

const RatingCount = styled.button`
  font-size: 0.72rem;
  background:none;
  line-height: 1.4;

  color: #817c75;

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`;


/* =========================================================
   PRICE
========================================================= */

const PriceBlock = styled.div`
  padding: 18px 0 17px;

  border-bottom: 1px solid #e9e3da;
  
`;

const PriceLine = styled.div`
  display: flex;

  align-items: center;
  
  flex-wrap: wrap;

  gap: 11px;
`;

const ProductPrice = styled.span`

  font-size: clamp(
    1.55rem,
    2.4vw,
    2rem
  );

  font-weight: 600;

  letter-spacing: -0.02em;

  color: #181818;
`;

const ComparePrice = styled.span`
  font-size: 0.86rem;

  color: #99928a;

  text-decoration: line-through;

  @media (max-width: 600px) {
    font-size: 0.82rem;
  }
`;

const SaveBadge = styled.span`
  display: inline-flex;

  align-items: center;

  padding: 4px 8px;

  background: #9b815f;

  color: white;

  font-size: 0.63rem;

  font-weight: 600;

  line-height: 1.3;

  letter-spacing: 0.04em;

  text-transform: uppercase;

  white-space: nowrap;
`;

const PriceNote = styled.div`
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 9px;

  color: #888178;

  font-size: 0.68rem;

  line-height: 1.45;

  svg {
    width: 14px;
    height: 14px;

    flex: 0 0 14px;

    color: #9b815f;
  }

  @media (max-width: 600px) {
    font-size: 0.67rem;
  }
`;


/* =========================================================
   ATTRIBUTES
========================================================= */

const AttributesWrapper = styled.div`
  padding: 3px 0 0;
`;

const ProductAttribute = styled.div`
  padding: 18px 0;
`;

const AttributeHeader = styled.div`
  display: flex;

  align-items: baseline;

  gap: 10px;

  margin-bottom: 11px;
`;

const AttributeTitle = styled.span`
  font-size: 0.76rem;

  font-weight: 600;

  line-height: 1.4;

  color: #282828;

  letter-spacing: 0.03em;

  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 0.72rem;
  }
`;

const SelectedValue = styled.span`
  max-width: 50%;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.7rem;

  line-height: 1.4;

  color: #918980;

  @media (max-width: 600px) {
    font-size: 0.68rem;
  }
`;

const AttributeValues = styled.div`
  display: flex;

  align-items: flex-start;

  flex-wrap: wrap;

  gap: 8px;
`;


/* =========================================================
   NORMAL ATTRIBUTE
========================================================= */

const AttributeButton = styled.button`
  min-width: 55px;
  min-height: 38px;

  padding: 7px 14px;

  border: 1px solid
    ${({ $active }) =>
    $active
      ? "#222"
      : "#dcd6ce"};

  border-radius: 2px;

  background:
    ${({ $active }) =>
    $active
      ? "#222"
      : "#fff"};

  color:
    ${({ $active }) =>
    $active
      ? "#fff"
      : "#383838"};

  font-family: inherit;

  font-size: 0.72rem;

  line-height: 1.3;

  cursor:
    ${({ disabled }) =>
    disabled
      ? "not-allowed"
      : "pointer"};

  opacity:
    ${({ disabled }) =>
    disabled ? 0.35 : 1};

  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease;

  &:hover:not(:disabled) {
    border-color: #9b815f;
  }

  &:focus-visible {
    outline: 1px solid #9b815f;

    outline-offset: 3px;
  }
`;


/* =========================================================
   COLOR
========================================================= */

const ColorItem = styled.button`
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 6px;

  padding: 4px;

  border: 1px solid transparent;

  background: transparent;

  cursor:
    ${({ $available }) =>
    $available
      ? "pointer"
      : "not-allowed"};

  opacity:
    ${({ $available }) =>
    $available ? 1 : 0.35};

  transition: opacity 180ms ease;

  &:focus-visible {
    outline: 1px solid #9b815f;

    outline-offset: 3px;
  }
`;

const ColorImageWrapper = styled.div`
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 58px;
  height: 58px;

  padding: 3px;

  border: 1px solid
    ${({ $active }) =>
    $active
      ? "#9b815f"
      : "#ddd7ce"};

  background: #fff;

  transition: border-color 180ms ease;

  &::after {
    content: "";

    position: absolute;

    inset: 1px;

    border:
      ${({ $active }) =>
    $active
      ? "1px solid #9b815f"
      : "1px solid transparent"};

    pointer-events: none;
  }
`;

const ColorImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  background: #f5f2ed;

  display: block;
`;


/* =========================================================
   PURCHASE INFORMATION
========================================================= */

const PurchaseInformation = styled.section`
  margin-top: 8px;

  padding-top: 2px;
`;

const PurchaseHeading = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  margin: 3px 0 0;

  color: #262626;

  font-size: 0.72rem;

  font-weight: 600;

  line-height: 1.4;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  &::after {
    content: "";

    flex: 1;

    height: 1px;

    background: #e8e1d8;
  }

  @media (max-width: 600px) {
    font-size: 0.68rem;

    letter-spacing: 0.11em;
  }
`;