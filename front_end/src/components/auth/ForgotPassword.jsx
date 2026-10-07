import React, {useState } from 'react'
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik';
import styled from 'styled-components';
import * as Yup from "yup"

import axios from 'axios';


  
  
function ForgotPassword({t}) {


    const [message, setMessage] = useState('');
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(null)


    const handleSubmit = (value) => {
        console.log(value)      
        setLoading(true)
        axios.post('/reset_password', {email : value})
            .then(res => {
                if (res.status === 200) {
                    setMessage(res.data.message);
                    setLoading(false)
                    setHasError(false)
                }
            })
            .catch(err => {
                console.log(err);
                setMessage(err.response.data.error)
                setLoading(false)
                setHasError(true)

            });
    }
   

    const editSechema = Yup.object({

        email: Yup.string().email(t("common.error_invalid_email")).required(t("common.required")),
    })



    const formik = useFormik({
        initialValues: { email: email },
        validationSchema: editSechema,
        onSubmit: values => {

            // same shape as initial values
            setEmail(values.email)
            handleSubmit(values.email)
        }  
    });

    return (

        <Container>
        <PopUpEdit onSubmit={formik.handleSubmit}>

                {hasError === true && (
                    <div style={{ fontSize: "13px", background: "#ff9999", color: "#000", padding: "5px 10px" }}>
                        <span>{message}</span>
                    </div>
                )
                }
                 {hasError === false && (
                        <div style={{ fontSize: "13px", background: "#adebad", color: "#000", padding: "5px 10px" }}>
                            <span>{message}</span>
                        </div>
                    )
                    }
            <div className='text'>
                   
                <span>
                    {t("common.password_reset_text")}
                </span>

            </div>
            <div className="input">
                <TextField
                    label={t("common.email")}
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
                    <span> {t("common.send_password_reset_link")} </span>
                    {loading && (

                        <CircularProgress
                            style = {{ marginLeft: "5px", color: "white" }}
                            size={23}
                            thickness={6}
                            value={100}
                        />
                    )
                    }
                </Button>
            </div>

        </PopUpEdit>
        </Container>
    )
}

export default ForgotPassword


const Container = styled.div`

    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
`
const PopUpEdit = styled.form`
         box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
         border:2px solid lightgray;
         border-radius:6px;
         min-width:280px;
         background:#fff;
         max-width:500px;
         min-height:200px;
         
         
    
    
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
    `