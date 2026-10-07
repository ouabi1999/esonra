import React from 'react';
import styled from 'styled-components';

function ProductTitle({ formData, setFormData }) {
  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [name]: value,
      },
    }));
  };

  return (
    <Container>
      <TitleGroup>
        <Label>Product Title English</Label>
        <Input type="text" name="en" value={formData?.name?.en} onChange={handelChange} />
      </TitleGroup>
      <TitleGroup>
        <Label>Product Title Spanish</Label>
        <Input type="text" name="es" value={formData?.name?.es} onChange={handelChange} />
      </TitleGroup>
      <TitleGroup>
        <Label>Product Title Arabic</Label>
        <Input type="text" name="ar" value={formData?.name?.ar} onChange={handelChange} />
      </TitleGroup>
    </Container>
  );
}

export default ProductTitle;

const Container = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.3s;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
    outline: none;
  }`