

import React, { useEffect, useState } from "react";

import styled from "styled-components";

import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";



import { useNavigate } from "react-router-dom";

import ApiInstance from "../../../../common/baseUrl";

import ReviewImagePopup from "../aboutProduct/reviews/ReviewImagePopup";



const PAGE_SIZE = 14;



const PLACEHOLDER_IMAGE =

  "https://res.cloudinary.com/dzpzy1o1y/image/upload/v1786734712/ChatGPT_Image_Aug_14_2026_09_11_32_PM_lok4wr.png";



const CustomersFeedback = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();



  const [reviews, setReviews] = useState([]);

  const [expanded, setExpanded] = useState(false);



  const [selected, setSelected] = useState({

    id: null,

    index: null,

  });



  const [review, setReview] = useState({});

  const [loading, setLoading] = useState(true);



  /* =========================================================

     FETCH REVIEWS

  ========================================================= */



  useEffect(() => {

    let mounted = true;



    const fetchReviews = async () => {

      setLoading(true);



      try {

        const response = await ApiInstance.get("ratings/", {

          params: {

            page: 1,

            page_size: PAGE_SIZE,

          },

        });



        if (!mounted) return;



        const data = response.data;



        // Support both paginated and plain-array responses.

        const fetchedReviews = Array.isArray(data)

          ? data

          : Array.isArray(data?.results)

            ? data.results

            : [];



        setReviews(fetchedReviews);

      } catch (error) {

        if (!mounted) return;



        console.error(

          "Ratings error:",

          error.response?.data || error.message

        );



        setReviews([]);

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

  }, []);



  /* =========================================================
     SWIPER BREAKPOINTS
  ========================================================= */

  // Mobile shows one full review plus a small preview of the next one.
  const swiperBreakpoints = {
    550: { slidesPerView: 2, spaceBetween: 14 },
    800: { slidesPerView: 3, spaceBetween: 16 },
    1100: { slidesPerView: 4, spaceBetween: 20 },
  };

  /* =========================================================

     OPEN REVIEW IMAGE POPUP

  ========================================================= */



  const setRate = (item, index = 0) => {

    setReview(item);

    setSelected({

      id: item.id,

      index,

    });

    setExpanded(true);

  };



  /* =========================================================

     CLOUDINARY IMAGE OPTIMIZATION

  ========================================================= */



  const optimizeCloudinaryImage = (url, width = 700) => {

    if (!url || typeof url !== "string") {

      return PLACEHOLDER_IMAGE;

    }



    if (

      !url.includes("res.cloudinary.com") ||

      !url.includes("/image/upload/")

    ) {

      return url;

    }



    // Avoid adding Cloudinary transformations twice.

    if (/\/image\/upload\/[^/]*f_auto/.test(url)) {

      return url;

    }



    return url.replace(

      "/image/upload/",

      `/image/upload/f_auto,q_auto,w_${width}/`

    );

  };



  /* =========================================================

     RATING CALCULATIONS

  ========================================================= */



  const validRatings = reviews

    .map((item) => Number(item?.stars))

    .filter(

      (rating) =>

        Number.isFinite(rating) &&

        rating >= 1 &&

        rating <= 5

    );



  const ratingCount = validRatings.length;



  const averageRating =

    ratingCount > 0

      ? (

          validRatings.reduce((total, rating) => total + rating, 0) /

          ratingCount

        ).toFixed(1)

      : "0.0";



  const roundedRating = Math.round(Number(averageRating));



  const stars = [1, 2, 3, 4, 5];



  /* =========================================================

     RENDER

  ========================================================= */



  return (

    <Section>

      <Container>

        {/* HEADER */}



        <Header>

          <Eyebrow>

            <bdi>{t("customersFeedback.eyebrow")}</bdi>

          </Eyebrow>



          <Title>

            <bdi>{t("customersFeedback.title")}</bdi>

          </Title>



          <Description>

            <bdi>{t("customersFeedback.description")}</bdi>

          </Description>



          {!loading && reviews.length > 0 && (

            <Rating>

              <RatingNumber>{averageRating}</RatingNumber>



              <RatingContent>

                <Stars

                  aria-label={`${averageRating} out of 5 stars`}

                >

                  {stars.map((star) => (

                    <span

                      key={star}

                      className={

                        star <= roundedRating ? "active" : ""

                      }

                    >

                      ★

                    </span>

                  ))}

                </Stars>



                <RatingText>

                  {t("customersFeedback.ratingText")}

                </RatingText>

              </RatingContent>

            </Rating>

          )}

        </Header>



        {/* REVIEWS */}



        {loading ? (

          <LoadingState aria-live="polite">

            <LoadingSpinner />

            <LoadingText>

              {t("customersFeedback.loading", {

                defaultValue: "Loading reviews...",

              })}

            </LoadingText>

          </LoadingState>

        ) : reviews.length > 0 ? (

          <Reviews>

            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1.15}
              spaceBetween={12}
              breakpoints={swiperBreakpoints}
              pagination={{ clickable: true, dynamicBullets: false }}
              autoplay={reviews.length > 1 ? {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false}
              speed={500}
              loop={reviews.length > 4}
              watchOverflow
              grabCursor
              className="customer-reviews-swiper"
            >

              {reviews.map((item) => {

                const rating = Number(item?.stars) || 0;



                const reviewImages = Array.isArray(

                  item?.review?.images

                )

                  ? item.review.images.filter(

                      (image) => typeof image === "string" && image

                    )

                  : [];



                const firstImage =

                  reviewImages.length > 0

                    ? reviewImages[0]

                    : PLACEHOLDER_IMAGE;



                const firstName =

                  typeof item?.user?.firstName === "string"

                    ? item.user.firstName.trim()

                    : "";



                const lastName =

                  typeof item?.user?.lastName === "string"

                    ? item.user.lastName.trim()

                    : "";



                const customerName = firstName

                  ? `${firstName} ${lastName.slice(0, 1)}${

                      lastName ? "." : ""

                    }`

                  : "Customer";



                return (

                  <SwiperSlide key={item.id}>
                    <ReviewSlide>

                    <ReviewCard>

                      {/* IMAGE */}



                      <ImageWrapper

                        onClick={() => setRate(item, 0)}

                        role="button"

                        tabIndex={0}

                        aria-label="View customer review images"

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

                            700

                          )}

                          alt={`Customer review by ${customerName}`}

                          loading="lazy"

                          decoding="async"

                          width="700"

                          height="700"

                          onError={(event) => {

                            if (

                              event.currentTarget.src !==

                              PLACEHOLDER_IMAGE

                            ) {

                              event.currentTarget.src =

                                PLACEHOLDER_IMAGE;

                            }

                          }}

                        />



                        {reviewImages.length > 1 && (

                          <ImageCount>

                            +{reviewImages.length - 1}

                          </ImageCount>

                        )}

                      </ImageWrapper>



                      {/* CONTENT */}



                      <ReviewContent>

                        {/* RATING + VERIFIED */}



                        <RatingRow>

                          <ReviewRating

                            aria-label={`${rating} out of 5 stars`}

                          >

                            {stars.map((star) => (

                              <span

                                key={star}

                                className={`star ${

                                  star <= rating ? "active" : ""

                                }`}

                              >

                                ★

                              </span>

                            ))}



                            <RatingScore>

                              {rating}/5

                            </RatingScore>

                          </ReviewRating>



                          <Verified>

                            <Check aria-hidden="true">✓</Check>



                            <bdi>

                              {t(

                                "customersFeedback.verifiedPurchase"

                              )}

                            </bdi>

                          </Verified>

                        </RatingRow>



                        {/* REVIEW TEXT */}



                        <ReviewText>

                          {item?.review?.text || ""}

                        </ReviewText>



                        {/* CUSTOMER */}



                        <Customer>

                          <CustomerAvatar>

                            {customerName.charAt(0).toUpperCase()}

                          </CustomerAvatar>



                          <CustomerInfo>

                            <CustomerName>

                              {customerName}

                            </CustomerName>



                            <CustomerDate>

                              {item?.created_at

                                ? new Date(

                                    item.created_at

                                  ).toLocaleDateString("en-GB")

                                : ""}

                            </CustomerDate>

                          </CustomerInfo>

                        </Customer>

                      </ReviewContent>

                    </ReviewCard>

                  </ReviewSlide>
                  </SwiperSlide>

                );

              })}

            </Swiper>



            {/* REVIEW IMAGE POPUP */}



            {expanded && selected.id !== null && (

              <ReviewImagePopup

                rate={review}

                selected={selected}

                setSelected={setSelected}

              />

            )}

          </Reviews>

        ) : (

          <EmptyState>

            <EmptyTitle>

              {t("customersFeedback.noReviews")}

            </EmptyTitle>



            <EmptyDescription>

              {t("customersFeedback.noReviewsDescription")}

            </EmptyDescription>

          </EmptyState>

        )}

      </Container>



      {/* VIEW ALL REVIEWS */}



      <ViewAllButton onClick={() => navigate("/reviews")}>

        {t("customersFeedback.viewAllReviews")}

        <Arrow aria-hidden="true">→</Arrow>

      </ViewAllButton>

    </Section>

  );

};



export default CustomersFeedback;



/* =========================================================

   SECTION

\========================================================= */



const Section = styled.section`

  width: 100%;

  padding: 90px 20px 100px;

  background: #faf9f7;

  box-sizing: border-box;



  @media (max-width: 550px) {

    padding: 70px 16px 80px;

  }

`;



/* =========================================================

   CONTAINER

\========================================================= */



const Container = styled.div`

  width: 100%;

  max-width: 1280px;

  margin: 0 auto;

  box-sizing: border-box;

`;



/* =========================================================

   HEADER

\========================================================= */



const Header = styled.div`

  width: 100%;

  max-width: 700px;

  margin: 0 auto 65px;

  text-align: center;



  @media (max-width: 550px) {

    margin-bottom: 50px;

  }

`;



const Eyebrow = styled.span`

  display: block;

  margin-bottom: 18px;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 2.5px;

  text-transform: uppercase;

  color: #777;

`;



const Title = styled.h2`

  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(36px, 3vw, 50px);

  font-weight: 400;

  line-height: 1.1;

  letter-spacing: -0.5px;

  color: #1d1d1b;

`;



const Description = styled.p`

  max-width: 560px;

  margin: 24px auto 32px;

  font-size: 16px;

  line-height: 1.7;

  color: #666;



  @media (max-width: 550px) {

    margin-top: 20px;

    font-size: 14px;

  }

`;



/* =========================================================

   AVERAGE RATING

\========================================================= */



const Rating = styled.div`

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

`;



const RatingNumber = styled.strong`

  font-family: Georgia, "Times New Roman", serif;

  font-size: 32px;

  font-weight: 400;

  line-height: 1;

  color: #1d1d1b;

`;



const RatingContent = styled.div`

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 6px;

`;



const Stars = styled.div`

  display: flex;

  gap: 3px;

  font-size: 15px;

  line-height: 1;



  span {

    color: #d8d5ce;

  }



  span.active {

    color: #38745B;





  }

`;



const RatingText = styled.span`

  font-size: 12px;

  color: #777;

`;



/* =========================================================

   REVIEWS SLIDER

\========================================================= */



const Reviews = styled.div`
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  .customer-reviews-swiper {
    width: 100%;
    padding: 10px 0 40px;
    overflow: hidden;
  }

  .swiper-wrapper {
    align-items: stretch;
  }

  .swiper-slide {
    height: auto;
    display: flex;
    box-sizing: border-box;
  }

  .swiper-slide > div {
    width: 100%;
    height: 100%;
  }

  .swiper-pagination {
    bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .swiper-pagination-bullet {
    width: 7px;
    height: 7px;
    margin: 0 !important;
    background: #1d1d1b;
    opacity: 0.22;
    transition: opacity 0.25s ease, background 0.25s ease, width 0.25s ease;
  }

  .swiper-pagination-bullet-active {
    width: 18px;
    border-radius: 10px;
    background: #38745b;
    opacity: 1;
  }

  @media (max-width: 550px) {
    .customer-reviews-swiper {
      padding: 5px 0 40px;
    }
  }
`;


/* =========================================================

   SLIDE

\========================================================= */



const ReviewSlide = styled.div`

  width: 100%;

  height: 100%;

  box-sizing: border-box;

`;



/* =========================================================

   REVIEW CARD

\========================================================= */



const ReviewCard = styled.article`

  position: relative;

  width: 100%;

  height: 600px;

  overflow: hidden;

  display: flex;

  flex-direction: column;

  background: #fff;

  border: 1px solid #e5e3df;

  box-sizing: border-box;



  transition:

    transform 0.3s ease,

    box-shadow 0.3s ease,

    border-color 0.3s ease;



  &:hover {

    transform: translateY(-3px);

    border-color: #dedbd5;

    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);

  }



  @media (max-width: 550px) {

    height: 590px;

  }

`;



/* =========================================================

   IMAGE

\========================================================= */



const ImageWrapper = styled.div`

  position: relative;

  width: 100%;

  height: 350px;

  flex-shrink: 0;

  overflow: hidden;

  background: #f4f2ed;

  cursor: pointer;



  &:focus-visible {

    outline: 2px solid #c9a35c;

    outline-offset: -3px;

  }

`;



const ReviewImage = styled.img`

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

  cursor: pointer;

  transition: transform 0.5s ease;



  ${ReviewCard}:hover & {

    transform: scale(1.02);

  }

`;



const ImageCount = styled.span`

  position: absolute;

  right: 14px;

  bottom: 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  min-width: 32px;

  height: 28px;

  padding: 0 8px;

  background: rgba(255, 255, 255, 0.94);

  color: #1d1d1b;

  font-size: 11px;

  font-weight: 600;

  backdrop-filter: blur(8px);

`;



/* =========================================================

   REVIEW CONTENT

\========================================================= */



const ReviewContent = styled.div`

  flex: 1;

  min-height: 0;

  padding: 28px 28px 24px;

  display: flex;

  flex-direction: column;

  background: #fff;

  box-sizing: border-box;



  @media (max-width: 550px) {

    padding: 24px 22px 22px;

  }

`;



/* =========================================================

   RATING ROW

\========================================================= */



const RatingRow = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  width: 100%;

  gap: 12px;

`;



const ReviewRating = styled.div`

  display: flex;

  align-items: center;

  gap: 2px;

  font-size: 16px;

  line-height: 1;

  white-space: nowrap;

  flex-shrink: 0;



  .star {

    color: #d8d5ce;

  }



  .star.active {

    color: #38745B;

  }

`;



const RatingScore = styled.span`

  margin-left: 5px;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0;

  color: #555;

`;



/* =========================================================

   VERIFIED PURCHASE

\========================================================= */



const Verified = styled.span`

  display: flex;

  align-items: center;

  gap: 7px;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.8px;

  color: #777;

  white-space: nowrap;

`;



const Check = styled.span`

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 14px;

  height: 14px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #e9e5dc;

  color: #6f654e;

  font-size: 10px;

`;



/* =========================================================

   REVIEW TEXT

\========================================================= */



const ReviewText = styled.p`

  margin: 22px 0 18px;

  font-family: Arial, sans-serif;

  font-size: 14px;

  line-height: 1.75;

  color: #303030;



  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;

  overflow: hidden;

  text-overflow: ellipsis;

`;



/* =========================================================

   CUSTOMER

\========================================================= */



const Customer = styled.div`

  margin-top: auto;

  padding-top: 18px;

  border-top: 1px solid #e7e5e1;

  display: flex;

  align-items: center;

  gap: 14px;

`;



const CustomerAvatar = styled.div`

  width: 42px;

  height: 42px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #1d1d1b;

  color: #fff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 14px;

  font-weight: 600;

  text-transform: uppercase;

`;



const CustomerInfo = styled.div`

  display: flex;

  flex-direction: column;

  gap: 4px;

  min-width: 0;

`;



const CustomerName = styled.span`

  display: block;

  font-size: 14px;

  font-weight: 600;

  color: #171717;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
  text-transform: capitalize;

`;



const CustomerDate = styled.span`

  display: block;

  font-size: 11px;

  color: #999;

`;



/* =========================================================

   LOADING

\========================================================= */



const LoadingState = styled.div`

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 16px;

`;



const LoadingSpinner = styled.div`

  width: 30px;

  height: 30px;

  border: 2px solid #e5e0d5;

  border-top-color: #c9a35c;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;



  @keyframes spin {

    to {

      transform: rotate(360deg);

    }

  }



  @media (prefers-reduced-motion: reduce) {

    animation-duration: 2s;

  }

`;



const LoadingText = styled.p`

  margin: 0;

  font-size: 13px;

  color: #777;

`;



/* =========================================================

   EMPTY STATE

\========================================================= */



const EmptyState = styled.div`

  min-height: 250px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 40px 20px;

  text-align: center;

  border: 1px solid #eceae5;

  background: #fff;

`;



const EmptyTitle = styled.h3`

  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 26px;

  font-weight: 400;

  color: #1d1d1b;

`;



const EmptyDescription = styled.p`

  max-width: 420px;

  margin: 12px 0 0;

  color: #888;

  font-size: 13px;

  line-height: 1.7;

`;



/* =========================================================

   VIEW ALL REVIEWS

\========================================================= */



const ViewAllButton = styled.button`

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  margin: 55px auto 0;

  padding: 14px 28px;

  border: 1px solid #1d1d1b;

  background: transparent;

  color: #1d1d1b;

  font-size: 12px;

  font-weight: 500;

  letter-spacing: 1px;

  text-transform: uppercase;

  cursor: pointer;



  transition:

    background 0.3s ease,

    color 0.3s ease,

    transform 0.3s ease;



  &:hover {

    background: #1d1d1b;

    color: #fff;

    transform: translateY(-2px);

  }



  &:active {

    transform: translateY(0);

  }



  &:focus-visible {

    outline: 2px solid #c9a35c;

    outline-offset: 4px;

  }



  @media (max-width: 550px) {

    margin-top: 45px;

    padding: 13px 24px;

    font-size: 11px;

  }

`;



const Arrow = styled.span`

  display: inline-block;

  font-size: 16px;

  line-height: 1;

  transition: transform 0.3s ease;



  ${ViewAllButton}:hover & {

    transform: translateX(4px);

  }

`;
