import React, { useState } from 'react'

import LoginForm from "../components/auth/LoginForm"
import SignUpForm from "../components/auth/SignUpForm"
import ForgotPassword from "../components/auth/ForgotPassword"
import { useTranslation } from 'react-i18next'

function Auth() {
 
  const [pageActive , setPageActive] = useState("login")
  const {t, i18n} = useTranslation();
  const show = (value)=>{
      
    setPageActive(value)
    
  }
  
  return (
    <>

      {pageActive === "login" && <LoginForm t = {t} i18n = {i18n} show={show} />}
      {pageActive === "sign-up" && <SignUpForm t = {t} i18n = {i18n} show={show} />}
      {pageActive  === "reset"&& <ForgotPassword t = {t}i18n = {i18n}  show={show} />}



    </>
  )
}

export default Auth