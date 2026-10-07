import React from "react";
import styled, { keyframes } from "styled-components";

const ProductDetailsSkeleton = () => {
  return (
    <Wrapper>
      <Container>

        {/* =========================================
            LEFT — PRODUCT IMAGES
        ========================================= */}

        <Gallery>

          <ThumbnailColumn>
            <Thumbnail />
            <Thumbnail />
            <Thumbnail />
            <Thumbnail />
            <Thumbnail />
            <Thumbnail />
          </ThumbnailColumn>

          <MainImage>
            <ImageCounter>
              <CounterNumber />
              <CounterLine />
              <CounterNumber />
            </ImageCounter>
          </MainImage>

        </Gallery>


        {/* =========================================
            RIGHT — PRODUCT INFORMATION
        ========================================= */}

        <Info>

          {/* Category */}
          <Category>
            <Skeleton width="105px" height="11px" />
          </Category>


          {/* Product title */}
          <Title>
            <Skeleton width="94%" height="31px" />
            <Skeleton width="68%" height="31px" />
          </Title>


          {/* Rating */}
          <Rating>
            <Stars>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </Stars>

            <RatingValue />
            <ReviewText />
          </Rating>


          <Divider />


          {/* Price */}
          <PriceRow>
            <Skeleton width="118px" height="34px" />
            <Skeleton width="78px" height="14px" />
            <DiscountSkeleton />
          </PriceRow>


          {/* Secure purchase */}
          <SecurePurchase>
            <SecureIcon />
            <Skeleton width="190px" height="11px" />
          </SecurePurchase>


          <Divider />


          {/* =====================================
              LAMPSHADE COLOR
          ===================================== */}

          <VariantSection>

            <VariantTitle>
              <Skeleton width="128px" height="12px" />
              <Skeleton width="45px" height="11px" />
            </VariantTitle>

            <VariantOptions>
              <VariantImage/>
              <VariantImage />
              <VariantImage />
              <VariantImage />
            </VariantOptions>

          </VariantSection>


          {/* =====================================
              VOLTAGE / PLUG
          ===================================== */}

          <VoltageSection>

            <VoltageTitle>
              <Skeleton width="145px" height="12px" />
              <Skeleton width="80px" height="11px" />
            </VoltageTitle>

            <VoltageButton>
              <Skeleton width="75px" height="10px" />
            </VoltageButton>

          </VoltageSection>


          {/* =====================================
              PURCHASE INFORMATION
          ===================================== */}

          <PurchaseHeading>
            <Skeleton width="160px" height="12px" />
            <PurchaseLine />
          </PurchaseHeading>

        </Info>

      </Container>
    </Wrapper>
  );
};

export default ProductDetailsSkeleton;


/* =====================================================
   SHIMMER
===================================================== */

const shimmer = keyframes`
  0% {
    background-position: -600px 0;
  }

  100% {
    background-position: 600px 0;
  }
`;


/* =====================================================
   BASE
===================================================== */

const Skeleton = styled.div`
  position: relative;
  overflow: hidden;

  width: ${({ width }) => width};
  height: ${({ height }) => height};

  flex-shrink: 0;

  background: linear-gradient(
    90deg,
    #e8e3da 0%,
    #f3f0e9 50%,
    #e8e3da 100%
  );

  background-size: 1200px 100%;

  animation: ${shimmer} 1.8s ease-in-out infinite;

  border-radius: 2px;
`;


/* =====================================================
   WRAPPER
===================================================== */

const Wrapper = styled.section`
  width: 100%;

  background: #f6f4ef;
`;


/* =====================================================
   MAIN CONTAINER
===================================================== */

const Container = styled.div`
  width: calc(100% - 120px);
  max-width: 1580px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.7fr)
    minmax(430px, 1fr);

  gap: 58px;

  padding: 24px 0 50px;

  box-sizing: border-box;


  /* ==========================================
     1250px
  ========================================== */

  @media (max-width: 1250px) {
    width: calc(100% - 70px);

    grid-template-columns:
      minmax(0, 1.6fr)
      minmax(380px, 1fr);

    gap: 40px;
  }


  /* ==========================================
     TABLET
  ========================================== */

  @media (max-width: 1050px) {
    width: calc(100% - 40px);

    grid-template-columns: 1fr;

    gap: 40px;
  }


  /* ==========================================
     MOBILE
  ========================================== */

  @media (max-width: 600px) {
    width: calc(100% - 24px);

    display: flex;

    flex-direction: column;

    gap: 25px;

    padding: 15px 0 40px;
  }
`;


/* =====================================================
   GALLERY
===================================================== */

const Gallery = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: 68px minmax(0, 1fr);

  gap: 18px;

  align-items: start;


  @media (max-width: 1250px) {
    grid-template-columns: 60px minmax(0, 1fr);

    gap: 15px;
  }


  @media (max-width: 600px) {
    display: flex;

    flex-direction: column;

    gap: 10px;
  }
`;


/* =====================================================
   THUMBNAILS
===================================================== */

const ThumbnailColumn = styled.div`
  display: flex;

  flex-direction: column;

  gap: 11px;

  width: 100%;


  @media (max-width: 600px) {
    order: 2;

    flex-direction: row;

    width: 100%;

    overflow: hidden;

    gap: 8px;
  }
`;

const Thumbnail = styled(Skeleton)`
  width: 100%;

  height: auto;

  aspect-ratio: 1 / 1;

  border-radius: 0;

  border: ${({ $active }) =>
    $active
      ? "1px solid #8f8169"
      : "1px solid transparent"};


  @media (max-width: 600px) {
    width: 62px;

    min-width: 62px;

    height: 62px;
  }
`;


/* =====================================================
   MAIN IMAGE
===================================================== */

const MainImage = styled(Skeleton)`
  position: relative;

  width: 100%;

  aspect-ratio: 1 / 1;

  min-height: 520px;

  border-radius: 0;


  @media (max-width: 1250px) {
    min-height: 450px;
  }


  @media (max-width: 1050px) {
    min-height: 0;
  }


  @media (max-width: 600px) {
    order: 1;

    width: 100%;

    min-height: 0;

    aspect-ratio: 1 / 1;
  }
`;


/* =====================================================
   IMAGE COUNTER
===================================================== */

const ImageCounter = styled.div`
  position: absolute;

  top: 20px;
  left: 22px;

  display: flex;

  align-items: center;

  gap: 8px;
`;

const CounterNumber = styled(Skeleton)`
  width: 12px;
  height: 8px;
`;

const CounterLine = styled(Skeleton)`
  width: 38px;
  height: 2px;
`;


/* =====================================================
   PRODUCT INFO
===================================================== */

const Info = styled.div`
  width: 100%;

  min-width: 0;

  padding-top: 7px;
`;


/* =====================================================
   CATEGORY
===================================================== */

const Category = styled.div`
  margin-bottom: 19px;
`;


/* =====================================================
   TITLE
===================================================== */

const Title = styled.div`
  display: flex;

  flex-direction: column;

  gap: 9px;

  margin-bottom: 19px;
`;


/* =====================================================
   RATING
===================================================== */

const Rating = styled.div`
  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 27px;
`;

const Stars = styled.div`
  display: flex;

  gap: 4px;
`;

const Star = styled(Skeleton)`
  width: 13px;
  height: 13px;

  border-radius: 50%;
`;

const RatingValue = styled(Skeleton)`
  width: 27px;
  height: 11px;
`;

const ReviewText = styled(Skeleton)`
  width: 125px;
  height: 11px;
`;


/* =====================================================
   DIVIDER
===================================================== */

const Divider = styled.div`
  width: 100%;

  height: 1px;

  background: #e2ddd5;

  margin-bottom: 27px;
`;


/* =====================================================
   PRICE
===================================================== */

const PriceRow = styled.div`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 14px;

  margin-bottom: 20px;
`;

const DiscountSkeleton = styled(Skeleton)`
  width: 75px;
  height: 25px;
`;


/* =====================================================
   SECURE PURCHASE
===================================================== */

const SecurePurchase = styled.div`
  display: flex;

  align-items: center;

  gap: 9px;

  margin-bottom: 27px;
`;

const SecureIcon = styled(Skeleton)`
  width: 15px;
  height: 15px;

  border-radius: 50%;
`;


/* =====================================================
   VARIANTS
===================================================== */

const VariantSection = styled.div`
  margin-bottom: 34px;
`;

const VariantTitle = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 17px;
`;

const VariantOptions = styled.div`
  display: flex;

  gap: 14px;

  flex-wrap: wrap;
`;

const VariantImage = styled(Skeleton)`
  width: 78px;
  height: 78px;

  border-radius: 0;

  border: ${({ $active }) =>
    $active
      ? "2px solid #9b8b6d"
      : "1px solid #ded9d1"};


  @media (max-width: 600px) {
    width: 68px;
    height: 68px;
  }
`;


/* =====================================================
   VOLTAGE
===================================================== */

const VoltageSection = styled.div`
  margin-bottom: 35px;
`;

const VoltageTitle = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 15px;
`;

const VoltageButton = styled.div`
  width: 110px;
  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #e8e3da;

  overflow: hidden;

  border-radius: 2px;

  & > div {
    background: linear-gradient(
      90deg,
      #e8e3da 0%,
      #f3f0e9 50%,
      #e8e3da 100%
    );

    background-size: 1200px 100%;
  }
`;


/* =====================================================
   PURCHASE INFORMATION
===================================================== */

const PurchaseHeading = styled.div`
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 3px;
`;

const PurchaseLine = styled(Skeleton)`
  flex: 1;

  height: 1px;
`;