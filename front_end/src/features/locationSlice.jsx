import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
    country : window.localStorage.getItem("country") || ""
    
   

};

export const location_Slice = createSlice({
    name: "location",
    initialState,
    

    reducers:{
        setLocation(state, action){
            console.log(action.payload)
             state.country = action.payload
             window.localStorage.setItem("country", action.payload);


        
        },
       

    }

})
export const {setLocation} = location_Slice.actions
export default location_Slice.reducer