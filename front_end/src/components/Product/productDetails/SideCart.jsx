import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import {useSelector } from "react-redux";

import ProductTrustBanner from "./ProductsTrustBanner";
import FixedAddBuyButtons from "./FixedAddBuyButtons";

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
  
    shippingMethodIndex,
    currentSku,
    setShippingInfo,
  } = props;

 const available = currentSku?.available_stock ? currentSku?.available_stock : ""
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


        {/* SHIPPING METHOD */}

        <ShippingRow>
          <ShippingLeft>
            <IconBox>
              <LocalShippingOutlinedIcon />
            </IconBox>

            <ShippingContent>


              <ShippingValue>
                {productData?.available_shipping?.length > 0 ? (
                  Number(
                    productData?.available_shipping[
                      shippingMethodIndex
                    ]?.cost
                  ) === 0
                    ? t("purchaseOptions.free_Shipping")
                    : productData?.available_shipping[
                      shippingMethodIndex
                    ]?.methodName
                ) : shippingInfo?.cost <= 0 ? (
                  t("purchaseOptions.free_Shipping")
                ) : (
                  shippingInfo?.methodName
                )}
              </ShippingValue>
            </ShippingContent>
          </ShippingLeft>

          {/*
          <ShippingChangeButton 
            type="button"
            onClick={() =>
              setIsPopUpShippingOpen(!isPopUpShippingOpen)
            }
            aria-label="Change shipping method"
          >
            <ArrowForwardIosOutlinedIcon />
          </ShippingChangeButton>
          */}
        </ShippingRow>


        {/* DELIVERY DATE */}

        <ShippingRow>
          <ShippingLeft>
            <IconBox>
              <DeliveryDiningIcon />
            </IconBox>

            <ShippingContent>
              <SmallLabel>
                {t("purchaseOptions.Delivrey")}
              </SmallLabel>

              <ShippingValue>
                5-7 {t("purchaseOptions.business_days")}
              </ShippingValue>
            </ShippingContent>
          </ShippingLeft>


        </ShippingRow>
      </Section>

      {/* =====================================================
          SECURITY
      ===================================================== */}

      <SecuritySection>
        <SecurityIcon>
          <VerifiedUserOutlinedIcon />
        </SecurityIcon>

        <SecurityContent>
          <SecurityTitle>
            {t("purchaseOptions.Security_&_Privacy.header")}
          </SecurityTitle>

          <SecurityText>
            {t("purchaseOptions.Security_&_Privacy.text")}
          </SecurityText>
        </SecurityContent>
      </SecuritySection>

      {/* =====================================================
          QUANTITY
      ===================================================== */}

      <QuantitySection>
        <QuantityHeader>
          <QuantityTitle>
            <AutoAwesomeMotionOutlinedIcon />

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
          <QuantityControls>
            <QuantityButton
              type="button"
              onClick={subtractQuantity}
              disabled={quantity <= 1}
            >
              −
            </QuantityButton>

            <QuantityValue>
              {quantity}
            </QuantityValue>

            <QuantityButton
              type="button"
              onClick={addQuantity}
            >
              +
            </QuantityButton>
          </QuantityControls>

          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchEnd"
            onClickAway={() =>
              setMaxOrderWorning(false)
            }
          >
            <Warning
              className={
                maxOrderWorning
                  ? "max-order-warning"
                  : "not-show"
              }
            >
              {t("purchaseOptions.max-order-warning")}
            </Warning>
          </ClickAwayListener>
        </QuantityArea>
      </QuantitySection>

      {/* =====================================================
          PURCHASE BUTTONS
      ===================================================== */}

      <PurchaseSection ref=  {purchaseRef}>
        <BuyButton
          dir={i18n.dir() === "ltr" ? "ltr" : "rtl"}
          className={!available ? "out-of-stock" : ""}
          type="button"
          disabled={available < 1}
          onClick={() =>
            buy_Now_item(
              currentSku,
              productData?.id,
              shippingInfo,
              productData?.name
            )
          }
        >
          <span>{available < 1 ? t("productPage.soldOut"):t("common.buyNow") }</span>
          <ArrowForwardIosOutlinedIcon
            style={{
              rotate:
                i18n.dir() === "ltr"
                  ? "0deg"
                  : "180deg",
            }}
          />
        </BuyButton>

        <AddButton
          type="button"
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
          <span>{t("common.addToCart")}</span>
        </AddButton>
      </PurchaseSection>
      <FixedAddBuyButtons
      currentSku={ currentSku}
  productData ={ productData}
  shippingInfo = {shippingInfo}
  buy_Now_item ={buy_Now_item}
   add_item_to_cart = {add_item_to_cart}
  purchaseRef = {purchaseRef}
      
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
const SecureCheckout = styled.div`
  margin-top: 18px;

  padding-top: 15px;

  border-top: 1px solid #eee9e2;

  text-align: center;
`;

const SecureImage = styled.img`
  display: block;

  width: 100%;

  max-width: 600px;

  height: auto;

  margin: 0 auto;

  opacity: 0.9;
  border-radius:8px;
`;

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

  padding-bottom: 18px;

  border-bottom: 1px solid #e9e4dc;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 16px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 0.82rem;
  font-weight: 600;

  color: #252525;

  .section-icon {
    font-size: 18px;
    color: #9b815f;
  }
`;

const CountrySelector = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  gap: 6px;

  select {
    appearance: none;
    -webkit-appearance: none;

    border: 0;
    outline: 0;

    background: transparent;

    padding: 3px 18px 3px 2px;

    max-width: 100px;

    font-size: 0.78rem;
    color: #333;

    cursor: pointer;
  }
`;

const ArrowDown = styled.span`
  position: absolute;

  right: 2px;

  pointer-events: none;

  font-size: 14px;

  color: #777;

  transform: translateY(-2px);
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

  border: 1px solid #e6dfd6;

  border-radius: 50%;

  background: #faf8f5;

  color: #9b815f;

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

const ShippingChangeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border: 0;

  background: transparent;

  color: #777;

  cursor: pointer;

  transition:
    color 180ms ease,
    transform 180ms ease;

  svg {
    font-size: 15px;
  }

  &:hover {
    color: #9b815f;

    transform: translateX(2px);
  }
`;

const DeliveryBadge = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;

  flex-shrink: 0;

  padding: 5px 8px;

  border: 1px solid #e5ded4;

  border-radius: 20px;

  background: #faf8f5;

  color: #777;

  font-size: 0.62rem;

  white-space: nowrap;

  span {
    color: #9b815f;

    font-weight: 700;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

/* =========================================================
   SECURITY
========================================================= */

const SecuritySection = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 11px;

  padding: 18px 0;

  border-bottom: 1px solid #e9e4dc;
`;

const SecurityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background: #faf8f5;

  color: #9b815f;

  svg {
    font-size: 17px;
  }
`;

const SecurityContent = styled.div`
  min-width: 0;
`;

const SecurityTitle = styled.div`
  margin-bottom: 5px;

  font-size: 0.8rem;

  font-weight: 600;

  color: #292929;
`;

const SecurityText = styled.p`
  margin: 0;

  max-width: 600px;

  font-size: 0.7rem;

  line-height: 1.6;

  color: #88827b;
`;

/* =========================================================
   QUANTITY
========================================================= */

const QuantitySection = styled.div`
  padding: 18px 0 20px;
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

    color: #9b815f;
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

  align-items: flex-start;

  min-height: 48px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  height: 38px;

  border: 1px solid #ddd7ce;

  border-radius: 3px;

  overflow: hidden;

  background: #fff;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;

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

    color: #9b815f;
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
  height: 38px;

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
   PURCHASE BUTTONS
========================================================= */

const PurchaseSection = styled.div`
  
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 2px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
     .out-of-stock {
  position: relative;
}

.out-of-stock::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background: #000000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-8deg);
  pointer-events: none;
}
  span{

    text-transform:uppercase;
  }
`;

const BuyButton = styled.button`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-height: 50px;

  border: 1px solid #9b815f;

  border-radius: 3px;

  background: #9b815f;

  color: #fff;

  font-size: 0.79rem;

  font-weight: 600;

  letter-spacing: 0.04em;

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;

  svg {
    font-size: 14px;

    transition: transform 180ms ease;
  }

  &:hover {
    background: #876e50;

    border-color: #876e50;

    svg {
      transform: translateX(2px);
    }
  }

  &:active {
    transform: scale(0.99);
  }
    &:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
 
`;

const AddButton = styled.button`
  min-height: 50px;

  border: 1px solid #252525;

  border-radius: 3px;

  background: #252525;

  color: #fff;

  font-size: 0.79rem;

  font-weight: 600;

  letter-spacing: 0.04em;

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease;

  &:hover {
    background: #111;

    border-color: #111;
  }
     &:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

/* =========================================================
   TRUST FOOTER
========================================================= */

const TrustFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 15px;

  padding-top: 13px;

  border-top: 1px solid #eeeae4;

  color: #8b867f;

  font-size: 0.64rem;

  line-height: 1.5;

  text-align: center;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;
`;

const TrustCheck = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 15px;
  height: 15px;

  border: 1px solid #b09a7c;

  border-radius: 50%;

  color: #9b815f;

  font-size: 9px;
`;

const TrustDivider = styled.span`
  width: 3px;
  height: 3px;

  border-radius: 50%;

  background: #cfc8bf;
`;