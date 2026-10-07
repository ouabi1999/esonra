import React, { useContext } from 'react'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import styled from 'styled-components';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {useFormik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UserContext } from '../UserInfo';
import * as Yup from "yup"
function EditPassword(props) {
    const { formData, setFormData, updateUserPassword, loading } = useContext(UserContext)

    const handleClickShowPassword = (value) => {

        if (value === "old") {
            setFormData({
                ...formData,
                showPassword: !formData.showPassword,
            });
        }
        if (value === "new") {
            setFormData({
                ...formData,
                showNewPassword: !formData.showNewPassword,
            });
        }
        if (value === "confirm") {
            setFormData({
                ...formData,
                showConfirmPassword: !formData.showConfirmPassword,
            });
        }
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const editSechema = Yup.object({

        oldPassword: Yup.string().required(props.t("common.please_enter_your_password")),

        
        newPassword: Yup.string()
              .required(props.t("common.please_enter_your_new_password"))
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                props.t("errors.error_weak_password")
              ),

    })

    const formik = useFormik({
        initialValues: formData,
        validationSchema: editSechema,
        onSubmit: values => {

            updateUserPassword({ ...formData, oldPassword: values.oldPassword, newPassword: values.newPassword })

        },
    });


    return (
        <Container>
            {props.passwordEdit && (
                <form onSubmit={formik.handleSubmit}>
                    <PopUpEdit>
                        <div className='edit-title'>
                            <span>{props.t("profile.change_your_password")}</span>
                            <DisabledByDefaultIcon className="disable-icon" onClick={props.closePasswordEdit} />
                        </div>
                        <div className="input">
                            <TextField
                                label={props.t("common.old_password")}
                                fullWidth
                                variant="filled"
                                size="small"

                                name="oldPassword"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                type={formData.showPassword ? "text" : "password"}
                                slotProps={{
                                    inputLabel: {
                                        sx: {
                                          textAlign: props.i18n.dir() === "rtl" ? "right" : "left",
                                          width: "100%", // important for text-align to work
                                        }
                                      },
                                    input: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={(e) => handleClickShowPassword("old")}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {formData.showPassword === true ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>

                                        </InputAdornment>,
                                    }
                                }}
                            />
                        </div>
                        <div className="input">
                            <TextField
                                label={props.t("common.new_password")}
                                fullWidth
                                variant="filled"
                                size="small"
                                name="newPassword"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                type={formData.showNewPassword ? "text" : "password"}
                                slotProps={{
                                    inputLabel: {
                                        sx: {
                                          textAlign: props.i18n.dir() === "rtl" ? "right" : "left",
                                          width: "100%", // important for text-align to work
                                        }
                                      },
                                    input: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword("new")}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {formData.showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>

                                        </InputAdornment>,
                                    }
                                }}
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
                </form>
            )}
        </Container>
    );
}

export default EditPassword

const Container = styled.div`


`
const PopUpEdit = styled.div`
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
     border:2px solid lightgray;
     border-radius:6px;
     min-width:280px;
     background:#fff;
     position:absolute;
     bottom:15%;
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