import React, { useLayoutEffect, useEffect } from "react";
import {
  removeFromCart,
  addQuantity,
  subtractQuantity,
} from "../../features/cartSlice";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styled from "styled-components";

import EmptyCart from "./EmptyCart";
import ProductSubtotal from "./ProductSubtotal";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SEO from "../SEO/SEO"
import CurrencyPrice from "../../../common/CurrencyPrice";


function ShoppingCart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (!cartItems?.length) return;

    if (typeof window.gtag !== "function") return;

    const items = cartItems.map((item) => ({
      item_id: item?.selectedSku?.sku_attr || item?.id,
      item_name:
        item?.name?.en || "Luxury Lamp",
      price: Number(item?.price || 0),
      quantity: Number(item?.quantity || 1),
    }));

    const value = items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    window.gtag("event", "view_cart", {
      currency: "USD",
      value,
      items,
    });
  }, [cartItems]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);




  return (
    <Container>
      <SEO title="Shopping Cart" />
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header>

        <Title>
          {t("common.shopping_cart")}
        </Title>

        <CartCount>
          {cartItems?.length || 0}{" "}
          {cartItems?.length === 1
            ? t("common.item")
            : t("common.items")}
        </CartCount>

        <HeaderLine />
      </Header>


      {/* =====================================================
          EMPTY CART
      ===================================================== */}

      {cartItems?.length === 0 ? (
        <EmptyWrapper>
          <EmptyCart t={t} />
        </EmptyWrapper>
      ) : (
        <Wrap>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <Wrapper dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}>
            {cartItems?.map((item, index) => {
              const productName =
                item?.name?.[i18n.language] ||
                item?.name?.en ||
                "";

              const image =
                item?.selectedSku?.attributes?.[
                  item?.selectedSku?.colorKey
                ]?.image;

              return (
                <ProductContainer
                  key={`${item.id}-${index}`}
                >

                  {/* PRODUCT IMAGE */}

                  <ProductImage>
                    <img
                      src={image}
                      alt={
                        item?.selectedSku?.colorKey ||
                        productName
                      }
                    />
                  </ProductImage>


                  {/* PRODUCT INFORMATION */}

                  <ProductInfo>

                    <ProductTop>

                      <ProductName>
                        {productName}
                      </ProductName>

                      <DeleteButton
                        type="button"
                        aria-label="Remove product"
                        onClick={() =>
                          dispatch(
                            removeFromCart(index)
                          )
                        }
                      >
                        <DeleteOutlineIcon />
                      </DeleteButton>

                    </ProductTop>


                    {/* VARIANT */}

                    {item?.size && (
                      <ProductVariant>
                        {item.size}
                      </ProductVariant>
                    )}


                    <ProductBottom>

                      <Price>
                        <CurrencyPrice price={item.price}/>
                      </Price>


                      {/* QUANTITY */}

                      <Quantity>

                        <QuantityButton
                          type="button"
                          onClick={() =>
                            dispatch(
                              subtractQuantity(index)
                            )
                          }
                        >
                          −
                        </QuantityButton>

                        <QuantityValue>
                          {item.quantity}
                        </QuantityValue>

                        <QuantityButton
                          type="button"
                          onClick={() =>
                            dispatch(
                              addQuantity(index)
                            )
                          }
                        >
                          +
                        </QuantityButton>

                      </Quantity>

                    </ProductBottom>

                  </ProductInfo>

                </ProductContainer>
              );
            })}
          </Wrapper>


          {/* =================================================
              SUBTOTAL
          ================================================= */}

          <SubtotalWrapper>
            <ProductSubtotal
              cartItems={cartItems}
              t={t}
            />
          </SubtotalWrapper>

        </Wrap>
      )}
    </Container>
  );
}

export default ShoppingCart;


/* ============================================================
   CONTAINER
============================================================ */
/* ============================================================
   CONTAINER
============================================================ */

const Container = styled.main`
  width: 100%;
  min-height: 90vh;

  background: #faf9f7;
  color: #1b1b1b;

  padding: 55px 0 100px;

  box-sizing: border-box;

  @media (max-width: 1000px) {
    padding: 48px 0 80px;
  }

  @media (max-width: 700px) {
    padding: 38px 0 70px;
  }

  @media (max-width: 500px) {
    padding: 30px 0 55px;
  }

  @media (max-width: 360px) {
    padding: 26px 0 45px;
  }
`;


/* ============================================================
   HEADER
============================================================ */

const Header = styled.header`
  width: 100%;
  box-sizing: border-box;

  text-align: center;

  margin: 0 auto 55px;
  padding: 0 20px;

  @media (max-width: 1000px) {
    margin-bottom: 45px;
  }

  @media (max-width: 700px) {
    margin-bottom: 38px;
    padding: 0 16px;
  }

  @media (max-width: 500px) {
    margin-bottom: 32px;
    padding: 0 12px;
  }
`;


/* ============================================================
   EYEBROW
============================================================ */

const Eyebrow = styled.div`
  margin-bottom: 12px;

  font-size: 10px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;

  color: #9a9288;

  @media (max-width: 500px) {
    margin-bottom: 9px;

    font-size: 9px;
    letter-spacing: 3px;
  }
`;


/* ============================================================
   TITLE
============================================================ */

const Title = styled.h1`
  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(27px, 4vw, 38px);

  font-weight: 400;
  line-height: 1.2;

  color: #181818;

  word-break: break-word;
`;


/* ============================================================
   CART COUNT
============================================================ */

const CartCount = styled.div`
  margin-top: 10px;

  color: #8b847b;

  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.8px;

  @media (max-width: 500px) {
    margin-top: 8px;

    font-size: 11px;
    letter-spacing: 0.5px;
  }
`;


/* ============================================================
   HEADER LINE
============================================================ */

const HeaderLine = styled.div`
  width: 40px;
  height: 1px;

  margin: 20px auto 0;

  background: #aaa298;

  @media (max-width: 500px) {
    width: 32px;
    margin-top: 16px;
  }
`;


/* ============================================================
   MAIN WRAPPER
============================================================ */

const Wrap = styled.div`
  width: min(1180px, calc(100% - 40px));

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(300px, 350px);

  align-items: start;

  gap: 45px;

  box-sizing: border-box;

  @media (max-width: 1100px) {
    width: min(100% - 32px, 900px);

    grid-template-columns:
      minmax(0, 1fr)
      minmax(280px, 330px);

    gap: 30px;
  }

  @media (max-width: 900px) {
    width: min(100% - 32px, 720px);

    grid-template-columns: 1fr;

    gap: 28px;
  }

  @media (max-width: 500px) {
    width: calc(100% - 24px);

    gap: 22px;
  }

  @media (max-width: 360px) {
    width: calc(100% - 18px);

    gap: 18px;
  }
`;


/* ============================================================
   PRODUCT LIST
============================================================ */

const Wrapper = styled.div`
  width: 100%;

  background: #fff;

  border: 1px solid #ebe7e1;

  box-sizing: border-box;

  overflow: hidden;
`;


/* ============================================================
   PRODUCT
============================================================ */

const ProductContainer = styled.article`
  width: 100%;

  display: flex;
  align-items: stretch;

  gap: 24px;

  padding: 24px;

  box-sizing: border-box;

  border-bottom: 1px solid #ebe7e1;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 700px) {
    gap: 18px;

    padding: 20px;
  }

  @media (max-width: 550px) {
    gap: 15px;

    padding: 16px;
  }

  @media (max-width: 420px) {
    gap: 12px;

    padding: 14px;
  }

  @media (max-width: 350px) {
    gap: 10px;

    padding: 12px;
  }
`;


/* ============================================================
   PRODUCT IMAGE
============================================================ */

const ProductImage = styled.div`
  flex: 0 0 125px;

  width: 125px;
  height: 150px;

  overflow: hidden;

  background: #f3f1ed;

  box-sizing: border-box;

  @media (max-width: 700px) {
    flex-basis: 105px;

    width: 105px;
    height: 125px;
  }

  @media (max-width: 550px) {
    flex-basis: 92px;

    width: 92px;
    height: 112px;
  }

  @media (max-width: 420px) {
    flex-basis: 80px;

    width: 80px;
    height: 100px;
  }

  @media (max-width: 350px) {
    flex-basis: 72px;

    width: 72px;
    height: 90px;
  }

  img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.035);
  }
`;


/* ============================================================
   PRODUCT INFO
============================================================ */

const ProductInfo = styled.div`
  flex: 1 1 auto;

  min-width: 0;
  min-height: 150px;

  display: flex;
  flex-direction: column;

  justify-content: space-between;

  box-sizing: border-box;

  @media (max-width: 700px) {
    min-height: 125px;
  }

  @media (max-width: 550px) {
    min-height: 112px;
  }

  @media (max-width: 420px) {
    min-height: 100px;
  }

  @media (max-width: 350px) {
    min-height: 90px;
  }
`;


/* ============================================================
   PRODUCT TOP
============================================================ */

const ProductTop = styled.div`
  width: 100%;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;

  min-width: 0;
`;


/* ============================================================
   PRODUCT NAME
============================================================ */

const ProductName = styled.h2`
  flex: 1 1 auto;

  min-width: 0;

  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 16px;
  font-weight: 400;

  line-height: 1.4;

  color: #222;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 700px) {
    font-size: 15px;
  }

  @media (max-width: 550px) {
    font-size: 14px;
  }

  @media (max-width: 420px) {
    font-size: 13px;
  }

  @media (max-width: 350px) {
    font-size: 12px;
  }
`;


/* ============================================================
   DELETE
============================================================ */

const DeleteButton = styled.button`
  width: 32px;
  height: 32px;

  flex: 0 0 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;

  background: transparent;

  color: #969088;

  cursor: pointer;

  transition:
    color 0.25s ease,
    transform 0.25s ease;

  -webkit-tap-highlight-color: transparent;

  svg {
    font-size: 20px;
  }

  &:hover {
    color: #1b1b1b;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: 550px) {
    width: 28px;
    height: 28px;

    flex-basis: 28px;

    svg {
      font-size: 18px;
    }
  }

  @media (max-width: 350px) {
    width: 25px;
    height: 25px;

    flex-basis: 25px;

    svg {
      font-size: 17px;
    }
  }
`;


/* ============================================================
   VARIANT
============================================================ */

const ProductVariant = styled.div`
  margin-top: 7px;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 1.5px;
  text-transform: uppercase;

  color: #9a9288;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 550px) {
    margin-top: 5px;

    font-size: 9px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 350px) {
    font-size: 8px;
    letter-spacing: 1px;
  }
`;


/* ============================================================
   PRODUCT BOTTOM
============================================================ */

const ProductBottom = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  margin-top: 14px;

  min-width: 0;

  @media (max-width: 550px) {
    gap: 8px;

    margin-top: 10px;
  }

  @media (max-width: 350px) {
    margin-top: 8px;
  }
`;


/* ============================================================
   PRICE
============================================================ */

const Price = styled.span`
  flex: 0 1 auto;

  min-width: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 16px;

  color: #242424;

  white-space: nowrap;

  @media (max-width: 550px) {
    font-size: 14px;
  }

  @media (max-width: 420px) {
    font-size: 13px;
  }

  @media (max-width: 350px) {
    font-size: 12px;
  }
`;


/* ============================================================
   QUANTITY
============================================================ */

const Quantity = styled.div`
  flex: 0 0 auto;

  display: flex;
  align-items: center;

  height: 34px;

  border: 1px solid #dcd7d0;

  background: #fff;

  box-sizing: border-box;

  @media (max-width: 550px) {
    height: 31px;
  }

  @media (max-width: 420px) {
    height: 29px;
  }

  @media (max-width: 350px) {
    height: 27px;
  }
`;


/* ============================================================
   QUANTITY BUTTON
============================================================ */

const QuantityButton = styled.button`
  width: 32px;
  height: 100%;

  padding: 0;

  border: none;

  background: transparent;

  color: #333;

  font-size: 17px;
  font-weight: 300;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #f4f1ed;
    color: #000;
  }

  &:active {
    background: #eeeae4;
  }

  @media (max-width: 550px) {
    width: 29px;

    font-size: 16px;
  }

  @media (max-width: 420px) {
    width: 26px;

    font-size: 15px;
  }

  @media (max-width: 350px) {
    width: 24px;

    font-size: 14px;
  }
`;


/* ============================================================
   QUANTITY VALUE
============================================================ */

const QuantityValue = styled.span`
  min-width: 28px;

  padding: 0 2px;

  text-align: center;

  font-size: 12px;

  color: #292929;

  box-sizing: border-box;

  @media (max-width: 550px) {
    min-width: 25px;

    font-size: 11px;
  }

  @media (max-width: 420px) {
    min-width: 23px;

    font-size: 10px;
  }
`;


/* ============================================================
   SUBTOTAL
============================================================ */

const SubtotalWrapper = styled.aside`
  width: 100%;

  position: sticky;

  top: 25px;

  min-width: 0;

  @media (max-width: 900px) {
    position: static;
  }
`;


/* ============================================================
   EMPTY CART
============================================================ */

const EmptyWrapper = styled.div`
  width: min(900px, calc(100% - 40px));

  margin: 0 auto;

  background: #fff;

  border: 1px solid #ebe7e1;

  padding: 50px 30px;

  box-sizing: border-box;

  @media (max-width: 700px) {
    width: calc(100% - 32px);

    padding: 42px 24px;
  }

  @media (max-width: 500px) {
    width: calc(100% - 24px);

    padding: 35px 18px;
  }

  @media (max-width: 360px) {
    width: calc(100% - 18px);

    padding: 30px 14px;
  }
`;