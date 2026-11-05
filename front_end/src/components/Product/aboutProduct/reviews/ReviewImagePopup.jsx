import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAwayListener } from "@mui/base";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1786734712/ChatGPT_Image_Aug_14_2026_09_11_32_PM_lok4wr.png";

const STAR_COLOR = "#38745B";
const EMPTY_STAR_COLOR = "#E5E0D8";

export default function ReviewImagePopup({ rate, selected, setSelected }) {
  const isOpen =
    selected?.index != null &&
    rate?.id != null &&
    rate.id === selected.id;

  const handleClose = () => {
    setSelected({ index: null, id: null });
  };

  // Keep AnimatePresence mounted so it can run the exit animation.
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          key="review-image-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <PopupContainer
              as={motion.div}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Header>
                <HeaderLabel>Customer Review</HeaderLabel>

                <CloseButton
                  type="button"
                  onClick={handleClose}
                  aria-label="Close review"
                >
                  <CloseIcon style={{ fontSize: 20 }} />
                </CloseButton>
              </Header>

              <Content>
                <ThumbColumn>
                  {imagesForReview(rate).map((img, index) => (
                    <Thumb
                      key={`${img}-${index}`}
                      src={img}
                      alt={`Review image ${index + 1}`}
                      active={index === selected.index}
                      onClick={() =>
                        setSelected({ ...selected, index })
                      }
                      loading="lazy"
                    />
                  ))}
                </ThumbColumn>

                <MainImageWrapper>
                  {imagesForReview(rate).length > 1 && (
                    <>
                      <NavButtonLeft
                        type="button"
                        onClick={() =>
                          changeImage(-1, rate, selected, setSelected)
                        }
                        aria-label="Previous image"
                      >
                        <ArrowBackIcon style={{ fontSize: 24 }} />
                      </NavButtonLeft>

                      <NavButtonRight
                        type="button"
                        onClick={() =>
                          changeImage(1, rate, selected, setSelected)
                        }
                        aria-label="Next image"
                      >
                        <ArrowForwardIcon style={{ fontSize: 24 }} />
                      </NavButtonRight>
                    </>
                  )}

                  <MainImage
                    key={imagesForReview(rate)[selected.index]}
                    src={
                      imagesForReview(rate)[selected.index] ||
                      FALLBACK_IMAGE
                    }
                    alt="Customer review"
                  />

                  {imagesForReview(rate).length > 1 && (
                    <ImageCounter>
                      {selected.index + 1} / {imagesForReview(rate).length}
                    </ImageCounter>
                  )}
                </MainImageWrapper>

                <ReviewInfo>
                  <Stars
                    aria-label={`Rating: ${getRating(rate)} out of 5`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} $active={star <= getRating(rate)}>
                        ★
                      </Star>
                    ))}

                    <RatingNumber>{getRating(rate).toFixed(1)}</RatingNumber>
                  </Stars>

                  {rate.review?.color && (
                    <SmallText>
                      <InfoLabel>Color:</InfoLabel> {rate.review.color}
                    </SmallText>
                  )}

                  <SmallText style={{textTransform:"capitalize"}}>
                    {getCustomerName(rate)}.
                  </SmallText>

                  <SmallText>{formatReviewDate(rate.created_at)}</SmallText>

                  {rate.review?.text && (
                    <ReviewText>{rate.review.text}</ReviewText>
                  )}
                </ReviewInfo>
              </Content>
            </PopupContainer>
          </ClickAwayListener>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

/* -------------------- Helper Functions -------------------- */

function imagesForReview(rate) {
  const images = rate?.review?.images;

  if (Array.isArray(images)) {
    const validImages = images.filter(
      (image) => typeof image === "string" && image.trim() !== ""
    );

    if (validImages.length > 0) {
      return validImages;
    }
  }

  return [FALLBACK_IMAGE];
}

function getRating(rate) {
  const rating = Number(rate?.stars ?? rate?.rating ?? 0);

  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.max(0, Math.min(5, rating));
}

function getCustomerName(rate) {
  const firstName = rate?.user?.firstName?.trim() || "";
  const lastName = rate?.user?.lastName?.trim().slice(0, 2) || "";

  const name = [firstName, lastName].filter(Boolean).join(" ");

  return name || "Customer";
}

function formatReviewDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function changeImage(direction, rate, selected, setSelected) {
  const images = imagesForReview(rate);

  if (images.length <= 1) {
    return;
  }

  const currentIndex = Math.max(
    0,
    Math.min(selected.index, images.length - 1)
  );

  const nextIndex =
    (currentIndex + direction + images.length) % images.length;

  setSelected({ ...selected, index: nextIndex });
}

/* -------------------- Styled Components -------------------- */

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  padding: 16px;
  background: rgba(18, 18, 18, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PopupContainer = styled.div`
  width: min(1100px, 100%);
  height: min(760px, 85vh);
  min-height: 0;
  background: #fff;
  border: 1px solid rgba(201, 163, 92, 0.2);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 100%;
    height: 90dvh;
    max-height: 850px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    height: 92dvh;
    border-radius: 8px;
  }
`;

export const Header = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid #eee9df;
  background: #fcfbf8;
`;

const HeaderLabel = styled.div`
  color: #292722;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  color: #625e55;
  transition: color 0.2s ease, background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    color: #222;
    background: #f0ece4;
    border-color: #e8e0d2;
  }

  &:focus-visible {
    outline: 2px solid ${STAR_COLOR};
    outline-offset: 2px;
  }
`;

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 320px;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 76px minmax(0, 1fr) 260px;
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
    overflow-y: auto;
  }
`;

export const ThumbColumn = styled.div`
  min-height: 0;
  padding: 12px 8px;
  background: #faf9f6;
  border-right: 1px solid #eee9df;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 768px) {
    grid-row: 2;
    order: 2;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 12px;
    border-right: none;
    border-top: 1px solid #eee9df;
  }
`;

export const Thumb = styled.img`
  display: block;
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid
    ${({ active }) => (active ? STAR_COLOR : "transparent")};
  outline: 1px solid ${({ active }) => (active ? STAR_COLOR : "#e7e2d9")};
  outline-offset: -1px;
  opacity: ${({ active }) => (active ? 1 : 0.78)};
  transition: opacity 0.2s ease, border-color 0.2s ease;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
`;

export const MainImageWrapper = styled.div`
  position: relative;
  min-width: 0;
  min-height: 0;
  padding: 20px;
  background: #f7f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-row: 1;
    padding: 16px;
    min-height: 260px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    min-height: 220px;
  }
`;

export const MainImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  object-fit: contain;
  opacity: 0;
  animation: imageFadeIn 0.3s ease forwards;

  @keyframes imageFadeIn {
    to {
      opacity: 1;
    }
  }
`;

export const NavButton = styled.button`
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: #292722;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(201, 163, 92, 0.35);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #fff;
    transform: translateY(-50%) scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${STAR_COLOR};
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

export const NavButtonLeft = styled(NavButton)`
  left: 12px;

  @media (max-width: 480px) {
    left: 8px;
  }
`;

export const NavButtonRight = styled(NavButton)`
  right: 12px;

  @media (max-width: 480px) {
    right: 8px;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 5px 10px;
  color: #fff;
  background: rgba(30, 30, 30, 0.68);
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 0.3px;
`;

export const ReviewInfo = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 24px 20px;
  background: #fff;
  border-left: 1px solid #eee9df;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 900px) {
    padding: 20px 16px;
  }

  @media (max-width: 768px) {
    grid-row: 3;
    display: block;
    padding: 16px;
    border-left: none;
    border-top: 1px solid #eee9df;
    overflow: visible;
  }
`;

export const Stars = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 16px;
  line-height: 1;
`;

const Star = styled.span`
  color: ${({ $active }) =>
    $active ? STAR_COLOR : EMPTY_STAR_COLOR};
  font-size: 21px;
`;

const RatingNumber = styled.span`
  margin-left: 6px;
  color: #514d45;
  font-size: 13px;
  font-weight: 600;
`;

export const SmallText = styled.div`
  margin-bottom: 8px;
  color: #77736b;
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

const InfoLabel = styled.span`
  color: #38362f;
  font-weight: 600;
`;

export const ReviewText = styled.p`
  margin: 16px 0 0;
  color: #393832;
  font-size: 14px;
  line-height: 1.8;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;
