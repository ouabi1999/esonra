import React from 'react'
import styled from 'styled-components'
import { createContext, useState, useEffect, useContext } from 'react'
import {Formik} from "formik"
import * as yup from "yup"
import { useSelector, useDispatch } from 'react-redux'

import Stepper from '../components/checkout/Stepper'
import Steps from '../components/checkout/steps/Steps';
import ProductCart from '../components/checkout/productCart';
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO/SEO'


export const FormContext = createContext();
function CheckoutPage() {
  const cartItems =  useSelector((state) => state.cart.cartItems)
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [total, setTotal] = useState(cartItems?.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)) || 0
  const navigate = useNavigate()
  
  useEffect(() => {
     window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
        if(cartItems.length === 0){
       navigate("/") 
       
     }
      
  }, [])

 
  
  return (
    
    <FormContext.Provider value={{ activeStepIndex, setActiveStepIndex, total, setTotal}}>
           <SEO title="Checkout" />
    
    {cartItems.length === 0 ?(
      ""
    )
    
    :
    <Conatiner dir = {"ltr"}>
      <Left_Section  >
        <ProductCart cartItems = {cartItems}/>
      </Left_Section>
      <Right_Section>
        <Stepper/>
        <Steps/>
      </Right_Section>
        </Conatiner>
  }

    
    
    </FormContext.Provider>
    
  )
}

export default CheckoutPage
const Conatiner = styled.div`
    width:100%;
    height:100vh;
    margin:0 auto;
    background:#fff;
    display:flex;
    flex-wrap:wrap;

 


   

`
const Left_Section = styled.div`
  flex:1;
  min-width:500px;
  
 

  @media only screen and (max-width: 500px){

   
&{
    
    min-width:320px;
  }



} 

   
`
const Right_Section = styled.div`
    min-width:500px;
   
   

    flex:1;
    position:relative;
   
        @media only screen and (max-width: 500px){

   
&{
   
    min-width:320px;
  }



} 


`
