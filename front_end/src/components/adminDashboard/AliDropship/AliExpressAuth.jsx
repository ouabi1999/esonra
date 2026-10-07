import React, { useEffect, useState } from "react";
import ApiInstance from "../../../../common/baseUrl"; // your existing Axios instance
import styled from "styled-components";

const APP_KEY = import.meta.env.VITE_API_ALIEXPRESS_APPKEY;
const REDIRECT_URI = import.meta.env.VITE_ALIEXPRESS_REDERECT_URL;

export default function AliExpressAuth() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState(null);

  const handleLogin = () => {
    const authUrl = `https://auth.aliexpress.com/oauth/authorize?response_type=code&client_id=${APP_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  };

  
useEffect(() => {
  // 1️⃣ Check if we already have tokens in localStorage
  const accessToken = localStorage.getItem("aliexpress_access_token");
  if (accessToken) {
    setStatus("✅");
    return; // skip code exchange
  }

  // 2️⃣ If no token, check URL for code
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;

  setLoading(true);
  setStatus("🔄...");

  ApiInstance.post("aliexpress/token/", { code })
    .then(res => {
      if (res.data.access_token) {
        localStorage.setItem("aliexpress_access_token", res.data.access_token);
        localStorage.setItem("aliexpress_refresh_token", res.data.refresh_token);
        setStatus("✅");
      } else {
        setStatus("⚠️");
        console.log(res.data)
      }
    })
    .catch(err => {
      console.error(err);
      setStatus("❌");
    })
    .finally(() => setLoading(false));
}, []);

  
  return (
    <Container>

        <ButtonRow>
          <Button color="#ff4747" onClick={handleLogin} disabled={loading}>
            Connect with AliExpress  {status && status}
          </Button>
        </ButtonRow>

       

        
    </Container>
  );
}

//
// 🎨 Styled Components
//
const Container = styled.div`
  
`;

const Card = styled.div`
 
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #222;
  margin-bottom: 1.5rem;
`;

const ButtonRow = styled.div`
  
`;

const Button = styled.button`
background-color: #f52727d5 !important;
  color: #fff !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  transition: background 0.3s !important;
  margin-bottom: 15px;

  &:hover {
    background-color: #f527278c !important;
  }

  &:disabled {
    background-color: #9ca3af !important;
    color: #f3f4f6 !important;
  }

`;

const Status = styled.p`
  color: #444;
  font-size: 0.95rem;
`;

const ProductBox = styled.div`
  margin-top: 2rem;
  background: #f9fafb;
  border: 1px solid #e4e6ea;
  border-radius: 10px;
  text-align: left;
  padding: 1rem;

  h3 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  pre {
    font-size: 0.85rem;
    background: #fff;
    padding: 0.75rem;
    border-radius: 8px;
    overflow-x: auto;
  }
`;