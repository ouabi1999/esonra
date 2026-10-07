import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "../SEO/SEO";


const OrderSuccess = () => {
  const { t } = useTranslation();
  return (
    <SuccessContainer>
      <SEO title="Order Confirmation" />
      <Message>
        {t("orderSuccess.orderPlacedSuccessfully")}
      </Message>

      <SubText>
        {t("orderSuccess.orderProcessingMessage")}
      </SubText>

      <Button to="/">
        {t("orderSuccess.backToHome")}
      </Button>
    </SuccessContainer>
  );
};

export default OrderSuccess;
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
  text-align: center;
`;

const Message = styled.h1`
  font-size: 2rem;
  color: #28a745;
`;

const SubText = styled.p`
  font-size: 1.2rem;
  margin: 10px 0;
`;

const Button = styled(Link)`
  text-decoration: none;
  background: #007bff;
  color: #fff;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 20px;
  &:hover {
    background: #0056b3;
  }
`;
