import styled from 'styled-components';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Description({ formData, setFormData }) {
  
  const handleChangeEng = (content, delta, source, editor) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, en: editor.getHTML() }
    }));
  };

  const handleChangeAr = (content, delta, source, editor) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, ar: editor.getHTML() }
    }));
  };

  const handleChangeEs = (content, delta, source, editor) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, es: editor.getHTML() }
    }));
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ align: [] }, { color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'align', 'color', 'background', 'size'
  ];

  return (
    <Container>
      <Label>Description English</Label>
      <StyledQuill value={formData.description.en} onChange={handleChangeEng} modules={modules} formats={formats} />

      <Label>Description Spanish</Label>
      <StyledQuill value={formData.description.es} onChange={handleChangeEs} modules={modules} formats={formats} />

      <Label>Description Arabic</Label>
      <StyledQuill value={formData.description.ar} onChange={handleChangeAr} modules={modules} formats={formats} />
    </Container>
  );
}

export default Description;

const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

const StyledQuill = styled(ReactQuill)`
  .ql-toolbar {
    border-radius: 8px 8px 0 0;
    border: 1px solid #d1d5db;
    background: #f9fafb;
  }
  .ql-container {
    border-radius: 0 0 8px 8px;
    border: 1px solid #d1d5db;
    min-height: 150px;
  }`