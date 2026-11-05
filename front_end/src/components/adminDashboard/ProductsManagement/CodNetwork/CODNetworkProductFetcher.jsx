
import React, { useState } from "react";
import styled from "styled-components";
import ApiInstance from "../../../../../common/baseUrl";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

export default function CODNetworkProductFetcher() {
  const [productType, setProductType] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState("");

  const COD_API_BASE_URL = import.meta.env.VITE_COD_API_BASE_URL;
  const COD_API_TOKEN = import.meta.env.VITE_COD_API_TOKEN;

  const fetchProductsList = async () => {
   

    setLoading(true);

    try {
      const response = await fetch(
        `${COD_API_BASE_URL}/seller/${productType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${COD_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      console.log("Fetched COD Network products:", data);

      setProducts(data.products || (Array.isArray(data) ? data : [data]));
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch COD Network product.");
    } finally {
      setLoading(false);
    }
  };

  const syncProducts = async () => {
    setLoading(true);

    try {
      const response = await ApiInstance.post(
        "cod-network/sync-products/",
        {
          product_type: productType,
          product_id: productId.trim() || null,
        }
      );

      toast.success(
        response.data.message || "Products synchronized successfully."
      );

      await fetchProductsList();
    } catch (error) {
      console.error(error);
      toast.error("Could not synchronize COD Network products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CODContainer>
      <h3>COD Network Products</h3>

      <div className="controls">
        <select
          value={productType}
          onChange={(event) => {
            setProductType(event.target.value);
            setProducts([]);
            setProductId("");
          }}
        >
          <option value="products">Seller Products</option>
          <option value="drop-products">Drop Products</option>
        </select>

        <input
          type="text"
          placeholder="Enter COD product ID"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        />

        <button onClick={fetchProductsList} disabled={loading}>
          Get Product
        </button>

        <button onClick={syncProducts} disabled={loading}>
          Sync Products
        </button>

        {loading && <CircularProgress size={22} />}
      </div>

      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.id || product.sku}>
            <span>{product.name || product.title || "Unnamed product"}</span>
            <span>SKU: {product.sku || product.product_id || "—"}</span>
            <span>
              {product.price != null ? `$${product.price}` : ""}
            </span>
          </div>
        ))}
      </div>
    </CODContainer>
  );
}

const CODContainer = styled.div`
  width: 100%;
  margin: 15px 0;

  h3 {
    margin-bottom: 12px;
  }

  .controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  select,
  input,
  button {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
  }

  input {
    min-width: 220px;
    outline: none;
  }

  input:focus {
    border-color: #777;
  }

  button {
    background: #111;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .products {
    margin-top: 12px;
  }

  .product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    margin-top: 8px;
    background: #f8f8f8;
    border-radius: 6px;
  }
`;
