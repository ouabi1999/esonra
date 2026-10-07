import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO/SEO";
import ProductLayout from "../components/Product/ProductLayout";
import AboutProductLayout from "../components/Product/aboutProduct/AboutProductLayout";
import PopUpShoppingMethod from "../components/Product/productDetails/PopUpShoppingMethod";

import { addToCart, buyNowItem, setIsCartOpen } from "../features/cartSlice";
import { getProductDetails, setProductDetails } from "../features/productDetails_slice";

import "react-toastify/dist/ReactToastify.css";
import PageNoteFound from "../../common/PageNoteFound";
import NewArrival from "../components/newArrival/NewArrival";
import ApiInstance from "../../common/baseUrl";
import ProductDetailsSkeleton from "../components/Services/skeletons/ProductDetailsSkeleton";
import SlideOutShoppingCart from "../components/Cart/SlideOutShoppingCart";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState(1);
  const [currentSku, setCurrentSku] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([])
  const [maxOrderWorning, setMaxOrderWorning] = useState(false);

  const [isPopUpShippingOpen, setIsPopUpShippingOpen] =
    useState(false);

  const [shippingMethodIndex, setShippingMethodIndex] = useState(0);
  const isOpen = useSelector(state => state.cart.isOpen)
  const dispatch = useDispatch()

  /* =========================
     SHIPPING DEFAULTS
  ========================= */

  const today = new Date();

  const defaultDate1 = new Date(today);
  const defaultDate2 = new Date(today);

  defaultDate1.setDate(defaultDate1.getDate() + 5);
  defaultDate2.setDate(defaultDate2.getDate() + 7);
  const [tryAgain, setTryAgain] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    date1: defaultDate1.toDateString(),
    date2: defaultDate2.toDateString(),
    from: 5,
    to: 7,
    cost: 0,
    methodName: t("purchaseOptions.free_Shipping"),
  });


  ///the product details
  const productData = useSelector(
    (state) => state.product.productData
  );
  /* =========================
     REDUX
  ========================= */

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );


  const hasError = useSelector(
    (state) => state.product.hasError
  );
  const isNotFound = useSelector(
    (state) => state.product.isNotFound
  );
  const isLoading = useSelector(
    (state) => state.product.isLoading
  );

  /* =========================
     LOAD PRODUCT
  ========================= */
  const mainSku = productData?.skuInfo?.[0];
  const price = Number(mainSku?.sellingPrice || 0);


  const viewedProductRef = useRef(null);

  useEffect(() => {
    if (!productData?.id) return;

    if (viewedProductRef.current === productData.id) return;



    if (typeof window.gtag !== "function") return;

    window.gtag("event", "view_item", {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: productData?.product_id || productData.id,
          item_name: productData?.name?.en || "Luxury Lamp",
          price: price,
          quantity: 1,
        },
      ],
    });

    viewedProductRef.current = productData.id;
  }, [productData]);
  
useEffect(() => {
  if (!slug) return;

  dispatch(getProductDetails(slug));

  return () => {
    dispatch(setProductDetails(null));
  };
}, [dispatch, slug, tryAgain]);

  /* =========================
     RESET SCROLL
  ========================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);


  // filter by similar products
  const get_similar_products = async (category) => {
    try {
      const response = await ApiInstance.get("product-search/", {
        params: {
          category : category || "table lamps",
          per_page: 6,
        },
      });

      const products = response.data?.results || [];
       if (products.length > 1){
         setSimilarProducts(
           products.filter(
             (product) => product.id !== productData?.id
           )
         );
      
       }else{
         setSimilarProducts( products)

       }
    } catch (error) {
      console.error("Failed to get similar products:", error);
    }
  };

  useEffect(() => {
    if (!productData?.category) return;

    get_similar_products(productData.category);
  }, [productData?.category]);
  /* =========================
     QUANTITY
  ========================= */

  const addQuantity = () => {
    const stock = Number(
      currentSku?.available_stock || 0
    );

    if (quantity < stock && quantity < 5) {
      setQuantity((prev) => prev + 1);
      setMaxOrderWorning(false);
      return;
    }

    setMaxOrderWorning(true);
  };

  const subtractQuantity = () => {
    if (quantity <= 1) return;

    setQuantity((prev) => prev - 1);
    setMaxOrderWorning(false);
  };

  /* =========================
     SHIPPING
  ========================= */

  const checkboxChange = (item, index) => {
    const from = Number(item?.from || 5);
    const to = Number(item?.to || 7);

    const start = new Date();

    const deliveryFrom = new Date(start);
    const deliveryTo = new Date(start);

    deliveryFrom.setDate(
      deliveryFrom.getDate() + from
    );

    deliveryTo.setDate(
      deliveryTo.getDate() + to
    );

    setShippingInfo({
      date1: deliveryFrom.toDateString(),
      date2: deliveryTo.toDateString(),
      from,
      to,
      cost: Number(item?.cost || 0),
      methodName:
        item?.methodName ||
        t("purchaseOptions.free_Shipping"),
    });

    setShippingMethodIndex(index);
    setIsPopUpShippingOpen(false);
  };

  /* =========================
     ADD TO CART
  ========================= */

  const add_item_to_cart = (
    selectedSku,
    productId,
    shipping,
    name
  ) => {
    if (!selectedSku) return;
        dispatch(setIsCartOpen(!isOpen))

    const alreadyExists = cartItems?.some(
      (item) =>
        item?.selectedSku?.sku_attr ===
        selectedSku?.sku_attr
    );

    if (alreadyExists) {
     

      return;
    }

    const price = Number(
      selectedSku.sellingPrice
    );
    // GA4 — Add to Cart
    if (typeof window.gtag === "function") {
      window.gtag("event", "add_to_cart", {
        currency: "USD",
        value: price * quantity,
        items: [
          {
            item_id: productData?.product_id || productId,
            item_name: productData?.name?.en || name,
            price: price,
            quantity: quantity,
          },
        ],
      });
    }

    dispatch(
      addToCart({
        id: productId,
        selectedSku,
        name,
        available_shipping: shipping,
        quantity,
        price,
        subtotal: price * quantity,
      })
    );
  };

  /* =========================
     BUY NOW
  ========================= */

  const buy_Now_item = (
    selectedSku,
    productId,
    shipping,
    name
  ) => {
    if (!selectedSku) return;

    const price = Number(
      selectedSku.sellingPrice
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", "begin_checkout", {
        currency: "USD",
        value: price * quantity,
        items:[{
          item_id: productId || item?.id,
          item_name: name?.en || "Luxury Lamp",
          price: price || 0,
          quantity: quantity || 1,
      }],
      });
    }
    dispatch(
      buyNowItem({
        id: productId,
        selectedSku,
        name,
        available_shipping: shipping,
        quantity,
        price,
        subtotal: price * quantity,
      })
    );

    navigate("/checkout");
  };

  /* =========================
    PAGE STATES
 ========================= */
const onClose = ()=>{
      dispatch(setIsCartOpen(!isOpen))

}
 

  if (isNotFound) {
    return <PageNoteFound />
  }

  if (hasError) {
    return (
      <ErrorPage>
        <ErrorCard>
          <ErrorTitle>
            {t("common.error")}
          </ErrorTitle>

          <RetryButton
            onClick={() => setTryAgain(!tryAgain)}
          >
            {t("common.tryAgain")}
          </RetryButton>
        </ErrorCard>
      </ErrorPage>
    );
  }

  /* =========================
     SUCCESS
  ========================= */

  return (
    <Page>
      {isLoading ? (
        <ProductDetailsSkeleton/>
      ) : (
        <>
        <SlideOutShoppingCart isOpen={isOpen} onClose={onClose}/>
      <SEO
        title={productData?.name?.en || "Luxury Lamp"}
        description={productData?.description?.en}
        canonical={`/product/${slug}`}
        image={productData?.multimediaInfo?.main_image}
        productData={productData}
      />
     

      <ProductSection>
        <ProductLayout
          quantity={quantity}
          shippingInfo={shippingInfo}
          checkboxChange={checkboxChange}
          currentSku={currentSku}
          setCurrentSku={setCurrentSku}
          setShippingInfo={setShippingInfo}
          addQuantity={addQuantity}
          subtractQuantity={subtractQuantity}
          maxOrderWorning={maxOrderWorning}
          setMaxOrderWorning={setMaxOrderWorning}
          add_item_to_cart={add_item_to_cart}
          buy_Now_item={buy_Now_item}
          setIsPopUpShoppingOpen={
            setIsPopUpShippingOpen
          }
          isPopUpShippingOpen={
            isPopUpShippingOpen
          }
          shippingMethodIndex={
            shippingMethodIndex
          }
        />
      </ProductSection>

      <AboutSection>
        <AboutProductLayout />
      </AboutSection>

      {isPopUpShippingOpen && (
        <PopUpShoppingMethod
          setIsPopUpShippingOpen={
            setIsPopUpShippingOpen
          }
          isPopUpShippingOpen={
            isPopUpShippingOpen
          }
          checkboxChange={checkboxChange}
          shippingMethodIndex={
            shippingMethodIndex
          }
          shippingInfo={shippingInfo}
        />
      )}
        <NewArrival products={similarProducts} name="mayAlsoLike" isAuto={false} />
      </>
      )}
     
      
    </Page>

  );
}

export default ProductDetailsPage;

/* =====================================================
   PAGE
===================================================== */

const Page = styled.main`
  width: 100%;
  min-height: 100vh;

  background:#F6F3ED;


  overflow-x: clip;
`;

/* =====================================================
   SERVICES
===================================================== */

const ServicesSection = styled.section`
  width: 100%;

  position: relative;
`;

/* =====================================================
   PRODUCT
===================================================== */

const ProductSection = styled.section`
  width: 100%;
  min-height: 600px;
  box-sizing: border-box;
`;

/* =====================================================
   ABOUT
===================================================== */

const AboutSection = styled.section`
  width: min(100% - 48px, 1640px);

  margin: 30px auto 0;

  @media (max-width: 1100px) {
    width: min(100% - 32px, 900px);
  }

  @media (max-width: 600px) {
    width: calc(100% - 24px);

    margin-top: 15px;
  }
`;

/* =====================================================
   LOADING
===================================================== */

const Loading = styled.div`
  width: 100%;

  min-height: 70vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;


/* =====================================================
   ERROR
===================================================== */

const ErrorPage = styled.div`
  width: 100%;
  min-height: 70vh;

  display: flex;
  align-items: center;
  justify-content: center;

`;

const ErrorCard = styled.div`
  width: min(100%, 280px);

  padding: 45px 30px;

  text-align: center;

  border: 1px solid #e8e2d9;

  background: #faf9f7;
`;

const ErrorTitle = styled.div`
  margin-bottom: 20px;

  font-size: 15px;
  letter-spacing: 0.08em;

  text-transform: uppercase;

  color: #555;
`;

const RetryButton = styled.button`
  border: 1px solid #1c1c1c;

  background: #1c1c1c;

  color: #ffffff;

  padding: 12px 25px;

  font-family: inherit;
  font-size: 13px;

  letter-spacing: 0.04em;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease;

  &:hover {
    background: transparent;
    color: #1c1c1c;
  }
`;