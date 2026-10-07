import React, { useContext } from "react";
import styled from "styled-components";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormContext } from "../../../pages/CheckoutPage";
import { OrderContext } from "../../../App";
import countriesData from "../../../../common/countryData.json"

function Billing({ t, i18n }) {
  const { setActiveStepIndex } = useContext(FormContext);
  const { formData, setFormData } = useContext(OrderContext);

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string().required(
      t("common.please_enter_your_first_name")
    ),
    lastName: Yup.string().required(
      t("common.please_enter_your_last_name")
    ),
    phoneNumber: Yup.string().required(
      t("common.please_enter_your_phone")
    ),
    email: Yup.string()
      .email(t("errors.error_invalid_email"))
      .required(t("common.please_enter_your_email")),
    city: Yup.string().required(
      t("common.please_enter_your_city")
    ),
    country: Yup.string().required(
      t("common.please_enter_your_country")
    ),
    zip: Yup.string().required(
      t("common.please_enter_your_zip_code")
    ),
    state: Yup.string().required(
      t("common.please_enter_your_state")
    ),
    address1: Yup.string().required(
      t("common.please_enter_your_address")
    ),
  });

  return (
    <Container dir={i18n.dir() === "ltr" ? "ltr" : "rtl"}>


      <Formik
        initialValues={formData.logistics_address}
        validationSchema={ValidationSchema}
        onSubmit={(values) => {
          setFormData((prev) => ({
            ...prev,
            logistics_address: {
              ...prev.logistics_address,
              ...values,
            },
          }));

          setActiveStepIndex((prev) => prev + 1);
          

          
          

         
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => (
          <Form id="billing-form">
            <FormCard>
              <Grid container spacing={{ xs: 2, sm: 2.5 }}>

                <Grid item xs={12} sm={6}>
                  <LuxuryTextField
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="firstName"
                    name="firstName"
                    label={t("common.firstName")}
                    fullWidth
                    autoComplete="given-name"
                    helperText={
                      touched.firstName ? errors.firstName : ""
                    }
                    error={
                      touched.firstName &&
                      Boolean(errors.firstName)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LuxuryTextField
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="lastName"
                    name="lastName"
                    label={t("common.lastName")}
                    fullWidth
                    autoComplete="family-name"
                    helperText={
                      touched.lastName ? errors.lastName : ""
                    }
                    error={
                      touched.lastName &&
                      Boolean(errors.lastName)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <LuxuryTextField
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="email"
                    name="email"
                    label={t("common.email")}
                    type="email"
                    fullWidth
                    autoComplete="email"
                    helperText={
                      touched.email ? errors.email : ""
                    }
                    error={
                      touched.email &&
                      Boolean(errors.email)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <LuxuryTextField
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="phoneNumber"
                    name="phoneNumber"
                    label={t("common.phoneNumber")}
                    type="tel"
                    fullWidth
                    autoComplete="tel"
                    helperText={
                      touched.phoneNumber ? errors.phoneNumber : ""
                    }
                    error={
                      touched.phoneNumber &&
                      Boolean(errors.phoneNumber)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <LuxuryTextField
                    value={values.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="address1"
                    name="address1"
                    label={t("common.address")}
                    fullWidth
                    autoComplete="address-line1"
                    helperText={
                      touched.address1 ? errors.address1 : ""
                    }
                    error={
                      touched.address1 &&
                      Boolean(errors.address1)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LuxuryTextField
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="city"
                    name="city"
                    label={t("common.city")}
                    fullWidth
                    helperText={
                      touched.city ? errors.city : ""
                    }
                    error={
                      touched.city &&
                      Boolean(errors.city)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LuxuryTextField
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="state"
                    name="state"
                    label={t("common.state")}
                    fullWidth
                    helperText={
                      touched.state ? errors.state : ""
                    }
                    error={
                      touched.state &&
                      Boolean(errors.state)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LuxuryTextField
                    value={values.zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="zip"
                    name="zip"
                    label={t("common.zipCode")}
                    autoComplete="postal-code"
                    fullWidth
                    helperText={
                      touched.zip ? errors.zip : ""
                    }
                    error={
                      touched.zip &&
                      Boolean(errors.zip)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"> {t("common.country")}</InputLabel>
                    <Select
  style={{ maxHeight: "50px" }}
  value={values.country}
  onChange={handleChange}
  id="country"
  name="country"
  label={t("common.country")}
  fullWidth
  autoComplete="country"
  MenuProps={{
    disableScrollLock: true,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  }}
  error={
    touched.country &&
    Boolean(errors.country)
  }
>
                      {countriesData?.map((country, index) => (
                        <MenuItem key={index} value={country.label}>
                          {t(`countries.${country.value}`)}
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                </Grid>

              </Grid>
            </FormCard>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Billing;


/* =========================
   LUXURY STYLES
========================= */

const Container = styled.div`
  width: 100%;

  
`;





const FormCard = styled.div`
  background: #ffffff;
 
padding: 30px 25px 0;
  @media (max-width: 600px) {
    border-radius: 0;
  }
`;

const LuxuryTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      background: #ffffff;
      max-height: 50px;
      transition: all 0.25s ease;

      fieldset {
        border-color: #e4ded4;
        border-width: 1px;
      }

      &:hover fieldset {
        border-color: #b39a76;
      }

      &.Mui-focused fieldset {
        border-color: #b39a76;
        border-width: 1px;
      }
    }

    .MuiInputLabel-root {
      color: #77736b;
      font-size: 14px;
      letter-spacing: 0.1px;
    }

    .MuiInputLabel-root.Mui-focused {
      color: #b39a76;
    }

    .MuiOutlinedInput-input {
      color: #1d1c1a;
      font-size: 15px;
      padding: 17px 15px;
    }

    .MuiFormHelperText-root {
      margin-left: 2px;
      font-size: 12px;
    }

    .Mui-error fieldset {
      border-color: #c75c5c !important;
    }

    @media (max-width: 600px) {
      .MuiOutlinedInput-root {
        min-height: 54px;
      }

      .MuiOutlinedInput-input {
        font-size: 14px;
        padding: 15px 14px;
      }
    }
  }
    && {
    .MuiOutlinedInput-input,
    .MuiSelect-select {
      font-size: 16px !important;
      
    }

    .MuiInputLabel-root {
      font-size: 14px;
    }

    @media (min-width: 601px) {
      .MuiOutlinedInput-input,
      .MuiSelect-select {
        font-size: 15px !important;
      }
    }
  }
`;