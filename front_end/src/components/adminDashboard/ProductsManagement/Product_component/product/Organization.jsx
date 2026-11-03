import React from 'react';
import styled from 'styled-components';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { categoryList} from '../../../../../../common/categoryList';

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