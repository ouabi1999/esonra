import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiInstance from "../../common/baseUrl";

export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await ApiInstance.get(`/product/${id}`);

      return {
        data: response.data,
        notFound: false,
      };
    } catch (error) {
      console.log("PRODUCT REQUEST ERROR:", error);
      console.log("HTTP STATUS:", error.response?.status);

      if (error.response?.status === 404) {
        return rejectWithValue({
          notFound: true,
        });
      }

      return rejectWithValue({
        notFound: false,
        status: error.response?.status || null,
        message: error.message,
      });
    }
  }
);

export const productDetails_Slice = createSlice({
  name: "product",

  initialState: {
    productData: null,
    isLoading: true,
    hasError: false,
    isNotFound: false,
  },

  reducers: {
    setProductDetails(state, action) {
      
      state.productData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // --------------------------------
      // REQUEST STARTED
      // --------------------------------
      .addCase(getProductDetails.pending, (state) => {
        state.isLoading = true;

        // IMPORTANT:
        // Remove old product immediately
        state.productData = null;

        state.isNotFound = false;
        state.hasError = false;
      })

      // --------------------------------
      // REQUEST SUCCESS
      // --------------------------------
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.productData = action.payload.data;

        state.isLoading = false;
        state.isNotFound = false;
        state.hasError = false;
      })

      // --------------------------------
      // REQUEST FAILED
      // --------------------------------
      .addCase(getProductDetails.rejected, (state, action) => {
        state.productData = null;

        state.isLoading = false;

        if (action.payload?.notFound === true) {
          state.isNotFound = true;
          state.hasError = false;
        } else {
          state.isNotFound = false;
          state.hasError = true;
        }
      });
  },
});

export const { setProductDetails } =
  productDetails_Slice.actions;

export default productDetails_Slice.reducer;