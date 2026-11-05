import React, {
  useContext,
  useRef,
} from "react";

import styled from "styled-components";
import { useSelector } from "react-redux";

import Billing from "./Billing";
import StripeContanier from "./StripeContanier";
import { FormContext } from "../../../pages/CheckoutPage";
import Shipping from "./Shipping";
import { OrderContext } from "../../../App";
import { useTranslation } from "react-i18next";

function Steps() {
  const user = useSelector((state) => state.auth.user);

  const shippingRef = useRef(null);

  const {
    activeStepIndex,
    setActiveStepIndex,
  } = useContext(FormContext);

  const { setFormData } = useContext(OrderContext);

  const { t, i18n } = useTranslation();

  /* =====================================================
     NEXT
  ===================================================== */

  const handleNext = () => {
    // Billing -> Shipping
    if (activeStepIndex === 0) {
      setFormData((prev) => ({
        ...prev,
        userId: user?.id,
      }));

      setActiveStepIndex(1);
      return;
    }

    // Shipping -> Payment
    if (activeStepIndex === 1) {
      shippingRef.current?.submitShipping();
    }
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    setActiveStepIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  /* =====================================================
     STEP CONTENT
  ===================================================== */

  let stepContent = null;

  switch (activeStepIndex) {
    case 0:
      stepContent = (
        <Billing t={t} i18n={i18n} />
      );
      break;

    case 1:
      stepContent = (
        <Shipping
          ref={shippingRef}
          t={t}
        />
      );
      break;

    case 2:
      stepContent = (
        <StripeContanier
          i18n={i18n}
          t={t}
        />
      );
      break;

    default:
      stepContent = null;
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <Container
      dir={i18n.dir() === "ltr" ? "ltr" : "rtl"}
    >
      {stepContent}

      {/* STEP 0: BILLING */}

      {activeStepIndex === 0 && (
        <SingleButtonWrapper>
          <button
            type="submit"
            form="billing-form"
            className="next-button"
          >
            {t("common.next")}
          </button>
        </SingleButtonWrapper>
      )}

      {/* STEP 1: SHIPPING */}

      {activeStepIndex === 1 && (
        <ButtonsContainer>
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            {t("common.back")}
          </button>

          <button
            type="button"
            className="next-button"
            onClick={handleNext}
          >
            {t("common.next")}
          </button>
        </ButtonsContainer>
      )}

      {/* STEP 2: PAYMENT */}

      {activeStepIndex === 2 && (
        <ButtonsContainer>
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            {t("common.back")}
          </button>
        </ButtonsContainer>
      )}
    </Container>
  );
}

export default Steps;

/* =====================================================
   MAIN CONTAINER
===================================================== */

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-height: 500px;

  position: sticky;
  top: 0;

  box-sizing: border-box;

  .next-button {
    min-width: 150px;
    max-width: 200px;
    width: 100%;
    height: 50px;
    border-radius: 4px;
    padding: 0 34px;

    border: 1px solid #1d1c1a;
    background: #000000;
    color: #ffffff;

    font-family: Georgia, serif;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;

    cursor: pointer;

    transition:
      background 0.3s ease,
      border-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      background: #3a332d;
      border-color: #3a332d;
      transform: translateY(-2px);

      box-shadow:
        0 8px 20px
        rgba(29, 28, 26, 0.12);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .back-button {
    min-width: 150px;
    max-width: 200px;
    width: 100%;
    height: 50px;
    border-radius: 4px;
    padding: 0 34px;

    border: 1px solid #d8d3ca;
    background: transparent;
    color: #5a534a;

    font-family: Georgia, serif;
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;

    cursor: pointer;

    transition:
      background 0.3s ease,
      border-color 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;

    &:hover {
      background: #f7f5f0;
      border-color: #9a8d78;
      color: #1d1c1a;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    min-height: auto;

    .next-button,
    .back-button {
      width: 100%;
      max-width: 140px;
      min-width: 0;
      height: 50px;
      font-size: 9px;
    }
  }
`;

const SingleButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  border-radius: 4px;

  justify-content: center;

  margin: 25px 0;

  min-width: 150px;
  max-width: 200px;
  width: 100%;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ButtonsContainer = styled.div`
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;
  flex-wrap: nowrap;

  gap: 14px;
  margin: 25px;
`;