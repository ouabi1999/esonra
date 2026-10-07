import React from "react";
import styled from "styled-components";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";

import { yellow } from "@mui/material/colors";
import { ClickAwayListener } from "@mui/base";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react"


function PopUpShoppingMethod(props) {
  const productData = useSelector((state) => state.products.productData);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const {t} = useTranslation()

  const {
    checkboxChange,
    shippingMethodIndex,
    shippingInfo ,
    setIsPopUpShippingOpen,
    isPopUpShippingOpen,
  } = props;

  return (
    <ParentContainer>
      <AnimatePresence mode="wait">
  
      <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            key="box"
            className="box"
        >
                 
      <ClickAwayListener
    mouseEvent="onMouseDown"
    touchEvent="onTouchStart"
    onClickAway={()=> setIsPopUpShippingOpen(!isPopUpShippingOpen)}
    >
      <ShippingMethods role="presentation">
        <div className="header">
          <h5>{t("sideCard.available_shipping_methods")}</h5>
          <InfoIcon className="info-icon" />
        </div>
        {productData?.available_shipping?.length > 0 ? (
          productData?.available_shipping?.map((item, index) => {
            return (
              <div className="methods_container" key={index}>
                <div className="shipping-type">
                  <span className="shipping-method">
                    {item.methodName.toUpperCase()}
                  </span>

                  <span className="shipping-time">
                    {item.from + " - " + item.to + " " + t("sideCard.days")}
                  </span>
                </div>
                <div>
                  <span>€{item.cost}</span>
                  <Checkbox
                    {...label}
                    name={item.methodName}
                    checked={index === shippingMethodIndex}
                    onClick={() => {
                      checkboxChange(item, index);
                      setIsPopUpShippingOpen(false);
                    }}
                    sx={{
                      color: yellow[800],
                      "&.Mui-checked": {
                        color: yellow[900],
                      },
                    }}
                    />
                </div>
              </div>
            );
          })
          
        ) : (
          
          <div className="methods_container">
            <div className="shipping-type">
              <span className="shipping-method">
                {shippingInfo.methodName.toUpperCase()}
              </span>

              <span className="shipping-time">
                {shippingInfo.from} - {shippingInfo.to}{" "}{t("sideCard.days")}
              </span>
            </div>
            <div>
              <span className="shipping-cost">€{shippingInfo.cost}</span>
              <Checkbox
                {...label}
                name="e-packet"
                checked={shippingMethodIndex === 1}
                onClick={() => {
                  checkboxChange(shippingInfo, 1);
                  setIsPopUpShippingOpen(false);
                }}
                sx={{
                  color: yellow[800],
                  "&.Mui-checked": {
                    color: yellow[900],
                  },
                }}
                />
            </div>
          </div>
         
        )}
      </ShippingMethods>
       </ClickAwayListener>
                </motion.div>
                </AnimatePresence>
    </ParentContainer>
                
  );
}

export default PopUpShoppingMethod;
const ParentContainer = styled.div`
  top: 0%;
  position: fixed;
  z-index: 100;
  .box{
  background: #665e5e88;
  width: 100%;
  height: 100%;
  top: 0%;
  position: fixed;
  z-index: 100;
  display:flex;
  justify-content: center;
  align-items: center;
  }

`;
const ShippingMethods = styled.div`

  border: 1px solid lightgray;
  border-radius: 6px;
  width: 80%;
  max-width:700px;
  min-width:320px;
  
  height: 100%;
  max-height: 400px;
  overflow-y: scroll;
  background: #fff;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);

  padding: 5px 10px;
  .header {
    display: flex;
    align-items: center;
    .info-icon {
      color: gray;
    }
  }
  .shipping-type {
    display: flex;
    gap: 10px;
  }
  .shipping-time {
    font-size: 0.8rem;
    color: gray;
  }
  .shipping-cost {
    font-size: 1rem;
  }
  .shipping-method {
    font-size: 1rem;
    width: 180px;
    font-family: monospace;
    font-weight: 900;
  }
  .methods_container {
    position: relative;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border: 1px solid lightgray;
    border-radius: 6px;
    padding: 4px 8px;
    margin-bottom: 10px;
  }
  .methods_container img {
    width: 80px;
    height: 40px;
    object-fit: cover;
    position: absolute;
    top: 2px;
    left: -5px;
  }
  @media only screen and (max-width: 500px) {
    
    .shipping-method {
      font-size: 0.7rem;
    }
    .shipping-time {
      font-size: 0.7rem;
    }
    .shipping-cost {
      font-size: 0.7rem;
    }
  }
`;

const Buttons_container = styled.div`
  display: flex;
  justify-content: space-evenly;
  button {
    color: #fff;
    background: blue;
    padding: 8px 15px;
    border-radius: 6px;
    margin-top: 10px;
    font-size: 17px;

    &:hover {
      opacity: 0.8;
    }
  }
`;
