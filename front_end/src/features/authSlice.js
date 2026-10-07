import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import ApiInstance from "../../common/baseUrl";

export const getUser = createAsyncThunk("auth/getUser", (_, { rejectWithValue }) => {
  return ApiInstance.get("auth/")
  
  .then((response) => {return response.data})
  .catch(error => {
    console.error('Profile fetch error:', error);
    if (error.response.status === 401) {
          window.localStorage.removeItem("refresh_token")
          window.localStorage.removeItem("access_token")
    }
      console.log(error)
      // Redirect to login if the profile fetch fails
      return rejectWithValue(error.response?.data || "Failed to fetch user profile");

  });
  });

const initialAuthState = {
  isAuth: window.localStorage.getItem("access_token") ,
  refresh_token: window.localStorage.getItem("refresh_token"),
  user : null,
  loading : false,
  hasErrors: false,
 
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
      setLogin(state, action){
        const data = action.payload
        window.localStorage.setItem("access_token", data.access_token)
        window.localStorage.setItem("refresh_token", data.refresh_token)
    
        
      },
      setSignUp(state, action){
        const data = action.payload
        window.localStorage.setItem("access_token", data.access_token)
        window.localStorage.setItem("refresh_token", data.refresh_token)
        
      },

      setLogout(state, action) {
        const data = action.payload
        if(data.status === 200){
          window.localStorage.removeItem("access_token")
          window.localStorage.removeItem("refresh_token")
          window.location.reload()
        }
       

        state.user = null
      },
    },

    extraReducers: (builder) => {
      builder
      .addCase(getUser.pending, (state, action) => {
          state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.hasErrors = action.error.message;        
        
    })
    .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;

    });
    
  }
})
  
  export const {setLogin, setLogout, setSignUp} = authSlice.actions;
  export default authSlice.reducer;