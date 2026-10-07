import React, {useRef, useState} from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styled from 'styled-components';

function DisplayLogo({formData, setFormData}) {
    

    
    const imgInput = useRef()
    

     // handle image input
     const handleImageInput = (e) => {
        e.preventDefault();
        if (e.target.id === e.target.name) {
          return false;
        } else {
         imgInput.current.click();
        }
      };
  
      /// handel image change
      const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFormData(prev => ({
    ...prev,
    logo: file,
  }));
};
    
    
  return (
    <Container>
      <div>
        <label htmlFor='logo'>Logo</label>
        <input 
            type="file" 
            ref={imgInput}
            onChange={handleImageChange}
            style={{display:"none"}}
            
            />
      </div>
      <div>
          <button onClick={handleImageInput} type="button">
          <AddPhotoAlternateIcon className="add_photo_icon"  />
          </button>
      </div>
      <div className="logo-preview">
          {formData.logo !== "" && (
          
            <img src={formData.logo}  alt=""/>
            
          )}

        </div>
    </Container>
  )
}

export default DisplayLogo
const Container = styled.div`
     width:600px;
     
     
     margin-top:10px;

    
    
  .logo-preview{
    background:#fff;
    padding:10px;
    height:100px;


  }
  .logo-preview img{
    width:100%;
    height:80px;
  }
`