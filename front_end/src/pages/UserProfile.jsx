import React from 'react'
import SideBar from "../components/user_Dashboard/SideBar"
import styled from "styled-components"
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom';
import NavBar from "../components/Navbar/NavBar"
import SEO from '../components/SEO/SEO'


function UserProfile() {
 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const auth = window.localStorage.getItem("access_token")
    useEffect(() => {
      if (!auth){
  
          navigate("/" )
          
      }
      
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      
      if(user?.admin === true){
        navigate("/admin")
    }
     }, [])
  
    
    return (
      <>
      
        {auth ? (
          <>
          <NavBar/>
          <SEO title="My Profile"/>
          <Container>
          
          <SideBar />
          
            <Outlet_container>
              <Outlet />
            </Outlet_container>
            </Container>
            </>
          
          ):""}
      </>
  
    )
  }
  
export default UserProfile  

const Container = styled.div`
    display:flex;
    position:relative;
    @media only screen and (max-width: 820px) {
      /* For mobile phones: */
        
       &{
        flex-direction:column;
       }
     
    }
  
  
  `
  const Outlet_container = styled.div`
    padding:10px 2px;
    flex:2;
    margin-left:4px;
  
   
  `
  

