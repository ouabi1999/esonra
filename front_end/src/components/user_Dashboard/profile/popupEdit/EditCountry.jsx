import React, { useContext } from 'react'
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { UserContext } from '../UserInfo';
import * as Yup from "yup"
import Flag from 'react-world-flags'
import  Data from "../../../../../common/countryData.json"


function EditCountry(props) {
    const countriesData = Data.slice()
    const { formData, setFormData, updateUserInfo, loading} = useContext(UserContext)
    const editSechema = Yup.object({
        country: Yup.string().required(props.t("errors.required")),
      
        })

    const formik = useFormik({
        initialValues : {country : formData.country},
        validationSchema :editSechema,
        onSubmit: values => {
            // same shape as initial values
            updateUserInfo({...formData, country: values.country})
        },
    });
   
    
    const {
       
        countryEdit,
       
        closeCountryEdit,
       
        ageEdit } = props;

    return (
        <Container>
            {countryEdit && (
                <form onSubmit={formik.handleSubmit}>
                <PopUpEdit>
                    <div className='edit-title'>
                        <span>{props.t("profile.edit_your_email")}</span>
                        <DisabledByDefaultIcon className="disable-icon" onClick={closeCountryEdit} />
                    </div>
                    
                    <div className="input">
                        <TextField
                            label="Country"
                            id="filled-size-small"
                            select
                            fullWidth
                            variant="filled"
                            name ="country"
                            value = {formik.values.country}
                            error = {formik.touched.country && Boolean(formik.errors.country)}
                            helperText = {formik.touched.country && formik.errors.country}
                          
                            onChange={formik.handleChange}
                            >
                            {countriesData?.map((country, index) =>{
                                  return(
                                    
                                   <MenuItem key={index}   
                                            value={country.label} 
                                            onClick={()=> {
                                                            setFormData({...formData, countryCode:country.value} )
                                                        }}>  
                                    <div style={{display:"flex" , alignItems:"center"}}>
                                    <Flag code={country.value} style={{width:"30px", height:"20px" , marginRight:"10px"}} />
                                    <span>{country.label}</span>
                                    </div>
                                   </MenuItem>
                                  
                                   
                                  )

                                }
                           )}
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

    </Container>
  )
}

export default EditCountry

const Container = styled.div`
    
      .flagicon{
        width:30px;
        height:20px;
      }

`
const  PopUpEdit = styled.div`
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
     border:2px solid lightgray;
     border-radius:6px;
     min-width:320px;
     background:#fff;
     position:absolute;
    
     max-width:500px;
     right:25%;
     left:25%;
     top:25%;



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

     .flag-icon{
          width:30px;
          height:10px;
          
          
      }
      @media only screen and (max-width:480px) {
            &{
                
               width:100%;
               left:0; 
                
                
                
            }

     }
`