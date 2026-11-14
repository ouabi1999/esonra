import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import ProductTrustBanner from "./ProductsTrustBanner";
import FixedAddBuyButtons from "./FixedAddBuyButtons";
import { colors } from "../../../utilis/colors";

function SideCart(props) {
  const purchaseRef = useRef(null);

  const productData = useSelector((state) => state.product.productData);

  const { t, i18n } = useTranslation();

  const today = new Date();
  let date1 = new Date(today);
  let date2 = new Date(today);

  const {
    shippingInfo,
    addQuantity,
    maxOrderWorning,
    setMaxOrderWorning,
    subtractQuantity,
    quantity,
    add_item_to_cart,
    buy_Now_item,

    currentSku,
    setShippingInfo,
  } = props;

  const available = currentSku?.available_stock
    ? currentSku?.available_stock
    : "";

  /*
   * Keep your original warning behavior
   */
  useEffect(() => {
    if (!maxOrderWorning) return;

    const handleScroll = () => {
      setMaxOrderWorning(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [maxOrderWorning, setMaxOrderWorning]);

  /*
   * Keep your original default delivery logic
   */
  useEffect(() => {
    date1.setDate(date1.getDate() + 5);
    date2.setDate(date2.getDate() + 7);

    setShippingInfo((prev) => ({
      ...prev,
      date1: date1.toDateString(),
      date2: date2.toDateString(),
    }));
  }, [setShippingInfo]);

  return (
    <Container>
      {/* =====================================================
          SHIPPING / DELIVERY
      ===================================================== */}

      <Section>
        <ShippingRow>
          <ShippingLeft>
            <IconBox>
              <LocalShippingOutlinedIcon />
            </IconBox>

            <ShippingContent>
              <SmallLabel>
                {t("purchaseOptions.Delivrey")}
              </SmallLabel>

              <ShippingValue>
                {shippingInfo.from} - {shippingInfo.to}{" "}
                {t("common.days")}
              </ShippingValue>
            </ShippingContent>
          </ShippingLeft>
        </ShippingRow>
      </Section>


      

      {/* =====================================================
          QUANTITY + ADD TO CART (inline row)
      ===================================================== */}

      <QuantitySection>
        <QuantityHeader>
          <QuantityTitle>
            <IconBox>
              <AutoAwesomeMotionOutlinedIcon />
            </IconBox>
            <span>{t("purchaseOptions.Quantity")}</span>
          </QuantityTitle>

          <AvailableStock>
            {Math.max(
              0,
              (currentSku?.available_stock || 0) - quantity
            )}{" "}
            {t("purchaseOptions.available")}
          </AvailableStock>
        </QuantityHeader>

        <QuantityArea>
          <QuantityRow>
            <QuantityControls>
              <QuantityButton
                type="button"
                onClick={subtractQuantity}
                disabled={quantity <= 1}
              >
                −
              </QuantityButton>

              <QuantityValue>{quantity}</QuantityValue>

              <QuantityButton type="button" onClick={addQuantity}>
                +
              </QuantityButton>
            </QuantityControls>

            <AddButton
              ref={purchaseRef}
              type="button"
              dir={i18n.dir() === "ltr" ? "ltr" : "rtl"}
              className={!available ? "out-of-stock" : ""}
              disabled={!available}
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
                {available < 1
                  ? t("productPage.soldOut")
                  : t("common.addToCart")}
              </span>

             
            </AddButton>
          </QuantityRow>

          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchEnd"
            onClickAway={() => setMaxOrderWorning(false)}
          >
            <Warning
              className={
                maxOrderWorning ? "max-order-warning" : "not-show"
              }
            >
              {t("purchaseOptions.max-order-warning")}
            </Warning>
          </ClickAwayListener>
        </QuantityArea>

        {/* COD offer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "auto",
            fontSize: "20px",
            color: "#b61813",
          }}
        >
          <span>{t("checkoutPage.payWhenDelivered")}</span>
        </div>
      </QuantitySection>

      <FixedAddBuyButtons
        currentSku={currentSku}
        productData={productData}
        shippingInfo={shippingInfo}
        buy_Now_item={buy_Now_item}
        add_item_to_cart={add_item_to_cart}
        purchaseRef={purchaseRef}
      />

      {/* =====================================================
          TRUST FOOTER
      ===================================================== */}

      <SecureCheckout>
        <ProductTrustBanner />
      </SecureCheckout>
    </Container>
  );
}

export default SideCart;

/* =========================================================
   MAIN CONTAINER
========================================================= */

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;

  padding: 22px 0 4px;

  color: #1c1c1c;

  font-family: inherit;
`;

/* =========================================================
   SHIPPING SECTION
========================================================= */

const Section = styled.div`
  width: 100%;


`;

/* =========================================================
   SHIPPING ROW
========================================================= */

const ShippingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 44px;

  gap: 12px;

  & + & {
    margin-top: 4px;
  }
`;

const ShippingLeft = styled.div`
  display: flex;
  align-items: center;

  min-width: 0;

  gap: 11px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border: 1px solid ${colors.border};

  border-radius: 50%;

  background: ${colors.background};

  color: ${colors.accent};

  svg {
    font-size: 16px;
  }
`;

const ShippingContent = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;

  gap: 2px;
`;

const SmallLabel = styled.span`
  font-size: 0.66rem;

  color: #96918a;

  letter-spacing: 0.02em;
`;

const ShippingValue = styled.span`
  overflow: hidden;

  max-width: 260px;

  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 0.81rem;

  font-weight: 600;

  color: #2b2b2b;
`;












/* =========================================================
   QUANTITY + ADD TO CART
========================================================= */

const QuantitySection = styled.div`
  padding: 18px 0 18px;

`;

const QuantityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-bottom: 12px;
`;

const QuantityTitle = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 0.81rem;

  font-weight: 600;

  color: #292929;

  svg {
    font-size: 18px;
  }
`;

const AvailableStock = styled.span`
  font-size: 0.68rem;

  color: #8c8780;

  white-space: nowrap;
`;

const QuantityArea = styled.div`
  display: flex;
  flex-direction: column;

  align-items: stretch;

  min-height: 48px;
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: stretch;

  gap: 10px;

  width: 100%;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  height: 48px;

  flex-shrink: 0;

  border: 1px solid #ddd7ce;

  border-radius: 3px;

  overflow: hidden;

  background: #fff;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 48px;

  padding: 0;

  border: 0;

  background: #faf9f7;

  color: #2b2b2b;

  font-size: 18px;

  cursor: pointer;

  transition:
    background 180ms ease,
    color 180ms ease;

  &:hover:not(:disabled) {
    background: #f1ede7;

    color: ${colors.accent};
  }

  &:disabled {
    opacity: 0.35;

    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 48px;

  border-left: 1px solid #ddd7ce;
  border-right: 1px solid #ddd7ce;

  font-size: 0.82rem;

  color: #292929;
`;

const Warning = styled.span`
  min-height: 16px;

  margin-top: 6px;

  font-size: 0.68rem;

  color: #c84c4c;

  &.not-show {
    visibility: hidden;
  }

  &.max-order-warning {
    visibility: visible;

    animation: warning 220ms ease;
  }

  @keyframes warning {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* =========================================================
   ADD TO CART (inline, fills remaining row width)
========================================================= */

const AddButton = styled.button`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  flex: 1 1 auto;

  min-width: 0;
  min-height: 48px;
  padding: 12px 22px;

  border: 1px solid ${colors.accent};
  border-radius: 3px;

  background: ${colors.accent};
  color: #fff;

  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;

  svg {
    font-size: 13px;
    flex-shrink: 0;
    transition: transform 180ms ease;
  }

  &:hover:not(:disabled) {
    background: ${colors.accentHover};
    border-color: ${colors.accentHover};
    box-shadow: 0 4px 14px rgba(90, 132, 82, 0.25);

    svg {
      transform: translateX(3px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* out-of-stock diagonal line */
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

  @media (max-width: 400px) {
    width: 100%;
    min-height: 48px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    svg {
      transition: none;
    }
  }
`;

/* =========================================================
   TRUST FOOTER
========================================================= */

const SecureCheckout = styled.div`
  margin-top: 18px;

  padding-top: 15px;

  border-top: 1px solid #eee9e2;

  text-align: center;
`;