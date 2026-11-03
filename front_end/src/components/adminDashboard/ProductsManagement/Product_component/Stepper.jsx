import React, { useState } from 'react';
import Layout from './product/Layout';
import Description from './Description';
import ProfessionalVariantManager from './VariantManager';
import MediaManagement from './MediaManagement';
import styled from 'styled-components';

function Stepper({ formData, setFormData, handelChange }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  let stepContent;

  switch (activeStepIndex) {
    case 0:
      stepContent = <Layout formData={formData} setFormData={setFormData} handelChange={handelChange} />;
      break;
    case 1:
      stepContent = <Description formData={formData} setFormData={setFormData} handelChange={handelChange} />;
      break;
    case 2:
      stepContent = <ProfessionalVariantManager formData={formData} setFormData={setFormData} handelChange={handelChange} />;
      break;
    case 3:
      stepContent = <MediaManagement formData={formData} setFormData={setFormData} handelChange={handelChange} />;
      break;
    default:
      break;
  }

  return (
    <Container>
      <StepperHeader>
        <StepItems>
          <StepButton active={activeStepIndex === 0} onClick={() => setActiveStepIndex(0)}>Product</StepButton>
          <Divider />
          <StepButton active={activeStepIndex === 1} onClick={() => setActiveStepIndex(1)}>Description</StepButton>
          <Divider />
          <StepButton active={activeStepIndex === 2} onClick={() => setActiveStepIndex(2)}>Variant</StepButton>
          <Divider />
          <StepButton active={activeStepIndex === 3} onClick={() => setActiveStepIndex(3)}>Media Management</StepButton>
        </StepItems>
      </StepperHeader>
      <StepContent>{stepContent}</StepContent>
    </Container>
  );
}

export default Stepper;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  background-color: #f5f7fa;
`;

const StepperHeader = styled.div`
  background-color: #fff;
  padding: 16px 24px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;

const StepItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.active ? '#fff' : '#4b5563'};
  background-color: ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 2px 6px rgba(59,130,246,0.3)' : 'none'};
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#d1d5db'};
  }
  @media (max-width: 500px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const Divider = styled.div`
  flex: 1;
  height: 3px;
  background-color: #d1d5db;
  border-radius: 2px;
  margin: 0 8px;
`;

const StepContent = styled.div`
  padding: 24px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  margin-top: 4px;
`
