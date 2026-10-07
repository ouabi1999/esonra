import React, { useContext} from 'react'
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from "yup"



import { UserContext } from '../UserInfo';

function EditName(props) {

    const { formData,  updateUserInfo, loading } = useContext(UserContext)
    const editSechema = Yup.object({ 
        firstName: Yup.string()
          .max(10, props.t('errors.error_max_name_characters'))
          .required(props.t('common.required')),
        
          lastName: Yup.string()
          .max(10, props.t('errors.error_max_name_characters'))
          .required(props.t('common.required')),
       
        })
        
    
     
   
    

    const formik = useFormik({
        initialValues : formData,
        validationSchema :editSechema,
        

        onSubmit: values => {
           
            // same shape as initial values
           
            updateUserInfo({...formData, firstName:values.firstName, lastName : values.lastName})

            
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
    {props.nameEdit && (
        <form onSubmit={formik.handleSubmit}>
        <PopUpEdit>
            <div className='edit-title'>
                <span>{props.t("profile.edit_your_name")}</span>
                <DisabledByDefaultIcon className="disable-icon" onClick={props.closeNameEdit} />
            </div>
            
            <div className="input">
                <TextField
                    label={props.t("common.firstName")}
                    id="filled-size-small"
                    fullWidth
                    variant="filled"
                    size="small"
                    name="firstName"
               
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                
                    slotProps={{
                        inputLabel: {
                          sx: {
                            textAlign: props.i18n.dir() === "rtl" ? "right" : "left",
                            
                            width: "100%", // important for text-align to work
                          }
                        }
                      }}
                />
            </div>
            <div className="input">
                <TextField
                    label={props.t("common.lastName")}
                    id="filled-size-small"
                    fullWidth
                    variant="filled"
                    size="small"
                    name="lastName"
               
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    slotProps={{
                        inputLabel: {
                          sx: {
                            textAlign: props.i18n.dir() === "rtl" ? "right" : "left",
                            
                            width: "100%", // important for text-align to work
                          }
                        }
                      }}
                />
            </div>
            <div className='save-button'>

                          <Button type="submit" variant="contained">{props.t("common.save")}
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
    </Container>
  )
}

export default EditName
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