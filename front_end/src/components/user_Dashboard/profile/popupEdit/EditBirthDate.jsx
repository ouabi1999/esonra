import React, { useContext } from 'react'
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';

import { useFormik } from 'formik';

import { UserContext } from '../UserInfo';
import * as Yup from "yup"

function EditBirthDate(props) {
    const { formData, setFormData, loading} = useContext(UserContext)
   
    const editSechema = Yup.object({
        birthDate: Yup.date().nullable().min(new Date(1900, 0, 1)),
    })

      
    const formik = useFormik({
        initialValues : formData,
        validationSchema :editSechema,
        onSubmit: values => {
           
            // same shape as initial values
            setFormData({...values})
            
        },
    });
    const {
        nameEdit,
        emailEdit,
        passwordEdit,
        countryEdit,
        genderEdit,
        closeNameEdit,
        closeEmailEdit,
        closePasswordEdit,
        closeCountryEdit,
        closeGenderEdit,
        closeBirthDateEdit,
        birthDateEdit } = props;

    return (
        <Container>
            {birthDateEdit && (
                <PopUpEdit>
                    <div className='edit-title'>
                        <span>{props.t("profile.edit_your_birthdate")}</span>
                        <DisabledByDefaultIcon className="disable-icon" onClick={closeBirthDateEdit} />
                    </div>
                    
                    <div className="input">
                        <TextField
                            label="BirthDate"
                            id="filled-size-small"
                            fullWidth
                            variant="filled"
                            size="small"
                            type="date"
                            defaultValue="2017-05-24"
                            
                            InputLabelProps={{
                              shrink: true,
                            }}
                        />
                    </div>
                    <div className='save-button'>

                        <Button variant="contained">
                         
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
            )}
        </Container>
    )
}

export default EditBirthDate
const Container = styled.div`


`
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