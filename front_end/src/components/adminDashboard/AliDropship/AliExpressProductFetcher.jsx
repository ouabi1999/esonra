import { useState } from "react";
import styled from "styled-components";
import ApiInstance from "../../../../common/baseUrl";
import { useDispatch } from "react-redux";
import { setAliExpressProduct } from "../../../features/AliExpressProductSlice";
export default function AliExpressProductFetcher() {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  const fetchProduct = () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    ApiInstance.get(
      `aliexpress/product/${productId}`,
      {
        params: {
          aliexpress_access_token: localStorage.getItem("aliexpress_access_token"),
        },
      }
    )
      .then((res) => {
        console.log("Product data:", res.data);
        dispatch(setAliExpressProduct(res.data.data.result))
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button onClick={fetchProduct} disabled={loading}>
          {loading ? "Loading..." : "Fetch Product"}
        </Button>
      </InputWrapper>
      {error && <Error>{error}</Error>}

      

    </Container>
  );
}

const Container = styled.div`

`;

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  color: #111827;
  margin-bottom: 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 12px;
`;


