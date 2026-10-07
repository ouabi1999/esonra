import React, { useState, useEffect, useContext, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { useSelector } from "react-redux";

import CheckoutForm from "./CheckoutForm";
import { FormContext } from "../../../pages/CheckoutPage";
import SkeletonLoader from "../Skeleton";
import { OrderContext } from "../../../App";
import ApiInstance from "../../../../common/baseUrl";

// Stripe is loaded only when the checkout route/component is loaded.
// Keeping this outside the component also prevents recreating the promise.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function StripeContanier({ t, i18n }) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);
  const { formData, setFormData } = useContext(OrderContext);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const paymentIntentCreated = useRef(false);
   const selectedCurrency = useSelector(
       (state) => state.currency.selectedCurrency
     );

  const ordered_items =
    cartItems?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      sku_attr: item.selectedSku?.sku_attr,
    })) || [];

  /*
   * Create PaymentIntent
   */
  useEffect(() => {
    if (paymentIntentCreated.current) return;

    if (!formData?.totalPrice) return;
    if (!cartItems?.length) return;

    paymentIntentCreated.current = true;
    setIsLoading(true);

    ApiInstance.post("create-payment-intent/", {
      user: formData.userId,

      first_name: formData.logistics_address?.firstName,
      last_name: formData.logistics_address?.lastName,

      city: formData.logistics_address?.city,
      address1: formData.logistics_address?.address1,
      zipcode: formData.logistics_address?.zip,
      state: formData.logistics_address?.state,
      country: formData.logistics_address?.country,

      email: formData.logistics_address?.email,

      shipping_method: formData.shippingMethod,
      payment_method: "Credit Card",

      shipping_price: formData.shippingPrice,
      delivery_time: formData.deliveryTime,

      total_price: formData.totalPrice,
      currency: "usd",

      ordered_items: JSON.stringify(ordered_items),
    })
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.error("Failed to create PaymentIntent:", error);

        // Allow retry if the request failed.
        paymentIntentCreated.current = false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    formData?.totalPrice,
    formData?.userId,
    formData?.shippingMethod,
    formData?.shippingPrice,
    formData?.deliveryTime,
    formData?.logistics_address,
    cartItems,
  ]);

  /*
   * Google Analytics - add_payment_info
   */
  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    if (!cartItems?.length) return;

    window.gtag("event", "add_payment_info", {
      currency: "USD",
      value: Number(formData?.totalPrice || 0),

      items: cartItems.map((item) => ({
        item_id: item?.selectedSku?.sku_attr || item?.id,

        item_name:
          item?.name?.[i18n.language] ||
          item?.name?.en ||
          "Luxury Lamp",

        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
      })),
    });
  }, [cartItems, formData?.totalPrice, i18n.language]);

  /*
   * Stripe appearance
   */
  const appearance = {
    theme: "flat",

    // Keep your existing luxury design.
    labels: "floating",

    variables: {
      colorPrimary: "#B39A76",
      colorBackground: "#F7F5F0",

      colorText: "#1D1C1A",
      colorTextSecondary: "#77736B",

      colorDanger: "#B42318",

      borderRadius: "0px",

      spacingUnit: "5px",
    },
  };

  const options = {
    clientSecret,
    appearance,
    loader: "auto",
    locale: i18n.language || "en",
  };

  return (
    <Container>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div
          style={{
            padding: "0 10px",
            width: "30vw",
            minWidth: "320px",
          }}
        >
          <SkeletonLoader />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 50px;
`;