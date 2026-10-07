import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import CircularProgress from "@mui/material/CircularProgress";
import axios from 'axios';


function Orders({products}) {
  const user = useSelector(state => state.auth.user) 
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getOrderes = () => {
    setIsLoading(true)
    
    axios.get('/api/get_orders')
      .then(response => {
        //dispatch(setProducts(response.data.products))
        setOrders(response.data.orders);
        setIsLoading(false)
      
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });

  }
  useEffect(() => {
    if ( user !== null){
        getOrderes()
     }

  }, [user])
  return(
  
    <Container>
      {!isLoading ?  (
      
      orders?.length <= 0 ? (
        <div style={
          { 
             height:"calc(100vh - 100px)" ,
             display:"flex", alignItems:"center",
             justifyContent:"center",
             flexDirection:'column',
          }
         }
        >
         <span> You have any orders yet</span>
        </div>
      )
        :
        (
          <div>

            {orders?.map((order, index) => {
              return (
                <Wrapper key={index}>
                  <div className='order-details'>
                    <div className='order-status'>
                      <span>Processing</span>
                    </div>
                    <div className='shippingInfo font'>
                      <span> Order take between: {order.deliveryTime}</span>
                      <span> ThrakingNumber: {order.trackingNumber === null ? "Not available" : order.trackingNumber} </span>
                      <span> ShippingMethod: {order.shippingMethod}

                      </span>
                    </div>
                    <div className='order-end-section font'>
                      <span> Order placed on: {order.date.slice(5, 16)}</span>
                      <span> Order ID: {order.id} </span>
                      <span> Payment method: Credit/Debit card</span>
                    </div>
                  </div>

                  {order?.ordered_products?.map((product, index) => {
                    return (
                      <div key={index} className="product-container">

                        <div className='flex-start-product'>
                          <div className="product-img">
                            <img src={products?.find(product => product.id === product.id)?.colors[product.selectedColor]} alt={""} />
                          </div>

                          <div className='product-info'>
                           
                              <span className={`title-container ${!products?.find(product => product.id === product.id) && " skeleton"}`}>
                                {products?.find(product => product.id === product.id)?.title}
                                
                              </span>
                            
                            <div className="selected-size">
                              <span>
                                {products?.find(product => product.id === product.id)?.sizes[product.selectedSize]}
                              </span>
                            </div>
                            <div className="product-price">
                              <span>
                                ${products?.find(product => product.id === product.id)?.price}
                              </span>
                              <span className='quantity'> x{product.selectedQuantity} </span>
                            </div>
                          </div>

                        </div>

                        <div className='flex-end-product'>
                          <div className='subtotal'>
                            <span> Subtotal </span>
                            <span >$ {(product.price * product.selectedQuantity).toFixed(2)}</span>
                          </div>
                          <div className='shipping'>
                            <span> Shipping </span>
                            <span>$ {order.shippingPrice ? order.shippingPrice : "0.00"}</span>
                          </div>

                          <div className='total'>
                            <span>  Total  </span>
                            <span> $ {(product.price * product.selectedQuantity + parseFloat(order.shippingPrice)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </Wrapper>
              )
            })}




          </div>
        ) ):
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"65px"}}>
            <CircularProgress
                size={25}
                thickness={4} 
              />
        </div>
      }
    </Container>

  )
}



export default Orders

const Container = styled.div`
    


    
  





`

const Wrapper = styled.div`
    
  
    padding:10px;
   
   
    margin-bottom:15px;
    width:100%;
    .font{
       font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       font-weight:500;
        font-size:0.8rem;
    }
    .order-details{
          display:grid;
          grid-gap:10px;
         
          padding-bottom:10px;


          .order-status{
              font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              grid-column: 1/ span 2;
              background:#fff;
              padding:10px;
            }

            .shippingInfo{
              grid-column: 3/ span 1;
             
            }
            .order-end-section{
              grid-column: 4 / span 1;
        

            }
          .shippingInfo, .order-end-section{
           
            display:flex;
            flex-direction:column;
            gap:4px;
            background-color:#fff;
            padding:10px;
            
          }
     

    }
    
      .product-container{
        background-color:#fff;
        border-bottom:1px solid lightgray;
        padding:10px;
        flex-wrap:wrap;
        display:flex;
        width:100%;
        justify-content:space-between;


        .product-info{
          display:flex;
          flex-direction:column;
          gap:10px;
          
        } 
         
         
          
         
          
         
          
        

        .title-container{
          font-size:0.9rem;
          font-weight:500;
          text-overflow:ellipsis;
          white-space: nowrap; 
          overflow: hidden;
          font-family:sans-serif;
          opacity:0.9;
          max-width:48vw;
          min-width:160px;
          
          
        
          
          
          
        }
      }
        .selected-size{
          text-transform:uppercase;
          font-weight:bold;
          color:gray;
          font-size:0.8rem;
        }
        .product-price{
           font-family:'Courier New', Courier, monospace;

        }
        .quantity{
          color:gray;
        }
       
      
       
    

    .flex-start-product{
      display:flex;
      
    }
    
    .product-img{
      display:flex;
      align-items:center;
  
     }

    .product-img img{
        width:90px;
        height:100px;
        box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 2px 0px, rgba(60, 64, 67, 0.25) 0px 2px 6px 2px;
        margin-right:10px;
        object-fit:cover;
        animation: skeleton-loading 1s linear infinite alternate;
    }
    .flex-end-product{
        display:flex;
        flex-direction:column;
        min-width:180px;
        gap:10px;
        
          .shipping , .subtotal, .total {
              font-size:14px;
              display:flex;
              justify-content:space-between;
           }
        .shipping , .subtotal{
          
          color:gray;

        }
        .total{
          font-weight:bolder;
        }

           
    }

   .skeleton {
        animation: skeleton-loading 1s linear infinite alternate;
    }

    @keyframes skeleton-loading {
    0% {
       background-color: #c2cfd6;
      }
      100% {
        background-color: #f0f3f5;
      }
    }
  
    @media only screen and (max-width: 1200px){


    &{
        margin-right:0;
      }

   

    } 
    @media only screen and (max-width: 990px) {
      .order-details{
          
      .order-status{
             
            
             grid-column: 1 / span 1;  
             grid-row:1/ span 1; 
              
          };

          .shippingInfo{
              grid-column:1;
              grid-row:2;
              
            };

            .order-end-section{
              
              grid-column: 1/ span 1;
              grid-row:3;

            }


          }
      }
    @media only screen and (max-width: 645px) {
        .product-img{
               margin-bottom:15px;
            }
          }
`



