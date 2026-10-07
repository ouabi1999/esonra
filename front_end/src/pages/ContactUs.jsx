import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import ApiInstance from "../../common/baseUrl";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO/SEO";

function ContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setIsLoading] = useState(false);

  const { t, i18n } = useTranslation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const handldSendEmail = (event) => {
    event.preventDefault();

    if (message !== "" && email !== "") {
      setIsLoading(true);

      ApiInstance.post("contact-us/", {
        email: email,
        message: message,
      })
        .then(() => {
          setIsLoading(false);

          toast.success(
            t("success.message_sent_successfully")
          );

          setEmail("");
          setMessage("");
        })
        .catch((error) => {
          console.log(error);

          toast.error(
            t("errors.server_error")
          );

          setIsLoading(false);
        });
    }
  };

  return (
    <Container dir={i18n.dir()}>
      <SEO
      title="Contact Enouza"
      description="Contact Enouza for questions about our luxury lamps, orders, shipping, returns, or any other assistance."
      canonical="/contact-us"
    />

      <ContactWrapper>
        <ContactHeader>
          <Title>
            {t("footer.help.contactUs")}
          </Title>

          <Description>
            {t("footer.help.contact_note")}
          </Description>
        </ContactHeader>

        <Form onSubmit={handldSendEmail}>
          {/* =================================================
              EMAIL
          ================================================= */}

          <Field>
            <Label htmlFor="email">
              {t("common.email")}
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder={t(
                "common.please_enter_your_email"
              )}
              required
            />
          </Field>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <Field>
            <Label htmlFor="message">
              {t("common.message")}
            </Label>

            <Textarea
              id="message"
              value={message}
              maxLength={105}
              required
              placeholder={t(
                "common.enter_message"
              )}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />
          </Field>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <SubmitButton
            type="submit"
            disabled={loading}
          >
            {loading && (
              <CircularProgress
                size={17}
                thickness={3}
                sx={{
                  color: "#ffffff",
                }}
              />
            )}

            <span>
              {t("common.send")}
            </span>
          </SubmitButton>
        </Form>
      </ContactWrapper>

      {/* =====================================================
          TOAST
      ===================================================== */}

      <ToastContainer
        position={
          i18n.dir() === "rtl"
            ? "top-left"
            : "top-right"
        }
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        rtl={i18n.dir() === "rtl"}
         style={{ zIndex: 999999 }}
      />
    </Container>
  );
}

export default ContactUs;


/* =========================================================
   MAIN
========================================================= */

const Container = styled.div`
  min-height: calc(100vh - 80px);

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 70px 20px;

  box-sizing: border-box;

  background: #f7f4ee;

  color: #292723;

  width: 100%;

  @media (max-width: 768px) {
    min-height: calc(100vh - 70px);

    padding: 50px 18px;
  }

  @media (max-width: 490px) {
    padding: 42px 16px;
  }
`;


/* =========================================================
   CONTACT WRAPPER
========================================================= */

const ContactWrapper = styled.div`
  width: 100%;

  max-width: 620px;

  margin: 0 auto;
`;


/* =========================================================
   HEADER
========================================================= */

const ContactHeader = styled.div`
  margin-bottom: 38px;

  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }

  @media (max-width: 490px) {
    margin-bottom: 28px;
  }
`;


/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = styled.span`
  display: block;

  margin-bottom: 12px;

  color: #b8955b;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.2em;

  text-transform: uppercase;
`;


/* =========================================================
   TITLE
========================================================= */

const Title = styled.h1`
  margin: 0;

  color: #292723;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: 42px;

  font-weight: 400;

  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 490px) {
    font-size: 32px;
  }
`;


/* =========================================================
   DESCRIPTION
========================================================= */

const Description = styled.p`
  max-width: 500px;

  margin: 16px auto 0;

  color: #777168;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 14px;

  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 15px;

    line-height: 1.75;
  }

  @media (max-width: 490px) {
    font-size: 16px;

    line-height: 1.7;
  }
`;


/* =========================================================
   FORM
========================================================= */

const Form = styled.form`
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 22px;

  @media (max-width: 490px) {
    gap: 20px;
  }
`;


/* =========================================================
   FIELD
========================================================= */

const Field = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 8px;
`;


/* =========================================================
   LABEL
========================================================= */

const Label = styled.label`
  color: #4b463f;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  @media (max-width: 490px) {
    font-size: 11px;
  }
`;


/* =========================================================
   INPUT
========================================================= */

const Input = styled.input`
  width: 100%;

  height: 54px;

  box-sizing: border-box;

  padding: 0 16px;

  border: 1px solid
    rgba(41, 39, 35, 0.18);

  border-radius: 0;

  outline: none;

  background: #faf8f4;

  color: #292723;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 13px;

  line-height: 1.4;

  appearance: none;

  -webkit-appearance: none;

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &::placeholder {
    color: #aaa49b;

    opacity: 1;
  }

  &:focus {
    border-color: #b8955b;

    box-shadow:
      0 0 0 3px
      rgba(184, 149, 91, 0.08);
  }

  /* =====================================================
     MOBILE — PREVENT IOS INPUT ZOOM
  ===================================================== */

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;


/* =========================================================
   TEXTAREA
========================================================= */

const Textarea = styled.textarea`
  width: 100%;

  min-height: 160px;

  box-sizing: border-box;

  resize: vertical;

  padding: 15px 16px;

  border: 1px solid
    rgba(41, 39, 35, 0.18);

  border-radius: 0;

  outline: none;

  background: #faf8f4;

  color: #292723;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 13px;

  line-height: 1.7;

  appearance: none;

  -webkit-appearance: none;

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  &::placeholder {
    color: #aaa49b;

    opacity: 1;
  }

  &:focus {
    border-color: #b8955b;

    box-shadow:
      0 0 0 3px
      rgba(184, 149, 91, 0.08);
  }

  /* =====================================================
     MOBILE — PREVENT IOS TEXTAREA ZOOM
  ===================================================== */

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;


/* =========================================================
   BUTTON
========================================================= */

const SubmitButton = styled.button`
  width: 100%;

  height: 54px;

  margin-top: 4px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  border: 1px solid #292723;

  border-radius: 0;

  background: #292723;

  color: #ffffff;

  font-family:
    "Jost",
    "Helvetica Neue",
    Arial,
    sans-serif;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.16em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    opacity 0.25s ease;

  &:hover:not(:disabled) {
    background: #b8955b;

    border-color: #b8955b;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: wait;

    opacity: 0.65;
  }

  @media (max-width: 490px) {
    height: 54px;

    font-size: 10px;
  }
`;