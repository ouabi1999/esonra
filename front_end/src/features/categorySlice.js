import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


/*export const getProductsDetails = createAsyncThunk("category/getProductsDetails", () => {
    return fetch("/productsinfo")
        .then((response) => {
            if (!response.ok) {

                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((data) => data);
     });
*/
const initialState = {
  
    ratings : null,
    filteredData : [],
    
    product_type_list:[
        { id: 1, checked: false, label: 't-shirt'},
        { id: 2, checked: false, label: 'shirt'},
        { id: 3, checked: false, label: 'rings' },
        { id: 4, checked: false, label: 'braclet'},
        { id: 5, checked: false, label: 'key-chain'},
        { id: 6, checked: false, label: 'earring'},
      ],
    
    category: null,
    productType: null,
    minPrice: 0,
    maxPrice: 200,
    search: "",
    searchChange:"",
    currentPage: 1,
      

};
    //state.product_type_list = state.product_type_list.map(item => ({...item, checked : false}))
    //state.selectedCategory = window.localStorage.getItem('selectedCategory')
export const category_Slice = createSlice({
    name: "category",
    initialState,
    reducers: {
        // FILTER SPECIFIC PRODUCT BY CATEGORY
        setCategory: (state, action) => {
            state.category = action.payload;
          },

          setProductType: (state, action) => {
            state.productType = action.payload;
            const CheckedProduct_type = state.product_type_list.map((item) =>
            item.id === action.payload ? { ...item, checked: !item.checked } : item
                );

            state.productType = CheckedProduct_type

            },

          setMinPrice: (state, action) => {
            state.minPrice = action.payload;
            
          },

          setMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
            
          },

          setSearch: (state, action) => {
            state.search = action.payload;
            
            
          },
          setSearchChange : (state, action) => {
            state.searchChange = action.payload
          },

          setRatings: (state, action) => {
            state.ratings = action.payload;
            
          },

        

          setFiltredData :(state, action)=>{
            state.filteredData = action.payload;
          }
        
        
        
    },
    /*extraReducers: {
        [getProductsDetails.pending]: (state) => {
            state.isLoading = true;
        },
        [getProductsDetails.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = action.error.message;
        },
        [getProductsDetails.fulfilled]: (state, { payload }) => {
            state.dataList = payload;
            state.isLoading = false;
           
        },
    },
*/

})
export const { 
            setCategory,
            setProductType,
            setMinPrice,
            setMaxPrice,
            setSearch,
            setRatings,
            setFiltredData,
            setSearchChange

             } = category_Slice.actions
export default category_Slice.reducer