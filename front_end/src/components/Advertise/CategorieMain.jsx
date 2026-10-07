import React,{useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from "styled-components"
import { setCategory} from "../../features/categorySlice"
import { toggleCategory } from '../../features/filterSlice'


function CategorieMain() {

  const dispatch = useDispatch()
  const displayData = useSelector(state=> state.display.displayData)

  const filter = (itemCategory) =>{
   
    dispatch(toggleCategory(itemCategory))
      
  }
  
  
  return (
    <Container data ={displayData?.main_category}>
        {displayData?.main_category?.length > 0 ? (
           displayData?.main_category.slice(0, 6).map((item, index)=> {

            return(
              <Link id ="link" className={`item${index}`} style={{ backgroundImage: `url(${item.img})` }} key={index} to="/search" onClick={() => filter(item.categoryName)}>
              </Link>
            )
          })
          
        ):
         [1, 2, 3, 4, 5, 6].map((item, index )=> {
          return(
            <div key={index} className={`item${index}`}>

            </div>
          )
         })
        }
        
       
      
        
    </Container>
  )
}

export default CategorieMain

const Container =  styled.div`
    
    
    min-width:320px;
    height:50vh;
    
    
    display:grid;
    gap: 10px;

  

   #link , div{
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center;

      background-color:#e3e3e3;
     
  }
  div{
     animation: skeleton-loading 1s linear infinite alternate;
      -webkit-animation: skeleton-loading 1s linear infinite alternate;
      animation: skeleton-loading 1s linear infinite alternate;
  }

@-webkit-keyframes skeleton-loading {
  0% {
    background-color: #c2cfd6;
  }
  100% {
    background-color: #f0f3f5;
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: #c2cfd6;
  }
  100% {
    background-color: #f0f3f5;
  }
}
    .item0{
        grid-column: 1 / span 1; 
        grid-row: 1 /span 2;
        
      
    }

    .item1{
      grid-column: 2 / span 1;
      grid-row: 1 / span 2;
      width:100%;
    
    
      
    }

    .item2{
      grid-column: 3 / span 2;
      grid-row: 1 /span 2;
      width:100%;
    
     

    }

    .item3{
      grid-column: 1 / span 2;
      grid-row: 3 / span 2;
    }

    .item4{
      grid-column: 3 / span 1;
      grid-row: 3 / span 2;
      
      
      
    }
    .item5{
      grid-column: 4 / span 1;
      grid-row: 3 / span 2;
       background-image: url(${props => props?.data?.[5]?.img});
  
    }


    @media only screen and (max-width:1280px) {
      .item0{
        grid-column: 1 / span 1;
        grid-row: 1 /span 3;
       
      
    }

    .item1{
      grid-column: 2 / span 1;
      grid-row: 1 / span 6;
    
     
      
    }

    .item2{
      grid-column: 3 / span 1;
      grid-row: 1 / span 3;
    }

    .item3{
      grid-column: 4 / span 1;
      grid-row: 1 / span 6;
    }

    .item4{
      grid-column: 1 / span 1;
      grid-row: 4 / span 3;
    }
    .item5{

      grid-column: 3 / span 1;
      grid-row: 4 / span 3;
    
    }
    
    }


    @media only screen and (max-width:885px) {
       &{
        height:100vh
       }
      .item0{
       grid-row:1 / span 3;
       grid-column:1 / span 1
      
    }

    .item1{
     
      grid-row:1 / span 3;
      grid-column:2;
     
      
    }

    .item2{
      grid-row:4 / span 3;
      grid-column:1;
     
    }

    .item3{
      grid-row:4 / span 3;
      grid-column:2;
     
    }

    .item4{
      grid-row: 7 / span 3 ;
      grid-column:1;
    
    }
    .item5{
      grid-row: 7 / span 3 ;
      grid-column:2;
    
    }
    
    }

    @media only screen and (max-width:420px){
      &{
        height:420px;
        min-width:290px;
      }
      .item0{
       grid-row:1 / span 2;
       grid-column:1 / span 1
      
    }

    .item1{
     
      grid-row:1 / span 2;
      grid-column:2;
     
      
    }

    .item2{
      grid-row:3 / span 2;
      grid-column:1;
     
    }

    .item3{
      grid-row:3 / span 2;
      grid-column:2;
     
    }

    .item4{
      grid-row: 5 / span 2 ;
      grid-column:1;
    
    }
    .item5{
      grid-row: 5 / span 2 ;
      grid-column:2;
    
    }
    }
       
`