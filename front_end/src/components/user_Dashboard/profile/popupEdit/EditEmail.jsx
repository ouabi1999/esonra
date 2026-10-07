import React, { useContext} from 'react'
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';
import { useFormik } from 'formik';

import { UserContext } from '../UserInfo';
import * as Yup from "yup"
function EditEmail(props) {
    const { formData, updateUserInfo, loading} = useContext(UserContext)
    const editSechema = Yup.object({
        
        email: Yup.string().email(props.t("errors.error_invalid_email")).required(props.t("errors.required")),
        
        })

    const formik = useFormik({
        initialValues :{email:formData.email},
        validationSchema :editSechema,
        onSubmit: values => {
           
            // same shape as initial values
            updateUserInfo({...formData, email:values.email})
            
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
        closeAgeEdit,
        ageEdit } = props;

    return (
        <Container>
            <form onSubmit={formik.handleSubmit}>
            {emailEdit && (
                <PopUpEdit>
                    <div className='edit-title'>
                        <span>{props.t("profile.edit_your_email")}</span>
                        <DisabledByDefaultIcon className="disable-icon" onClick={closeEmailEdit} />
                    </div>
                   
                    <div className="input">
                        <TextField
                            label="email"
                            id="filled-size-small"
                            fullWidth
                            variant="filled"
                            size="small"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
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
            )}
            </form>
        </Container>
  )
}

export default EditEmail

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