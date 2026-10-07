import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";

import { OrderContext } from "../../App";
import { FormContext } from "../../pages/CheckoutPage";
import CurrencyPrice from "../../../common/CurrencyPrice";

function ProductCart() {
  const { total } = useContext(FormContext);
  const { formData } = useContext(OrderContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const { t, i18n } = useTranslation();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError(
        t("common.please_enter_coupon_code")
      );
      setCouponSuccess("");
      setDiscountAmount(0);
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      // Temporary loading simulation.
      // Replace this later with your Django API request.
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      const code = couponCode.trim().toUpperCase();

      if (code === "ENOUZA10") {
        const discount = Number(total) * 0.1;

        setDiscountAmount(discount);
        setCouponSuccess(
          t("common.discount_code_applied")
        );
      } else {
        setDiscountAmount(0);
        setCouponSuccess("");
        setCouponError(
          t("common.invalid_discount_code")
        );
      }
    } catch (error) {
      setDiscountAmount(0);
      setCouponSuccess("");
      setCouponError(
        t("common.invalid_discount_code")
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const shippingPrice = Number(
    formData?.shippingPrice || 0
  );

  const finalTotal =
    Number(total || 0) +
    shippingPrice -
    discountAmount;

  return (
    <Container>
      <div className="header-container">
        <div>
          <span className="checkout">
            ENOUZA — {t("common.checkout")}
          </span>
        </div>
      </div>

      <Wrapper>
        <div className="product-container">
          {cartItems?.map((item, index) => {
            const image =
              item?.selectedSku?.attributes?.[
                item?.selectedSku?.colorKey
              ]?.image;

            const productName =
              item?.name?.[i18n.language] ||
              item?.name?.[
                i18n.language?.split("-")[0]
              ] ||
              item?.name?.en ||
              "";

            return (
              <div
                className="child-container"
                key={
                  item?.id
                    ? `${item.id}-${item?.selectedSku?.sku || index}`
                    : index
                }
              >
                <div className="img-container">
                  {image && (
                    <img
                      src={image}
                      alt={
                        item?.selectedSku?.colorKey ||
                        productName ||
                        "Product"
                      }
                    />
                  )}

                  <div className="quantity">
                    <span>{item.quantity}</span>
                  </div>
                </div>

                <span className="product-title">
                  {productName}
                </span>

                <span className="price">
                    <CurrencyPrice price=
                  {(
                    Number(item?.price || 0) *
                    Number(item?.quantity || 0)
                  ).toFixed(2)}/>
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="discount-wrapper"
          dir={
            i18n.language?.startsWith("ar")
              ? "rtl"
              : "ltr"
          }
        >
          <div className="discount">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError("");
                setCouponSuccess("");
                setDiscountAmount(0);
              }}
              placeholder={t(
                "common.enterCouponCode"
              )}
              disabled={couponLoading}
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading}
            >
              {couponLoading ? (
                <CircularProgress
                  size={18}
                  thickness={5}
                  sx={{
                    color: "#ffffff",
                  }}
                />
              ) : (
                t("common.apply")
              )}
            </button>
          </div>

          {couponError && (
            <span className="coupon-error">
              {couponError}
            </span>
          )}

          {couponSuccess && (
            <span className="coupon-success">
              {couponSuccess}
            </span>
          )}
        </div>

        <Totals
          dir={
            i18n.language?.startsWith("ar")
              ? "rtl"
              : "ltr"
          }
        >
          <div>
            <span>{t("common.subtotal")}</span>

            <span>
                <CurrencyPrice price={Number(total || 0).toFixed(2)}/>
            </span>
          </div>

          <div>
            <span>{t("common.shipping")}</span>

            <span>
               <CurrencyPrice price={shippingPrice.toFixed(2)}/>
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="discount-total">
              <span>
                {t("common.discount")}
              </span>

              <span>
                -<CurrencyPrice price ={discountAmount.toFixed(2)}/>
              </span>
            </div>
          )}

          <div className="Total-price">
            <span>
              {t("common.total")}</span>

            <span>
              <CurrencyPrice price = {finalTotal.toFixed(2)}/>
            </span>
          </div>
        </Totals>
      </Wrapper>
    </Container>
  );
}

export default ProductCart;


/* =========================
   CHECKOUT CONTAINER
========================= */

const Container = styled.div`
  position: sticky;
  top: 0;


  height:100%;
  display: flex;
  flex-direction: column;

  background: #f7f5f0;

  .checkout {
    color: #1d1c1a;

    font-size: 17px;
    font-weight: 500;

    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .header-container {
    min-height: 73px;

    display: flex;
    align-items: center;

    padding: 0 15%;

    background: #f7f5f0;
    border-bottom: 1px solid #e4ded4;
     font-family:
      "Playfair Display",
      "Cormorant Garamond",
      Georgia,
      serif !important;
  }

  .header-container > div {
    width: 100%;
  }

  @media (max-width: 900px) {
    position: relative;

    height: auto;
    min-height: auto;

    border-left: none;

    .header-container {
      min-height: 68px;
      padding: 0 20px;
    }

    .checkout {
      font-size: 15px;
      letter-spacing: 1px;
    }
  }

  @media (max-width: 500px) {
    .header-container {
      min-height: 62px;
      padding: 0 16px;
      margin:auto;
    }

    .checkout {
      font-size: 14px;
      letter-spacing: 0.8px;
    }
  }
`;


/* =========================
   CONTENT
========================= */

const Wrapper = styled.div`
  width: 100%;
  max-width: 620px;

  margin: 0 auto;
  padding: 30px 8%;

  box-sizing: border-box;

  .product-container {
    max-height: 320px;

    overflow-y: auto;

    border-bottom: 1px solid #e4ded4;

    padding: 4px 0;

    scrollbar-width: thin;
    scrollbar-color: #ded4c4 transparent;
  }

  .product-container::-webkit-scrollbar {
    width: 4px;
  }

  .product-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .product-container::-webkit-scrollbar-thumb {
    background: #ded4c4;
  }

  .child-container {
    display: grid;

    grid-template-columns: 74px minmax(0, 1fr) auto;

    align-items: center;
    gap: 16px;

    padding: 18px 0;

    border-bottom: 1px solid #e4ded4;
  }

  .child-container:last-child {
    border-bottom: none;
  }

  .img-container {
    position: relative;

    width: 74px;
    height: 88px;

    background: #ffffff;
    border: 1px solid #e4ded4;
  }

  .product-container img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;
  }

  .quantity {
    position: absolute;

    top: -8px;
    right: -8px;

    min-width: 18px;
    height: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 2px;

    background: #1d1c1a;
    color: #ffffff;

    border: 2px solid #ffffff;
    border-radius: 50%;

    font-size: 11px;
    font-weight: 500;
  }

  .product-title {
    min-width: 0;

    color: #1d1c1a;

    font-size: 14px;
    font-weight: 400;

    line-height: 1.5;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .price {
    color: #1d1c1a;

    font-size: 14px;
    font-weight: 500;

    white-space: nowrap;
  }


  /* =========================
     DISCOUNT
  ========================= */

  .discount-wrapper {
    margin: 28px 0;
  }

  .discount {
    display: flex;
    align-items: center;
  }

  .discount input {
    flex: 1;
    min-width: 0;

    height: 52px;

    padding: 0 16px;

    background: #ffffff;
    color: #1d1c1a;

    font-size: 16px;

    border: 1px solid #e4ded4;
    border-inline-end: none;
    border-radius: 0;

    outline: none;

    transition: border-color 0.25s ease;
  }

  .discount input::placeholder {
    color: #77736b;
  }

  .discount input:focus {
    border-color: #b39a76;
  }

  .discount button {
    width: 105px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #1d1c1a;
    color: #ffffff;

    border: none;

    font-size: 12px;
    font-weight: 500;

    letter-spacing: 1px;
    text-transform: uppercase;

    white-space: nowrap;
    cursor: pointer;

    transition: background 0.25s ease;
  }

  .discount button:not(:disabled):hover {
    background: #3a332d;
  }

  .discount button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .coupon-error,
  .coupon-success {
    display: block;

    margin-top: 9px;

    font-size: 12px;
  }

  .coupon-error {
    color: #b85c5c;
  }

  .coupon-success {
    color: #5d7a5d;
  }


  /* =========================
     MOBILE
  ========================= */

  @media (max-width: 900px) {
    max-width: none;

    padding: 24px 20px;

    .product-container {
      max-height: 350px;
    }
  }

  @media (max-width: 500px) {
    padding: 20px 16px 28px;

    .product-container {
      max-height: 310px;
    }

    .child-container {
      grid-template-columns: 64px minmax(0, 1fr) auto;

      gap: 12px;

      padding: 15px 0;
    }

    .img-container {
      width: 64px;
      height: 76px;
    }

    .product-title {
      font-size: 13px;
    }

    .price {
      font-size: 13px;
    }

    .discount-wrapper {
      margin: 24px 0;
    }

    .discount input {
      height: 50px;

      padding: 0 12px;

      font-size: 16px;
    }

    .discount button {
      width: auto;
      height: 50px;

      padding: 0 14px;

      font-size: 11px;
    }
  }
`;


/* =========================
   TOTALS
========================= */

const Totals = styled.div`
  margin-top: 10px;

  border-top: 1px solid #e4ded4;
  border-bottom: 1px solid #e4ded4;

  padding: 18px 0 8px;

  background: transparent;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 9px 0;

    color: #77736b;

    font-size: 14px;
  }

  & > div span:last-child {
    color: #1d1c1a;
    font-weight: 400;
  }

  .discount-total span:last-child {
    color: #5d7a5d;
  }

  .Total-price {
    margin-top: 12px;

    padding: 18px 0 14px;

    border-top: 1px solid #e4ded4;

    color: #1d1c1a;

    font-size: 18px;
    font-weight: 500;
  }

  .Total-price span:last-child {
    font-size: 24px;
    font-weight: 500;

    letter-spacing: -0.5px;
  }

  @media (max-width: 500px) {
    padding-top: 14px;

    & > div {
      font-size: 13px;
    }

    .Total-price {
      margin-top: 10px;

      padding-top: 16px;

      font-size: 16px;
    }

    .Total-price span:last-child {
      font-size: 22px;
    }
  }
`;

