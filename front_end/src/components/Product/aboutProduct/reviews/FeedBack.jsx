import React, { useState } from 'react';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CircularProgress, {
    circularProgressClasses,
  } from '@mui/material/CircularProgress';
import {useSelector} from "react-redux"

function Feedback(props) {

    
    const [hoverValue, setHoverValue] = useState(null)
    const user = useSelector(state => state.auth.user)


    const {handelRatingSubmit , setComment, required , set_star_rating, isLoading, star_rating , comment, t} = props;
 
    const stars = Array(5).fill(0);
    const imgInput = React.createRef()

    const handel_CommentChange = (e) => {
        setComment({...comment, text:e.target.value})
    }

    const handle_Rating_Click = value => {
        set_star_rating(value + 1)
    }

    const handleMouseOver = (newHoverValue) => {
        setHoverValue(newHoverValue)
    };

    const handleMouseLeave = () => {
        setHoverValue(null)
    }

   


    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setComment({...comment ,images:[...comment.images, reader.result]})
            }
        }
        reader.readAsDataURL(e.target.files[0])
     
    }

    const handleImageInput = (e) => {
        e.preventDefault()
        if (e.target.id === e.target.name) {
            return false
        } else {
            imgInput.current.click()
        }
    }
 
    return (
        <Conatiner>
            <h3> {t("productInfo.give_us_your_feedback")}</h3>
            <div className='Stars'>
                {stars.map((_, index) => {
                    return (
                        <StarIcon
                            key={index}
                            className={(star_rating || hoverValue) > index ? "on" : "off"}
                            onClick={() => handle_Rating_Click(index)}
                            onMouseOver={() => handleMouseOver(index + 1)}
                            onMouseLeave={handleMouseLeave}
                        />
                    )
                })}
            </div>
            <Wraper>
                <Wrap>
                    <textarea
                        className="feedback_feild"
                        onChange={handel_CommentChange}
                        value = {comment.text}
                        type = "text"
                        placeholder = {t("productInfo.comment")}
                        required = {true}
                    />
                    <input
                        type="file"
                        ref={imgInput}
                        style={{ display: "none" }}
                        accept = "image/*"
                        onChange= {imageHandler}
                    />
                    <Add_image_container>
                        <button
                            className="add-image"
                            name="imageinput"
                            id="imageinput"
                            onClick={handleImageInput}
                        >
                            <AddPhotoAlternateIcon className="add-image-icon" />
                        </button>
                        {comment.images?.map((item, index) => {
                            return (
                                <img key={index} src={item} width="50px"  height="50px" />
                            )
                        })}
                    </Add_image_container>
                    {required === true &&(
                        <span className="required"> {t("common.text_field_required")} </span>
                    )}
                    <button
                        type="submit"
                        className='submit-button'
                        onClick={(e) => handelRatingSubmit(e, comment, star_rating)}>
                        {isLoading ? (
                            <>
                                <span>{t("common.submit")}</span>
                                <CircularProgress
                                    style={{ marginLeft: "3px" }}
                                    size={20}
                                    thickness={5}
                                    value={100}
                                />
                            </>)
                            : t("common.send")}
                    </button>
                    
             
                </Wrap>
            </Wraper>
        </Conatiner>
    )
}

export default Feedback
const Conatiner = styled.div`
  h3{
    font-family:roboto sant serif;
    text-transform:uppercase;
    margin-bottom:8px;
  }
    .Stars{
      margin-bottom:10px;
    }
.on{
    color: #d8b24a;
    cursor:pointer;
}
.off{
    color: #ccc;
    cursor:pointer;
}
.required{
    color: red;
    font-size:12px;
}

`
const Wrap = styled.div`

    display:flex;
    flex-direction:column;
    
    .feedback_feild{

       width:100%;
       min-height:180px;
       padding:5px;
       border-color: #e0d2bb;
       border-bottom:none;
       resize: none;
       border-radius:4px 4px 0 0 ;
 background: #f8f6f1;
       &:focus{
        border-color: #eec280;
        outline: none
       }
    }
    
    .submit-button{
        display:flex;
        align-items:center;
        justify-content:center;
        background:black;
        color:white;
        padding:8px 10px;
        height:35px;
        width:70px;
        margin-top:4px;
        border-radius:4px;

        
    }
    input{
        position:relative;
        top:-5px;
        padding:5px;
        border-left:1px solid lightblue;
        border-right:1px solid lightblue;
        background:#FFE5B1;
        width:100%;
       


    }
    
    
`
const Wraper = styled.div`
      min-width:280px;
      max-width:650px;

`
const Add_image_container = styled.div`
    display:flex;
    flex-wrap:wrap;
    background:  #f2ece2;

    padding:5px;
    border: 1px solid  #e0d2bb;

    border-top:1px solid lightgray;
    border-radius: 0 0 4px 4px;
    width:100%;

    .add-image{
        background:none;
    }

`