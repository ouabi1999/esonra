import React, { useMemo, useState } from "react";
import styled from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReviewImagePopup from "./ReviewImagePopup";
import Ratings from "./Ratings";

function CustomerReviews(props) {
  const [selected, setSelected] = useState({
    index: null,
    id: null,
  });

  const {
    fiveStars,
    twoStars,
    fourStars,
    threeStars,
    oneStar,
    sum_stars,
    newRatings,
    productData,
    ratings,
    t,
    i18n,
  } = props;

  const stars = useMemo(() => Array(5).fill(0), []);

  const translate = (key, fallback) => {
    if (typeof t !== "function") return fallback;
    const translated = t(`customer_reviews.${key}`);
    return translated === `customer_reviews.${key}` ? fallback : translated;
  };

 
  const getRatingValue = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) return 0;

    return Math.max(0, Math.min(5, Math.round(number)));
  };

  const formatDate = (date) => {
    if (!date) return "";

    try {
      const locale =
        i18n?.language === "ar"
          ? "ar"
          : i18n?.language === "es"
          ? "es-ES"
          : "en-US";

      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(date));
    } catch {
      return date;
    }
  };

  const handleImageError = (event) => {
    const image = event.currentTarget;

    image.style.display = "none";

    const placeholder = image.parentElement?.querySelector(
      '[data-review-placeholder="true"]'
    );

    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  const handleImageLoad = (event) => {
    const placeholder = event.currentTarget.parentElement?.querySelector(
      '[data-review-placeholder="true"]'
    );

    if (placeholder) {
      placeholder.style.display = "none";
    }
  };

  return (
    <Container>

      

      {ratings?.length > 0 ? (
        <ReviewsList>
          {ratings.map((rate, reviewIndex) => {
            const ratingValue = getRatingValue(rate?.stars);

            const reviewImages = Array.isArray(rate?.review?.images)
              ? rate.review.images.filter(Boolean)
              : [];

            return (
              <ReviewCard
                key={rate?.id ?? `review-${reviewIndex}`}
                $isArabic={i18n?.language === "ar"}
              >
                <ReviewIdentity>
                  <Avatar>
                    <PersonOutlineIcon />
                  </Avatar>

                  <IdentityInfo>
                    <CustomerName dir = {"ltr"}>
                      {rate.user?.firstName + " " + rate.user?.lastName.slice(0, 1)}.
                    </CustomerName>

                    <VerifiedLabel>
                      <VerifiedMark />
                      {translate("verified_purchase", "Verified Purchase")}
                    </VerifiedLabel>
                  </IdentityInfo>
                </ReviewIdentity>

                <ReviewMain>
                  <ReviewMeta>
                    <RatingStars
                      aria-label={`${ratingValue} ${translate(
                        "stars",
                        "stars"
                      )}`}
                    >
                      {stars.map((_, starIndex) => (
                        <StarIcon
                          key={starIndex}
                          className={
                            starIndex < ratingValue
                              ? "star-active"
                              : "star-inactive"
                          }
                        />
                      ))}
                    </RatingStars>

                    {rate?.created_at && (
                      <bdi>
                      <ReviewDate>
                        {formatDate(rate.created_at)}
                      </ReviewDate>
                      </bdi>
                    )}
                  </ReviewMeta>

                  {rate?.review?.text && (
                    <ReviewText>{rate.review.text}</ReviewText>
                  )}

                  {reviewImages.length > 0 && (
                    <ReviewImages>
                      {reviewImages.slice(0, 4).map((img, imageIndex) => {
                        const isSelected =
                          selected.index === imageIndex &&
                          selected.id === rate.id;

                        return (
                          <ReviewImageButton
                            key={`${rate.id}-${imageIndex}`}
                            type="button"
                            $selected={isSelected}
                            onClick={() =>
                              setSelected({
                                index: imageIndex,
                                id: rate.id,
                              })
                            }
                            aria-label={`${translate(
                              "view_image",
                              "View image"
                            )} ${imageIndex + 1}`}
                          >
                            <ImageFrame>
                              <ReviewImage
                                src={img}
                                alt={`${translate(
                                  "review_image",
                                  "Review image"
                                )} ${imageIndex + 1}`}
                                loading="lazy"
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                              />

                              <ImagePlaceholder
                                data-review-placeholder="true"
                              >
                                <PlaceholderMark>ENOUZA</PlaceholderMark>
                                <PlaceholderText>
                                  {translate(
                                    "no_photo_available",
                                    "No photo available"
                                  )}
                                </PlaceholderText>
                              </ImagePlaceholder>

                              {imageIndex === 3 &&
                                reviewImages.length > 4 && (
                                  <MoreImages>
                                    +{reviewImages.length - 4}
                                  </MoreImages>
                                )}
                            </ImageFrame>
                          </ReviewImageButton>
                        );
                      })}
                    </ReviewImages>
                  )}
                </ReviewMain>

                <ReviewImagePopup
                  rate={rate}
                  selected={selected}
                  setSelected={setSelected}
                />
              </ReviewCard>
            );
          })}
        </ReviewsList>
      ) : (
        <EmptyReviews>
          <EmptyMark>ENOUZA</EmptyMark>
          <EmptyTitle>
            {translate("no_reviews", "No reviews yet")}
          </EmptyTitle>
          <EmptyAccent />
        </EmptyReviews>
      )}
    </Container>
  );
}

export default CustomerReviews;

/* =========================================================
   LUXURY REVIEW DESIGN
   Editorial / quiet luxury direction
========================================================= */

const Container = styled.section`
  width: 100%;
  max-width: 1160px;
  margin: 30px auto;
  box-sizing: border-box;
  color: #211e1a;

  @media (max-width: 700px) {
    padding: 0 18px 12px;
  }

  @media (max-width: 420px) {
    padding: 0 14px 10px;
  }
`;






const ReviewsList = styled.div`
  width: 100%;
`;

const ReviewCard = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  column-gap: 48px;
  width: 100%;
  padding: 42px 4px;
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #e4ded6;
  }

  &:first-child::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: #e4ded6;
  }

  @media (max-width: 850px) {
    grid-template-columns: 150px minmax(0, 1fr);
    column-gap: 32px;
    padding: 34px 2px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 30px 0;
  }
`;

const ReviewIdentity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 2px;

  @media (max-width: 650px) {
    flex-direction: row;
    align-items: center;
    gap: 13px;
    padding-top: 0;
  }
`;

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  border: 1px solid #d7cec2;
  border-radius: 50%;
  color: #a88a62;
  background: #fcfaf7;

  svg {
    width: 21px;
    height: 21px;
    stroke-width: 1.25;
  }

  @media (max-width: 650px) {
    margin-bottom: 0;
  }
`;

const IdentityInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CustomerName = styled.span`
  color: #29251f;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.025em;
  text-transform:capitalize;
`;

const VerifiedLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  color: #8f8172;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8px;
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
`;

const VerifiedMark = styled.span`
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: #a88a62;
`;

const ReviewMain = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 17px;

  @media (max-width: 500px) {
    flex-wrap: wrap;
    gap: 9px;
    margin-bottom: 14px;
  }
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;

  svg {
    width: 14px;
    height: 14px;
  }

  .star-active {
    color: #a88a62;
  }

  .star-inactive {
    color: #dcd5cd;
  }
`;

const ReviewDate = styled.time`
  flex-shrink: 0;
  color: #9d9184;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const ReviewText = styled.p`
  max-width: 720px;
  margin: 0;
  color: #403a34;
  font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  font-size: clamp(17px, 1.7vw, 20px);
  font-weight: 400;
  line-height: 1.72;
  letter-spacing: 0.005em;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  &::before {
    content: "“";
    margin-right: 2px;
    color: #b49a78;
  }

  &::after {
    content: "”";
    margin-left: 2px;
    color: #b49a78;
  }

  @media (max-width: 650px) {
    font-size: 17px;
    line-height: 1.65;
  }
`;

const ReviewImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 23px;
`;

const ReviewImageButton = styled.button`
  position: relative;
  width: 82px;
  height: 82px;
  padding: 0;
  overflow: hidden;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#a88a62" : "#ddd5cb")};
  border-radius: 1px;
  background: #f7f3ee;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    border-color: #a88a62;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(60, 48, 36, 0.08);
  }

  &:focus-visible {
    outline: 1px solid #a88a62;
    outline-offset: 3px;
  }

  @media (max-width: 500px) {
    width: 70px;
    height: 70px;
  }
`;

const ImageFrame = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
`;

const ReviewImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.span`
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  box-sizing: border-box;
  background: #f4efe8;
  color: #9b8b78;
  text-align: center;
`;

const PlaceholderMark = styled.span`
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 8px;
  letter-spacing: 0.25em;
`;

const PlaceholderText = styled.span`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 6px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MoreImages = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 24, 20, 0.48);
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
`;

const EmptyReviews = styled.div`
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e4ded6;
  border-bottom: 1px solid #e4ded6;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const EmptyMark = styled.span`
  color: #a88a62;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.38em;
`;

const EmptyTitle = styled.p`
  margin: 12px 0 0;
  color: #62594f;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.015em;
`;

const EmptyAccent = styled.span`
  width: 28px;
  height: 1px;
  margin-top: 14px;
  background: #a88a62;
`;