import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

function SearchPage({value}) {
   const {t, i18n} = useTranslation();
  return (
    <Container>
        <span>
            
         {}
        </span>
        
        </Container>
  )
}

export default SearchPage

const Container = styled.div`
   display:flex;
   justify-content:center;
   align-items:center;
   height: 70vh;
   font-size:16px;
   span{
    max-width:50%;

   }
    
     
`