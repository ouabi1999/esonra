import React, { useEffect, useState, createContext } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import FemaleIcon from '@mui/icons-material/Female';
import { ToastContainer, toast } from 'react-toastify';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useTranslation} from 'react-i18next'
import ApiInstance from "../../../../common/baseUrl"
import EditBirthDate from "./popupEdit/EditBirthDate"
import EditName from "./popupEdit/EditName"
import EditGender from "./popupEdit/EditGender"
import EditEmail from "./popupEdit/EditEmail"
import EditPassword from "./popupEdit/EditPassword"
import EditCountry from "./popupEdit/EditCountry"



export const UserContext = createContext()

function UserInfo(props){
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")   
    const user = useSelector(state=> state.auth.user)
    const [nameEdit, setNameEdit] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [passwordEdit, setPasswordEdit] = useState(false)
    const [countryEdit, setCountryEdit] = useState(false)
    const [genderEdit, setGenderEdit] = useState(false)
    const [birthDateEdit, setBirthDateEdit] = useState(false)
    
    const [formData, setFormData] = useState({
        firstName : "",
        lastName : " ",
        birthDate : "",
        gender : "",
        country : "",
        countryCode:"",
        email : "",
        joined_at:"",
        userAvatar:"",
        oldPassword : "",
        newPassword : "",
        confirmPassword : "",
        id : "",
        showPassword:false,
        showNewPassword:false,
        showConfirmPassword:false
    })
  
    const closeNameEdit = ()=>{
        setNameEdit(false)
    }
    const closeEmailEdit = () =>{
        setEmailEdit(false)
    }
    const closePasswordEdit = () =>{
        setPasswordEdit(false)
    }
    const closeCountryEdit = ()=>{
        setCountryEdit(false)
    }
    const closeGenderEdit  = ()=>{
        setGenderEdit(false)
    }
    const closeBirthDateEdit = ()=>{
        setBirthDateEdit(false)
    }

    useEffect(() => {
        console.log(user)
        setFormData({
         ...formData,
         ...user
        })
     }, [user])
     
    
     
     const updateUserInfo = (values) => {  
         
        setLoading(true)
     
        ApiInstance.put(`update-user/${values.id}/`, {
            firstName: values.firstName,
            lastName : values.lastName,
            birthDate: values.birthDate, 
            country: values.country,
            countryCode : values.countryCode,
            email: values.email,
            gender: values.gender,
            joined_at: values.joined_at
            
           })
           .then((res) => {
             setFormData(res.data);
             console.log(res.data)
             
             setLoading(false)
             toast.success(t("success.updated" ))
   
           })
           .catch((error) => {
             console.error('Error:', error);
             setLoading(false)
             toast.error(t("errors.server_error"))
           });
       }


       const updateUserPassword = (values) => {  
         
        setLoading(true)
        
       
     
         ApiInstance.put(`update-user-password/${values.id}/`, {
          new_password: values.newPassword,
          old_password: values.oldPassword
         })
           .then((result) => {

    
                setFormData(result.data);

                setLoading(false)
                toast.success(t("success.password_changed_successfully"))
    
    
           
   
           })
           .catch((error) => {
            toast.error(t("errors.bad_request"))
            console.error('There has been a problem with your fetch operation:', error);
            setLoading(false)
            
          
           });
       }

      
    
       const handleClickShowPassword = (password) => {

        if(password === "old"){
        setFormData({
          ...formData,
          showPassword: !formData.showPassword,
        });
     }
       if(password === "new"){
      setFormData({
        ...formData,
        showNewPassword: !formData.showNewPassword,
      });
     }
      if(password === "confirm"){
        setFormData({
            ...formData,
            showConfirmPassword: !formData.showConfirmPassword,
          });
      }
    } 
     
        
 
  
     
    
    return (
      <UserContext.Provider
        value={{
          formData,
          setFormData,
          updateUserInfo,
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
          birthDateEdit,
          handleClickShowPassword,
          updateUserPassword,
          loading,
        }}
      >
        <Container>
            <ToastContainer/>
          <Section>
            <ImageWrap>
              <AccountCircleIcon className="profile-icon" />
            </ImageWrap>

            <div>
              <strong>
                {" "}
                {formData?.firstName} {formData?.lastName}
              </strong>
              <EditIcon
                className="edit-icon"
                onClick={() => setNameEdit(true)}
              />
            </div>

            <div className="location">
              <div className="flex-icon">
                <LocationOnIcon className="icon" />
                <span> {t("common.from")} </span>
              </div>
              <div>
                <span> {formData?.country}</span>
                <EditIcon
                  className="edit-icon"
                  onClick={() => setCountryEdit(true)}
                />
              </div>
            </div>

            <div className="member-since">
              <div className="flex-icon">
                <EmailIcon className="icon" />
                <span> {t("common.email")} </span>
              </div>
              <div className="email">
                <div className="email-content">
                  <span>{formData?.email}</span>
                </div>
                <EditIcon
                  className="edit-icon"
                  onClick={() => setEmailEdit(true)}
                />
              </div>
            </div>

            <div className="member-since">
              <div className="flex-icon">
                <LockIcon className="icon" />

                <span> {t("common.password")} </span>
              </div>

              <div>
                <span> ******** </span>
                <EditIcon
                  className="edit-icon"
                  onClick={() => setPasswordEdit(true)}
                />
              </div>
            </div>

            <div className="member-since">
              <div className="flex-icon">
                <FemaleIcon className="icon" />

                <span> {t("common.gender")}</span>
              </div>

              <div>
                <span>{t(`common.${formData.gender.toLowerCase()}`)}</span>
                <EditIcon
                  className="edit-icon"
                  onClick={() => setGenderEdit(true)}
                />
              </div>
            </div>

            <div className="member-since">
              <div className="flex-icon">
                <PersonIcon className="icon" />
                <span> {t("common.member_since")}</span>
              </div>
              <span> {formData?.joined_at}</span>
            </div>
          </Section>
          <EditBirthDate
           t = {t}
            birthDateEdit={birthDateEdit}
            closeBirthDateEdit={closeBirthDateEdit}
          />
          <EditName nameEdit={nameEdit} t = {t}  i18n ={i18n} closeNameEdit={closeNameEdit} />
          <EditEmail emailEdit={emailEdit} t = {t} closeEmailEdit={closeEmailEdit} />
          <EditCountry
            countryEdit={countryEdit}
            closeCountryEdit={closeCountryEdit}
            t = {t}
          />
          <EditPassword
            t = {t}
           i18n ={i18n}
            passwordEdit={passwordEdit}
            closePasswordEdit={closePasswordEdit}
            handleClickShowPassword={handleClickShowPassword}
          />
          <EditGender
            genderEdit={genderEdit}
            closeGenderEdit={closeGenderEdit}
            t = {t}
          />
        </Container>
      </UserContext.Provider>
    );
    }



export default  UserInfo

const Container = styled.div`
    position:relative;
    margin:auto;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    padding:2px 10px;
    width:50%;
    min-width:320px;
    border:1px solid lightgray;
    display:flex;
    justify-content:center;
`   
const Section = styled.div`
    width:100%;
    
    
    
    display:flex;
    flex-direction:column;
    align-items:center;
    background:#fff;
     

  
   .headers{
       margin-left:10px;
   }
   .location,
    .member-since{
        border-top:1px solid lightgray;
        margin-top:10px;
        padding:15px 5px;
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        

    }
    .flex-icon{
        display:flex;
        align-items:center;

    }
    .flex-icon span{
        color:gray;
        font-size:15px;
    }
   .icon{
       font-size:20px;
       color:gray;
   }
   .edit-icon{
      font-size:16px;
       color:gray;
       margin-left:5px;
       cursor:pointer;
   }
   .email{
       white-space: nowrap;
       display:flex;
       align-items:center;
       
   }
   .email-content{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
      max-width:220px; 
      width:100%;
      margin-top:0;
      padding:0 5px;
      
   }
   @media only screen and (max-width: 1048px) {

    &{
        width:80%;
    }
   }
   @media only screen and (max-width: 600px) {
    
    &{
        width:100%;
    }

  }
   
   
   

   
`
const ImageWrap = styled.div` 
    .profile-icon{
    width:150px;
    height:150px;
    color:gray;
    }
 

`



