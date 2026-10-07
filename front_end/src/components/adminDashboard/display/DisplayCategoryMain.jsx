import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { categoryList } from "../../../../common/categoryList";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

export default function DisplayCategoryMain({formData, setFormData}) {
  const [mainCategory, setMainCategory] = useState({
    img:"",
    categoryName:"",

  })


  const RefInput = useRef()
  const handleImageInput =  ()=>{
    RefInput.current.click()
  }
  const add =()=>{
    setFormData({
      ...formData,
      main_category:[...formData.main_category, mainCategory]
    })
    setMainCategory({
      img:"",
      categoryName:"",

    })
    console.log(formData.main_category);
  }

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setMainCategory(prev => ({
    ...prev,
    img: file
  }));
};
 
 
  const remove = (item)=>{
    
      setFormData({
        ...formData,
        main_category: formData.main_category.filter(x => x !== item)

      })
    

  }
  
   
  
    
  return (
    <Container>
        <div className="category-container">
            <h4 style={{fontFamily:"sans-serif"}}> Main Category</h4>

            <div className='added-categories-container'>
               {formData.main_category?.map((item, index) =>{
                  return(
                    <div className="child-container" key={index} >
                       {formData.id? (
                            <img src={item.img} alt="categreyMain img" />
                        ): <img src={URL.createObjectURL(item.img)} alt="slider img" />
                        }
                        <span>{item.categoryName}</span>
                        <DeleteIcon className="delete-icon" onClick={()=> remove(item)}/>
                    </div>
                       
                    )
               })}
            </div>

              <input
                type="file"
              
                ref={RefInput}
                
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
            />
            {mainCategory.img == "" &&(
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
            )}
           
            <div className='priveiw-img-container'>
               {mainCategory?.img && (

                      <img src={mainCategory.img}  alt="previw-img" />
               )}
                   
               
            </div>
            <InputContainer>
                <TextField
                    className="text_input"
                    id="filled-select-category"
                    select
                    label="Category"
                    /*helperText="Please select your currency"*/
                    value={mainCategory.categoryName}
                    onChange={(event) =>
                        setMainCategory({
                            ...mainCategory,
                            categoryName: event.target.value,
                        })
                    }
                >
                    {categoryList?.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
                <button onClick={add}>Add</button>
            </InputContainer>
            </div>
        </Container>
  )
}

const Container = styled.div`
    margin: 10px 0;
    background: rgb(245, 245, 245);
    border-radius: 6px;
    padding: 10px;

    
    
    .added-categories-container{
         display:flex;
         flex-wrap:wrap;

    }
    .child-container{
      position:relative;
      width:300px;
      height:200px;
      margin-right:10px;
      margin-bottom:10px;
    }
    .child-container img {
        width:100%;
        height:100%;
        position:relative;
       
    }
    .child-container span{
        position:absolute;
        top:0%;
        left:0%;
        font-family:'Times New Roman', Times, serif;
        font-size:22px;
        text-transform:uppercase;
        color:green;
        background-color:lightgray;
        padding:10px;
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

    .priveiw-img-container{

    }
    .priveiw-img-container img {
        width:150px;
        height:80px;
    }


  `
  const InputContainer = styled.div`
    display:flex;
    flex-direction:column;

    .text_input{
        width:290px;
        margin-top:8px;
    }

    button{
      width:60px;
      background:#000;
      color: #fff;
      height:30px;
      margin-top:10px;
      border-radius:5px;
    }

  `