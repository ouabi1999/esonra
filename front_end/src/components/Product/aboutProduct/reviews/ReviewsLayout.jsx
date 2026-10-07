import React, { useEffect, useState } from 'react'
import CustomerReviews from './CustomerReviews'
import Feedback from './FeedBack'
import { useSelector } from 'react-redux'
import ApiInstance from '../../../../../common/baseUrl'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Ratings from './Ratings'

function ReviewsLayout() {
  const productData = useSelector(state => state.product.productData)
  const user = useSelector(state=> state.auth.user)
  useEffect(()=>{
   console.log(user)
  },[])
  const [comment, setComment] = useState({ images:[], text:""})
  const [isLoading, setIsLoading] = useState(false)
  const [newRatings, setNewRatings ] = useState(null)
  const [required,  setRequired] = useState(false)
  const [selected, setSelected] = useState({
    isDescription:true,
    isReviews : false
  })
  const {t, i18n} = useTranslation()

  const [preveiwImages, setPreviewImages] = useState([])

  const [star_rating, set_star_rating] = useState(1);

  let ratings = productData?.ratings;

    const fiveStars = ratings?.length > 0 ? ratings?.filter(item => item.stars === 5).reduce((total, value) => {
      return total += value.stars
    }, 0) : ""
    const twoStars = ratings?.length > 0 ? ratings?.filter(item => item.stars === 2).reduce((total, value) => {
      return total += value.stars
    }, 0) : ""
    const fourStars = ratings?.length > 0 ? ratings?.filter(item => item.stars === 4).reduce((total, value) => {
      return total += value.stars
    }, 0) : ""
    const threeStars = ratings?.length > 0 ? ratings?.filter(item => item.stars === 3).reduce((total, value) => {
      return total += value.stars
    }, 0) : ""
    const oneStar = ratings?.length > 0 ? ratings?.filter(item => item.stars === 1).reduce((total, value) => {
      return total += value.stars
    }, 0) : ""

    let sum_stars = ratings?.length > 0 ? ratings?.reduce((total, value) => {
         return total += value.stars
      }, 0):""


      const handelRatingSubmit = (event) => {
        
        if(comment.text !== ""){
  
        
        event.preventDefault()
        setIsLoading(true)
        ApiInstance.post("ratings/", 
            
            {
                product: productData.id,
                user: {
                      "id":user.id,
                     "firstName": user.firstName, 
                     "lastName": user.lastName,
                      "country": user.country,
                      "countryCode": user.countryCode
                },
                stars: star_rating,
                review: comment,
  
            })
          .then( (response) => {
            setNewRatings(response.data)
            setIsLoading(false)
            setComment({text:"", images:[]})
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
      else{
        setRequired(true)
      }
    }
  
    
  return (
    <Container>
      <Ratings fiveStars={fiveStars}
             twoStars={twoStars}
             fourStars={fourStars}
             threeStars={threeStars}
             oneStar={oneStar}
             productData={productData}
             sum_stars={sum_stars}
             ratings= {ratings}
             newRatings = {newRatings}
             t = {t}
             i18n = {i18n}/>
        <CustomerReviews 
             fiveStars={fiveStars}
             twoStars={twoStars}
             fourStars={fourStars}
             threeStars={threeStars}
             oneStar={oneStar}
             productData={productData}
             sum_stars={sum_stars}
             ratings= {ratings}
             newRatings = {newRatings}
             t = {t}
             i18n = {i18n}
        />
        {user?.is_staff && (
          <Feedback
              comment = {comment}
              setComment = {setComment}
              isLoading = {isLoading}  
              setIsLoading= {setIsLoading}
              newRatings = {newRatings} 
              setNewRatings ={ setNewRatings}
              required = {required}
              star_rating = {star_rating}
              set_star_rating = {set_star_rating}
              handelRatingSubmit = {handelRatingSubmit}
             preveiwImages={ preveiwImages}
             setPreviewImages = {setPreviewImages}
             t = {t}
             i18n = {i18n}
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