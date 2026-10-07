import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CurrencyPrice from "../../../common/CurrencyPrice";
function ProductSubtotal(props) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation()
  const selectedCurrency = useSelector(
    (state) => state.currency.selectedCurrency
  );  
  
  const subtotal =
    props.cartItems?.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    ) || 0;
  const navigateTo = () => {
   
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
      <Summary>

        {/* HEADER */}


        <Title>
          {props.t("common.orderSummary")}
        </Title>


        {/* TOTALS */}

        <Totals>
           <Row>
            <Label>
              {props.t("common.shipping")}
            </Label>

            <Value>
              <CurrencyPrice  price ={0.00}/>
              
            </Value>
          </Row>

          <Row>
            <Label>
              {props.t("common.subtotal")}
            </Label>

            <Value>
              <CurrencyPrice  price ={subtotal.toFixed(2)}/>
              
            </Value>
          </Row>


          <Row>
            <Label>
              {props.t("common.total")}
            </Label>

            <TotalValue>
              <CurrencyPrice  price ={subtotal.toFixed(2)}/>
            </TotalValue>
          </Row>

        </Totals>


        {/* CHECKOUT */}

        <CheckoutButton
          type="button"
          onClick={navigateTo}
        >
          {props.t("common.checkout")}
        </CheckoutButton>

        <SecureText>
          {props.t("footer.payment.secure")}
        </SecureText>

      </Summary>
    </Container>
  );
}

export default ProductSubtotal;


/* ============================================================
   CONTAINER
============================================================ */

const Container = styled.div`
  width: 100%;
`;


/* ============================================================
   SUMMARY
============================================================ */

const Summary = styled.div`
  width: 100%;

  box-sizing: border-box;

  padding: 15px 32px;

  background: #fff;

  border: 1px solid #e8e3dc;

  @media (max-width: 500px) {
    padding: 25px 20px;
  }
`;


/* ============================================================
   EYEBROW
============================================================ */

const Eyebrow = styled.div`
  margin-bottom: 10px;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 3px;

  text-transform: uppercase;

  color: #9a9288;
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

  font-size: 23px;

  font-weight: 400;

  line-height: 1.3;

  color: #1c1c1c;
`;


/* ============================================================
   TOTALS
============================================================ */

const Totals = styled.div`
  margin-top: 30px;

  padding: 20px 0;

  border-top: 1px solid #ebe7e1;

  border-bottom: 1px solid #ebe7e1;
`;


/* ============================================================
   ROW
============================================================ */

const Row = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  &:first-child {
    margin-bottom: 15px;
  }
`;


/* ============================================================
   LABEL
============================================================ */

const Label = styled.span`
  font-size: 12px;

  letter-spacing: 0.3px;

  color: #777169;
`;


/* ============================================================
   VALUE
============================================================ */

const Value = styled.span`
  font-size: 13px;

  color: #333;

  white-space: nowrap;
`;


/* ============================================================
   TOTAL VALUE
============================================================ */

const TotalValue = styled.span`
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 18px;

  color: #181818;

  white-space: nowrap;
`;


/* ============================================================
   CHECKOUT BUTTON
============================================================ */

const CheckoutButton = styled.button`
  width: 100%;

  height: 50px;

  margin-top: 25px;

  border: 1px solid #1b1b1b;

  background: #1b1b1b;

  color: #fff;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 2px;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    background: #fff;

    color: #1b1b1b;

    border-color: #1b1b1b;
  }

  &:active {
    transform: translateY(1px);
  }
`;


/* ============================================================
   SECURE TEXT
============================================================ */

const SecureText = styled.div`
  margin-top: 14px;

  text-align: center;

  font-size: 11px;

  letter-spacing: 1.2px;

  text-transform: uppercase;

  color: #a29a91;
`;