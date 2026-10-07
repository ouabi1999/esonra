import React, {
  useContext,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import styled from "styled-components";

import Radio from "@mui/material/Radio";
import { useSelector } from "react-redux";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import { FormContext } from "../../../pages/CheckoutPage";
import { OrderContext } from "../../../App";
import CurrencyPrice from "../../../../common/CurrencyPrice";


/* =====================================================
   DEFAULT SHIPPING METHODS

   These are used ONLY when the backend does not provide
   available_shipping.
===================================================== */

const DEFAULT_SHIPPING_METHODS = [
  {
    methodName: "Standard Shipping",
    cost: 0,
    from: 5,
    to: 10,
  },
];


const Shipping = forwardRef(({ t }, ref) => {

  /* =====================================================
     CONTEXT
  ===================================================== */

  const {
    setActiveStepIndex,
    total,
  } = useContext(FormContext);


  const {
    formData,
    setFormData,
  } = useContext(OrderContext);

   const selectedCurrency = useSelector(
     (state) => state.currency.selectedCurrency
   );

  /* =====================================================
     REDUX
  ===================================================== */

  const productData =
    useSelector(
      (state) => state.product.productData
    ) || {};


  /* =====================================================
     SHIPPING METHODS

     If backend has shipping methods:
       → Use backend methods

     If backend has no shipping methods:
       → Use default methods
  ===================================================== */

  const backendShippingMethods =
    Array.isArray(
      productData?.available_shipping
    )
      ? productData.available_shipping
      : [];


  const shippingMethods =
    productData?.available_shipping?.length > 0
      ? productData?.available_shipping
      : DEFAULT_SHIPPING_METHODS;


  /* =====================================================
     SELECTED SHIPPING METHOD

     Restore the selected method from formData.

     formData itself is restored from localStorage
     by your OrderContext.
  ===================================================== */

  const [
    selectedShippingIndex,
    setSelectedShippingIndex,
  ] = useState(() => {

    if (!formData?.shippingMethod) {
      return null;
    }


    const savedIndex =
      shippingMethods.findIndex(
        (item) =>
          item.methodName ===
          formData.shippingMethod
      );


    return savedIndex !== -1
      ? savedIndex
      : null;

  });


  /* =====================================================
     VALIDATION STATE
  ===================================================== */

  const [
    inputRequired,
    setInputRequired,
  ] = useState(false);


  /* =====================================================
     SELECT SHIPPING METHOD
  ===================================================== */

  const selectShippingMethod = (
    item,
    index
  ) => {

    setSelectedShippingIndex(index);

    setInputRequired(false);


    setFormData((prev) => ({

      ...prev,

      shippingMethod:
        item.methodName,

      shippingPrice:
        Number(item.cost),

      deliveryTime:
        `${item.from} - ${item.to} Days`,

    }));

  };


  /* =====================================================
     VALIDATE + NEXT STEP
  ===================================================== */

  const submitShipping = () => {

  if (!formData?.shippingMethod) {
    setInputRequired(true);
    return false;
  }

  const shippingPrice = Number(
    formData.shippingPrice || 0
  );

  const totalPrice = Math.round(
    (
      Number(total) +
      shippingPrice
    ) * 100
  );

  // GA4 — Shipping Information
  if (typeof window.gtag === "function") {
    window.gtag("event", "add_shipping_info", {
      currency: selectedCurrency,
      value: totalPrice / 100,
      shipping: shippingPrice,
      items: formData.cartItems?.map((item) => ({
        item_id: item?.selectedSku?.sku_attr || item?.id,
        item_name: item?.name?.en || "Luxury Lamp",
        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
      })),
    });
  }

  setFormData((prev) => ({
    ...prev,
    totalPrice,
  }));

  setActiveStepIndex((prev) => prev + 1);

  return true;
};


  /* =====================================================
     EXPOSE FUNCTION TO STEPS COMPONENT
  ===================================================== */

  useImperativeHandle(ref, () => ({

    submitShipping,

  }));


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <ShippingMethods>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="header">

        <div className="header-text">

          <h5>
            {t("common.selectShippingMethod")}
          </h5>

         

        </div>


        <LocalShippingOutlinedIcon
          className="shipping-icon"
        />

      </div>



      {/* =================================================
          SHIPPING OPTIONS
      ================================================= */}

      <div className="methods-list">

        {shippingMethods.map(
          (item, index) => {

            const isSelected =
              selectedShippingIndex === index ||
              formData?.shippingMethod ===
                item.methodName;


            return (

              <div

                key={`${item.methodName}-${index}`}

                className={`
                  shipping-option
                  ${
                    isSelected
                      ? "selected"
                      : ""
                  }
                `}

                onClick={() =>
                  selectShippingMethod(
                    item,
                    index
                  )
                }

              >


                {/* ================= LEFT ================= */}

                <div className="shipping-info">


                  <span className="method-name">

                    {item.methodName}

                  </span>


                  <span className="delivery-time">

                    {item.from}

                    {" - "}

                    {item.to}

                    {" "}

                    {t("common.days")}

                  </span>


                </div>



                {/* ================= RIGHT ================= */}

                <div className="shipping-price">


                  <span className="price">

                    <CurrencyPrice price = 

                    {Number(
                      item.cost || 0
                    ).toFixed(2)}
                    />

                  </span>


                  <Radio

                    checked={isSelected}

                    onChange={() =>
                      selectShippingMethod(
                        item,
                        index
                      )
                    }

                    onClick={(event) =>
                      event.stopPropagation()
                    }

                    inputProps={{
                      "aria-label":
                        item.methodName,
                    }}

                  />


                </div>


              </div>

            );

          }
        )}

      </div>



      {/* =================================================
          VALIDATION MESSAGE
      ================================================= */}

      {inputRequired && (

        <div
          className="validation-message"
          role="alert"
        >

          {t(
            "common.pleaseSelectShippingMethod"
          )}

        </div>

      )}


    </ShippingMethods>

  );

});


export default Shipping;


/* =====================================================
   STYLES
===================================================== */

const ShippingMethods = styled.div`

  width: 85%;

  max-width: 760px;

  box-sizing: border-box;

  background: #ffffff;

  border:
    1px solid #e4ded4;

  padding: 30px;

  margin: 15px 0;


  /* =================================================
     HEADER
  ================================================= */

  .header {

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding-bottom: 20px;

    margin-bottom: 22px;

    border-bottom:
      1px solid #e4ded4;

  }


  .header-text {

    display: flex;

    flex-direction: column;

  }


  .header h5 {

    margin: 0 0 6px;

    font-family:
      Georgia,
      serif;

    font-size: 15px;

    font-weight: 500;

    letter-spacing: 0.7px;

    color: #1d1c1a;

  }


  .header p {

    margin: 0;

    font-size: 11px;

    line-height: 1.5;

    color: #77736b;

  }


  .shipping-icon {

    font-size: 25px;

    color: #b39a76;

  }



  /* =================================================
     SHIPPING METHODS
  ================================================= */

  .methods-list {

    display: flex;

    flex-direction: column;

    gap: 12px;

  }


  .shipping-option {

    width: 100%;

    box-sizing: border-box;

    display: flex;

    align-items: center;

    justify-content: space-between;

    min-height: 76px;

    padding: 14px 16px;

    border:
      1px solid #e4ded4;

    background:
      #ffffff;

    cursor: pointer;

    transition:
      border-color 0.25s ease,
      background 0.25s ease,
      transform 0.25s ease;


    &:hover {

      border-color:
        #b39a76;

      transform:
        translateY(-1px);

    }


    &.selected {

      border-color:
        #b39a76;

      background:
        #f7f5f0;

    }

  }



  /* =================================================
     SHIPPING INFORMATION
  ================================================= */

  .shipping-info {

    display: flex;

    flex-direction: column;

    gap: 7px;

  }


  .method-name {

    font-family:
      Georgia,
      serif;

    font-size: 12px;

    font-weight: 500;

    letter-spacing: 1.1px;

    text-transform:
      uppercase;

    color:
      #1d1c1a;

  }


  .delivery-time {

    font-size: 11px;

    color:
      #77736b;

  }



  /* =================================================
     PRICE
  ================================================= */

  .shipping-price {

    display: flex;

    align-items: center;

    gap: 12px;

  }


  .price {

    font-size: 13px;

    font-weight: 500;

    color:
      #3a332d;

    white-space:
      nowrap;

  }


  /* Material UI Radio */

  .MuiRadio-root {

    color:
      #b39a76;

    padding: 6px;

  }


  .MuiRadio-root.Mui-checked {

    color:
      #9d825e;

  }



  /* =================================================
     VALIDATION
  ================================================= */

  .validation-message {

    margin-top: 16px;

    padding: 12px 14px;

    background:
      #f7f5f0;

    border-left:
      2px solid #b39a76;

    font-size: 11px;

    color:
      #5a534a;

  }



  /* =================================================
     MOBILE
  ================================================= */

  @media (max-width: 600px) {

    width: 100%;

    padding: 20px 15px;


    .header h5 {

      font-size: 14px;

    }


    .header p {

      font-size: 10px;

    }


    .shipping-option {

      min-height: 70px;

      padding: 12px;

    }


    .method-name {

      font-size: 11px;

      letter-spacing:
        0.8px;

    }


    .delivery-time {

      font-size: 10px;

    }


    .price {

      font-size: 12px;

    }

  }

`;