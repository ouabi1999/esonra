import React, { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from 'react-i18next';
import ApiInstance from '../../../common/baseUrl';


function MyOrders() {
  const user = useSelector(state => state.auth.user) 
  const [orders, setOrders] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const  { t } = useTranslation()
  
  const handleChange = (event, value) => {
    setCurrentPage(value);
    console.log(currentPage)
  };

  const getOrdered_products = () => {
    setIsLoading(true)
    
    ApiInstance.post(`get_user_orders/${user?.id}/`,{
      "current_page": currentPage,
      
    })
      .then(response => {
        setOrders(response.data.orders);
        setTotalPages(response.data.total_pages);
        setIsLoading(false)
        console.log(response.data)
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });

  }
  useEffect(() => {
    if ( user !== null){
        getOrdered_products()
     }

  }, [user, currentPage]);
  return (
    <Container>
      {!isLoading ? (
        orders?.length <= 0 && user !== null ? (
          <div
            style={{
              height: "calc(100vh - 100px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <span>{t("profile.you_havent_placed_any_orders_yet")}</span>
            <Link to="/">{t("profile.start_shopping")}</Link>
          </div>
        ) : (
          <div>
            {orders?.map((order, index) => {
              return (
                <Wrapper key={index}>
                  <div className="order-details">
                    <div className="order-status">
                      <span>{t("profile.processing")}</span>
                    </div>
                    <div className="shippingInfo font">
                      <span> {t("profile.order_take_between:")} {order.delivery_time}</span>
                      <span>
                        {" "}
                        {t("profile.tracking_number:")}{" "}
                        {order.trackingNumber === null
                          ? t("profile.not_available")
                          : order.trackingNumber}{" "}
                      </span>
                      <span> {t("profile.shippingMethod:")} {order.shipping_method}</span>
                    </div>
                    <div className="order-end-section font">
                      <span> {t("profile.order_placed_on")}: {order.ordered_at}</span>
                      <span>{t("profile.order_id: ")}{order.id} </span>
                      <span> {t("profile.payment_method")}: {t("profile.Credit_Debit_card")}</span>
                    </div>
                  </div>

                  {order?.ordered_items?.map((product, index) => {
                    return (
                      <div key={index} className="product-container">
                        <div className="flex-start-product">
                          <div className="product-img">
                            <img
                              src={product.color}
                              alt={""}
                            />
                          </div>

                          <div className="product-info">
                            <span
                              className={`title-container ${
                                product.size ? "skeleton" : ""
                              }`}
                            >
                              {product.name}
                            </span>

                            <div className="selected-size">
                              <span>{product.size ? product.size : ""}</span>
                            </div>
                            <div className="product-price">
                              <span>${product.price}</span>
                              <span className="quantity">
                                {" "}
                                x{product.quantity}{" "}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-end-product">
                          <div className="subtotal">
                            <span> {t("profile.subtotal")} </span>
                            <span>
                              $ {(product.price * product.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="shipping">
                            <span> {t("profile.shipping")} </span>
                            <span>
                              ${" "}
                              {order.shipping_price
                                ? order.shipping_price
                                : "0.00"}
                            </span>
                          </div>

                          <div className="total">
                            <span> {t("profile.total")} </span>
                            <span>
                              {" "}
                              ${" "}
                              {(
                                product.price * product.quantity +
                                parseFloat(order.shipping_price)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Wrapper>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pagination
              
                color="primary"
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
              />
            </div>
          </div>
        )
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "65px",
          }}
        >
          <CircularProgress size={25} thickness={4} />
        </div>
      )}
    </Container>
  );
}



export default MyOrders

const Container = styled.div`
  

`

const Wrapper = styled.div`
    
  
    padding:10px;
   
   
    margin-bottom:15px;
    width:95%;
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



