import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import styled from "styled-components";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ClickAwayListener from "@mui/material/ClickAwayListener";

import {
  removeFromCart,
  addQuantity,
  subtractQuantity,
} from "../../features/cartSlice";

import EmptyCart from "./EmptyCart";

import CurrencyPrice from "../../../common/CurrencyPrice";

import ProductSubtotalSlideOut from "./ProductSubtotalSlideOut";


function SlideOutShoppingCart({ isOpen , onClose }) {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );


  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;


  return (
    <Overlay>

      <Backdrop />

      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={onClose}
      >
        <Drawer
          dir={i18n.dir() === "rtl" ? "rtl" : "ltr"}
        >

          {/* HEADER */}
          <DrawerHeader>

            <Title>
              {t("common.shopping_cart")}
            </Title>

            <CloseButton
              type="button"
              onClick={onClose}
              aria-label="Close shopping cart"
            >
              ×
            </CloseButton>

          </DrawerHeader>


          {/* CONTENT */}
          <DrawerContent>

            {cartItems?.length === 0 ? (

              <EmptyWrapper>
                <EmptyCart t={t} />
              </EmptyWrapper>

            ) : (

              <>
                <Products>

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

                        {/* IMAGE */}
                        <ProductImage>
                          <img
                            src={image}
                            alt={
                              item?.selectedSku?.colorKey ||
                              productName
                            }
                          />
                        </ProductImage>


                        {/* INFO */}
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


                          {/* BOTTOM */}
                          <ProductBottom>

                            <Price>
                              <CurrencyPrice
                                price={item.price}
                              />
                            </Price>


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

                </Products>


                {/* SUBTOTAL */}
                <SubtotalWrapper>

                  <ProductSubtotalSlideOut
                    cartItems={cartItems}
                    t={t}
                  />

                </SubtotalWrapper>

              </>
            )}

          </DrawerContent>

        </Drawer>
      </ClickAwayListener>

    </Overlay>
  );
}


export default SlideOutShoppingCart;


/* ============================================================
   OVERLAY
============================================================ */

const Overlay = styled.div`
  position: fixed;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 9999;

  pointer-events: none;
`;


/* ============================================================
   BACKDROP
============================================================ */

const Backdrop = styled.div`
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.35);

  animation: fadeIn 0.25s ease;

  pointer-events: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;


/* ============================================================
   DRAWER
============================================================ */

const Drawer = styled.aside`
  position: fixed;

  top: 0;
  right: 0;
  width: min(560px, 100vw);

  height: 100dvh;

  display: flex;
  flex-direction: column;

  background: #faf9f7;

  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);

  pointer-events: auto;

  animation: slideIn 0.3s
    cubic-bezier(0.22, 1, 0.36, 1);

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @media (max-width: 600px) {
    width: 100%;
     top: 35px;
  right: 50%;
  transform: translateX(50%);

  height: 90dvh;
    width: min(360px, 100vw);
  }
`;


/* ============================================================
   HEADER
============================================================ */

const DrawerHeader = styled.header`
  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 70px;

  padding: 0 24px;

  background: #fff;

  border-bottom: 1px solid #ebe7e1;

  box-sizing: border-box;
`;


/* ============================================================
   TITLE
============================================================ */

const Title = styled.h2`
  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 22px;

  font-weight: 400;

  color: #181818;
`;


/* ============================================================
   CLOSE
============================================================ */

const CloseButton = styled.button`
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;

  background: transparent;

  font-size: 28px;

  font-weight: 300;

  line-height: 1;

  color: #555;

  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #111;

    transform: rotate(90deg);
  }
`;


/* ============================================================
   CONTENT
============================================================ */

const DrawerContent = styled.div`
  flex: 1 1 auto;

  min-height: 0;

  display: flex;

  flex-direction: column;

  box-sizing: border-box;
`;


/* ============================================================
   PRODUCTS
============================================================ */

const Products = styled.div`
  width: 100%;

  flex: 1 1 auto;

  min-height: 0;

  background: #fff;

  box-sizing: border-box;

  overflow-y: auto;

  overflow-x: hidden;

  overscroll-behavior: contain;
`;


/* ============================================================
   PRODUCT
============================================================ */

const ProductContainer = styled.article`
  width: 100%;

  display: flex;

  align-items: stretch;

  gap: 15px;

  padding: 18px;

  box-sizing: border-box;

  border-bottom: 1px solid #ebe7e1;
`;


/* ============================================================
   PRODUCT IMAGE
============================================================ */

const ProductImage = styled.div`
  flex: 0 0 82px;

  width: 82px;

  height: 100px;

  overflow: hidden;

  background: #f3f1ed;

  box-sizing: border-box;

  img {
    display: block;

    width: 100%;

    height: 100%;

    object-fit: cover;
  }
`;


/* ============================================================
   PRODUCT INFO
============================================================ */

const ProductInfo = styled.div`
  flex: 1 1 auto;

  min-width: 0;

  min-height: 100px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
`;


/* ============================================================
   PRODUCT TOP
============================================================ */

const ProductTop = styled.div`
  width: 100%;

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 8px;

  min-width: 0;
`;


/* ============================================================
   PRODUCT NAME
============================================================ */

const ProductName = styled.h3`
  flex: 1 1 auto;

  min-width: 0;

  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 15px;

  font-weight: 400;

  line-height: 1.4;

  color: #222;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
`;


/* ============================================================
   DELETE
============================================================ */

const DeleteButton = styled.button`
  width: 28px;

  height: 28px;

  flex: 0 0 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  border: none;

  background: transparent;

  color: #969088;

  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;

  svg {
    font-size: 20px;
  }

  &:hover {
    color: #181818;

    transform: scale(1.05);
  }
`;


/* ============================================================
   VARIANT
============================================================ */

const ProductVariant = styled.div`
  margin-top: 4px;

  font-size: 12px;

  line-height: 1.4;

  color: #888;
`;


/* ============================================================
   PRODUCT BOTTOM
============================================================ */

const ProductBottom = styled.div`
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;
`;


/* ============================================================
   PRICE
============================================================ */

const Price = styled.div`
  font-size: 14px;

  color: #222;
`;


/* ============================================================
   QUANTITY
============================================================ */

const Quantity = styled.div`
  display: flex;

  align-items: center;

  border: 1px solid #dedad4;

  background: #fff;
`;


/* ============================================================
   QUANTITY BUTTON
============================================================ */

const QuantityButton = styled.button`
  width: 28px;

  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0;

  border: none;

  background: transparent;

  color: #222;

  font-size: 17px;

  line-height: 1;

  cursor: pointer;

  transition: background 0.2s ease;

  &:hover {
    background: #f4f2ef;
  }
`;


/* ============================================================
   QUANTITY VALUE
============================================================ */

const QuantityValue = styled.span`
  min-width: 28px;

  text-align: center;

  font-size: 13px;

  color: #222;
`;


/* ============================================================
   SUBTOTAL
============================================================ */

const SubtotalWrapper = styled.div`
  flex: 0 0 auto;

  width: 100%;

  background: #faf9f7;

  border-top: 1px solid #ebe7e1;

  box-sizing: border-box;
`;


/* ============================================================
   EMPTY CART
============================================================ */

const EmptyWrapper = styled.div`
  flex: 1;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  padding: 30px;

  box-sizing: border-box;
`;