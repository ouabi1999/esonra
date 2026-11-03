import React,{useEffect, useRef, useState} from 'react'
import styled from 'styled-components';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export default function Color({ setFormData, formData}) {

   
    const imgInput = useRef()
  
    const removeImage = (index) => {
        const colors = formData.colors.slice();
        setFormData({
          ...formData,
          colors: colors.filter((x) => x !== index),
        });
      };

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
        e.preventDefault();
        if (e.target.files) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.readyState === 2) {
              setFormData({
                ...formData,
                colors: [...formData.colors, reader.result],
              });
            }
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      };
  return (
    <Container>
            <label htmlFor="Preview image" style={{fontFamily:"sans-serif"}} > Color</label>
            <div className="productImg-container">
                <input
                    type="file"
                    name="pics_info"
                    ref={imgInput}
                    id="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div>
                    <button
                        className="add-image"
                        name="imageinput"
                        id="imageinput"
                        onClick={handleImageInput}
                        onChange={handleImageChange}
                    >
                        <AddPhotoAlternateIcon className="add_photo_icon" />
                    </button>
                </div>


                {formData.colors?.map((img) => {
                    return (
                        <div key={img.index}>
                            <img
                                src={img}
                                alt="img"
                                className="imgprview"
                                onClick={handleImageInput}
                            />
                            <span
                                className="remove_image"
                                onClick={() => removeImage(img)}
                            >
                                x
                            </span>
                        </div>
                    );
                })}
            </div>
        </Container>
    
  )
}
const Container = styled.div`
    background: #FFFF;
    padding: 10px;
    border-radius: 6px;
    margin:15px 0;
    border:1px solid lightgray;

    .productImg-container {
      display: flex;
      align-items:center;
      flex-wrap:wrap;
     

      

    }
    .remove_image {
      cursor: pointer;
      background: lightgrey;
      border-radius: 50%;
      padding: 2px 10px;
      font-size: 16px;
      color: red;
      position:relative;
      top:-143px;
      right:13px;
      
    }
    
    .imgprview {
      margin-left: 5px;
      width: 150px;
      height: 150px;
      object-fit: cover;
      border: 1px solid lightblue;
    }
    button{
      background:0;
       
    }
    .add_photo_icon {
      font-size:10rem;
      color: lightgray;
      
      
    }
  `;