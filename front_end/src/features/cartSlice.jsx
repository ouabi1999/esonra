import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  cartItems: JSON.parse(window.localStorage.getItem("cartItems")) || [],
  buySingleItem :[],
  isOpen : false

};
export const cart_Slice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    // add product to the shopping cart
    setCartItems(state, action){
       state.cartItems = action.payload
    },

    setIsCartOpen(state, action){
      state.isOpen = action.payload
    },
    
    addToCart(state, action) {
      
      const cartItems = JSON.parse(window.localStorage.getItem("cartItems")) || [];
      cartItems.push(action.payload)
      state.cartItems = cartItems
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems))
      

    },

    // remove product to the shopping cart
    removeFromCart(state, product) {
      const cartItems = JSON.parse(window.localStorage.getItem("cartItems"));

      state.cartItems = cartItems.filter((x, index) => index !== product.payload) 
      window.localStorage.setItem("cartItems", JSON.stringify(state.cartItems))


    },
    // addition quantity or subtract quantity
    subtractQuantity(state, action) {
      const cartItems = JSON.parse(window.localStorage.getItem("cartItems"));
      cartItems.map((item, index) => {
        if (index === action.payload) {
          if (item.quantity > 1) {
            item.quantity -= 1
            item.subtotal -= item.price
          }
        }
        state.cartItems = cartItems
        window.localStorage.setItem("cartItems", JSON.stringify(cartItems))
      })
    },

    addQuantity(state, action) {
      const cartItems = JSON.parse(window.localStorage.getItem("cartItems"));
      cartItems.map((item, index) => {
        if (index === action.payload) {
          if (item.quantity < 5) {
            item.quantity += 1
            item.subtotal += item.price
            item.price = item.price
          }
        }
        state.cartItems = cartItems
        window.localStorage.setItem("cartItems", JSON.stringify(cartItems))
      })
    },


    buyNowItem(state, action) {
     
      state.cartItems = [{
        id: action.payload.id,
        selectedSku: action.payload.selectedSku,
        name: action.payload.name,
        available_shipping:action.payload.available_shipping,
        quantity: action.payload.quantity,
        price: parseFloat(action.payload.price),
        subtotal: parseFloat(action.payload.price) * action.payload.quantity,
      }]
      
      window.localStorage.setItem("cartItems", JSON.stringify(state.cartItems))





    },
  },

})
export const { removeFromCart, addQuantity, setIsCartOpen, addToCart,setCartItems, buyNowItem, subtractQuantity } = cart_Slice.actions
export default cart_Slice.reducer