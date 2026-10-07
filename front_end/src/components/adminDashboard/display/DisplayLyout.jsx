import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DisplayCategory from './DisplayCategory';
import DisplayCategoryMain from './DisplayCategoryMain';
import DisplayHeader from './DisplayHeader';
import DisplayLogo from './DisplayLogo';
import DisplaySlider from './DisplaySlider';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import DisplayBanners from './DisplayBanners';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayInfo } from "../../../features/DisplaySlice"
import ApiInstance from '../../../../common/baseUrl';
export default function DisplayLyout() {

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const display = useSelector(state => state.display);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log(formData);
  }, [formData])


  useEffect(() => {
    setFormData(display.displayData);
  }, [display.displayData])

  const buildFormData = () => {
    const data = new FormData();

    // ID for update

    // Header
    data.append("header", JSON.stringify(formData.header || {}));

    // Category & pop_up
    data.append("category", JSON.stringify(formData.category || []));
    data.append("pop_up", JSON.stringify(formData.pop_up || []));

    // Count Down
    data.append("count_Down", formData.count_Down);

    // Logo
    if (formData.logo instanceof File) {
      data.append("logo", formData.logo);
    } else if (typeof formData.logo === "string") {
      data.append("logo", formData.logo);
    }

    // Main Category
    formData.main_category?.forEach((cat, index) => {
      data.append(`main_category[${index}][categoryName]`, cat.categoryName || "");
      if (cat.img instanceof File) {
        data.append(`main_category[${index}][img]`, cat.img);
      } else if (typeof cat.img === "string") {
        data.append(`main_category[${index}][img]`, cat.img);
      }
    });

    // Banners
    formData.banners?.forEach((file) => {
      if (file instanceof File) {
        data.append("banners", file);
      }
    });

    // Slider — only append new File objects, keep URLs as JSON
    const sliderFiles = formData.slider?.filter((f) => f instanceof File) || [];
    sliderFiles.forEach((file) => {
      data.append("slider", file);
    });

    // Already uploaded slider URLs (existing)
    const sliderUrls = formData.slider?.filter((f) => typeof f === "string") || [];
    if (sliderUrls.length > 0) {
      data.append("slider_urls", JSON.stringify(sliderUrls));
    }

    return data;
  };




  const addNew = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = buildFormData(formData);
      const res = await ApiInstance.post("displayInfo/", data);

      setFormData(res.data);
      toast.success("Added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add");
    } finally {
      setLoading(false);
    }
  };


  const save = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Send PUT request
      const data = buildFormData(formData);
      const response = await ApiInstance.put(`displayInfo/`, data, {
        params: { id: formData.id }
      });

      // Extract only serializable data
      const updatedData = response.data;

      // Update local state
      setFormData(updatedData);

      // Dispatch to Redux safely
      dispatch(setDisplayInfo(updatedData));

      // Notify user
      toast.success("Saved successfully!");
    } catch (error) {
      console.error("Error saving display info:", error);

      // Optional: show backend error if available
      const message =
        error.response?.data?.detail ||
        error.message ||
        "An error occurred while saving.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {display.isLoaded === false ? (


        <Container>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className='foo-bar'
          />
          <div className='button-container'>
            <button onClick={formData.id === null ? addNew : save} disabled={loading ? true : false}>
              {loading && (
                <span className='loader'>
                  <CircularProgress
                    size={20}
                    thickness={6}
                  />
                </span>
              )} <span>{formData.id === null ? "Add New" : "Save"}</span>

            </button>
          </div>
          <DisplayHeader
            formData={formData}
            setFormData={setFormData}
          />
          <DisplayLogo
            formData={formData}
            setFormData={setFormData}
          />

          <DisplaySlider
            formData={formData}
            setFormData={setFormData}
          />
          <DisplayBanners
            formData={formData}
            setFormData={setFormData}

          />

          <DisplayCategoryMain
            formData={formData}
            setFormData={setFormData}

          />

          <DisplayCategory
            formData={formData}
            setFormData={setFormData}
          />

          <div className='count-down-input'>
            <label htmlFor='input'> Count Down </label>
            <TextField
              className="text_input"
              id="filled-select-category"
              select
              label="input"
              /*helperText="Please select your currency"*/
              value={formData.count_Down}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  count_Down: event.target.value,
                })
              }
            >

              <MenuItem value={true}>
                True
              </MenuItem>
              <MenuItem value={false}>
                False
              </MenuItem>

            </TextField>
          </div>




        </Container>
      ) :
        <LoadingContainer>
          <CircularProgress
            size={30}
            thickness={6}
          />
        </LoadingContainer>
      }
    </>

  )
}
const Container = styled.div`
     
     position:relative;
     .button-container{
      
      position:sticky;
      width:fit-content;  
      top:2.5%;
      left:87%;
      z-index:1000;
      
         
     }
    .button-container button{
          background:lightseagreen;
          padding:5px 10px;
          height:35px;
          width:80px;
          font-size:18px;
          font-family:'Open Sans', 'Helvetica Neue', sans-serif;
          color:#fff;
          border-radius:4px;
          display:flex;
          align-items:center;
          justify-content:center;
          letter-spacing:2px;
          
          
      }
    .count-down-input{
        display:flex;
        flex-direction:column;
        background: rgb(245, 245, 245);
        padding:10px;

    }
     label{
        margin-bottom:10px;
     }
    .text-input{
        background:#fff;
    }
    .loader{
      margin-right:5px;
      margin-top:4px;
    }
    .foo-bar{
      width:200px;
      letter-spacing:2px;
    }

  

`
const LoadingContainer = styled.div`
      display:flex;
      justify-content:center;
      margin-top:80px;
`



