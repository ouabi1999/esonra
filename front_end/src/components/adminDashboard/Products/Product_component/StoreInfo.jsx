import React from "react";
import styled from "styled-components";

const StoreCard = styled.div`
  padding: 1rem;
  background: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.06);
`;

const StoreInfo = ({ product }) => {
  const store = product.ae_store_info;

  return (
    <StoreCard>
      <h2>Store Info</h2>
      <p><strong>Name:</strong> {store.store_name}</p>
      <p><strong>Country:</strong> {store.store_country_code}</p>
      <p><strong>Shipping Rating:</strong> {store.shipping_speed_rating}</p>
      <p><strong>Communication Rating:</strong> {store.communication_rating}</p>
      <p><strong>Item as Described:</strong> {store.item_as_described_rating}</p>
    </StoreCard>
  );
};

export default StoreInfo;
