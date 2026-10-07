import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "../features/cartSlice"
import authReducer from "../features/authSlice"
import display_Reducer from "../features/DisplaySlice"
import productReducer from "../features/productSlice"
import locationReducer from "../features/locationSlice"
import AliExpressReducer from "../features/AliExpressProductSlice"
import productDetails_reducer from "../features/productDetails_slice"
import filterReducer from '../features/filterSlice'
import currencyReducer from "../features/currencySlice";
import languageReducer from "../features/LanguagesSlice"


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    display: display_Reducer,
    products : productReducer,
    location : locationReducer,
    currency: currencyReducer,
    aliExpressProduct : AliExpressReducer,
    //orders : orderReducer,
    //filteredProduct : categoryReducer,
    product : productDetails_reducer,
    //customers : customers_Reducer,
    filter: filterReducer,
    language:languageReducer,


  },
})