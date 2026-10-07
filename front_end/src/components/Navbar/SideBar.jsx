import React, { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";
import styled from "styled-components";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PersonIcon from "@mui/icons-material/Person";
import DropDownMenuLang from "./DropDownMenuLang";
import { useSelector } from "react-redux";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function SideBar(props) {
  const user = useSelector(state => state.auth.user)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const openProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={props.hideSideBarMenu}

    >
      <Container dir = {i18n.dir() === "rtl"? "rtl": "ltr"}>
        <div className="first-section">
          <DisabledByDefaultIcon onClick={props.hideSideBarMenu} />
          <User_container>
            {props.isAuth !== null ? (
              <div className="user">
                <span> {t("common.Hello")}, {user?.firstName.slice(0, 20)} </span>
                <div>
                  <DropDownMenu
                    logout={props.logout}
                    isAuth={props.isAuth}
                    isProfileOpen={isProfileOpen}
                    openProfileMenu={openProfileMenu}
                    setIsProfileOpen={setIsProfileOpen}
                  />
                </div> 
              </div>
            ) : (
              <Link onClick={props.hideSideBarMenu} to="/auth" className="sign_in_button">
                <span>
                  <PersonIcon />
                </span>
                <span>{t("common.register")}</span>
              </Link>
            )}
          </User_container>
        </div>
        <div className="lang">
          <DropDownMenuLang
            topPosition="100px"
            rightPosition="-2px"
            isLangMenuOpen={isLangMenuOpen}
            setIsLangMenuOpen={setIsLangMenuOpen}
            country={props.country}
          />
        </div>
        <h4>{t("footer.policies.title")}:</h4>
        <Wrapper>
          <Wrapp>
            <Link onClick={props.hideSideBarMenu} to="terms-of-services">{t("footer.policies.termsOfService")}</Link>
            <Link onClick={props.hideSideBarMenu} to="about-us"> {t("footer.help.aboutUs")} </Link>
            <Link onClick={props.hideSideBarMenu} to="contact-us"> {t("footer.help.contactUs")} </Link>
            <Link onClick={props.hideSideBarMenu} to="privacy-policy"> {t("footer.policies.privacyPolicy")} </Link>
          </Wrapp>
        </Wrapper>
        <h4>{t("footer.followUs.title")}</h4>
        <SocialMedia>
          <a
            href="https://www.facebook.com/profile.php?id=61571681156358"
            target="_blank"
            rel="noreferrer"
          >
            <FacebookIcon className="social-icon" />
          </a>

          <a
            href="https://www.tiktok.com/@en.ouza"
            target="_blank"
            rel="noreferrer"
          >
            <MusicNoteIcon className="social-icon" />
          </a>

          <a
            href="https://www.instagram.com/en.ouza"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon className="social-icon" />
          </a>

          

        </SocialMedia>
      </Container>
    </ClickAwayListener>
  );
}

export default SideBar;

const Container = styled.div`
  position: fixed;
  z-index: 400;
  top: 0;
  right: 0;
  padding: 2px 15px;
  width: 300px;
  background: #ffffff;
  height: 100%;
  transition: ease-in-out;
  animation-duration: 1s;
  animation-name: hideShowMenu;
  

  @keyframes hideShowMenu {
    from {
      width: 0;
    }
    to {
      width: 300px;
    }
  }
  .first-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .user {
    display: flex;
    align-items: center;
  }
  .user span {
    font-size: 13px;
    white-space: nowrap;
  }
  
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.2ch;
  width: 100%;
  
  a {
    color: #000;
    font-size: 13px;
    margin-bottom: 15px;
  }
`;
const SocialMedia = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .social-icon {
    color: #000000;
  }
`;
const Wrapp = styled.div`
  display: flex;
  flex-direction: column;
`;
const User_container = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;

  .sign_in_button {
    display: flex;
    align-items: center;
    background: #000000;
    border-radius: 6px;
    color: #ffff;
    padding: 3px 8px;
    font-size: 12px;
    white-space: nowrap;
  }
`;
