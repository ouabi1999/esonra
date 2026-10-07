import React, {useEffect, useContext} from 'react'
import styled from "styled-components"
import { FormContext } from '../../pages/CheckoutPage';
import { useTranslation } from 'react-i18next';
function Stepper() {
    const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);
    const {t, i18n} = useTranslation()
    
    useEffect(() => {
        const stepperItems = document.querySelectorAll(".stepper-item");
        stepperItems.forEach((step, i) => {
          if (i <= activeStepIndex) {
        step.classList.add("bg-indigo-500", "text-white");
          } else {
            step.classList.remove("bg-indigo-500", "text-white");
          }
        });

      }, [activeStepIndex]);
  return (
    <Container dir = {i18n.dir() === "ltr" ? "ltr": "rtl"}>
       <Wraper>
        <div className='stepper-item'>
            <h5> {t("common.signin")} </h5>
        </div>
        <div className="flex-auto border-t-2"></div>
   
        <div className='stepper-item'>
            <h5>{t("common.billingAddress")} </h5>
        </div>
        <div className="flex-auto border-t-2"></div>
        <div className='stepper-item' >
            <h5>{t("common.shipping")}  </h5>
        </div>
        <div className="flex-auto border-t-2"></div>
        <div className='stepper-item'>
            <h5> {t("common.payment")} </h5>
        </div>
      </Wraper>
    </Container>
  )
}

export default Stepper;

const Container = styled.div`
  
 
  
 


`
const Wraper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  padding: 20.5px 8px;
 border-bottom: 1px solid #e4ded4;

  
 .stepper-item{
     height:30px;
     display:flex;
     align-items:center;
     padding:0px 10px;
     border-radius:4px;
  }

.bg-indigo-500{
 border: 1px solid #b39a76;

        

      background:
        #f7f5f0;


}


.border-t-2{
    border-top:1px solid  #b39a76;
;
    width:25%;

}

h5{
min-width:50px;
text-align:center;
}
@media only screen and (max-width: 500px){
      h5{

        min-width:30px;
        white-space: nowrap;
        font-size:10px;
     }
    }
   

`