
import React, { useEffect, useState, useContext } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styled from "styled-components";
import {colors} from "../../../utilis/colors"
import {
  CreditCardOutlined,
  LocalShippingOutlined,
  CheckCircle,
} from "@mui/icons-material";

import { FormContext } from "../../../pages/CheckoutPage";
import { OrderContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import ApiInstance from "../../../../common/baseUrl";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CurrencyPrice from "../../../../common/CurrencyPrice";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { formData } = useContext(OrderContext);

  const { total } = useContext(FormContext);
   const shippingPrice = Number(
    formData?.shippingPrice || 0
  );

  

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCOD, setIsLoadingCOD] = useState(false);
  const [message, setMessage] = useState("");

  const ordered_items =
    cartItems?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      sku: item.selectedSku?.sku_attr,
      price: item.price,
    })) || [];

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(
      window.location.search
    ).get("payment_intent_client_secret");

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage(t("checkoutPage.paymentSuccess"));
          break;

        case "processing":
          setMessage(t("checkoutPage.paymentProcessing"));
          break;

        case "requires_payment_method":
          setMessage(t("checkoutPage.paymentFailed"));
          break;

        default:
          setMessage(t("checkoutPage.paymentError"));
      }
    });
  }, [stripe, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://esonra.com/order-success",
        },
      });

      if (error) {
        setMessage(error.message || t("checkoutPage.paymentError"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(t("checkoutPage.paymentError"));
    } finally {
      setIsLoading(false);
    }
  };

  const createCashOnDeliveryOrder = async () => {
    console.log(formData);
    if (isLoadingCOD || !cartItems?.length) return;

    setIsLoadingCOD(true);
    setMessage("");

    try {
      await ApiInstance.post("create-order/", {
        user: formData.userId,
        first_name: formData.logistics_address?.firstName,
        last_name: formData.logistics_address?.lastName,
        city: formData.logistics_address?.city,
        address1: formData.logistics_address?.address1,
        address2: formData.logistics_address?.address2,
        zipcode: formData.logistics_address?.zip,
        state: formData.logistics_address?.state,
        country: formData.logistics_address?.country,
        phoneNumber: formData.logistics_address?.phoneNumber,
        email: formData.logistics_address?.email,
        shipping_method: formData.shippingMethod,
        payment_method: "Cash on delivery",
        shipping_price: formData.shippingPrice,
        delivery_time: formData.deliveryTime,
        total_price: formData.totalPrice,
        ordered_items: JSON.stringify(ordered_items)
      });

      console.log("COD order created successfully.");
    } catch (error) {
      console.error("COD order error:", error);

      setMessage(
        error.response?.data?.detail ||
          t("checkoutPage.orderCreationError")
      );
    } finally {
      setIsLoadingCOD(false);
    }
  };


   const finalTotal =
    Number(total || 0) +
    shippingPrice;
  return (
    <Container>
      {/* Header */}
      <div className="payment-header">
        <h3>{t("checkoutPage.paymentMethod")}</h3>
        <p>{t("checkoutPage.paymentDescription")}</p>
      </div>

      {/* Payment method options */}
      <div className="payment-options">
        <button
          type="button"
          className={`payment-option ${
            paymentMethod === "card" ? "selected" : ""
          }`}
          onClick={() => {
            setPaymentMethod("card");
            setMessage("");
          }}
        >
          <div className="option-icon">
            <CreditCardOutlined />
          </div>

          <div className="option-text">
            <strong>{t("checkoutPage.creditCard")}</strong>
            <span>{t("checkoutPage.creditCardDescription")}</span>
          </div>

          <div className="option-check">
            {paymentMethod === "card" && <CheckCircle />}
          </div>
        </button>

        <button
          type="button"
          className={`payment-option ${
            paymentMethod === "cod" ? "selected" : ""
          }`}
          onClick={() => {
            setPaymentMethod("cod");
            setMessage("");
          }}
        >
          <div className="option-icon">
            <LocalShippingOutlined />
          </div>

          <div className="option-text">
            <strong>{t("checkoutPage.cashOnDelivery")}</strong>
            <span>{t("checkoutPage.cashOnDeliveryDescription")}</span>
          </div>

          <div className="option-check">
            {paymentMethod === "cod" && <CheckCircle />}
          </div>
        </button>
      </div>

      {/* Payment content - same permanent width for both methods */}
      <div className="payment-content">
        {paymentMethod === "card" ? (
          <>
            <div className="content-heading">
              <div className="heading-icon">
                <CreditCardOutlined />
              </div>

              <div>
                <strong>{t("checkoutPage.cardDetails")}</strong>
                <span>{t("checkoutPage.securePayment")}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <PaymentElement />

              {message && (
                <div className="message error-message">{message}</div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !stripe || !elements}
              >
                {isLoading ? (
                  <span className="spinner" />
                ) : (
                  t("checkoutPage.payNow")
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="content-heading">
              <div className="heading-icon">
                <LocalShippingOutlined />
              </div>

              <div>
                <strong>{t("checkoutPage.payWhenDelivered")}</strong>
                <span>{t("checkoutPage.codInformation")}</span>
              </div>
            </div>

            <div className="cod-information">
              <CheckCircle />
              <p>{t("checkoutPage.codInformation")}</p>
            </div>

            {message && (
              <div className="message error-message">{message}</div>
            )}

            <button
              type="button"
              className="submit-button"
              onClick={createCashOnDeliveryOrder}
              disabled={isLoadingCOD || !cartItems?.length}
            >
              {isLoadingCOD ? (
                <span className="spinner" />
              ) : (
                t("checkoutPage.confirmOrder")
              )}
            </button>
          </>
        )}
      </div>

      {/* Total price */}
      <div className="order-total">
        <div className="total-label">
          <span>{t("checkoutPage.totalToPay")}</span>
          <small>{t("checkoutPage.includingShipping")}</small>
        </div>

        <strong>
          
          <CurrencyPrice price={finalTotal.toFixed(2)} />
        </strong>
      </div>

      {/* Security note */}
      <div className="secure-note">
        <span className="secure-icon">🔒</span>
        <p>{t("checkoutPage.securePayment")}</p>
      </div>
    </Container>
  );
}


const Container = styled.div`
  width: min(42vw, 620px);
  min-width: 420px;
  margin: 0 auto;
  box-sizing: border-box;

  .payment-header {
    margin-bottom: 22px;

    h3 {
      margin: 0 0 7px;
      font-size: 19px;
      font-weight: 600;
      color: ${colors.text};
    }

    p {
      margin: 0;
      font-size: 13px;
      color: ${colors.textSecondary};
      line-height: 1.6;
    }
  }

  .payment-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    width: 100%;
  }

  .payment-option {
    width: 100%;
    min-width: 0;
    min-height: 90px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    background: ${colors.surface};
    transition: border-color 0.2s ease, background 0.2s ease;

    &.selected {
      border-color: ${colors.accent};
      background: ${colors.background};
    }

    .option-icon {
      flex-shrink: 0;
      color: ${colors.secondary};

      svg {
        font-size: 24px;
      }
    }

    .option-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;

      strong {
        color: ${colors.text};
        font-size: 13px;
        font-weight: 600;
      }

      span {
        color: ${colors.textSecondary};
        font-size: 11px;
        line-height: 1.4;
      }
    }

    .option-check {
      width: 19px;
      flex-shrink: 0;
      color: ${colors.accent};

      svg {
        font-size: 19px;
      }
    }
  }

  .payment-content {
    width: 100%;
    min-width: 0;
    min-height: 250px;
    margin-top: 18px;
    padding: 25px;
    box-sizing: border-box;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    background: ${colors.surface};

    .content-heading {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-bottom: 25px;

      .heading-icon {
        width: 42px;
        height: 42px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        background: ${colors.background};
        color: ${colors.secondary};

        svg {
          font-size: 22px;
        }
      }

      > div:last-child {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;

        strong {
          color: ${colors.text};
          font-size: 14px;
          font-weight: 600;
        }

        span {
          color: ${colors.textSecondary};
          font-size: 11px;
          line-height: 1.5;
        }
      }
    }

    form {
      width: 100%;
      min-width: 0;
    }

    .cod-information {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin: 20px 0 25px;
      padding: 14px;
      border-radius: 8px;
      background: ${colors.background};

      svg {
        flex-shrink: 0;
        margin-top: 1px;
        color: ${colors.success};
        font-size: 18px;
      }

      p {
        margin: 0;
        color: ${colors.textSecondary};
        font-size: 12px;
        line-height: 1.6;
      }
    }
  }

  .submit-button {
    width: 100%;
    min-height: 50px;
    margin-top: 22px;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    border-radius: 7px;
    background: ${colors.primary};
    color: ${colors.surface};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover:not(:disabled) {
      background: ${colors.secondary};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .message {
    margin-top: 15px;
    font-size: 12px;
    line-height: 1.5;
  }

  .error-message {
    color: ${colors.error};
  }

  .order-total {
    width: 100%;
    margin-top: 16px;
    padding: 20px 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    box-sizing: border-box;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    background: ${colors.background};

    .total-label {
      display: flex;
      flex-direction: column;
      gap: 5px;

      span {
        color: ${colors.text};
        font-size: 14px;
        font-weight: 600;
      }

      small {
        color: ${colors.textSecondary};
        font-size: 11px;
      }
    }

    > strong {
      color: ${colors.accent};
      font-size: 21px;
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;

    .secure-icon {
      font-size: 13px;
    }

    p {
      margin: 0;
      color: ${colors.textSecondary};
      font-size: 11px;
    }
  }

  .spinner {
    width: 17px;
    height: 17px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: ${colors.surface};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    width: 65vw;
    min-width: 0;
    max-width: 620px;
  }

  @media (max-width: 600px) {
    width: 90vw;

    .payment-options {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .payment-option {
      min-height: 75px;
      padding: 14px;
    }

    .payment-content {
      min-height: 220px;
      padding: 18px;
    }

    .order-total {
      padding: 17px 18px;

      > strong {
        font-size: 18px;
      }
    }
  }
`;
