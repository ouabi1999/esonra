import React, { useEffect, useState, useRef } from 'react'
import CustomerReviews from './CustomerReviews'
import Feedback from './FeedBack'
import { useSelector } from 'react-redux'
import ApiInstance from '../../../../../common/baseUrl'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Ratings from './Ratings'

function ReviewsLayout() {
  const productData = useSelector(state => state.product.productData)
  const user = useSelector(state => state.auth.user)
  const [comment, setComment] = useState({ images: [], text: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [newRatings, setNewRatings] = useState(null)
  const [required, setRequired] = useState(false)
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1)

  const reviewsTopRef = useRef(null);

  const PAGE_SIZE = 6;
  const { t, i18n } = useTranslation()

  const [preveiwImages, setPreviewImages] = useState([])

  const [star_rating, set_star_rating] = useState(1);
  const [ratings, setRatings] = useState([])

const fiveStars = productData?.five_star_count ?? 0;
const fourStars = productData?.four_star_count ?? 0;
const threeStars = productData?.three_star_count ?? 0;
const twoStars = productData?.two_star_count ?? 0;
const oneStar = productData?.one_star_count ?? 0;

let sum_stars = Number(productData?.average_rating).toFixed(1) || 0


  const handelRatingSubmit = (event) => {

    if (comment.text !== "") {


      event.preventDefault()
      setIsLoading(true)
      ApiInstance.post("ratings/",

        {
          product: productData.id,
          user: {
            "id": user.id,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "country": user.country,
            "countryCode": user.countryCode
          },
          stars: star_rating,
          review: comment,

        })
        .then((response) => {
          setNewRatings(response.data)
          setIsLoading(false)
          setComment({ text: "", images: [] })
          setPreviewImages
          set_star_rating(1)
          setRequired(false)
        })
        .catch(message => {
          console.log(message)
          setIsLoading(false)
          setRequired(false)
        })
    }
    else {
      setRequired(true)
    }
  }


  useEffect(() => {
    if (!productData?.id) {
      setRatings([]);
      setTotalReviews(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchReviews = async () => {
      setLoading(true);

      try {
        const { data } = await ApiInstance.get("product_ratings", {
          params: {
            product_id: productData.id,
            page: currentPage,
            page_size: PAGE_SIZE,
          },
        });

        if (!mounted) return;

        const results = Array.isArray(data?.results) ? data.results : [];
        const count = Number(data?.count ?? 0);

        setRatings(results);
        setTotalReviews(count);
        setTotalPages(
          Number(data?.total_pages) || Math.max(1, Math.ceil(count / PAGE_SIZE))
        );
      } catch (error) {
        if (!mounted) return;

        console.error("Failed to fetch product reviews:", error.response?.data || error);

        setRatings([]);
        setTotalReviews(0);
        setTotalPages(1);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReviews();

    return () => {
      mounted = false;
    };
  }, [productData?.id, currentPage]);

  const previousPageRef = useRef(currentPage);

  useEffect(() => {
    if (previousPageRef.current !== currentPage) {
      previousPageRef.current = currentPage;
      reviewsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

  }, [currentPage]);

  useEffect(() => {
    if (previousPageRef.current !== currentPage) {
      previousPageRef.current = currentPage;
      reviewsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  return (
    <Container>
      <div ref= {reviewsTopRef}>
      <Ratings fiveStars={fiveStars}
        twoStars={twoStars}
        fourStars={fourStars}
        threeStars={threeStars}
        oneStar={oneStar}
        productData={productData}
        sum_stars={sum_stars}
        ratings={ratings}
        newRatings={newRatings}
        t={t}
        i18n={i18n} />
        </div>


        <CustomerReviews
          fiveStars={fiveStars}
          twoStars={twoStars}
          fourStars={fourStars}
          threeStars={threeStars}
          oneStar={oneStar}
          productData={productData}
          sum_stars={sum_stars}
          ratings={ratings}
          newRatings={newRatings}
          totalReviews={totalReviews}
          totalPages={totalPages}
          currentPage={currentPage}
          loading={loading}
          setCurrentPage={setCurrentPage}
          t={t}
          i18n={i18n}
        />
      {user?.is_staff && (
        <Feedback
          comment={comment}
          setComment={setComment}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          newRatings={newRatings}
          setNewRatings={setNewRatings}
          required={required}
          star_rating={star_rating}
          set_star_rating={set_star_rating}
          handelRatingSubmit={handelRatingSubmit}
          preveiwImages={preveiwImages}
          setPreviewImages={setPreviewImages}
          t={t}
          i18n={i18n}
        />

      )}
    </Container>

  )
}

export default ReviewsLayout
const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 32px 64px;
  box-sizing: border-box;
  color: #29251f;

  @media (max-width: 768px) {
    padding: 52px 20px 60px;
  }

  @media (max-width: 480px) {
    padding: 42px 16px 50px;
  }
`