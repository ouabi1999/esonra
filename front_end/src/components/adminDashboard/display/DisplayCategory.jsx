import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { categoryList } from '../../../../common/categoryList';

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
export default function DisplayCategory({formData, setFormData}) {
  const [category, setCategory] = useState({
    img0 : null,
    img1 :null,
    img2 : null,
    categoryName:"",

  })


  const RefInput1 = useRef()
  const RefInput2 = useRef()
  const RefInput3 = useRef()

  const handleImageInput1 =  ()=>{
    RefInput1.current.click()
  }

  const handleImageInput2 =  ()=>{
    RefInput2.current.click()
  }
  
  const handleImageInput3 =  ()=>{
    RefInput3.current.click()
  }

  const add =()=>{
    setFormData({
      ...formData,
      category:[...formData.category, category]
    })
    setCategory({
      img0:null,
      img1:null,
      img2:null,
      categoryName:"",

    })
  }

const handleImageChange = (e) => {
  const { name, files } = e.target;
  const file = files?.[0];
  if (!file) return;

  setCategory(prev => ({
    ...prev,
    [name]: file,
  }));
};




  const remove = (item)=>{
    
      setFormData({
        ...formData,
        category: formData.category.filter(x => x !== item)

      })
      
  }


  
    
  return (
    <Container>
        <div className="category-container">
            <h4 style={{fontFamily:"sans-serif"}}>Category</h4>

            <div className='added-categories-container'>
               {formData.category?.map((item, index) =>{
                  return(
                    <div className="child-container"  key={index} >
                      <div className="child-imgs-container">

                        {item.img`${index}` !== null && (

                          formData.id? (
                            <img src={item.img`${index}`} alt="category img" />
                        ): <img src={URL.createObjectURL(item.img`${index}`)} alt="category img" />
               )}
                        
                      </div>
                       
                        
                        <span>{item.categoryName}</span>
                        <DeleteIcon className="delete-icon" onClick={()=> remove(item)}/>
                    </div>
                       
                    )
               })}
            </div>
           
              <input
                type="file"
                name="img1"
                ref={RefInput1}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
        />
         <input
                type="file"
                name="img2"
               
                ref={RefInput2}
                style={{ display: "none" }}
                accept="image/*"
                onChange={ handleImageChange}
        />
         <input
                type="file"
                
                ref={RefInput3}
                name="img3"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
        />
       
          <div className='priveiw-img-container'>
          
            <button
              className="add-image"
              name="imageinput"
              id="imageinput"
              onClick={handleImageInput1}
            >
              <AddPhotoAlternateIcon className="add_photo_icon" />
              {category.img1 !== null && (

                <img src={category.img1} alt="" />
              )
              }
            </button>

            
          
         
            <button
              className="add-image"
              name="imageinput"
              id="imageinput"
              onClick={handleImageInput2}
            >
              <AddPhotoAlternateIcon className="add_photo_icon" />
              {category.img2 !== null && (

                <img src={category.img2} alt="" />
              )
              }
            </button>

            
         
         
            <button
              className="add-image"
              name="imageinput"
              id="imageinput"
              onClick={handleImageInput3}
            >
              <AddPhotoAlternateIcon className="add_photo_icon" />
              {category.img3 !== null && (

                <img src={category.img3} alt="" />
              )
              }
            </button>
          </div>
        
            <InputContainer>
                <TextField
                    className="text_input"
                    id="filled-select-category"
                    select
                    label="Category"
                    /*helperText="Please select your currency"*/
                    value={category.categoryName}
                    onChange={(event) =>
                        setCategory({
                            ...category,
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
        border:1px solid lightgray;
        padding:5px;
        background: #fff;
          

    }
    .child-imgs-container{
      display:flex;
      background:lightblue;
      padding:40px 10px 10px 10px;
    }
    .child-container{
      position:relative;
      
      margin-right:10px;
      margin-bottom:10px;

    }
    .child-container img {
        width:100px;
        height:80px;
        margin-right:10px;
       
    }
    .child-container span{
        position:absolute;
        top:0%;
        left:0%;
        font-family:'Times New Roman', Times, serif;
        font-size:12px;
        text-transform:uppercase;
        color:#000;
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

    .add_photo_icon{
      width:150px;
      height:100px;

    }

    .priveiw-img-container button{
      position:relative;
      width:150px;
      height:100px;
      

      }

      .priveiw-img-container{
         display:flex;
      }
    .priveiw-img-container  img {
        width:150px;
        height:100px;
        position:absolute;
        top:0%;
        right:0%;
        
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