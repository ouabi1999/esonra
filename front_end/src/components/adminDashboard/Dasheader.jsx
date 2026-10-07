import React, { Component } from 'react';
import styled from 'styled-components';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';

 class Dasheader extends Component {
   constructor(props) {
     super(props)
   
     this.state = {
        
     }
   }
   
  render() {
    return (
      <HeaderWrap>
        <div className="menu">
        <li>
          
             <MenuIcon  onClick={this.props.showSidebar} className="menu-icon"  />

        </li>
        </div>
        <div className="profile">
          <li >
            <NotificationsNoneIcon className="notification-icon"  />
          </li>
          <li>
            <MarkunreadIcon className='message-icon' />
          </li>
          
        </div>
      </HeaderWrap>
    )
  }
}
export default Dasheader

const HeaderWrap = styled.div`
  
   background:#262626;
   border-bottom:1px solid lightgray;
   display:flex;
   justify-content:flex-end;
   height:70px;
  
  
  
   
.profile{
   display:flex;
   align-items:center;
   padding:8px 15px;
   margin-left:2px;
  li{
    margin-left:10px;
  }

img{
  width:45px;
  height:45px;
  border-radius: 50%
 }
}
.menu{
  flex:1;
  
}

.message-icon, .notification-icon, .menu-icon{
    cursor:pointer;
    color:lightgreen;
  }



`