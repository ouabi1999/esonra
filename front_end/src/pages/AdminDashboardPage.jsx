/*import React, { Component } from 'react'
import styled from 'styled-components'
import {Link} from "react-router-dom"

import Chart from "../components/adminDashboard/Chart"
import Orders from "../components/adminDashboard/Orders"
import DashLayout from '../components/adminDashboard/DashLayout'
 class Dashboard extends Component {
    render() {
        return (
            <Wrapper>    
                <DashLayout/>
                <ChartWrap>
                    <Chart/>
                </ChartWrap>
                <OrdersWrap>
                    <Orders/>
                </OrdersWrap>
            </Wrapper>
        )
    }
}

export default Dashboard
const Wrapper = styled.div`
    min-width:760px;
    margin:auto;
  
`
 const ChartWrap = styled.div`
    margin-top:10px;
 `
 const OrdersWrap = styled.div`
    
      
     
 `
*/

import React, { useCallback, useEffect, useState } from 'react'
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import PageNoteFound from "../../common/PageNoteFound"
import { getUser } from "../features/authSlice"
import Dasheader from '../components/adminDashboard/Dasheader';

import DashSideBar from '../components/adminDashboard/DashSideBar';



function AdminDashboardPage(props){

    const user = useSelector( state => state.auth.user)
    const isAuth = window.localStorage.getItem("access_token")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    
    
   
        

        

     
      const [data , setData] = useState({
        isOpen : null,
        showBar : ""


      })
    
    
    const showSidebar = () =>{
        if (data.isOpen){
            setData({
                ...data,
                showBar:"none",
                isOpen:false,
                
            })
        }
        else{
            setData({
                ...data,
                showBar:"flex",
                isOpen:true,
            })
        }
    
    }
    useLayoutEffect(() => {
       
        if (!isAuth){
    
            navigate("/")
            
        }
        
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        
       
       }, [])
    
        const { showBar} = data;
        return (
            <>
           
           {isAuth  ? (

            <Wrapper>
                <div className='sidebar' style={{ display: showBar}}>
                    <DashSideBar/>
                </div>
                <div className='Headbar'>
                    <Dasheader showSidebar={showSidebar}/>
                </div>
                <div className='outlet'>
                    <Outlet />
               </div>
            </Wrapper>
            ): <PageNoteFound/>
            
            }
            
            </>
        )
    
    }

export default AdminDashboardPage
const Wrapper = styled.div`
   display:flex;
   margin:auto;
   min-height:100vh;
   .sidebar{
       flex:1;
       transition:2s;
       background:#262626;
       border-right:1px solid lightgray;
       
   }
   .Headbar{
       position:fixed;
       flex:4;
       width:100%;
       z-index:1000;
   }
   .outlet{
       
       margin-top:70px;
       padding:15px;
      
       min-width:780px;
       width:calc(100vw - 260px);
       flex:4;
       background-color:rgba(252, 205, 250, 0.34);
       
   }
   @media only screen and (max-width:1200px) {
    .sidebar{
        display:none;
    }
    .Headbar{
        left:0px;
        flex:0;
        width:100%;
        

    }
  }



`







