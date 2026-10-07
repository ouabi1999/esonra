import React, { useEffect } from "react";
import styled from "styled-components";

import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Flag from "react-world-flags";

import countriesData from "../../../../common/countryData.json";
import { setLocation } from "../../../features/locationSlice";

function PurchaseInfo({
  shippingInfo,
  addQuantity,
  maxOrderWorning,
  setMaxOrderWorning,
  subtractQuantity,
  quantity,
  add_item_to_cart,
  buy_Now_item,
  setIsPopUpShippingOpen,
  isPopUpShippingOpen,
  shippingMethodIndex,
  currentSku,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const country = useSelector(
    (state) => state.location.country
  );

  const productData = useSelector(
    (state) => state.product.productData
  );

  /*
   * Hide quantity warning when the customer scrolls
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
   * SHIPPING
   */

  const availableShipping =
    productData?.available_shipping || [];

  const selectedShipping =
    availableShipping[shippingMethodIndex];

  const shippingCost = selectedShipping
    ? Number(selectedShipping.cost)
    : Number(shippingInfo?.cost || 0);

  const isFreeShipping = shippingCost <= 0;

  const shippingMethod = isFreeShipping
    ? t("sideCard.free_Shipping")
    : selectedShipping?.methodName ||
      shippingInfo?.methodName ||
      "";

  /*
   * DELIVERY DATE
   */

  const deliveryFrom =
    shippingInfo?.date1?.slice(3, -4) || "";

  const deliveryTo =
    shippingInfo?.date2?.slice(3, -4) || "";

  /*
   * AVAILABLE STOCK
   */

  const availableStock = Math.max(
    0,
    Number(currentSku?.available_stock || 0) - quantity
  );

  return (
    <PurchaseContainer>

      {/* =====================================================
          PURCHASE INFORMATION HEADER
      ===================================================== */}

      <PurchaseHeader>
        <PurchaseHeading>
          {t("common.purchase") || "Purchase"}
        </PurchaseHeading>

        <PurchaseSubtitle>
          {t("sideCard.Security_&_Privacy.header")}
        </PurchaseSubtitle>
      </PurchaseHeader>


      {/* =====================================================
          SHIPPING INFORMATION
      ===================================================== */}

      <ShippingSection>

        {/* SHIP TO */}

        <InfoRow>
          <InfoLeft>
            <IconWrapper>
              <LocationOnOutlinedIcon />
            </IconWrapper>

            <InfoContent>
              <InfoLabel>
                {t("sideCard.Ship_to")}
              </InfoLabel>
            </InfoContent>
          </InfoLeft>

          <CountrySelector>

            {country && (
              <Flag
                code={country}
                height={13}
              />
            )}

            <select
              value={country || ""}
              onChange={(e) => {
                dispatch(
                  setLocation(e.target.value)
                );
              }}
              aria-label={t("sideCard.Ship_to")}
            >
              {countriesData?.map((item, index) => (
                <option
                  key={index}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

          </CountrySelector>
        </InfoRow>


        {/* SHIPPING METHOD */}

        <InfoRow>

          <InfoLeft>
            <IconWrapper>
              <LocalShippingOutlinedIcon />
            </IconWrapper>

            <InfoContent>

              <InfoLabel>
                {shippingMethod}
              </InfoLabel>

              {isFreeShipping && (
                <InfoDescription>
                  {t("sideCard.free_Shipping")}
                </InfoDescription>
              )}

            </InfoContent>
          </InfoLeft>


          {availableShipping.length > 0 && (
            <ShippingButton
              type="button"
              onClick={() =>
                setIsPopUpShippingOpen(
                  !isPopUpShippingOpen
                )
              }
              aria-label="Change shipping method"
            >
              <span>
                {t("common.change") || "Change"}
              </span>

              <ArrowForwardIosOutlinedIcon />
            </ShippingButton>
          )}

        </InfoRow>


        {/* DELIVERY */}

        <InfoRow>

          <InfoLeft>
            <IconWrapper>
              <DeliveryDiningIcon />
            </IconWrapper>

            <InfoContent>
              <InfoLabel>
                {t("sideCard.Delivrey")}
              </InfoLabel>
            </InfoContent>
          </InfoLeft>

          <DeliveryDate>
            {deliveryFrom} / {deliveryTo}
          </DeliveryDate>

        </InfoRow>

      </ShippingSection>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <SecuritySection>

        <SecurityHeader>

          <IconWrapper>
            <VerifiedUserOutlinedIcon />
          </IconWrapper>

          <SecurityTitle>
            {t(
              "sideCard.Security_&_Privacy.header"
            )}
          </SecurityTitle>

        </SecurityHeader>

        <SecurityText>
          {t(
            "sideCard.Security_&_Privacy.text"
          )}
        </SecurityText>

      </SecuritySection>


      {/* =====================================================
          QUANTITY
      ===================================================== */}

      <QuantitySection>

        <QuantityHeader>

          <QuantityTitle>

            <IconWrapper>
              <AutoAwesomeMotionOutlinedIcon />
            </IconWrapper>

            <span>
              {t("sideCard.Quantity")}
            </span>

          </QuantityTitle>


          <StockText>
            {availableStock}{" "}
            {t("sideCard.available")}
          </StockText>

        </QuantityHeader>


        <QuantityControl>

          <QuantityButton
            type="button"
            onClick={subtractQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </QuantityButton>


          <QuantityValue>
            {quantity}
          </QuantityValue>


          <QuantityButton
            type="button"
            onClick={addQuantity}
            aria-label="Increase quantity"
          >
            +
          </QuantityButton>

        </QuantityControl>


        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchEnd"
          onClickAway={() =>
            setMaxOrderWorning(false)
          }
        >

          <Warning
            $visible={maxOrderWorning}
          >
            {t("sideCard.max-order-warning")}
          </Warning>

        </ClickAwayListener>

      </QuantitySection>


      {/* =====================================================
          PURCHASE BUTTONS
      ===================================================== */}

      <PurchaseActions>

        <BuyButton
          type="button"
          disabled={!currentSku}
          onClick={() =>
            buy_Now_item(
              currentSku,
              productData?.id,
              shippingInfo,
              productData?.name
            )
          }
        >
          <span>
            {t("common.buyNow")}
          </span>

          <ButtonArrow>
            →
          </ButtonArrow>
        </BuyButton>


        <CartButton
          type="button"
          disabled={!currentSku}
          onClick={() =>
            add_item_to_cart(
              currentSku,
              productData?.id,
              shippingInfo,
              productData?.name
            )
          }
        >
          {t("common.addToCart")}
        </CartButton>

      </PurchaseActions>


      {/* =====================================================
          TRUST MESSAGE
      ===================================================== */}

      <TrustSection>

        <TrustItem>
          <TrustCheck>✓</TrustCheck>

          <span>
            {t(
              "sideCard.Security_&_Privacy.header"
            )}
          </span>
        </TrustItem>


        <TrustDivider />


        <TrustItem>
          <TrustCheck>✓</TrustCheck>

          <span>
            {t(
              "sideCard.Security_&_Privacy.text"
            )}
          </span>
        </TrustItem>

      </TrustSection>

    </PurchaseContainer>
  );
}

export default PurchaseInfo;


/* =========================================================
   MAIN CONTAINER
========================================================= */

const PurchaseContainer = styled.section`
  width: 100%;

  margin-top: 26px;
  padding-top: 24px;

  border-top: 1px solid #e9e4dc;

  color: #1c1c1c;

  box-sizing: border-box;
`;


/* =========================================================
   HEADER
========================================================= */

const PurchaseHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 20px;
`;

const PurchaseHeading = styled.h2`
  margin: 0;

  font-family: "Playfair Display", serif;

  font-size: 1.05rem;

  font-weight: 600;

  color: #1d1d1d;
`;

const PurchaseSubtitle = styled.span`
  font-size: 0.67rem;

  color: #938d84;

  letter-spacing: 0.03em;
`;


/* =========================================================
   SHIPPING
========================================================= */

const ShippingSection = styled.div`
  display: flex;

  flex-direction: column;

  gap: 17px;

  padding-bottom: 20px;

  border-bottom: 1px solid #eeeae4;
`;

const InfoRow = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  min-height: 30px;
`;

const InfoLeft = styled.div`
  display: flex;

  align-items: center;

  min-width: 0;

  gap: 10px;
`;

const IconWrapper = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  width: 22px;

  color: #a58a68;

  svg {
    font-size: 18px;
  }
`;

const InfoContent = styled.div`
  display: flex;

  flex-direction: column;

  min-width: 0;
`;

const InfoLabel = styled.span`
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.82rem;

  font-weight: 500;

  color: #303030;
`;

const InfoDescription = styled.span`
  margin-top: 2px;

  font-size: 0.67rem;

  color: #918b83;
`;


/* =========================================================
   COUNTRY
========================================================= */

const CountrySelector = styled.div`
  display: flex;

  align-items: center;

  flex-shrink: 0;

  gap: 6px;

  select {
    appearance: none;
    -webkit-appearance: none;

    border: none;
    outline: none;

    padding: 4px 2px;

    background: transparent;

    color: #333;

    font-size: 0.78rem;

    cursor: pointer;
  }
`;


/* =========================================================
   SHIPPING CHANGE
========================================================= */

const ShippingButton = styled.button`
  display: flex;

  align-items: center;

  gap: 5px;

  padding: 4px 0;

  border: none;

  background: transparent;

  color: #8f7658;

  font-size: 0.69rem;

  cursor: pointer;

  transition: color 180ms ease;

  svg {
    font-size: 12px;
  }

  &:hover {
    color: #5f4d39;
  }
`;


/* =========================================================
   DELIVERY DATE
========================================================= */

const DeliveryDate = styled.span`
  flex-shrink: 0;

  font-size: 0.78rem;

  color: #555;

  white-space: nowrap;
`;


/* =========================================================
   SECURITY
========================================================= */

const SecuritySection = styled.div`
  padding: 19px 0;

  border-bottom: 1px solid #eeeae4;
`;

const SecurityHeader = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;
`;

const SecurityTitle = styled.span`
  font-size: 0.82rem;

  font-weight: 600;

  color: #282828;
`;

const SecurityText = styled.p`
  margin: 8px 0 0;

  padding-left: 32px;

  max-width: 600px;

  font-size: 0.72rem;

  line-height: 1.6;

  color: #88827b;
`;


/* =========================================================
   QUANTITY
========================================================= */

const QuantitySection = styled.div`
  padding: 20px 0 18px;
`;

const QuantityHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 12px;
`;

const QuantityTitle = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 0.82rem;

  font-weight: 600;

  color: #282828;
`;

const StockText = styled.span`
  font-size: 0.7rem;

  color: #8b857d;

  text-align: right;
`;

const QuantityControl = styled.div`
  display: flex;

  align-items: center;

  width: fit-content;

  border: 1px solid #dcd6cd;

  border-radius: 2px;

  overflow: hidden;
`;

const QuantityButton = styled.button`
  display: flex;

  align-items: center;

  justify-content: center;

  width: 40px;

  height: 36px;

  padding: 0;

  border: none;

  background: #faf9f7;

  color: #282828;

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

  height: 36px;

  border-left: 1px solid #dcd6cd;

  border-right: 1px solid #dcd6cd;

  background: #fff;

  font-size: 0.82rem;

  color: #292929;
`;


/* =========================================================
   WARNING
========================================================= */

const Warning = styled.span`
  display: block;

  min-height: 17px;

  margin-top: 7px;

  font-size: 0.72rem;

  color: #bd4b4b;

  opacity: ${({ $visible }) =>
    $visible ? 1 : 0};

  transition: opacity 180ms ease;
`;


/* =========================================================
   PURCHASE BUTTONS
========================================================= */

const PurchaseActions = styled.div`
  display: grid;

  grid-template-columns: 1.15fr 1fr;

  gap: 10px;

  width: 100%;
`;

const BuyButton = styled.button`
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  min-height: 50px;

  padding: 0 18px;

  border: 1px solid #9b815f;

  border-radius: 2px;

  background: #9b815f;

  color: #fff;

  font-size: 0.79rem;

  font-weight: 600;

  letter-spacing: 0.04em;

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease;

  &:hover:not(:disabled) {
    background: #876d4e;

    border-color: #876d4e;
  }

  &:disabled {
    opacity: 0.4;

    cursor: not-allowed;
  }
`;

const ButtonArrow = styled.span`
  position: absolute;

  right: 16px;

  font-size: 16px;

  font-weight: 400;
`;

const CartButton = styled.button`
  min-height: 50px;

  padding: 0 18px;

  border: 1px solid #292929;

  border-radius: 2px;

  background: #292929;

  color: #fff;

  font-size: 0.79rem;

  font-weight: 600;

  letter-spacing: 0.04em;

  cursor: pointer;

  transition:
    background 180ms ease,
    border-color 180ms ease;

  &:hover:not(:disabled) {
    background: #111;

    border-color: #111;
  }

  &:disabled {
    opacity: 0.4;

    cursor: not-allowed;
  }
`;


/* =========================================================
   TRUST
========================================================= */

const TrustSection = styled.div`
  display: flex;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 15px;

  padding-bottom: 3px;

  color: #89837b;

  font-size: 0.65rem;

  line-height: 1.5;

  text-align: center;
`;

const TrustItem = styled.div`
  display: flex;

  align-items: center;

  gap: 5px;

  max-width: 300px;
`;

const TrustCheck = styled.span`
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 15px;

  height: 15px;

  border: 1px solid #a58a68;

  border-radius: 50%;

  color: #a58a68;

  font-size: 9px;

  flex-shrink: 0;
`;

const TrustDivider = styled.span`
  color: #c9c3bb;
`;


/* =========================================================
   RESPONSIVE
========================================================= */

const MobileStyle = styled.div``;