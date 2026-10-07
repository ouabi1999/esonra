import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAwayListener } from "@mui/base";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

export default function ReviewImagePopup({ rate, selected, setSelected }) {
  if (selected.index === null || rate.id !== selected.id) return null;

  const images = rate.review.images.length >0? rate.review.images : ["https://res.cloudinary.com/dzpzy1o1y/image/upload/v1786734712/ChatGPT_Image_Aug_14_2026_09_11_32_PM_lok4wr.png"];
  const currentImage = images[selected.index];

  const handlePrev = () =>
    setSelected({
      ...selected,
      index: selected.index === 0 ? images.length - 1 : selected.index - 1,
    });

  const handleNext = () =>
    setSelected({
      ...selected,
      index: selected.index === images.length - 1 ? 0 : selected.index + 1,
    });

  const handleClose = () => setSelected({ index: null, id: null });

  return (
    <AnimatePresence>
      <Overlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <PopupContainer
            as={motion.div}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >

            <Header>
              <CloseButton onClick={handleClose}>
                <CloseIcon style={{ fontSize: 20 }} />
              </CloseButton>
            </Header>
            <Content>
              {/* LEFT: Thumbnails */}
              <ThumbColumn>
                {images?.map((img, i) => (
                  <Thumb
                    key={i}
                    src={img}
                    active={i === selected.index}
                    onClick={() => setSelected({ ...selected, index: i })}
                  />
                ))}
              </ThumbColumn>

              {/* CENTER: Main image */}
              <MainImageWrapper>
                {images.length > 1 && (
                  <>
                    <NavButtonLeft onClick={handlePrev}>
                      <ArrowBackIcon style={{ fontSize: 28 }} />
                    </NavButtonLeft>
                    <NavButtonRight onClick={handleNext}>
                      <ArrowForwardIcon style={{ fontSize: 28}} />
                    </NavButtonRight>
                  </>
                )}
                <MainImage src={currentImage} alt="review" />
              </MainImageWrapper>

              {/* RIGHT: Review text */}
              <ReviewInfo>
                <Stars>★★★★★</Stars>
                <SmallText>{rate.review.color ? "Color:" + " " + rate.review.color : ""}</SmallText>
                <SmallText>
                  {rate.user?.firstName + " " + rate.user?.firstName.slice(0, 1)}. | {rate.created_at}

                </SmallText>
                <ReviewText>{rate.review.text}</ReviewText>
              </ReviewInfo>
            </Content>
          </PopupContainer>
        </ClickAwayListener>
      </Overlay>
    </AnimatePresence>
  );
}


export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 10px; /* Prevent edges cut on small screens */
`;

export const PopupContainer = styled.div`
  width: 90%;
  max-width: 1100px;
  height: 80vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    height: 85vh;
  }

  @media (max-width: 768px) {
    height: 90vh;
    width: 100%;
    border-radius: 0;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
  font-size: 16px;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 10px 12px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 18px;
  transition: color 0.2s;
  &:hover {
    color: #000;
  }
`;

const Title = styled.div`
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  user-select: none;
`;
export const Content = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 380px;
  height: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 80px 1fr 300px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
`;

export const ThumbColumn = styled.div`
  background: #f8f8f8;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    flex-direction: row;
    justify-content: center;
    overflow-x: auto;
    padding: 8px;
  }
`;

export const Thumb = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: ${({ active }) => (active ? "2px solid #eea16d" : "1px solid #ddd")};
  transition: all 0.2s ease;
  &:hover {
    border-color: #a88a62;
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

export const MainImageWrapper = styled.div`
  position: relative;
  background: rgb(240, 236, 236);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const MainImage = styled.img`
      min-width:200px;
      width:450px;
      height:450px;
      object-fit:contain;
      transition: transform 0.3s ease, opacity 0.3s ease;
       cursor: zoom-in;
        opacity: 0;
        animation: fadeIn 0.4s forwards;


     
     @media only screen and (max-width: 500px) {
      &{
        width:100%;
        height:100%;
        min-width:300px;
        min-height:300px;
      }
      
  }

  

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    cursor: default;
    &:hover {
      transform: none;
    }
  }
`;

export const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: 50%;
  padding: 8px;
  color: #000;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 600px) {
    padding: 6px;
  }
`;

export const NavButtonLeft = styled(NavButton)`
  left: 12px;
`;

export const NavButtonRight = styled(NavButton)`
  right: 12px;
`;

export const ReviewInfo = styled.div`
  padding: 16px;
  overflow-y: auto;
  border-left: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    display: none; /* hide review info on small screens to maximize image space */
  }
`;

export const Stars = styled.div`
  color: #a88a62;
  font-size: 18px;
  margin-bottom: 8px;
`;

export const SmallText = styled.div`
  font-size: 13px;
  color: #777;
  margin-bottom: 4px;
  text-transform:capitalize;
`;

export const ReviewText = styled.p`
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-top: 10px;
`;

