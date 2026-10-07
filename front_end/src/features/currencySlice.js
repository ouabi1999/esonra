import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  selectedCurrency:
    window.localStorage.getItem("selectedCurrency") || "USD",

  currencyManuallySelected:
    window.localStorage.getItem("currencyManuallySelected") === "true",
  

  rates: {
    USD: 1,
  },

  status: "idle",

  error: null,

  lastUpdated: null,
};

export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://api.frankfurter.dev/v2/rates?base=USD"
      );

      if (!response.ok) {
        throw new Error(
          `Exchange rate request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const rates = {
        USD: 1,
      };

      data.forEach((item) => {
        rates[item.quote] = item.rate;
      });

      return rates;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to fetch exchange rates"
      );
    }
  }
);

export const currency_Slice = createSlice({
  name: "currency",

  initialState,

  reducers: {
    setCurrency(state, action) {
      state.selectedCurrency = action.payload;
      state.currencyManuallySelected = true;

      window.localStorage.setItem(
        "selectedCurrency",
        action.payload
      );

      window.localStorage.setItem(
        "currencyManuallySelected",
        "true"
      );
    },

    setCurrencyAutomatically(state, action) {
      state.selectedCurrency = action.payload;
      state.currencyManuallySelected = false;

      window.localStorage.setItem(
        "selectedCurrency",
        action.payload
      );

      window.localStorage.setItem(
        "currencyManuallySelected",
        "false"
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchExchangeRates.pending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )

      .addCase(
        fetchExchangeRates.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.rates = action.payload;
          state.lastUpdated = new Date().toISOString();
          state.error = null;
        }
      )

      .addCase(
        fetchExchangeRates.rejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            action.payload ||
            "Unable to fetch exchange rates";
        }
      );
  },
});

export const {
  setCurrency,
  setCurrencyAutomatically,
} = currency_Slice.actions;

export default currency_Slice.reducer;