import React, { useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styled from 'styled-components';
import CancelIcon from '@mui/icons-material/Cancel';

function DisplayHeader({formData, setFormData}) {

  const RefInput =  useRef()
  

  const handelIinputRefer = (e) =>{
    e.preventDefault();
    RefInput.current.click();

  }
  const remove_banner = () =>{
    setFormData({
      ...formData,
       header: {
            ...formData.header,
             banner:""
        
          
            }
    });
  }
  const handelChange =(e)=>{
    setFormData({
      ...formData,
       header: {
            ...formData.header,
             title: e.target.value
        
          
            }
    });
    
  } 
  const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFormData(prev => ({
    ...prev,
    header: {
      ...prev.header,
      banner: file,
    },
  }));
};


    
  return (

    <Container>
      <div className="text-input-container">
        <input value={formData?.header?.title ||""}  onChange={handelChange} type="text" placeholder='header title' />
      </div>

      <div className='img-input-container'>
        <input
          accept="image/*"
          ref={RefInput}
          value={formData?.header?.banner || ""}
          type="file"
          onChange={handleImageChange}
          style={{ display: "none" }}
          
        />

      </div>
      <div>
          <button onClick={handelIinputRefer} type="button">
          <AddPhotoAlternateIcon className="add_photo_icon"  />
          </button>
      </div>
    
          <div className="banner-preview">
          {formData.header?.banner !== "" && (
          <>
            <img src={formData?.header?.banner} alt='banner'/>
            <CancelIcon className="delete-icon"  onClick = {remove_banner}/>
          </>
            )} 
           </div>
      
      
    </Container>
  )
}

export default DisplayHeader

const Container = styled.div`
       border-bottom:2px solid lightgray;
       padding:10px 0px;
       width:600px;
      .text-input-container input{
          height:45px;
          width:600px;
          border-radius:4px;
          border:1px solid lightgray;
          margin-bottom:10px;
      }

      .banner-preview{
        width:600px;
        height:100px;
        background-color:#fff;
        padding:10px;
        position:relative;
        
      }
      .banner-preview img{
        width:100%;
        height:80px;
       
      }
      .delete-icon{
        position:absolute;
        top:-8%;
        right:-2%;
      }


`