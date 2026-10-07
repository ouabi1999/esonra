import React, { useState } from "react";
import styled from "styled-components";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import ApiInstance from "../../../common/baseUrl";

function NewsLetter() {
  const [isLoading, setIsLoading] = useState(false);

  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("errors.validation_error"))
      .required(t("errors.required")),
  });

  const handleSubscribe = async (values, { resetForm }) => {
    try {
      setIsLoading(true);

      await ApiInstance.post("subscribe-newsletter/", {
        email: values.email,
      });

      resetForm();

      toast.success(
        t("common.success")
      );
    } catch (error) {
      console.error(
        "Newsletter subscription error:",
        error
      );

      const message =
        error?.response?.data?.error ||
        t("errors.error_email_already_exists");

      toast.error(t`errors.${message}`);

      
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema,

    onSubmit: handleSubscribe,
  });

  const hasError =
    formik.touched.email &&
    Boolean(formik.errors.email);

  return (
    <>
      <Container
        onSubmit={formik.handleSubmit}
        dir={isRTL ? "rtl" : "ltr"}
      >

        <SubscribeRow>

          {/* EMAIL INPUT */}
          <InputWrapper $error={hasError}>

            <MailWrapper>
              <MailOutlineIcon />
            </MailWrapper>

            <EmailInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t(
                "footer.newsletter.placeholder"
              )}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={hasError}
            />

          </InputWrapper>


          {/* BUTTON */}
          <SubscribeButton
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress
                size={17}
                thickness={3}
              />
            ) : (
              <span>
                {t(
                  "footer.newsletter.subscribeButton"
                )}
              </span>
            )}
          </SubscribeButton>

        </SubscribeRow>


        {/* VALIDATION */}
        {hasError && (
          <ErrorMessage>
            {formik.errors.email}
          </ErrorMessage>
        )}
<div>
  <ToastContainer
    position={isRTL ? "top-right" : "top-left"}
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    style={{ zIndex: 4 }}
   

  />
</div>
      </Container>

 
    </>
  );
}

export default NewsLetter;


/* =========================================================
   CONTAINER
========================================================= */

const Container = styled.form`
  width: 100%;

  margin-top: 0;
  .Toastify__toast-container {
  z-index: 11 !important;
}
`;


/* =========================================================
   SUBSCRIBE ROW
========================================================= */

const SubscribeRow = styled.div`
  width: 100%;

  min-height: 54px;

  display: flex;

  align-items: stretch;

  gap: 10px;

  @media (max-width: 520px) {
    flex-direction: column;

    gap: 10px;
  }
`;


/* =========================================================
   INPUT WRAPPER
========================================================= */

const InputWrapper = styled.div`
  flex: 1;

  min-width: 0;

  height: 54px;

  display: flex;

  align-items: center;

  background: #f8f6f1;

  border: 1px solid
    ${({ $error }) =>
      $error
        ? "#b66b63"
        : "rgba(35, 33, 29, 0.16)"};

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &:focus-within {
    border-color: #b8955b;

    box-shadow:
      0 0 0 3px
      rgba(184, 149, 91, 0.09);
  }
`;


/* =========================================================
   MAIL ICON
========================================================= */

const MailWrapper = styled.div`
  width: 52px;

  height: 100%;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #9b7b45;

  border-inline-end: 1px solid
    rgba(35, 33, 29, 0.1);

  svg {
    font-size: 20px;
  }
`;


/* =========================================================
   INPUT
========================================================= */

const EmailInput = styled.input`
  width: 100%;

  height: 100%;
  min-height:54px;

  min-width: 0;

  padding: 0 17px;

  border: none;

  outline: none;

  background: transparent;

  color: #292723;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 13px;

  font-weight: 400;

  text-align: start;

  &::placeholder {
    color: #99948b;

    opacity: 1;
  }

  &:focus::placeholder {
    color: #b2ada4;
  }

  @media (max-width: 520px) {
    font-size: 12px;
  }
`;


/* =========================================================
   BUTTON
========================================================= */

const SubscribeButton = styled.button`
  width: 145px;

  min-height: 54px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid #292723;

  background: #292723;

  color: #f8f6f1;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;

  &:hover:not(:disabled) {
    background: #b8955b;

    border-color: #b8955b;

    color: #fff;
  }

  &:disabled {
    cursor: wait;

    opacity: 0.65;
  }

  @media (max-width: 520px) {
    width: 100%;

    height: 50px;

    min-height: 50px;
  }
`;


/* =========================================================
   ERROR
========================================================= */

const ErrorMessage = styled.p`
  margin: 8px 2px 0;

  color: #a95e57;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 10px;

  line-height: 1.5;

  text-align: start;
`;