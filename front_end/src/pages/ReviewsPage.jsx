import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {  useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

import ApiInstance from "../../common/baseUrl";
import { optimizeCloudinaryImage } from "../utilis/cloudinary";
import ReviewImagePopup from "../components/Product/aboutProduct/reviews/ReviewImagePopup";
const ReviewsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({});
  const [selected, setSelected] = useState({
    id: null,
    index: null,
  });

  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = Number(searchParams.get("page")) || 1;

  const PAGE_SIZE = 12;


  /* =========================================================
     FETCH REVIEWS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      setLoading(true);

      try {
        const response = await ApiInstance.get(
          `ratings/?page=${currentPage}&page_size=${PAGE_SIZE}`
        );

        if (!mounted) return;

        /*
          Django REST Framework pagination returns:

          {
            count: 35,
            next: "...",
            previous: null,
            results: [...]
          }
        */

        const data = response.data;
        

        const results = Array.isArray(data?.results) ? data.results : [];
        const count = Number(data?.count || 0);
        setReviews(results);
        setTotalReviews(count);
        setTotalPages(
          Number(data?.total_pages) || Math.max(1, Math.ceil(count / PAGE_SIZE))
        );
        
      } catch (error) {
        console.error("Ratings error:", error);

        if (!mounted) return;

        setReviews([]);
        setTotalReviews(0);
        setTotalPages(1);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      mounted = false;
    };
  }, [currentPage]);
   /* =========================
       RESET SCROLL
    ========================= */
  
    useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, [currentPage]);
    

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const changePage = (_, page) => {
    if (page === currentPage) {
      return;
    }

    setSearchParams({
      page: page.toString(),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     IMAGE POPUP
  ========================================================= */

  const setRate = (item, index) => {
    setReview(item);

    setSelected({
      id: item?.id,
      index,
    });
  };


  /* =========================================================
     SKELETON
  ========================================================= */

  const SkeletonCard = () => {
    return (
      <ReviewCard>
        <SkeletonImage />

        <ReviewContent>
          <SkeletonStars>
            <SkeletonStar />
            <SkeletonStar />
            <SkeletonStar />
            <SkeletonStar />
            <SkeletonStar />
          </SkeletonStars>

          <SkeletonText large />
          <SkeletonText />
          <SkeletonText />

          <SkeletonBottom>
            <SkeletonAvatar />

            <div>
              <SkeletonSmall />
              <SkeletonSmall short />
            </div>
          </SkeletonBottom>
        </ReviewContent>
      </ReviewCard>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Page>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header>
        <Title>
           <bdi>
            {t("customersFeedback.description")}
          </bdi>
        </Title>


        {!loading && totalReviews > 0 && (
          <RatingSummary>
            <RatingStars>
              ★★★★★
            </RatingStars>

            <ReviewCount>
              {totalReviews}{" "}
              {totalReviews === 1
                ? t("customersFeedback.review")
                : t("customersFeedback.reviews")}
            </ReviewCount>

            <RatingText>
              <bdi>
                {t("customersFeedback.ratingText")}
              </bdi>
            </RatingText>
          </RatingSummary>
        )}
      </Header>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <ReviewsSection>
        {loading ? (
          <ReviewsGrid>
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </ReviewsGrid>
        ) : reviews.length > 0 ? (
          <ReviewsGrid>
            {reviews.map((item) => {
              const images = Array.isArray(
                item?.review?.images
              )
                ? item.review.images
                : [];

              const firstImage =
                images.length > 0
                  ? images[0]
                  : null;

              const customerName =
                `${item?.user?.firstName || ""} ${
                  item?.user?.lastName?.slice(0, 1) || ""
                }`.trim() || "Customer";

              const isExpanded = expandedReviewId === item.id;
              const reviewText = item?.review?.text || "";

              return (
                <ReviewCard key={item.id}>
                  {/* =================================================
                      REVIEW IMAGE
                  ================================================= */}

                  {firstImage ? (
                    <ReviewImageWrapper
                      onClick={() =>
                        setRate(item, 0)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          setRate(item, 0);
                        }
                      }}
                    >
                      <ReviewImage
                        src={optimizeCloudinaryImage(
                          firstImage,
                          900
                        )}
                        alt={`Review by ${customerName}`}
                        loading="lazy"
                      />

                      {images.length > 1 && (
                        <ImageCount>
                          +{images.length - 1}
                        </ImageCount>
                      )}
                    </ReviewImageWrapper>
                  ) : (
                    <NoImage>
                      <img
                         src={optimizeCloudinaryImage(
                            "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1794077392/review-placeholder-optimized_rl4cxc.webp",
                            700
                          )}/>
                    </NoImage>
                  )}

                  {/* =================================================
                      REVIEW CONTENT
                  ================================================= */}

                  <ReviewContent>
                    <TopRow>
                      <Stars
                        aria-label={`${item?.stars || 0} out of 5 stars`}
                      >
                        {"★★★★★".split("").map(
                          (_, index) => (
                            <Star
                              key={index}
                              active={
                                index <
                                Number(item?.stars || 0)
                              }
                            >
                              ★
                            </Star>
                          )
                        )}
                      </Stars>

                      <Verified>
                        <VerifiedDot />

                        <bdi>
                          {t(
                            "customersFeedback.verifiedPurchase"
                          )}
                        </bdi>
                      </Verified>
                    </TopRow>

                    <ReviewText $expanded={isExpanded}>
                      {reviewText}
                    </ReviewText>

                    {reviewText.length > 220 && (
                      <ReadMore
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedReviewId((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </ReadMore>
                    )}

                    <Customer>
                      <Avatar>
                        {customerName
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>

                      <CustomerInfo>
                        <bdi>
                        <CustomerName>
                          {customerName}.
                        </CustomerName>
                         </bdi>
                        <CustomerDate>
                          {item?.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : ""}
                        </CustomerDate>
                      </CustomerInfo>
                    </Customer>
                  </ReviewContent>
                </ReviewCard>
              );
            })}
          </ReviewsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>✦</EmptyIcon>

            <EmptyTitle>
              <bdi>
                {t(
                  "customersFeedback.noReviews"
                )}
              </bdi>
            </EmptyTitle>

            <EmptyText>
              <bdi>
                {t(
                  "customersFeedback.noReviewsDescription"
                )}
              </bdi>
            </EmptyText>
          </EmptyState>
        )}

        {/* =====================================================
            MATERIAL UI PAGINATION
        ===================================================== */}
{!loading && reviews.length > 0 && totalPages > 1 && (
  <PaginationWrapper>
    <Pagination
      count={totalPages}
      page={Math.min(currentPage, totalPages)}
      onChange={changePage}
      color="standard"
      shape="rounded"
      siblingCount={1}
      boundaryCount={1}
      aria-label={t("customersFeedback.pagination")}
    />
  </PaginationWrapper>
)}
      </ReviewsSection>

      {/* =====================================================
          REVIEW IMAGE POPUP
      ===================================================== */}

      {selected.id !== null && (
        <ReviewImagePopup
          rate={review}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </Page>
  );
};

/* =============================================================
   PAGE
============================================================= */

const Page = styled.main`
  min-height: 100vh;
  background: #faf9f6;
  padding: 50px 6vw 100px;

  @media (max-width: 768px) {
    padding: 35px 20px 70px;
  }
`;

/* =============================================================
   HEADER
============================================================= */

const Header = styled.header`
  max-width: 900px;
  margin: 0 auto 70px;
  text-align: center;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: 0;
  background: transparent;
  padding: 0;

  font-family: inherit;
  font-size: 13px;
  letter-spacing: 0.03em;

  color: #555;

  cursor: pointer;

  margin-bottom: 55px;

  transition: color 0.25s ease;

  &:hover {
    color: #111;
  }
`;


const Title = styled.h1`
  margin-bottom: 18px;

  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(36px, 3vw, 50px);
  font-weight: 400;
  line-height: 1.08;

  color: #1d1d1b;
`;



const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  gap: 12px;

  margin-top: 30px;
`;

const RatingStars = styled.span`
  font-size: 14px;
  letter-spacing: 2px;
  color: #38745b;
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: #333;
`;

const RatingText = styled.span`
  font-size: 12px;
  color: #888;
`;

/* =============================================================
   REVIEWS SECTION
============================================================= */

const ReviewsSection = styled.section`
  max-width: 1600px;
  margin: 0 auto;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
`;

/* =============================================================
   REVIEW CARD
============================================================= */

const ReviewCard = styled.article`
  min-width: 0;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eae7df;
  border-radius: 12px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #ded7c8;
    box-shadow: 0 12px 32px rgba(35, 32, 24, 0.08);
  }

  @media (max-width: 520px) {
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover { transform: none; }
  }
`;

/* =============================================================
   REVIEW IMAGE
============================================================= */

const ReviewImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f5f3ee;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #38745b;
    outline-offset: -3px;
  }
`;

const ReviewImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${ReviewImageWrapper}:hover & {
    transform: scale(1.04);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${ReviewImageWrapper}:hover & { transform: none; }
  }
`;

const ImageCount = styled.span`
  position: absolute;

  right: 14px;
  bottom: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 34px;
  height: 28px;

  padding: 0 8px;

  background: rgba(255, 255, 255, 0.94);

  color: #1d1d1b;

  font-size: 11px;
  font-weight: 600;

  backdrop-filter: blur(8px);
`;

const NoImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f2f0eb, #e9e6df);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;



/* =============================================================
   REVIEW CONTENT
============================================================= */

const ReviewContent = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 18px;

  @media (max-width: 520px) {
    padding: 18px 18px 16px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
`;

const Stars = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 2px;
`;

const Star = styled.span`
  font-size: 14px;
  line-height: 1;
  color: ${({ active }) => (active ? "#38745b" : "#e5e0d8")};
`;

const Verified = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #68786c;
`;

const VerifiedDot = styled.span`
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #38745b;
`;

const ReviewText = styled.p`
  margin: 0;
  color: #45443f;
  font-size: 13px;
  line-height: 1.75;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ $expanded }) =>
    !$expanded && `-webkit-line-clamp: 5;`}
`;

const ReadMore = styled.button`
  align-self: flex-start;
  margin-top: 8px;
  padding: 2px 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  color: #38745b;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:focus-visible {
    outline: 2px solid #38745b;
    outline-offset: 3px;
  }
`;

const Customer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #efede8;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #1d1d1b;

  color: #fff;

  font-size: 12px;
  font-weight: 600;
`;

const CustomerInfo = styled.div`
  min-width: 0;
`;

const CustomerName = styled.div`
  overflow: hidden;

  color: #1d1d1b;

  font-size: 12px;
  font-weight: 600;

  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
`;

const CustomerDate = styled.div`
  margin-top: 3px;

  color: #999;

  font-size: 10px;
`;

/* =============================================================
   EMPTY STATE
============================================================= */

const EmptyState = styled.div`
  min-height: 380px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 50px 20px;

  border: 1px solid #eceae5;

  background: #fff;
`;

const EmptyIcon = styled.div`
  margin-bottom: 20px;

  font-size: 28px;

  color: #aaa;
`;

const EmptyTitle = styled.h2`
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 28px;
  font-weight: 400;

  color: #1d1d1b;
`;

const EmptyText = styled.p`
  max-width: 420px;

  margin: 12px 0 0;

  color: #888;

  font-size: 13px;
  line-height: 1.7;
`;

/* =============================================================
   MATERIAL UI PAGINATION
============================================================= */

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 70px;

  .MuiPagination-root {
    direction: ltr;
  }

  .MuiPaginationItem-root {
    min-width: 38px;
    height: 38px;

    border-radius: 0;

    color: #555;

    font-family: inherit;
    font-size: 12px;

    transition:
      background 0.25s ease,
      color 0.25s ease;
  }

  .MuiPaginationItem-root:hover {
    background: #1d1d1b;
    color: #fff;
  }

  .MuiPaginationItem-root.Mui-selected {
    background: #1d1d1b;
    color: #fff;
  }

  .MuiPaginationItem-root.Mui-selected:hover {
    background: #1d1d1b;
  }

  @media (max-width: 500px) {
    .MuiPaginationItem-root {
      min-width: 34px;
      height: 34px;
    }
  }
`;

/* =============================================================
   SKELETON
============================================================= */

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;

  background: linear-gradient(
    90deg,
    #eeeae3 25%,
    #f7f5f0 50%,
    #eeeae3 75%
  );

  background-size: 200% 100%;

  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonStars = styled.div`
  display: flex;

  gap: 4px;

  margin-bottom: 15px;
`;

const SkeletonStar = styled.div`
  width: 13px;
  height: 13px;

  border-radius: 2px;

  background: #e9e6df;

  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 1;
    }
  }
`;

const SkeletonText = styled.div`
  width: ${({ large }) =>
    large ? "85%" : "70%"};

  height: 10px;

  margin-bottom: 10px;

  border-radius: 3px;

  background: #eeeae3;

  animation: pulseText 1.5s ease-in-out infinite;

  @keyframes pulseText {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 1;
    }
  }
`;

const SkeletonBottom = styled.div`
  display: flex;
  align-items: center;

  gap: 11px;

  margin-top: auto;
  padding-top: 18px;

  border-top: 1px solid #efede8;
`;

const SkeletonAvatar = styled.div`
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #eeeae3;

  animation: pulseAvatar 1.5s ease-in-out infinite;

  @keyframes pulseAvatar {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 1;
    }
  }
`;

const SkeletonSmall = styled.div`
  width: ${({ short }) =>
    short ? "60px" : "100px"};

  height: 7px;

  margin-bottom: 6px;

  border-radius: 3px;

  background: #eeeae3;

  animation: pulseSmall 1.5s ease-in-out infinite;

  @keyframes pulseSmall {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 1;
    }
  }
`;

export default ReviewsPage;