import React, { useState } from "react";
import styled from "styled-components";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Flag from "react-world-flags";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import data from "../../../common/countryData.json";

import { setLocation } from "../../features/locationSlice";

import {
  setCurrency,
  setCurrencyAutomatically,
} from "../../features/currencySlice";
import { setLanguage } from "../../features/LanguagesSlice";

// ============================================================
// ENOUZA FOOTER PREFERENCES
// ============================================================

function FooterPreferences() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
    const selectedLang = useSelector(state=> state.language.selectedLanguage)
    
  

  // ==========================================================
  // REDUX
  // ==========================================================

  const country = useSelector(
    (state) => state.location.country
  );

  const selectedCurrency = useSelector(
    (state) => state.currency.selectedCurrency
  );

  const currencyManuallySelected = useSelector(
    (state) =>
      state.currency.currencyManuallySelected
  );

  // ==========================================================
  // STATE
  // ==========================================================

  const [isOpen, setIsOpen] = useState(false);



  // ==========================================================
  // LANGUAGES
  // ==========================================================

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

  // ==========================================================
  // COUNTRY → CURRENCY
  // ==========================================================

  const COUNTRY_CURRENCY_MAP = {
    US: "USD",
    ES: "EUR",
    GB: "GBP",
    AE: "AED",
    SA: "SAR",
  };

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const switchLanguage = (value) => {
    if (i18n.language !== value) {
      i18n.changeLanguage(value);
    }

    window.localStorage.setItem(
      "selectedLang",
      value
    );

    dispatch(setLanguage(value))
  };

  // ==========================================================
  // COUNTRY
  // ==========================================================

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;

    dispatch(setLocation(newCountry));

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
  };

  // ==========================================================
  // CURRENCY
  // ==========================================================

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;

    if (newCurrency === selectedCurrency) {
      return;
    }

    dispatch(setCurrency(newCurrency));
  };

  // ==========================================================
  // DISPLAY VALUES
  // ==========================================================

  const selectedCountry =
    data?.find(
      (item) => item.value === country
    )?.label || "";

  const selectedLanguage =
    languages.find(
      (language) =>
        language.code === selectedLang
    )?.label || "";

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = () => {
    setIsOpen(false);
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <Container>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => setIsOpen(false)}
      >
        <Wrapper>

          {/* ==================================================
              FOOTER TRIGGER
          ================================================== */}

          <Trigger
            type="button"
            onClick={() =>
              setIsOpen(
                (previous) => !previous
              )
            }
            aria-expanded={isOpen}
          >
            

            <TriggerMain>
              {country && (
                <Flag
                alt="country flag"
                  className="triggerFlag"
                  code={country}
                />
              )}

              {selectedCountry && (
                <SelectedText>
                     {t(`countries.${country}`)}
                </SelectedText>
              )}

              {selectedCountry &&
                selectedLanguage && (
                  <Dot>•</Dot>
                )}

              {selectedLanguage && (
                <SelectedText>
                  {selectedLanguage}
                </SelectedText>
              )}

              <Dot>•</Dot>

              <Currency>
                {selectedCurrency}
              </Currency>

              <Arrow
                className={
                  isOpen ? "open" : ""
                }
              >
                <KeyboardArrowDownIcon />
              </Arrow>
            </TriggerMain>
          </Trigger>


          {/* ==================================================
              DROPDOWN
          ================================================== */}

          {isOpen && (
            <Dropdown>

              {/* ----------------------------------------------
                  HEADER
              ---------------------------------------------- */}

              <DropdownHeader>
                <Eyebrow>
                  ENOUZA
                </Eyebrow>

                <Title>
                  {t("purchaseOptions.Language")}
                  {" & "}
                  {t("purchaseOptions.Currency")}
                </Title>
              </DropdownHeader>


              {/* ----------------------------------------------
                  COUNTRY
              ---------------------------------------------- */}

              <Field>
                <FieldHeader>
                  <FieldLabel>
                    {t(
                      "purchaseOptions.Ship_to"
                    )}
                  </FieldLabel>
                </FieldHeader>

                <SelectWrapper>
                  {country && (
                    <Flag
                      className="selectFlag"
                      code={country}
                      alt="country flag"
                    />
                  )}

                  <select
                    value={country || ""}
                    onChange={
                      handleCountryChange
                    }
                  >
                    {data?.map(
                      (item, index) => (
                        <option
                          key={index}
                          value={item.value}
                        >
                        {t(`countries.${item.value}`)}

                        </option>
                      )
                    )}
                  </select>
                </SelectWrapper>
              </Field>


              {/* ----------------------------------------------
                  LANGUAGE
              ---------------------------------------------- */}

              <Field>
                <FieldHeader>
                  <FieldLabel>
                    {t(
                      "purchaseOptions.Language"
                    )}
                  </FieldLabel>
                </FieldHeader>

                <SelectWrapper>
                  <select
                    value={selectedLang}
                    onChange={(event) =>
                      switchLanguage(
                        event.target.value
                      )
                    }
                  >
                    {languages.map(
                      (language) => (
                        <option
                          key={language.code}
                          value={language.code}
                        >
                          {language.label}
                        </option>
                      )
                    )}
                  </select>
                </SelectWrapper>
              </Field>


              {/* ----------------------------------------------
                  CURRENCY
              ---------------------------------------------- */}

              <Field>
                <FieldHeader>
                  <FieldLabel>
                    {t(
                      "purchaseOptions.Currency"
                    )}
                  </FieldLabel>
                </FieldHeader>

                <SelectWrapper>
                  <select
                    value={selectedCurrency}
                    onChange={
                      handleCurrencyChange
                    }
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
                  </select>
                </SelectWrapper>
              </Field>


              {/* ----------------------------------------------
                  FOOTER
              ---------------------------------------------- */}

              <DropdownFooter>
                <SaveButton
                  type="button"
                  onClick={handleSave}
                >
                  {t("common.save")}
                </SaveButton>
              </DropdownFooter>

            </Dropdown>
          )}

        </Wrapper>
      </ClickAwayListener>
    </Container>
  );
}

export default FooterPreferences;


// ============================================================
// CONTAINER
// ============================================================

const Container = styled.div`
  position: relative;

  display: inline-block;
  padding:10px;

`;


// ============================================================
// WRAPPER
// ============================================================

const Wrapper = styled.div`
  position: relative;

  max-width: 100%;
`;


// ============================================================
// TRIGGER
// ============================================================

const Trigger = styled.button`
  appearance: none;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 7px;

  width: auto;

  max-width: 100%;

  padding: 0;

  margin: 0;

  border: none;

  outline: none;

  background: transparent;

  color: #ffffff;

  cursor: pointer;

  text-align: left;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  transition:
    opacity 0.25s ease;

  &:hover {
    opacity: 0.82;
  }

  &:focus-visible {
    outline:
      1px solid
      rgba(179, 154, 118, 0.7);

    outline-offset: 6px;
  }

  @media (max-width: 767px) {
    width: 100%;
  }
`;


// ============================================================
// TRIGGER LABEL
// ============================================================


// ============================================================
// TRIGGER MAIN
// ============================================================

const TriggerMain = styled.span`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 7px;

  width: 100%;

  min-height: 19px;

  color: #ffffff;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 12px;

  font-weight: 400;

  line-height: 1.5;

  white-space: normal;

  overflow-wrap: anywhere;

  .triggerFlag {
    width: 20px;

    height: 13px;

    flex: 0 0 auto;

    object-fit: cover;

    border-radius: 1px;
  }

  @media (max-width: 767px) {
    gap: 5px;

    font-size: 11px;

    line-height: 1.45;

    .triggerFlag {
      width: 19px;

      height: 12px;
    }
  }

  @media (max-width: 380px) {
    gap: 4px;

    font-size: 10px;

    .triggerFlag {
      width: 18px;

      height: 12px;
    }
  }
`;


// ============================================================
// SELECTED TEXT
// ============================================================

const SelectedText = styled.span`
  color: #000000;

  font-weight: 400;

  white-space: normal;

  overflow-wrap: anywhere;
`;


// ============================================================
// DOT
// ============================================================

const Dot = styled.span`
  flex: 0 0 auto;

  color:
    rgba(255, 255, 255, 0.35);

  font-size: 9px;

  @media (max-width: 380px) {
    font-size: 7px;
  }
`;


// ============================================================
// CURRENCY
// ============================================================

const Currency = styled.span`
  color: #000000;

  font-weight: 500;

  white-space: nowrap;
`;


// ============================================================
// ARROW
// ============================================================

const Arrow = styled.span`
  display: flex;

  align-items: center;

  justify-content: center;

  flex: 0 0 auto;

  margin-left: 2px;

  color:
    rgb(0, 0, 0);

  transition:
    transform 0.25s ease,
    color 0.25s ease;

  svg {
    width: 17px;

    height: 17px;
  }

  &.open {
    transform: rotate(180deg);

    color: #b39a76;
  }

  @media (max-width: 767px) {
    svg {
      width: 16px;

      height: 16px;
    }
  }
`;


// ============================================================
// DROPDOWN
// ============================================================
const Dropdown = styled.div`
  position: absolute;

  left: 50%;

  bottom: calc(100% + 22px);

  z-index: 99999;

  width: 380px;

  overflow: hidden;

  background: #ffffff;

  border: 1px solid #d8d3ca;

  box-shadow:
    0 24px 65px
    rgba(0, 0, 0, 0.18);

  transform: translateX(-50%);

  animation: dropdownAppear 0.22s ease-out;

  @keyframes dropdownAppear {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  /* =========================
     TABLET
     ========================= */

  @media (max-width: 900px) {
    width: 350px;
  }

  /* =========================
     MOBILE
     ========================= */

  @media (max-width: 600px) {
    position: fixed;

    left: 50%;

    bottom: 75px;

    width: calc(100vw - 30px);

    max-width: 380px;

    max-height: calc(100vh - 100px);

    overflow-y: auto;

    transform: translateX(-50%);

    animation: dropdownMobileAppear 0.22s ease-out;

    @keyframes dropdownMobileAppear {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(10px);
      }

      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  }

  @media (max-width: 400px) {
    width: calc(100vw - 24px);

    bottom: 70px;
  }

  @media (max-width: 360px) {
    width: calc(100vw - 20px);

    bottom: 65px;
  }
`;


// ============================================================
// DROPDOWN HEADER
// ============================================================

const DropdownHeader = styled.div`
  padding:
    25px
    26px;

  background: #f7f4ee;

  border-bottom:
    1px solid
    #ddd8d0;

  @media (max-width: 767px) {
    padding:
      21px
      20px;
  }

  @media (max-width: 480px) {
    padding:
      19px
      18px;
  }
`;


// ============================================================
// EYEBROW
// ============================================================

const Eyebrow = styled.div`
  margin-bottom: 8px;

  color: #a4865c;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 0.2em;

  line-height: 1;

  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 8px;

    margin-bottom: 7px;
  }
`;


// ============================================================
// TITLE
// ============================================================

const Title = styled.h3`
  margin: 0;

  color: #111111;

  font-family:
    "Playfair Display",
    Georgia,
    serif;

  font-size: 23px;

  font-weight: 400;

  line-height: 1.3;

  overflow-wrap: anywhere;

  @media (max-width: 767px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;


// ============================================================
// FIELD
// ============================================================

const Field = styled.div`
  padding:
    18px
    26px;

  background: #ffffff;

  border-bottom:
    1px solid
    #e5e1da;

  @media (max-width: 767px) {
    padding:
      16px
      20px;
  }

  @media (max-width: 480px) {
    padding:
      15px
      18px;
  }
`;


// ============================================================
// FIELD HEADER
// ============================================================

const FieldHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 9px;

  min-width: 0;
`;


// ============================================================
// FIELD LABEL
// ============================================================

const FieldLabel = styled.div`
  color: #111111;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.13em;

  line-height: 1.3;

  text-transform: uppercase;

  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: 9px;

    letter-spacing: 0.1em;
  }
`;


// ============================================================
// SELECT WRAPPER
// ============================================================

const SelectWrapper = styled.div`
  position: relative;

  width: 100%;

  min-width: 0;

  .selectFlag {
    position: absolute;

    left: 13px;

    top: 50%;

    width: 20px;

    height: 13px;

    object-fit: cover;

    transform:
      translateY(-50%);

    pointer-events: none;

    z-index: 2;

    border-radius: 1px;
  }

  select {
    appearance: none;

    display: block;

    width: 100%;

    min-width: 0;

    height: 44px;

    padding:
      0
      42px
      0
      14px;

    border:
      1px solid
      #d1ccc4;

    border-radius: 0;

    outline: none;

    background-color: #ffffff;

    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23222222' stroke-width='1.2'/%3E%3C/svg%3E");

    background-repeat: no-repeat;

    background-position:
      right 15px center;

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
      box-shadow 0.2s ease;

    &:hover {
      border-color: #b39a76;
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

  .selectFlag + select {
    padding-left: 43px;
  }

  @media (max-width: 480px) {
    select {
      height: 42px;

      padding:
        0
        38px
        0
        12px;

      font-size: 11px;

      background-position:
        right 12px center;
    }

    .selectFlag {
      left: 11px;

      width: 19px;

      height: 12px;
    }

    .selectFlag + select {
      padding-left: 40px;
    }
  }
`;


// ============================================================
// DROPDOWN FOOTER
// ============================================================

const DropdownFooter = styled.div`
  display: flex;

  justify-content: flex-end;

  padding:
    18px
    26px
    22px;

  background: #f7f4ee;

  @media (max-width: 767px) {
    padding:
      16px
      20px
      20px;
  }

  @media (max-width: 480px) {
    padding:
      15px
      18px
      18px;
  }
`;


// ============================================================
// SAVE BUTTON
// ============================================================

const SaveButton = styled.button`
  appearance: none;

  min-width: 140px;

  height: 40px;

  padding:
    0
    22px;

  border:
    1px solid
    #191816;

  border-radius: 0;

  background: #191816;

  color: #ffffff;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 0.15em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    background: #b39a76;

    border-color: #b39a76;
  }

  @media (max-width: 767px) {
    width: 100%;

    min-width: 0;
  }

  @media (max-width: 480px) {
    height: 42px;

    font-size: 8px;

    letter-spacing: 0.13em;
  }
`;