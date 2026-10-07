import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ApiInstance from '../../common/baseUrl';

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiInstance.get("product-api/");
      return response.data;
    } catch (error) {
      console.error("Product fetch error:", error);

      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const products_Slice = createSlice({
   name:"product",
   initialState:{
       productData:[],
       nextStart : 0,
       totalProducts : 0,
       isLoading : true,
       hasError  : false,
       isProductsLoaded: null,
       
   },
   reducers:{
       setProducts(state, action){
           state.isProductsLoaded = true
        },
       
        
       
        setNextStart(state, action){

        },
        setTotalProducts(state, action){
            
        }
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(getProduct.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productData = [...state.productData , action.payload];
        state.isLoading = false;
        state.hasError = false;

      });
      
    }
})
export const {setProducts } = products_Slice.actions
export default products_Slice.reducer