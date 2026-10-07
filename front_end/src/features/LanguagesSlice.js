import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const language_Slice = createSlice({
    name: "language",
    initialState: {
        selectedLanguage:  window.localStorage.getItem("selectedLang") || "en"
    },
    reducers: {
        setLanguage(state, action) {
            state.selectedLanguage = action.payload

            window.localStorage.setItem("selectedLang", action.payload)

        }

    }
}
)
export const {
  setLanguage,
} = language_Slice.actions;

export default language_Slice.reducer;
