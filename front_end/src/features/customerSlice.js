import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const getCustomers = createAsyncThunk("customers/Customers", () => {
    return fetch("/customers")
        .then((response) => {
            if (!response.ok) {

                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((data) => data);
});

const initialState = {
    customers: [],
    isLoading: false,
    hasError: false,
   

};

export const customers_Slice = createSlice({
    name: "customers",
    initialState,
    

    reducers:{
        setNewMessage(state, action){
           
            const customers = state.customers.slice();
            const {user_id, message} = action.payload
            customers.map(user => {
                if (user.id === user_id){
                    user.rooms.map(room =>{
                        if (room.id === message.room_id){
                            room.messages = [...room.messages, message]
                        }
                    })  
                }
            
            })
            state.customers =  customers
        
        },
       

        setReadMessages(state, action){
            const customers = state.customers.slice();
            const {user_id, room_id, messages} = action.payload
           
            customers.map(user => {
                if (user.id === user_id){
                    user.rooms.map(room => {
                        if (room.id === room_id){
                            room.messages  = messages
                                
                        }
                    
                    })
                    
               
                }
            
            })
            state.customers =  customers
             
        },
        
        setRoom(state, action) {
            const customers = state.customers.slice();
            const { user_id, room } = action.payload

            customers.map(user => {
                if (user.id === user_id) {
                    user.rooms = [...user.rooms, room]
                    
                }
            }

            )
            state.customers = customers
        

        }
    },

    extraReducers: {
        [getCustomers.pending]: (state) => {
            state.isLoading = true;
        },
        [getCustomers.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = action.error.message;
            
        },
        [getCustomers.fulfilled]: (state, { payload }) => {
            state.customers = payload;
            state.isLoading = false;
            
           
        },
    },


})
export const { setNewMessage, setReadMessages, setRoom} = customers_Slice.actions
export default customers_Slice.reducer