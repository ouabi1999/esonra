import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  categories: [],
  sort : "best_match",
  minPrice: 0,
  maxPrice: 200,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(cat => cat !== category);
      } else {
        state.categories.push(category);
      }
    },
    setSort(state, action){
      state.sort = action.payload
    },
     setMinPrice: (state, action) => {
            state.minPrice = action.payload;
            
          },

          setMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
            },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearch,
  toggleCategory,
  resetFilters,
  setSort
} = filterSlice.actions;

export default filterSlice.reducer;
