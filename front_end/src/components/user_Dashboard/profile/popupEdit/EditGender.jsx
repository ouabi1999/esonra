import React, { useContext } from 'react'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';
import {useFormik } from 'formik';
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { UserContext } from '../UserInfo';
import * as Yup from "yup"
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CircularProgress from "@mui/material/CircularProgress"

function EditGender(props) {
    const { formData, setFormData, updateUserInfo, loading} = useContext(UserContext)
    const editSechema = Yup.object({
        gender :  Yup.mixed().oneOf(["male", "female"])
        .defined(props.t("errors.error_gender_must_be_defined"))
       
            })

    const formik = useFormik({
        initialValues :{
            gender:formData.gender

            },
        validationSchema :editSechema,
        onSubmit: values => {
           
            // same shape as initial values
            updateUserInfo({...formData, gender:values.gender})
        },
    });  const {
       
        genderEdit,
       
        closeGenderEdit,
         } = props;

    const genders = [
       {gender : "male", tranGender : props.t("common.male"), icon:<MaleIcon/>},
        {gender : "female", tranGender : props.t("common.female"), icon:<FemaleIcon/>}
    ]
    return (
        <div>
            {genderEdit && (
                <form onSubmit={formik.handleSubmit}>
                <PopUpEdit>
                    <div className='edit-title'>
                        <span>{props.t("profile.edit_your_gender")}</span>
                        <DisabledByDefaultIcon className="disable-icon" onClick={closeGenderEdit} />
                    </div>
                    
                    <div className="input">
                        <TextField
                            label={props.t("common.gender")}
                            id="filled-size-small"
                            fullWidth
                            variant="filled"
                            size="small"
                            name="gender"
                            select
                            error={formik.touched.gender && Boolean(formik.errors.gender)}
                            helperText={formik.touched.gender && formik.errors.gender}
                            value={formik.values.gender}
                            onChange={formik.handleChange}

                        >  
                        {genders.map((sex, index)=>{
                             return(
                            <MenuItem key= {index} value = {sex.gender} >
                                    <div style={{display:"flex" , alignItems:"center"}}>
                                    {sex.icon}
                                    <span>{sex.tranGender}</span>
                                    </div>
                            </MenuItem>
                            )
                              })}
                        </TextField>
                    </div>
                    <div className='save-button'>

                        <Button type="submit" variant="contained">
                        <span>{props.t("common.save")}</span>
                            {loading && (
                                   
                                <CircularProgress
                                        style={{ marginLeft: "5px", color: "white" }}
                                        size={23}
                                        thickness={6}
                                        
                                        value={100}
                                    />
                                )
                                
                            }
                            
                        </Button>
                    </div>
                </PopUpEdit>
                </form>
            )}
        </div>
    )
}

export default EditGender

const  PopUpEdit = styled.div`
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
     border:2px solid lightgray;
     border-radius:6px;
     min-width:280px;
     background:#fff;
     position:absolute;
     bottom:25%;
     max-width:500px;
     right:25%;
     left:25%;


     .edit-title{
        border-radius: 4px 4px 0px 0px;
        border-bottom:1px solid lightgray;
        padding:8px 10px;
        background-color:lightgray;
        font-weight:900;
        font-size:19px;
        font-family:'Trebuchet MS', sans-serif;
        display:flex;
        justify-content:space-between;
        
       
     }
     .text{
         font-size:14px;
         margin:15px 10px;
     }
     .save-button{
        padding:10px;
        display:flex;
        justify-content:flex-end;
     }
     .input{
         margin-top:8px;
     }
     @media only screen and (max-width:480px) {
            &{  
               width:100%;
               left:0;   
            }
     }
`