import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Rating from "@mui/material/Rating";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import countriesData from "../../../../common/countryData.json";
import ApiInstance from '../../../../common/baseUrl';

export const AliExpressRating= ({ product }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    stars: 1,
    product:product?.id,
    review: {
      text: '',
      images: []
    },
    user: {
      firstName: '',
      lastName:"",
      avatar: '',
      country: '',
      countryCode:"",
    }
  });
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      product: product?.id
    }))
  }, [product]);
  
  const handleStarChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      stars: newValue
    }));
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value
      }
    }));
  };
  const addImageUrl = () => {

    setFormData(prev => ({
      ...prev,
      review: {
        ...prev.review,
        images: [...prev.review.images, imageUrl]
      }
    }));
    setImageUrl('');
  };
  const handleReviewInput = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      review: {
        ...prev.review,
        text: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        review: {
          ...prev.review,
          images: [...prev.review.images, ...images]
        }
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiInstance.post('ratings/', {
        ...formData,
      });
      
      toast.success('Rating submitted successfully!');
      setFormData({
        stars: 0,
        review: { text: '', images: [] },
        user: { firstName: '', lastName:"",  avatar: '', country: '', countryCode: '' }
      });
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <FormContainer>
      <Title>Submit AliExpress Rating</Title>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Rating</Label>
          <Rating
            value={Math.max(1, formData.stars || 1)}
            
            onChange={handleStarChange}
            size="large"
          />
        </FormGroup>

        <FormGroup>
          <Label>firstName</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.user.firstName}
            onChange={handleUserInput}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>lastName</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.user.lastName}
            onChange={handleUserInput}
            required
          />
        </FormGroup>

  
        <TextField
                  label="Country"
                  id="filled-size-small"
                  select
                  fullWidth
                  variant="filled"
                  name="country"
                  size="small"
                  value={formData.country}
                  autoComplete="false"
                  required
                  onChange={handleUserInput}
                >
                  {countriesData?.map((country, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={country.label}
                        defaultValue=""
                        onClick={() =>
                          setFormData({
                            ...formData,
                            user: {...formData.user, countryCode: country.value},
                          })
                        }
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{country.label}</span>
                        </div>
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  label="image URL"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  fullWidth
                  variant="filled"
                  size="small"
                  sx={{ mt: 2 }}
                />
                <Button  size = "small" onClick={addImageUrl} variant="contained" sx={{ mt: 1 }}>
                  Add URL
                </Button>

        <FormGroup>
          <Label>Review</Label>
          <TextArea
            value={formData.review.text}
            onChange={handleReviewInput}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Upload Images</Label>
          <FileInput
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </FormGroup>

        {formData.review.images.length > 0 && (
          <ImageGrid>
            {formData.review.images.map((img, index) => (
              <PreviewImage
                key={index}
                src={img}
                alt={`Review image ${index + 1}`}
              />
            ))}
          </ImageGrid>
        )}

        <SubmitButton type="submit" >
          Submit Rating
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AliExpressRating;



const FormContainer = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2d3748;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 8rem;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  
  &::file-selector-button {
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    border: none;
    border-radius: 0.25rem;
    background-color: #e2e8f0;
    color: #4a5568;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #cbd5e0;
    }
  }
`;