import { createSlice } from "@reduxjs/toolkit";
const initialState = {

    product:null,
}
export const AliExpressProductSlice = createSlice({
    name : "aliexpressProduct",
    initialState,
    reducers:{
        setAliExpressProduct(state, action){

            state.product = action.payload

        }
    }

})
export const {setAliExpressProduct} = AliExpressProductSlice.actions
export default AliExpressProductSlice.reducer