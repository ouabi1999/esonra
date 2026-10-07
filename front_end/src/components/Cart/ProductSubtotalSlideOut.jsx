import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CurrencyPrice from "../../../common/CurrencyPrice";

function ProductSubtotalSlideOut(props) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const savedCountry = window.localStorage.getItem("country")
  const selectedCurrency = useSelector(
    (state) => state.currency.selectedCurrency
  );

  const subtotal =
    props.cartItems?.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    ) || 0;
const navigateToCheckout = () => {
   
    if (typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        currency:selectedCurrency,
        value: subtotal,
        items: props.cartItems.map((item) => ({
          item_id:  item?.id,
          item_name:  item?.name?.[i18n.language] ||
                item?.name?.en
                 || "Luxury Lamp",
          price: Number(item?.price || 0),
          quantity: Number(item?.quantity || 1),
        })),
      });
    }
     navigate("/checkout");
  };


  return (
    <Container dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}>
      <TotalRow>
        <TotalLabel>
          {props.t("common.total")}
        </TotalLabel>

        <TotalPrice>
          <CurrencyPrice price={subtotal.toFixed(2)} />
        </TotalPrice>
      </TotalRow>

      <Shipping>
        <bdi>
        <ShippingIcon>📦</ShippingIcon>

        <ShippingText>
          {props.t("shoppingCart.freeExpressTo")} {props.t(`countries.${savedCountry}`)}
        </ShippingText>
        </bdi>
      </Shipping>

      <ContinueButton
        type="button"
        onClick={() => navigate("/")}
      >
        {props.t("common.continueShopping")}
      </ContinueButton>

      <CheckoutButton
        type="button"
        onClick={navigateToCheckout}
      >
        <LockOutlinedIcon />

        <span>
          {props.t("common.checkout")}
        </span>
      </CheckoutButton>
    </Container>
  );
}

export default ProductSubtotalSlideOut;


/* ============================================================
   CONTAINER
============================================================ */

const Container = styled.div`
  width: 100%;

  padding: 22px 18px 18px;

  background: #f7f7f4;

  box-sizing: border-box;
`;


/* ============================================================
   TOTAL
============================================================ */

const TotalRow = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
`;


/* ============================================================
   TOTAL LABEL
============================================================ */

const TotalLabel = styled.h2`
  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 30px;
  font-weight: 400;

  line-height: 1;

  color: #222;
`;


/* ============================================================
   TOTAL PRICE
============================================================ */

const TotalPrice = styled.div`
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 25px;
  font-weight: 400;

  line-height: 1;

  color: #222;

  white-space: nowrap;
`;


/* ============================================================
   SHIPPING
============================================================ */

const Shipping = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  margin-top: 18px;

  color: #6d6d6d;
`;


/* ============================================================
   SHIPPING ICON
============================================================ */

const ShippingIcon = styled.span`
  font-size: 16px;

  line-height: 1;
`;


/* ============================================================
   SHIPPING TEXT
============================================================ */

const ShippingText = styled.span`
  font-size: 14px;

  line-height: 1.2;
`;


/* ============================================================
   CONTINUE SHOPPING
============================================================ */

const ContinueButton = styled.button`
  width: 100%;
  height: 52px;

  margin-top: 20px;

  border: 2px solid #1b1b1b;

  background: transparent;

  color: #111;

  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.3px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: #1b1b1b;
    color: #fff;
  }
`;


/* ============================================================
   CHECKOUT
============================================================ */

const CheckoutButton = styled.button`
  width: 100%;
  height: 52px;

  margin-top: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  border: 1px solid #111;

  background: #111;

  color: #fff;

  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.3px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  svg {
    font-size: 21px;
  }

  &:hover {
    background: #fff;
    color: #111;
  }

  &:active {
    transform: translateY(1px);
  }
`;