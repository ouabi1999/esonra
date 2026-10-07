import React from 'react';
import styled from 'styled-components';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { categoryList, series, types } from '../../../../../../common/categoryList';

function Organization({ formData, setFormData }) {
  return (
    <Container>
      <Title>Organization</Title>
      <FieldsContainer>
        <TextFieldStyled
          select
          label="Category"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          {categoryList?.map((option, index) => (
            <MenuItem key={index} value={option.value}>{option.value}</MenuItem>
          ))}
        </TextFieldStyled>

        <TextFieldStyled
          select
          label="Product type"
          value={formData.product_type}
          onChange={e => setFormData({ ...formData, product_type: e.target.value })}
        >
          {types.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        </TextFieldStyled>

        <TextFieldStyled
          select
          label="Series"
          value={formData.series}
          onChange={e => setFormData({ ...formData, series: e.target.value })}
        >
          {series.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        </TextFieldStyled>
      </FieldsContainer>
    </Container>
  );
}

export default Organization;

const Container = styled.div`
  margin-bottom: 16px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const Title = styled.h4`
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  color: #111827;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextFieldStyled = styled(TextField)`
  &.MuiTextField-root {
    background: #fff;
    border-radius: 8px;
  }
  .MuiInputLabel-root {
    color: #374151;
    font-weight: 500;
  }
  .MuiOutlinedInput-root {
    border-radius: 8px;
  }`