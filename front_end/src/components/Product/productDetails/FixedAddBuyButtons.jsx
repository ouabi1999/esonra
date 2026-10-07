
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useTranslation } from "react-i18next";

export default function FixedAddBuyButtons({
  available,
  currentSku,
  productData,
  shippingInfo,
  buy_Now_item,
  add_item_to_cart,
  purchaseRef
}) {
  const { t, i18n } = useTranslation();
  const [showFixed, setShowFixed] = useState(false);

  useEffect(() => {
    if (!purchaseRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show fixed buttons when the original buttons
        // are no longer visible
        setShowFixed(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(purchaseRef.current);

    return () => {
      observer.disconnect();
    };
  }, [purchaseRef]);

  if (!showFixed) return null;

  const isOutOfStock = available < 1;

  return (
    <FixedPurchaseBar>
      <PurchaseSection dir={i18n.dir()}>

        <BuyButton
          dir={i18n.dir()}
          className={isOutOfStock ? "out-of-stock" : ""}
          type="button"
          disabled={isOutOfStock}
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
            {isOutOfStock
              ? t("productPage.soldOut")
              : t("common.buyNow")}
          </span>

          <ArrowForwardIosOutlinedIcon
            style={{
              transform:
                i18n.dir() === "ltr"
                  ? "rotate(0deg)"
                  : "rotate(180deg)",
            }}
          />
        </BuyButton>


        <AddButton
          type="button"
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
          <span>{t("common.addToCart")}</span>
        </AddButton>

      </PurchaseSection>
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

  width: 40%;

  padding: 12px 20px;

  background: rgba(255, 255, 255, 0.96);

  border-top: 1px solid #e8e4df;

  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.06);

  backdrop-filter: blur(10px);

  box-sizing: border-box;

   @media (max-width: 1120px) {
    width:100%;
  }
`;


/* ============================================================
   PURCHASE SECTION
============================================================ */

const PurchaseSection = styled.div`
  width: 100%;

  max-width: 700px;

  margin: 0 auto;

  display: flex;

  flex-direction: row;

  gap: 10px;

  box-sizing: border-box;

  direction: ltr;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;


/* ============================================================
   BUY NOW
============================================================ */

const BuyButton = styled.button`
  flex: 1;

  min-height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 0 20px;

  border: 1px solid #111;

  background: #111;

  color: #fff;

  font-size: 14px;

  font-weight: 500;

  letter-spacing: 0.3px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  svg {
    font-size: 15px;
  }

  &:hover:not(:disabled) {
    background: #2a2a2a;
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }

  &.out-of-stock {
    background: #888;

    border-color: #888;
  }

  @media (max-width: 600px) {
    min-height: 48px;

    padding: 0 12px;

    font-size: 13px;
  }
`;


/* ============================================================
   ADD TO CART
============================================================ */

const AddButton = styled.button`
  flex: 1;

  min-height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0 20px;

  border: 1px solid #111;

  background: #fff;

  color: #111;

  font-size: 14px;

  font-weight: 500;

  letter-spacing: 0.3px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background: #111;

    color: #fff;
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    min-height: 48px;

    padding: 0 12px;

    font-size: 13px;
  }
`;