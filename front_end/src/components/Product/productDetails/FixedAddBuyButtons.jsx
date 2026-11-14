import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useTranslation } from "react-i18next";

import { colors } from "../../../utilis/colors";

export default function FixedAddBuyButtons({
  available,
  currentSku,
  productData,
  shippingInfo,
  buy_Now_item,
  add_item_to_cart,
  purchaseRef,
  bottomRef,
}) {
  const { t, i18n } = useTranslation();
  const [showFixed, setShowFixed] = useState(false);

  /* ---------- Availability ---------- */
  const resolvedAvailable =
    typeof available === "number"
      ? available
      : currentSku?.available_stock || 0;

  /* ---------- Product display data ---------- */
  const attrs = currentSku?.attributes || {};

  const colorAttr = Object.entries(attrs).find(([key]) =>
    key.toLowerCase().includes("color")
  )?.[1];

  const productImage =
    colorAttr?.image ||
    colorAttr?.sku_image ||
    currentSku?.image ||
    currentSku?.images?.[0] ||
    productData?.image ||
    productData?.images?.[0] ||
    "";

  const productName =
    (typeof productData?.name === "object"
      ? productData?.name?.[i18n.language] ||
        productData?.name?.en
      : productData?.name) || "";

  const variantLabel = Object.values(attrs)
    .map((a) => a?.definitionName || a?.value || "")
    .filter(Boolean)
    .join(" · ");

  const rawPrice =
    Number(currentSku?.sellingPrice) > 0
      ? Number(currentSku.sellingPrice)
      : Number(productData?.price) || null;

  const currency =
    currentSku?.currency || productData?.currency || "€";

  const formattedPrice =
    rawPrice !== null
      ? `${rawPrice.toFixed(2)} ${currency}`
      : "";

  /* ---------- Scroll visibility ---------- */
  useEffect(() => {
    const purchaseElement = purchaseRef?.current;
    const bottomElement = bottomRef?.current;

    if (!purchaseElement) return;

    const updateVisibility = () => {
      const purchaseRect = purchaseElement.getBoundingClientRect();

      const originalButtonsPassed = purchaseRect.bottom <= 0;

      const reachedBottom = bottomElement
        ? bottomElement.getBoundingClientRect().top < window.innerHeight
        : false;

      setShowFixed(originalButtonsPassed && !reachedBottom);
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    updateVisibility();

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [purchaseRef, bottomRef]);

  if (!showFixed) return null;

  const isOutOfStock = resolvedAvailable < 1;

  return (
    <FixedPurchaseBar>
      <BarInner dir={i18n.dir()}>
        {/* ---------- PRODUCT INFO ---------- */}
        <ProductInfo>
          {productImage ? (
            <ProductImage
              src={productImage}
              alt={productName}
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder />
          )}

          <ProductMeta>
           

            {variantLabel && (
              <VariantLabel>{variantLabel}</VariantLabel>
            )}

            {formattedPrice && (
              <ProductPrice>{formattedPrice}</ProductPrice>
            )}
          </ProductMeta>
        </ProductInfo>

        {/* ---------- ADD TO CART ---------- */}
        <AddButton
          type="button"
          dir={i18n.dir()}
          className={isOutOfStock ? "out-of-stock" : ""}
          disabled={isOutOfStock}
          onClick={() =>
            add_item_to_cart(
              currentSku,
              productData?.id,
              shippingInfo,
              productData?.name
            )
          }
        >
          <span>
            {isOutOfStock
              ? t("productPage.soldOut")
              : t("common.addToCart")}
          </span>

          <ArrowForwardIosOutlinedIcon
            style={{
              rotate:
                i18n.dir() === "ltr" ? "0deg" : "180deg",
            }}
          />
        </AddButton>
      </BarInner>
    </FixedPurchaseBar>
  );
}

/* ============================================================
   FIXED BAR
============================================================ */

const FixedPurchaseBar = styled.div`
  position: fixed;

  right: 0;
  bottom: 0;

  z-index: 1000;

  width: 30%;

  padding: 12px 20px;

  background: rgba(255, 255, 255, 0.96);

  border-top: 1px solid #e8e4df;

  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.06);

  backdrop-filter: blur(10px);

  box-sizing: border-box;

  @media (max-width: 1120px) {
    width: 100%;
  }
`;

/* ============================================================
   INNER LAYOUT
============================================================ */

const BarInner = styled.div`
  width: 100%;

  max-width: 700px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 14px;

  box-sizing: border-box;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

/* ============================================================
   PRODUCT INFO
============================================================ */

const ProductInfo = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;

  flex: 1 1 auto;
`;

const ProductImage = styled.img`
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  object-fit: cover;

  border: 1px solid #e8e4df;

  border-radius: 3px;

  background: #faf8f5;

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
  }
`;

const ImagePlaceholder = styled.div`
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  border: 1px solid #e8e4df;

  border-radius: 3px;

  background: #faf8f5;

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
  }
`;

const ProductMeta = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2px;

  min-width: 0;
`;

const ProductName = styled.span`
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 260px;

  font-size: 0.82rem;

  font-weight: 600;

  color: #1c1c1c;

  @media (max-width: 480px) {
    max-width: 160px;

    font-size: 0.78rem;
  }
`;

const VariantLabel = styled.span`
  overflow: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 260px;

  font-size: 0.7rem;

  color: #96918a;

  letter-spacing: 0.02em;

  @media (max-width: 480px) {
    max-width: 160px;
  }
`;

const ProductPrice = styled.span`
  font-size: 0.82rem;

  font-weight: 600;

  color: ${colors.accent};

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

/* ============================================================
   ADD TO CART — GREEN (brand accent)
============================================================ */

const AddButton = styled.button`
  position: relative;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  min-height: 50px;

  padding: 0 26px;

  border: 1px solid ${colors.accent};

  background: ${colors.accent};

  color: #fff;

  font-size: 14px;

  font-weight: 600;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  svg {
    font-size: 13px;

    flex-shrink: 0;

    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    background: ${colors.accentHover};

    border-color: ${colors.accentHover};

    box-shadow: 0 4px 14px rgba(90, 132, 82, 0.25);

    svg {
      transform: translateX(3px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${colors.accent};

    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }

  &.out-of-stock {
    background: #a8b8a3;

    border-color: #a8b8a3;
  }

  &.out-of-stock::after {
    content: "";

    position: absolute;

    width: 100%;
    height: 2px;

    background: #000;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%) rotate(-8deg);

    pointer-events: none;
  }

  @media (max-width: 600px) {
    min-height: 48px;

    padding: 0 16px;

    font-size: 13px;
  }

  @media (max-width: 380px) {
    padding: 0 12px;

    font-size: 12px;

    svg {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    svg {
      transition: none;
    }
  }
`;