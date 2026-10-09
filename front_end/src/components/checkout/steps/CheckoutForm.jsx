import React, { useEffect, useState, useContext } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styled from "styled-components";

;
import { FormContext } from "../../../pages/CheckoutPage";
import { OrderContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import ApiInstance from "../../../../common/baseUrl";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCOD, setIsLoadingCOD] = useState(false);

  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [creditCard, setCreditCard] = useState(true);

  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);
  const { formData, setFormData } = useContext(OrderContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const {t, i18n} = useTranslation()
  const [successOrder, setSuccessOrder] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://esonra.com/order-success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };
 
   const CreatCashONDeliveryOrder = () => {
    setIsLoadingCOD(true);
    ApiInstance.post("create-order/",

      {
        user: formData.userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        city: formData.city,
        address1: formData.address1,
        address2: formData.address2,
        zipcode: formData.zip,
        state: formData.state,
        country: formData.country,
        shipping_method: formData.shippingMethod,
        payment_method: "Cash on delivery",
        shipping_price: formData.shippingPrice,
        delivery_time: formData.deliveryTime,
        total_price: formData.totalPrice,
        currency: "usd",
        ordered_items: JSON.stringify(cartItems),
      }
    ).then((res) => {
      navigate("/order-success");
      setIsLoadingCOD(false);

    }).catch(error => {
      console.log(error)
      setIsLoadingCOD(false);

    });
  };
 
  return (
    <>
      {/*<div>
        <Radio
          name="Cash On Delivery"
          checked={cashOnDelivery}
          onChange={() => {
            setCashOnDelivery(true);
            setCreditCard(false);
          }}
        />
        <span>Cash On Delivery</span>
      </div>
      <div>
        <Radio
          name="Credit Card"
          checked={creditCard}
          onChange={() => {
            setCashOnDelivery(false);
            setCreditCard(true);
          }}
        />
        <span>Credit Card</span>
      </div>*/}

    <Container>
      {creditCard && (
        <form
          id="payment-form"
          onSubmit={handleSubmit}
        >
          <PaymentElement />
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                t("common.payNow")
              )}
            </span>
          </button>
          {/* Show any error or success messages */}
         
        </form>
      )}
      {/*cashOnDelivery && <button onClick={CreatCashONDeliveryOrder}>
      <span id="button-text">
              {isLoadingCOD ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "buy Now"
              )}
            </span></button>*/}
    </Container>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;

  form {
    width: 30vw;
    min-width: 340px;
    align-self: center;
    border: 1px solid #e4ded4;
    border-radius: 7px;
    padding: 15px;
    box-sizing: border-box;
  }

  #payment-message {
    color: rgb(105, 115, 134);
    font-size: 14px;
    line-height: 20px;
    padding-top: 12px;
    text-align: center;
  }

  button {
    background: #b18952;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 15px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition:
      background 0.2s ease,
      opacity 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  button:hover:not(:disabled) {
    filter: contrast(115%);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .spinner {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: checkout-spin 0.7s linear infinite;
    margin:auto;
  }

  @keyframes checkout-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 1000px) {
    form {
      width: 50vw;
      min-width: 320px;
    }
  }

  @media only screen and (max-width: 480px) {
    form {
      width: 100%;
      min-width: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 1.5s;
    }
  }
`;
