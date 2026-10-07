import React, { useRef, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styled from 'styled-components';
import CancelIcon from '@mui/icons-material/Cancel';

export default function DisplaySlider({ formData, setFormData }) {
    const RefInput = useRef()
    const [slider, setSlider] = useState([]);
const handleImageChange = (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setFormData(prev => ({
    ...prev,
    slider: [...prev.slider, files[0]],
  }));
};


    const handleImageInput = () => {
        RefInput.current.click();

    }
    const removeImg = (index) => {
        if (formData.slider[index] instanceof File) URL.revokeObjectURL(formData.slider[index]);

        setFormData({
            ...formData,
            slider: formData.slider.filter(x => x !== index)
        })

    }


    return (

        <Container>
            <label htmlFor='slider' > Main slider</label>
            <input
                type="file"

                ref={RefInput}

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

                >
                    <AddPhotoAlternateIcon className="add_photo_icon" />
                </button>
            </div>


            {formData.slider?.map((img, index) => {
                let src;
        try {
          src = (img instanceof File || img instanceof Blob)
            ? URL.createObjectURL(img)
            : img;
        } catch (error) {
          console.error("Failed to create image preview:", error, img);
          src = ""; // fallback
        }

        if (!src) return null;

                return (
                    <div className="img-slider-container" key={index}>
                      
                      
                        <img src={src} alt="slider img" />
                        <CancelIcon onClick={() => removeImg(img)} className="delete-icon" />
                    </div>
                )

            })}


        </Container>
    )
}
const Container = styled.div`

    width:600px;
    margin-top:10px;
    background: rgb(245, 245, 245);
    padding:10px;
    display:flex;
    flex-wrap:wrap;
    margin-right:10px;  
    min-height:200px;
    .img-slider-container{
        position:relative;
       
    }

    .img-slider-container img{
        width:200px;
        height:115px;
        margin-right:20px;
    }
    .delete-icon{
        position:absolute;
        top:-3%;
        right: 5%;
        cursor:pointer;
    }


`