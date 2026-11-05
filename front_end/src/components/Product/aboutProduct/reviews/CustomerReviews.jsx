import React, { useMemo, useState } from "react";
import styled from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReviewImagePopup from "./ReviewImagePopup";

function CustomerReviews(props) {
  const [selected, setSelected] = useState({
    index: null,
    id: null,
  });

  const {
    ratings,
    t,
    i18n,
    totalReviews = 0,
    totalPages = 1,
    currentPage = 1,
    loading = false,
    setCurrentPage,
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

const handlePageChange = (page) => {
  if (
    page < 1 ||
    page > totalPages ||
    page === currentPage ||
    loading ||
    typeof setCurrentPage !== "function"
  ) {
    return;
  }

  setCurrentPage(page);
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

      

      {loading ? (
        <ReviewSkeleton />
      ) : ratings?.length > 0 ? (
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
                      {`${rate?.user?.firstName || "Customer"} ${
                        rate?.user?.lastName
                          ? `${rate.user.lastName.charAt(0)}.`
                          : ""
                      }`}
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

      {!loading && totalReviews > 0 && totalPages > 1 && (
        <Pagination aria-label={translate("pagination", "Review pages")}>
          <bdi>
          <PaginationInfo>
            {t("common.page", "Page")} {" "}
            <strong>{currentPage}</strong> {" "}
            {t("common.of", "of")} {" "}
            <strong>{totalPages}</strong>
          </PaginationInfo>
</bdi>
          <PaginationControls>
            <PaginationButton
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label={translate("previous_page", "Previous page")}
            >
              <span aria-hidden="true">{i18n?.language[0] === "ar" ? "→" : "←"}</span>
              <span>{t("common.previous", "Previous")}</span>
            </PaginationButton>

            <PageNumber aria-current="page">{currentPage}</PageNumber>

            <PaginationButton
              type="button"
              disabled={currentPage >= totalPages || loading}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label={t("next_page", "Next page")}
            >
              <span>{t("common.next", "Next")}</span>
              <span aria-hidden="true">{i18n?.language[0] === "ar" ? "←" : "→"}</span>
            </PaginationButton>
          </PaginationControls>
        </Pagination>
      )}
    </Container>
  );
}

function ReviewSkeleton() {
  return (
    <SkeletonList aria-label="Loading customer reviews" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <SkeletonReviewCard key={item}>
          <SkeletonIdentity>
            <SkeletonBlock $avatar />
            <SkeletonIdentityText>
              <SkeletonBlock $name />
              <SkeletonBlock $verified />
            </SkeletonIdentityText>
          </SkeletonIdentity>

          <SkeletonMain>
            <SkeletonMeta>
              <SkeletonStars>
                {[0, 1, 2, 3, 4].map((star) => (
                  <SkeletonBlock $star key={star} />
                ))}
              </SkeletonStars>
              <SkeletonBlock $date />
            </SkeletonMeta>

            <SkeletonTextLines>
              <SkeletonBlock />
              <SkeletonBlock $lineWidth="88%" />
              <SkeletonBlock $lineWidth="64%" />
            </SkeletonTextLines>

            {item !== 1 && (
              <SkeletonImages>
                <SkeletonBlock $thumbnail />
                <SkeletonBlock $thumbnail />
                {item === 0 && <SkeletonBlock $thumbnail />}
              </SkeletonImages>
            )}
          </SkeletonMain>
        </SkeletonReviewCard>
      ))}
    </SkeletonList>
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

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 25px 4px;
  border-bottom: 1px solid #e4ded6;
  color: #62594f;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
    padding: 22px 0;
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #62594f;

  strong {
    color: #29251f;
    font-weight: 600;
  }
`;

const PaginationCount = styled.span`
  margin-left: 8px;
  color: #9d9184;
  font-size: 11px;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #d7cec2;
  border-radius: 2px;
  background: transparent;
  color: #62594f;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #a88a62;
    background: #fcfaf7;
    color: #29251f;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 1px solid #a88a62;
    outline-offset: 3px;
  }
`;

const PageNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  box-sizing: border-box;
  border: 1px solid #a88a62;
  background: #fcfaf7;
  color: #29251f;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
`;

const SkeletonList = styled.div`
  width: 100%;
  border-top: 1px solid #e4ded6;
`;

const SkeletonReviewCard = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  column-gap: 48px;
  width: 100%;
  padding: 42px 4px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4ded6;

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

const SkeletonIdentity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;

  @media (max-width: 650px) {
    flex-direction: row;
    align-items: center;
    gap: 13px;
  }
`;

const SkeletonIdentityText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;


const SkeletonMain = styled.div`
  min-width: 0;
`;


const SkeletonMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
  @media (max-width: 500px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const SkeletonStars = styled.div`
  display: flex;
  gap: 4px;
`;

const SkeletonTextLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 23px;
`;

const SkeletonBlock = styled.div`
  position: relative;
  flex: 0 0 auto;
  overflow: hidden;
  width: ${({ $lineWidth }) => $lineWidth || "100%"};
  height: ${({ $avatar, $star, $date, $name, $verified, $thumbnail }) =>
    $avatar ? "46px" : $star ? "14px" : $date ? "10px" : $name ? "14px" : $verified ? "8px" : $thumbnail ? "76px" : "10px"};
  max-width: 100%;
  border-radius: ${({ $avatar }) => ($avatar ? "50%" : "2px")};
  border: ${({ $avatar, $thumbnail }) =>
    $avatar || $thumbnail ? "1px solid #e2d9ce" : "none"};
  box-sizing: border-box;
  background: #eee8df;

  ${({ $avatar }) =>
    $avatar &&
    `
      width: 46px;
      flex: 0 0 46px;
    `}

  ${({ $star }) =>
    $star &&
    `
      width: 14px;
      flex: 0 0 14px;
      border-radius: 2px;
    `}

  ${({ $date }) =>
    $date &&
    `
      width: 78px;
      flex: 0 0 78px;
    `}

  ${({ $name }) =>
    $name &&
    `
      width: 112px;
      flex: 0 0 112px;
    `}

  ${({ $verified }) =>
    $verified &&
    `
      width: 88px;
      flex: 0 0 88px;
    `}

  ${({ $thumbnail }) =>
    $thumbnail &&
    `
      width: 76px;
      flex: 0 0 76px;
    `}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.62) 45%,
      transparent 100%
    );
    animation: enouza-skeleton-shimmer 1.5s ease-in-out infinite;
  }

  @keyframes enouza-skeleton-shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (max-width: 500px) {
    ${({ $thumbnail }) =>
      $thumbnail &&
      `
        width: 70px;
        flex-basis: 70px;
        height: 70px;
      `}
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;
