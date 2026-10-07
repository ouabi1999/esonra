import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../src/utilis/currencyUtils"

function CurrencyPrice({ price }) {
  const selectedCurrency = useSelector(
    (state) => state.currency.selectedCurrency
  );

  const rates = useSelector(
    (state) => state.currency.rates
  );

  return (
    <>
      {formatPrice(
        price,
        selectedCurrency,
        rates
      )}
    </>
  );
}

export default CurrencyPrice;