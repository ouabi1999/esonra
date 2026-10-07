import React, {useRef, useState} from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete'; 

function DisplayBanners({formData, setFormData}) {
  const [previewImages, setPreviewImages] =  useState(formData.banners || [])
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
    banners: Array.isArray(prev.banners)
      ? [...prev.banners, file]
      : [file],
  }));
};

   const remove = (item)=>{
    
    setFormData({
      ...formData,
      banners: formData.banners.filter(x => x !== item)

    })
}
   
  return (
    <Container>
      <div>
        <label htmlFor='logo'>Banners</label>
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
      <div className="banners-preview">
          {formData.banners?.map((item, index) =>{
            return(
              <div className="img-container" key={index}>
                <img src={item}  alt="" />
                <DeleteIcon className="delete-icon" onClick={() => remove(item)} />
              </div>
            )
          }) 
        } 
      </div>
    </Container>
  )
}

export default DisplayBanners
const Container = styled.div`
     width:600px;
     
     
     margin-top:10px;

    
    
  .banners-preview{
    background:#fff;
    padding:10px;
    height:100px;
    display:flex;
    


  }
  .banners-preview img{
    width:100%;
    height:80px;
    margin-right:10px;
  }

  .img-container{
      position:relative;
      
      margin-right:10px;
      margin-bottom:10px;

    }
.delete-icon{
      position:absolute;
      top:0%;
      right:0%;
      cursor:pointer;
    }
    .delete-icon:hover{
      color:red;
    } 
`

  

