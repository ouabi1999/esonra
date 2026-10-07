import React from "react";
import styled from "styled-components";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";

function DropDownMenu(props) {
  const { t, i18n } = useTranslation();

  const user = useSelector(
    (state) => state.auth.user
  );

  const isRTL = i18n.dir() === "rtl";

  return (
    <Container $rtl={isRTL}>
      {props.isAuth !== null ? (
        <div>
          <PersonOutlineOutlinedIcon
            className="person-icon"
            onClick={props.openProfileMenu}
          />
        </div>
      ) : (
        <div className="sign-in-button">
          <Link to="auth">
            {t("common.register")}
          </Link>
        </div>
      )}

      {props.isProfileOpen && (
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onScroll"
          onClickAway={props.openProfileMenu}
        >
          <Wrapper>
            {/* PROFILE */}
            <MenuLink
              onClick={props.openProfileMenu}
              to={
                user?.is_staff
                  ? "admin-dashboard"
                  : "/profile"
              }
            >
              <AccountBoxIcon className="icon" />

              <span>
                {t("common.profile")}
              </span>
            </MenuLink>

            {/* FAQ */}
            <MenuLink
              onClick={props.openProfileMenu}
              to="/help-center"
            >
              <LiveHelpIcon className="icon" />

              <span>
                {t("common.faq")}
              </span>
            </MenuLink>

            {/* LOGOUT */}
            <LogoutButton onClick={props.logout}>
              <ExitToAppOutlinedIcon className="icon" />

              <span>
                {t("common.logout")}
              </span>
            </LogoutButton>
          </Wrapper>
        </ClickAwayListener>
      )}
    </Container>
  );
}

export default DropDownMenu;

/* =========================
   CONTAINER
========================= */

const Container = styled.div`
  position: relative;

 

  span {
    font-size: 12px;
    font-weight: 500;
  }

  .person-icon {
    display: block;

    color: #171615;

    cursor: pointer;

    font-size: 22px;

    transition:
      color 0.25s ease,
      transform 0.25s ease;

    &:hover {
      color: #806b45;

      transform: translateY(-1px);
    }
  }

  .sign-in-button {
    display: flex;

    align-items: center;
    justify-content: center;

    height: 38px;

    padding-inline: 8px;

    font-family:
      "Inter",
      Arial,
      sans-serif;

    font-size: 14px;

    a {
      color: #171615;

      text-decoration: none;

      transition:
        color 0.25s ease;

      &:hover {
        color: #806b45;
      }
    }
  }
`;

/* =========================
   PROFILE MENU
========================= */

const Wrapper = styled.div`
  position: fixed;

  inset-inline-end: 10px;

  top: 68px;

  z-index: 9999;

  width: 165px;

  padding: 8px;

  background: #ffffff;

  border: 1px solid #e6e1d9;

  box-shadow:
    0 18px 45px
    rgba(30, 27, 24, 0.12);

  @media (max-width: 420px) {
    inset-inline-end: 10px;

    width: 150px;
  }
`;

/* =========================
   MENU LINK
========================= */

const MenuLink = styled(Link)`
  display: flex;

  align-items: center;

  gap: 10px;

  width: 100%;

  box-sizing: border-box;

  padding: 10px 9px;

  color: #302d29;

  background: transparent;

  text-decoration: none;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 12px;

  font-weight: 500;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: #806b45;

    background: #f7f5f1;
  }

  .icon {
    flex-shrink: 0;

    color: #4b4741;

    font-size: 18px;

    transition:
      color 0.2s ease;
  }

  &:hover .icon {
    color: #806b45;
  }
`;

/* =========================
   LOGOUT
========================= */

const LogoutButton = styled.button`
  display: flex;

  align-items: center;

  gap: 10px;

  width: 100%;

  box-sizing: border-box;

  padding: 10px 9px;

  border: none;

  color: #302d29;

  background: transparent;

  cursor: pointer;

  font-family:
    "Inter",
    Arial,
    sans-serif;

  font-size: 12px;

  font-weight: 500;

  text-align: start;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: #806b45;

    background: #f7f5f1;
  }

  .icon {
    flex-shrink: 0;

    color: #4b4741;

    font-size: 18px;

    transition:
      color 0.2s ease;
  }

  &:hover .icon {
    color: #806b45;
  }
`;