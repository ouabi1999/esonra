import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ApiInstance from '../../common/baseUrl';
// Redux thunk with proper error handling
export const getDisplayInfo = createAsyncThunk(
    "displayInfo/getDisplayInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiInstance.get("/displayInfo");
            // Django returns data directly, no need for response.data.data
            return response.data;
        } catch (error) {
            // Handle error properly
            console.error("Error fetching display info:", error);

            // Return error to Redux state
            return rejectWithValue({
                message: error.response?.data?.error || "Failed to fetch display info",
                status: error.response?.status,
            });
        }
    }
);

export const getDisplayInfoSlice = createSlice({
    name: "display",
    initialState: {
        displayData: {
            banners: [],
            category: [],
            count_Down: false,
            header: {},
            id: null,
            logo: null,
            main_category: [],
            pop_up: [],
            slider: [],
            updated_at: "",
            created_at:""
        },

        isLoaded: false,
        hasError: false

    },
    reducers: {
        setDisplayInfo(state, action) {
            state.display = action.payload

        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getDisplayInfo.pending, (state, action) => {
                state.isLoaded = true;
            })
            .addCase(getDisplayInfo.rejected, (state, action) => {
                state.isLoaded = false;
                state.hasError = action.error.message;
            })
            .addCase(getDisplayInfo.fulfilled, (state, action) => {

                if (Object.keys(action.payload).length !== 0 ) {
                    state.displayData = action.payload[0];
                }
                state.isLoaded = false;
            });

    }
})
export const { setDisplayInfo } = getDisplayInfoSlice.actions
export default getDisplayInfoSlice.reducer