import React, { useState } from "react";
import styled from "styled-components";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import { setLogout } from "../../features/authSlice";
import { setSearch } from "../../features/filterSlice";

import ApiInstance from "../../../common/baseUrl";

import DropDownMenu from "./DropDownMenu";
import DropDownMenuLang from "./DropDownMenuLang";
import SideBar from "./SideBar";
import {optimizeCloudinaryImage} from "../../utilis/cloudinary"

import { useTranslation } from "react-i18next";
import UserServices from "../Services/UserServices";
import { colors } from "../../utilis/colors";




// ============================================================
// COMPONENT
// ============================================================

function NavBar({ outlet, setSearchValue, value }) {

  // ----------------------------------------------------------
  // REDUX
  // ----------------------------------------------------------

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const country = useSelector(
    (state) => state.location.country
  );

  const [required, setRequired] = useState(false);


  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const isAuth =
    window.localStorage.getItem("refresh_token");

  const refresh_token =
    window.localStorage.getItem("refresh_token");


  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [language, setLanguage] = useState("");
  const [currency, setCureency] = useState("");

  const [isSearchInputOpen, setIsSearchInputOpen] =
    useState(false);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [isSideBarOpen, setIsSideBarOpen] =
    useState(false);

  const [isLangMenuOpen, setIsLangMenuOpen] =
    useState(false);


  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {

    ApiInstance.post("logout/", {
      refresh_token: refresh_token,
    })

      .then((response) => {

        dispatch(setLogout(response.data));

        navigate("/");

        console.log(response.data);

      })

      .catch((error) => {

        console.log(error);

      });
  };


  // ==========================================================
  // PROFILE
  // ==========================================================

  const openProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };


  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const hideSideBarMenu = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearchInput = () => {

    dispatch(setSearch(value));

    if (value) {

      navigate("/collections/?search");

    } else {

      setRequired(true);

    }
  };


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <ParentContainer dir="ltr">

      {/* ======================================================
          MOBILE SEARCH
      ====================================================== */}

      {isSearchInputOpen && (

        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchEnd"
          onClickAway={() =>
            setIsSearchInputOpen(false)
          }
        >

          <div
            className="search-container"
            dir={
              i18n.language === "ar"
                ? "rtl"
                : "ltr"
            }
          >

            <div className="responsive-input">

              <input
                style={{
                  borderColor: required
                    ? "red"
                    : undefined,
                }}

                placeholder={t("common.search")}

                value={value}

                onChange={(e) => {

                  setSearchValue(e.target.value);

                  setRequired(false);

                }}

                maxLength="100"
              />

            </div>


            <button
              className="search-icon-container"
              onClick={handleSearchInput}
              aria-label={t("common.search")}
              onMouseLeave={() =>
                setRequired(false)
              }
            >

              <SearchIcon
                className="search-icon"
              />

            </button>

          </div>

        </ClickAwayListener>
      )}


      {/* ======================================================
          MAIN NAVBAR
      ====================================================== */}

   <UserServices/>
      <Container>
   

        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <ChildContainer>
           {/* ==================================================
              MOBILE MENU
              ================================================== */}

          <MenuIcon

            className="menu-icon"

            onClick={hideSideBarMenu}

          />

          {/* ==================================================
              LOGO
              ================================================== */}

          <LogoLink to="/">

            <BrandLogo>

              <img
                    src="../ESONRAWordmark.png"

                alt="ESONRA"
              />


            </BrandLogo>

          </LogoLink>


          {/* ==================================================
              DESKTOP SEARCH
              ================================================== */}

          <SearchContainer
            dir={
              i18n.language === "ar"
                ? "rtl"
                : "ltr"
            }
          >

            <div className="search-bar">

              <input
                style={{
                  borderColor: required
                    ? "red"
                    : undefined,
                }}

                placeholder={t("common.search")}

                value={value}

                onChange={(e) => {

                  setSearchValue(e.target.value);

                  setRequired(false);

                }}

                maxLength="50"
              />

            </div>


            <button
              className="search-icon-container"
              onClick={handleSearchInput}
              aria-label={t("common.search")}

              onMouseLeave={() =>
                setRequired(false)
              }
            >

              <SearchIcon
                className="search-icon"
              />

            </button>

          </SearchContainer>

        </ChildContainer>


        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <Wrapper>


          {/* ==================================================
              MOBILE SEARCH
              ================================================== */}

          <div className="search-icon-container-responsive">

            <SearchIcon

              onClick={() =>
                setIsSearchInputOpen(true)
              }

              className="search-icon-responsive"

            />

          </div>


          {/* ==================================================
              LANGUAGE
              ================================================== */}

          <div className="drop-down-lang-container">

            <DropDownMenuLang

              isLangMenuOpen={
                isLangMenuOpen
              }

              setIsLangMenuOpen={
                setIsLangMenuOpen
              }

              country={country}

              topPosition="60px"

              righPosition="20px"

              t={t}

              i18n={i18n}

            />

          </div>


          {/* ==================================================
              PROFILE
              ================================================== */}

          <div className="drop-down-menu-container">

            <DropDownMenu

              logout={logout}

              isAuth={isAuth}

              isProfileOpen={
                isProfileOpen
              }

              openProfileMenu={
                openProfileMenu
              }

              setIsProfileOpen={
                setIsProfileOpen
              }

              t={t}

              i18n={i18n}

            />

          </div>


          {/* ==================================================
              SHOPPING CART
              ================================================== */}

          <Link to="/shopping-cart">

            <div className="shopping-cart">

              <ShoppingCartIcon
                className="shopping-cart-icon"
              />


              <div className="cart-number-container">

                <span>
                  {cartItems?.length || 0}
                </span>

              </div>

            </div>

          </Link>


         

        </Wrapper>

      </Container>


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      {isSideBarOpen && (

        <SideBar

          t={t}

          isAuth={isAuth}

          isLangMenuOpen={
            isLangMenuOpen
          }

          setIsLangMenuOpen={
            setIsLangMenuOpen
          }

          country={country}

          hideSideBarMenu={
            hideSideBarMenu
          }

          logout={logout}

          isProfileOpen={
            isProfileOpen
          }

          openProfileMenu={
            openProfileMenu
          }

          setIsProfileOpen={
            setIsProfileOpen
          }

        />

      )}


      {/* ======================================================
          OUTLET
      ====================================================== */}

      {outlet}

    </ParentContainer>

  );
}

export default NavBar;


const ParentContainer = styled.div`
  position: relative;
  width: 100%;
  color: ${colors.text};

  /* MOBILE SEARCH */
  .search-container {
    display: flex;
    align-items: center;
    position: fixed;
    top: 35px;
    inset-inline: 0;
    z-index: 3;
    height: 50px;
    padding: 8px 14px;
    box-sizing: border-box;
    background: ${colors.primary};
    border-bottom: 1px solid ${colors.border};
    box-shadow: 0 8px 25px rgba(7, 27, 27, 0.08);
  }

  .responsive-input {
    display: flex;
    flex: 1;
    min-width: 0;
    height: 35px;
  }

  .responsive-input input {
    box-sizing: border-box;
    width: 100%;
    height: 35px;
    padding: 0 16px;
    border: 1px solid ${colors.border};
    border-radius: 0;
    outline: none;
    background: ${colors.surface};
    color: ${colors.text};
    font-family: inherit;
    font-size: 16px;
    line-height: 1;
    -webkit-text-size-adjust: 100%;
    transition: border-color 0.2s ease;
  }

  .responsive-input input::placeholder {
    color: ${colors.textSecondary};
    font-size: 16px;
  }

  .responsive-input input:focus {
    border-color: ${colors.accent};
  }

  .search-container .search-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 42px;
    height: 35px;
    border: none;
    border-radius: 0;
    background: ${colors.accent};
    color: ${colors.primary};
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .search-container .search-icon-container:hover {
    background: ${colors.accentHover};
  }

  .search-container .search-icon {
    display: block;
    padding: 0;
    color: ${colors.primary};
    font-size: 20px;
  }

  @media only screen and (min-width: 861px) {
    .search-container {
      display: none;
    }
  }
`;

/* MAIN NAVBAR */
const Container = styled.div`
  position: sticky;
  top: 34px;
  z-index: 2;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  box-sizing: border-box;
  background: ${colors.surface};
  color: ${colors.text};
  border-bottom: 1px solid ${colors.border};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  a {
    color: ${colors.text};
    text-decoration: none;
  }

  .menu-icon {
    display: none;
    color: ${colors.primary};
    cursor: pointer;
    font-size: 27px;
    transition: color 0.2s ease;
  }

  .menu-icon:hover {
    color: ${colors.accent};
  }

  .drop-down-lang-container,
  .drop-down-menu-container {
    display: flex;
    align-items: center;
  }

  @media only screen and (max-width: 1000px) {
    padding: 0 24px;
  }

  @media only screen and (max-width: 860px) {
    padding: 0 20px;

    .menu-icon {
      display: flex;
    }

    .drop-down-lang-container,
    .drop-down-menu-container {
      display: none;
    }
  }

  @media only screen and (max-width: 816px) {
    height: 50px;
    top: 34px;
  }
`;

/* LEFT SIDE */
const ChildContainer = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  min-width: 0;

  @media only screen and (max-width: 1000px) {
    width: 58%;
  }

  @media only screen and (max-width: 860px) {
    width: auto;
    flex: 0 0 auto;
  }
`;

/* LOGO LINK */
const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
  flex-shrink: 0;

  @media only screen and (max-width: 860px) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    white-space: nowrap;
  }
`;

/* LOGO */
const BrandLogo = styled.div`
  color: ${colors.primary};
  display: flex;
  align-items: center;
  font-family: "Times New Roman", serif;
  font-size: 27px;
  letter-spacing: 0.17em;
  line-height: 1;

  img {
    height: 45px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    display: block;
    margin-bottom: 0.5px;
  }

  span {
    display: inline-block;
    transition: color 0.25s ease;
  }

  @media (hover: hover) and (pointer: fine) {
    span:hover {
      color: ${colors.accent};
    }
  }

  @media only screen and (max-width: 650px) {
    font-size: 24px;

    img {
      height: 38px;
      width: auto;
    }
  }

  @media only screen and (max-width: 380px) {
    font-size: 20px;

    img {
      height: 32px;
      width: auto;
    }
  }
`;

/* DESKTOP SEARCH */
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 38px;

  .search-bar {
    height: 38px;
    display: flex;
  }

  input {
    box-sizing: border-box;
    width: clamp(170px, 30vw, 420px);
    height: 38px;
    padding: 0 13px;
    border: 1px solid ${colors.border};
    border-radius: 0;
    outline: none;
    background: ${colors.surface};
    color: ${colors.text};
    font-family: inherit;
    font-size: 14px;
    line-height: 1;
    transition: border-color 0.25s ease;
  }

  input::placeholder {
    color: ${colors.textSecondary};
  }

  input:focus {
    border-color: ${colors.accent};
  }

  .search-icon-container {
    box-sizing: border-box;
    width: 40px;
    height: 38px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 0;
    background: ${colors.primary};
    color: ${colors.surface};
    cursor: pointer;
    transition: background 0.25s ease;
  }

  .search-icon-container:hover {
    background: ${colors.accent};
  }

  .search-icon {
    display: block;
    padding: 0;
    color: ${colors.surface};
    font-size: 19px;
  }

  @media only screen and (max-width: 860px) {
    display: none;
  }
`;

/* RIGHT SIDE */
const Wrapper = styled.div`
  width: 39%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
  box-sizing: border-box;
  padding-right: 0;

  /* SHOPPING CART */
  .shopping-cart {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    direction: ltr;
    cursor: pointer;
    transition: transform 0.25s ease;
  }

  .shopping-cart:hover {
    transform: translateY(-1px);
  }

  .shopping-cart-icon {
    display: block;
    color: ${colors.primary};
    font-size: 22px;
    transition: color 0.25s ease;
  }

  .shopping-cart:hover .shopping-cart-icon {
    color: ${colors.accent};
  }

  /* CART COUNT */
  .cart-number-container {
    position: absolute;
    top: -8px;
    inset-inline-end: -8px;
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${colors.accent};
    color: ${colors.primary};
    font-size: 8px;
    font-weight: 700;
    line-height: 1;
  }

  /* MOBILE SEARCH ICON */
  .search-icon-container-responsive {
    display: none;
    align-items: center;
    justify-content: center;
  }

  .search-icon-responsive {
    display: block;
    color: ${colors.primary};
    cursor: pointer;
    font-size: 22px;
    transition:
      color 0.25s ease,
      transform 0.25s ease;
  }

  .search-icon-responsive:hover {
    color: ${colors.accent};
    transform: translateY(-1px);
  }

  @media only screen and (max-width: 860px) {
    width: auto;
    flex: 1;
    gap: 22px;
    justify-content: flex-end;

    .search-icon-container-responsive {
      display: flex;
    }
  }

  @media only screen and (max-width: 650px) {
    gap: 20px;
  }

  @media only screen and (max-width: 420px) {
    gap: 18px;

    .shopping-cart-icon,
    .search-icon-responsive {
      font-size: 21px;
    }
  }
`;
