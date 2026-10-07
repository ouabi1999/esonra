import React from "react";
import styled from "styled-components";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReplayIcon from "@mui/icons-material/Replay";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

function UserServices() {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const services = [
    {
      icon: VerifiedUserIcon,
      text: t("trust.secureCheckout"),
    },
    
   
    {
      icon: LocalShippingIcon,
      text: t("trust.freeShipping.text"),
    },
    {
      icon: ReplayIcon,
      text: t("trust.returns.text"),
    },
    {
      icon: WorkspacePremiumIcon,
      text: t("trust.warranty.title"),
    },
  ];

  return (
    <Container>
      <Viewport>
        <Track
          $rtl={isRTL}
          animate={{
            x: isRTL
              ? ["-50%", "0%"]
              : ["0%", "-50%"],
          }}
          transition={{
            duration: 24,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* =================================================
              FIRST GROUP
          ================================================= */}

          <Group $rtl={isRTL}>
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <React.Fragment key={`first-${index}`}>
                  <Service>
                    <Icon className="service-icon" />

                    <span>{service.text}</span>
                  </Service>

                  <Separator aria-hidden="true">
                    <span />
                  </Separator>
                </React.Fragment>
              );
            })}
          </Group>

          {/* =================================================
              SECOND GROUP
              Exact duplicate for seamless infinite loop
          ================================================= */}

          <Group
            $rtl={isRTL}
            aria-hidden="true"
          >
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <React.Fragment key={`second-${index}`}>
                  <Service>
                    <Icon className="service-icon" />

                    <span>{service.text}</span>
                  </Service>

                  <Separator aria-hidden="true">
                    <span />
                  </Separator>
                </React.Fragment>
              );
            })}
          </Group>
        </Track>
      </Viewport>
    </Container>
  );
}

export default UserServices;


/* =========================================================
   CONTAINER
========================================================= */

const Container = styled.div`
  position: -webkit-sticky;
  position: sticky;

  top: 0;
  z-index: 2;

  width: 100%;
  height: 34px;

  overflow: hidden;

  background: #353531;

  display: flex;
  align-items: center;

  box-sizing: border-box;
`;


/* =========================================================
   VIEWPORT
========================================================= */

const Viewport = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  display: flex;
  align-items: center;

  box-sizing: border-box;
`;


/* =========================================================
   TRACK
========================================================= */

const Track = styled(motion.div)`
  display: flex;
  align-items: center;

  width: max-content;
  min-width: max-content;

  height: 100%;

  flex-shrink: 0;

  direction: ${({ $rtl }) =>
    $rtl ? "rtl" : "ltr"};

  will-change: transform;

  transform: translate3d(0, 0, 0);

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;


/* =========================================================
   GROUP
========================================================= */

const Group = styled.div`
  width: max(100vw, 1440px);
  min-width: max(100vw, 1440px);

  height: 100%;

  flex: 0 0 auto;

  display: flex;
  align-items: center;

  justify-content: space-between;

  box-sizing: border-box;

  padding: 0 50px;

  direction: ${({ $rtl }) =>
    $rtl ? "rtl" : "ltr"};

  @media only screen and (max-width: 816px) {
    width: max(100vw, 1000px);
    min-width: max(100vw, 1000px);
  }
`;


/* =========================================================
   SERVICE
========================================================= */

const Service = styled.div`
  width: max-content;
  min-width: max-content;

  flex: 0 0 auto;

  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  white-space: nowrap;

  

  color: #ffffff;

  .service-icon {
    width: 18px;
    height: 18px;

    flex: 0 0 18px;

    color: #ffffff;

    margin-inline-end: 7px;
  }

  span {
    display: block;

    width: max-content;
    min-width: max-content;

    font-size: 12px;


    line-height: 1;

    letter-spacing: 0.2px;

    color: #ffffff;

    white-space: nowrap;
  }
`;


/* =========================================================
   SEPARATOR / DOT
========================================================= */

const Separator = styled.div`
  width: 36px;
  min-width: 36px;

  height: 100%;

  flex: 0 0 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  span {
    display: block;

    width: 3px;
    height: 3px;

    flex: 0 0 3px;

    border-radius: 50%;

    background: #ffffff;

    transform: translateY(-0.5px);
  }
`;