import React, { useEffect, useState } from "react";
import styled from "styled-components";

import data from "../../../common/countryData.json";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { setLocation } from "../../features/locationSlice";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import Flag from "react-world-flags";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  setCurrency,
  setCurrencyAutomatically,
} from "../../features/currencySlice";

import { setLanguage } from "../../features/LanguagesSlice";

function DropDownMenuLang(props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  /* ============================================================
     REDUX STATE
  ============================================================ */

  const selectedLang = useSelector(
    (state) => state.language.selectedLanguage
  );

  const selectedCurrency = useSelector(
    (state) => state.currency.selectedCurrency
  );

  const currencyManuallySelected = useSelector(
    (state) => state.currency.currencyManuallySelected
  );

  /* ============================================================
     LANGUAGES
  ============================================================ */

  const languages = [
    {
      code: "en",
      label: t("languages.en"),
    },
    {
      code: "es",
      label: t("languages.es"),
    },
    {
      code: "ar",
      label: t("languages.ar"),
    },
  ];

  /* ============================================================
     COUNTRY → CURRENCY
  ============================================================ */

  const COUNTRY_CURRENCY_MAP = {
    US: "USD",
    ES: "EUR",
    GB: "GBP",
    AE: "AED",
    SA: "SAR",
    MA: "MAD",
  };

  /* ============================================================
     COUNTRY → LANGUAGE

     We only use languages that actually exist in the app:
     en / es / ar
  ============================================================ */

  const COUNTRY_LANGUAGE_MAP = {
    /* Spanish */
    ES: "es",
    MX: "es",
    AR: "es",
    CL: "es",
    CO: "es",
    PE: "es",
    VE: "es",
    UY: "es",
    EC: "es",
    BO: "es",
    PY: "es",
    CR: "es",
    PA: "es",
    DO: "es",
    GT: "es",
    HN: "es",
    NI: "es",
    SV: "es",

    /* Arabic */
    MA: "ar",
    DZ: "ar",
    TN: "ar",
    LY: "ar",
    EG: "ar",
    SA: "ar",
    AE: "ar",
    QA: "ar",
    KW: "ar",
    BH: "ar",
    OM: "ar",
    JO: "ar",
    LB: "ar",
    IQ: "ar",
    YE: "ar",
    PS: "ar",
    SY: "ar",
    SD: "ar",

    /* English */
    US: "en",
    GB: "en",
    CA: "en",
    AU: "en",
    NZ: "en",
    IE: "en",
    DE: "en",
    FR: "en",
    IT: "en",
    PT: "en",
    NL: "en",
    BE: "en",
    CH: "en",
    AT: "en",
    SE: "en",
    NO: "en",
    DK: "en",
    FI: "en",
    JP: "en",
    KR: "en",
    IN: "en",
    SG: "en",
  };

  /* ============================================================
     HELPERS
  ============================================================ */

  const changeAppLanguage = (language) => {
    if (!language) return;

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    dispatch(setLanguage(language));

    window.localStorage.setItem("selectedLang", language);

    /*
      Remember that the customer manually chose a language.
      This prevents automatic country detection from changing it.
    */
    window.localStorage.setItem("languageManuallySelected", "true");
  };

  /* ============================================================
     AUTO DETECT COUNTRY
  ============================================================ */

  useEffect(() => {
    const savedCountry = window.localStorage.getItem("country");
    const savedLanguage = window.localStorage.getItem("selectedLang");

    /*
      If we already have both preferences, don't run
      automatic detection again.
    */
    if (savedCountry && savedLanguage) {
      return;
    }

    fetch("https://ipinfo.io/json?token=ced98efb100ff5")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Location request failed");
        }

        return response.json();
      })
      .then((locationData) => {
        const detectedCountry = locationData?.country;

        if (!detectedCountry) {
          return;
        }

        /* ---------------------------------------------
           COUNTRY
        --------------------------------------------- */

        dispatch(setLocation(detectedCountry));

        window.localStorage.setItem(
          "country",
          detectedCountry
        );

        /* ---------------------------------------------
           LANGUAGE
        --------------------------------------------- */

        const languageWasManuallySelected =
          window.localStorage.getItem(
            "languageManuallySelected"
          ) === "true";

        /*
          Only automatically select a language when
          the customer has not manually selected one.
        */
        if (!savedLanguage && !languageWasManuallySelected) {
          const automaticLanguage =
            COUNTRY_LANGUAGE_MAP[detectedCountry] || "en";

          if (i18n.language !== automaticLanguage) {
            i18n.changeLanguage(automaticLanguage);
          }

          dispatch(setLanguage(automaticLanguage));

          window.localStorage.setItem(
            "selectedLang",
            automaticLanguage
          );
        }

        /* ---------------------------------------------
           CURRENCY
        --------------------------------------------- */

        if (!currencyManuallySelected) {
          const automaticCurrency =
            COUNTRY_CURRENCY_MAP[detectedCountry];

          if (automaticCurrency) {
            dispatch(
              setCurrencyAutomatically(
                automaticCurrency
              )
            );
          }
        }
      })
      .catch((error) => {
        console.log(
          "Location detection failed:",
          error
        );
      });

    /*
      We intentionally run this only on initial load.
      Otherwise changes to Redux currency/language can
      cause the location request to run again.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     LOAD SAVED LANGUAGE
  ============================================================ */

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem("selectedLang");

    if (!savedLanguage) {
      return;
    }

    const validLanguage = languages.some(
      (language) => language.code === savedLanguage
    );

    if (!validLanguage) {
      return;
    }

    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    dispatch(setLanguage(savedLanguage));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     LOAD SAVED COUNTRY
  ============================================================ */

  useEffect(() => {
    const savedCountry =
      window.localStorage.getItem("country");

    if (!savedCountry) {
      return;
    }

    dispatch(setLocation(savedCountry));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     LANGUAGE
  ============================================================ */

  const switchLanguage = (value) => {
    if (!value) return;

    if (value === selectedLang) {
      return;
    }

    changeAppLanguage(value);
  };

  /* ============================================================
     CURRENCY
  ============================================================ */

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;

    if (!newCurrency) {
      return;
    }

    if (newCurrency === selectedCurrency) {
      return;
    }

    /*
      setCurrency() should mark the currency as manually
      selected inside your Redux slice.
    */
    dispatch(setCurrency(newCurrency));

    window.localStorage.setItem(
      "selectedCurrency",
      newCurrency
    );
  };

  /* ============================================================
     COUNTRY
  ============================================================ */

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;

    if (!newCountry) {
      return;
    }

    /* ---------------------------------------------
       SAVE COUNTRY
    --------------------------------------------- */

    dispatch(setLocation(newCountry));

    window.localStorage.setItem(
      "country",
      newCountry
    );

    /* ---------------------------------------------
       AUTOMATIC CURRENCY
    --------------------------------------------- */

    if (!currencyManuallySelected) {
      const automaticCurrency =
        COUNTRY_CURRENCY_MAP[newCountry];

      if (automaticCurrency) {
        dispatch(
          setCurrencyAutomatically(
            automaticCurrency
          )
        );
      }
    }

    /*
      IMPORTANT:
      Changing the shipping country does NOT
      automatically change the customer's language.

      Language remains their chosen language.
    */
  };

  /* ============================================================
     SAVE / CLOSE
  ============================================================ */

  const handleSave = () => {
    props.setIsLangMenuOpen(false);
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Container>
      {/* ======================================================
          TRIGGER
      ====================================================== */}

      <Trigger
        type="button"
        aria-expanded={props.isLangMenuOpen}
        aria-label="Language and currency settings"
        onClick={() =>
          props.setIsLangMenuOpen(
            !props.isLangMenuOpen
          )
        }
      >
        <TriggerFlag>
          <Flag
            className="flag-icon"
            alt="country flag"
            code={props.country}
          />
        </TriggerFlag>

        <TriggerContent>
          <TriggerTop>
            {t(`languages.${selectedLang || "en"}`)}
          </TriggerTop>

          <TriggerBottom>
            {props.country}

            <TriggerDivider>/</TriggerDivider>

            {selectedCurrency}
          </TriggerBottom>
        </TriggerContent>

        <ArrowWrapper
          className={
            props.isLangMenuOpen ? "open" : ""
          }
        >
          <ArrowDropDownIcon />
        </ArrowWrapper>
      </Trigger>

      {/* ======================================================
          DROPDOWN
      ====================================================== */}

      {props.isLangMenuOpen && (
        <ClickAwayListener
  mouseEvent="onClick"
  touchEvent="onTouchEnd"
  onClickAway={() => {
    props.setIsLangMenuOpen(false);
  }}
>
          <Dropdown  dir="ltr">
            {/* HEADER */}

            <DropdownHeader>
              <HeaderEyebrow>
                ENOUZA
              </HeaderEyebrow>

              <HeaderTitle>
                {t("purchaseOptions.Language")}
                {" & "}
                {t("purchaseOptions.Currency")}
              </HeaderTitle>
            </DropdownHeader>

            {/* CONTENT */}

            <DropdownContent>
              {/* COUNTRY */}

              <OptionGroup>
                <OptionLabel>
                  {t("purchaseOptions.Ship_to")}
                </OptionLabel>

                <SelectBox>
                  <Flag
                    alt="country flag"
                    className="field-flag"
                    code={props.country}
                  />

                  <select
                    value={props.country || ""}
                    onChange={handleCountryChange}
                  >
                    {data?.map(
                      (country, index) => (
                        <option
                          key={`${country.value}-${index}`}
                          value={country.value}
                        >
                          {t(`countries.${country.value}`)}
                        </option>
                      )
                    )}
                  </select>

                  <SelectArrow>
                    <ArrowDropDownIcon />
                  </SelectArrow>
                </SelectBox>
              </OptionGroup>

              {/* LANGUAGE */}

              <OptionGroup>
                <OptionLabel>
                  {t("purchaseOptions.Language")}
                </OptionLabel>

                <SelectBox>
                  <select
                    value={selectedLang || "en"}
                    onChange={(e) =>
                      switchLanguage(
                        e.target.value
                      )
                    }
                  >
                    {languages.map(
                      (lang) => (
                        <option
                          key={lang.code}
                          value={lang.code}
                        >
                          {lang.label}
                        </option>
                      )
                    )}
                  </select>

                  <SelectArrow>
                    <ArrowDropDownIcon />
                  </SelectArrow>
                </SelectBox>
              </OptionGroup>

              {/* CURRENCY */}

              <OptionGroup>
                <OptionLabel>
                  {t("purchaseOptions.Currency")}
                </OptionLabel>

                <SelectBox>
                  <select
                    value={
                      selectedCurrency || "USD"
                    }
                    onChange={handleCurrencyChange}
                  >
                    <option value="USD">
                      USD — US Dollar
                    </option>

                    <option value="EUR">
                      EUR — Euro
                    </option>

                    <option value="GBP">
                      GBP — British Pound
                    </option>

                    <option value="AED">
                      AED — UAE Dirham
                    </option>

                    <option value="SAR">
                      SAR — Saudi Riyal
                    </option>

                    <option value="MAD">
                      MAD — Moroccan Dirham
                    </option>
                  </select>

                  <SelectArrow>
                    <ArrowDropDownIcon />
                  </SelectArrow>
                </SelectBox>
              </OptionGroup>
            </DropdownContent>

            {/* FOOTER */}

            <DropdownFooter>
              <SaveButton
                type="button"
                onClick={handleSave}
              >
                {t("common.save")}
              </SaveButton>
            </DropdownFooter>
          </Dropdown>
        </ClickAwayListener>
      )}
    </Container>
  );
}

export default DropDownMenuLang;

/* ============================================================
   CONTAINER
============================================================ */

const Container = styled.div`
  position: relative;

  display: inline-flex;

  direction: inherit;
`;

/* ============================================================
   TRIGGER
============================================================ */

const Trigger = styled.button`
  appearance: none;

  display: inline-flex;

  align-items: center;

  gap: 9px;

  min-height: 38px;

  padding: 5px 7px 5px 8px;

  margin: 0;

  border: 1px solid transparent;

  border-radius: 2px;

  outline: none;
  background: rgba(179, 154, 118, 0.06);

    border-color: rgba(
      179,
      154,
      118,
      0.18
    );

  color: #171615;

  cursor: pointer;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;

  

  &:focus-visible {
    outline: 1px solid #b39a76;

    outline-offset: 3px;
  }

  @media (max-width: 600px) {
    gap: 7px;

    min-height: 36px;

    padding: 4px 5px 4px 6px;
  }
`;

/* ============================================================
   FLAG
============================================================ */

const TriggerFlag = styled.span`
  display: flex;

  align-items: center;

  justify-content: center;

  width: 22px;

  height: 16px;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: 1px;

  .flag-icon {
    display: block;

    width: 22px;

    height: 14px;

    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 20px;

    height: 14px;

    .flag-icon {
      width: 20px;

      height: 13px;
    }
  }
`;

/* ============================================================
   TRIGGER CONTENT
============================================================ */

const TriggerContent = styled.span`
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  justify-content: center;

  gap: 2px;

  min-width: 0;
`;

/* ============================================================
   TRIGGER TOP
============================================================ */

const TriggerTop = styled.span`
  color: #171615;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 10px;

  font-weight: 500;

  line-height: 1.1;

  letter-spacing: 0.01em;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  max-width: 120px;

  @media (max-width: 600px) {
    font-size: 9px;

    max-width: 90px;
  }
`;

/* ============================================================
   TRIGGER BOTTOM
============================================================ */

const TriggerBottom = styled.span`
  color: #77716a;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 9px;

  font-weight: 500;

  line-height: 1;

  letter-spacing: 0.08em;

  white-space: nowrap;

  text-transform: uppercase;
`;

/* ============================================================
   DIVIDER
============================================================ */

const TriggerDivider = styled.span`
  margin-inline: 4px;

  color: #b39a76;
`;

/* ============================================================
   ARROW
============================================================ */

const ArrowWrapper = styled.span`
  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  color: #77716a;

  transition:
    transform 0.25s ease,
    color 0.25s ease;

  svg {
    width: 18px;

    height: 18px;
  }

  &.open {
    color: #b39a76;

    transform: rotate(180deg);
  }
`;

/* ============================================================
   DROPDOWN
============================================================ */

const Dropdown = styled.div`
  position: fixed;

  top: 70px;

  inset-inline-end: 28px;

  z-index: 99999;

  width: 360px;

  overflow: hidden;

  background: #ffffff;

  border: 1px solid #ddd8cf;

  box-shadow:
    0 24px 70px
    rgba(27, 24, 21, 0.16);

  animation: dropdownIn 0.22s ease-out;

  @keyframes dropdownIn {
    from {
      opacity: 0;

      transform:
        translateY(-7px)
        scale(0.985);
    }

    to {
      opacity: 1;

      transform:
        translateY(0)
        scale(1);
    }
  }

  @media (max-width: 700px) {
    top: auto;

    bottom: 18px;

    left: 50%;

    inset-inline-end: auto;

    width: calc(100vw - 30px);

    max-width: 390px;

    max-height: calc(100vh - 36px);

    overflow-y: auto;

    transform: translateX(-50%);

    animation: mobileDropdownIn
      0.22s ease-out;

    @keyframes mobileDropdownIn {
      from {
        opacity: 0;

        transform:
          translateX(-50%)
          translateY(10px)
          scale(0.985);
      }

      to {
        opacity: 1;

        transform:
          translateX(-50%)
          translateY(0)
          scale(1);
      }
    }
  }

  @media (max-width: 420px) {
    width: calc(100vw - 22px);

    bottom: 11px;
  }
`;

/* ============================================================
   HEADER
============================================================ */

const DropdownHeader = styled.div`
  padding: 25px 26px 22px;

  background:
    linear-gradient(
      135deg,
      #faf8f4 0%,
      #f5f1ea 100%
    );

  border-bottom: 1px solid #e5e0d8;

  @media (max-width: 600px) {
    padding: 21px 20px 18px;
  }
`;

/* ============================================================
   EYEBROW
============================================================ */

const HeaderEyebrow = styled.div`
  margin-bottom: 8px;

  color: #a4865c;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 8px;

  font-weight: 600;

  letter-spacing: 0.24em;

  line-height: 1;

  text-transform: uppercase;
`;

/* ============================================================
   HEADER TITLE
============================================================ */

const HeaderTitle = styled.h3`
  margin: 0;

  color: #171615;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: 23px;

  font-weight: 400;

  line-height: 1.25;

  @media (max-width: 600px) {
    font-size: 21px;
  }
`;

/* ============================================================
   CONTENT
============================================================ */

const DropdownContent = styled.div`
  padding: 21px 26px 5px;

  background: #ffffff;

  @media (max-width: 600px) {
    padding: 18px 20px 3px;
  }
`;

/* ============================================================
   OPTION GROUP
============================================================ */

const OptionGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 8px;
  }

  @media (max-width: 600px) {
    margin-bottom: 17px;
  }
`;

/* ============================================================
   OPTION LABEL
============================================================ */

const OptionLabel = styled.label`
  display: block;

  margin-bottom: 8px;

  color: #3d3934;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 0.14em;

  line-height: 1;

  text-transform: uppercase;
`;

/* ============================================================
   SELECT BOX
============================================================ */

const SelectBox = styled.div`
  position: relative;

  width: 100%;

  .field-flag {
    position: absolute;

    top: 50%;

    left: 14px;

    z-index: 2;

    width: 20px;

    height: 13px;

    object-fit: cover;

    transform: translateY(-50%);

    pointer-events: none;
  }

  select {
    appearance: none;

    display: block;

    width: 100%;

    min-width: 0;

    height: 45px;

    padding: 0 42px 0 13px;

    border: 1px solid #d9d4cc;

    border-radius: 0;

    outline: none;

    background: #ffffff;

    color: #111111;

    font-family:
      "Inter",
      Arial,
      sans-serif;

    font-size: 12px;

    font-weight: 500;

    cursor: pointer;

    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;

    &:hover {
      border-color: #b39a76;

      background: #fdfcf9;
    }

    &:focus {
      border-color: #b39a76;

      box-shadow:
        0 0 0 2px
        rgba(179, 154, 118, 0.1);
    }

    option {
      color: #111111;

      background: #ffffff;

      font-size: 12px;
    }
  }

  .field-flag + select {
    padding-left: 45px;
  }
`;

/* ============================================================
   SELECT ARROW
============================================================ */

const SelectArrow = styled.span`
  position: absolute;

  top: 50%;

  right: 11px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #77716a;

  pointer-events: none;

  transform: translateY(-50%);

  svg {
    width: 18px;

    height: 18px;
  }
`;

/* ============================================================
   FOOTER
============================================================ */

const DropdownFooter = styled.div`
  display: flex;

  align-items: center;

  justify-content: flex-end;

  padding: 16px 26px 22px;

  background: #faf8f4;

  border-top: 1px solid #e8e3db;

  @media (max-width: 600px) {
    padding: 14px 20px 18px;
  }
`;

/* ============================================================
   SAVE BUTTON
============================================================ */

const SaveButton = styled.button`
  appearance: none;

  width: 145px;

  height: 40px;

  padding: 0 20px;

  border: 1px solid #191816;

  border-radius: 0;

  outline: none;

  background: #191816;

  color: #ffffff;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 0.16em;

  line-height: 1;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.2s ease;

  &:hover {
    background: #b39a76;

    border-color: #b39a76;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 1px solid #b39a76;

    outline-offset: 3px;
  }

  @media (max-width: 600px) {
    width: 100%;

    height: 42px;
  }
`;