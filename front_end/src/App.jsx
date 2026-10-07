import React, {
  useEffect,
  useState,
  Suspense,
  createContext,
} from "react";

import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import BuyerTrustServices from "./components/Services/BuyerTrustServices";
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";

import "./App.css";

import HomePage from "./pages/HomePage.jsx";

import { getUser } from "./features/authSlice";

import { useTranslation } from "react-i18next";



import "../public/i18n/index.jsx";
import { fetchExchangeRates } from "./features/currencySlice.js";


/*
=========================================================
LAZY LOADED PAGES
=========================================================

These pages are NOT needed when the user first visits
the homepage.

They will only be downloaded when the user navigates
to the corresponding route.

This reduces the initial JavaScript bundle.
=========================================================
*/

/* =========================
   CUSTOMER PAGES
========================= */

const Auth = React.lazy(() =>
  import("./pages/Auth")
);
const ProductDetailsPage  = React.lazy(() =>
  import("./pages/ProductDetailsPage")
);


const ShoppingCart = React.lazy(() =>
  import("./components/Cart/ShoppingCart")
);

const UserProfile = React.lazy(() =>
  import("./pages/UserProfile")
);
const ReviewsPage = React.lazy(()=> 
  import("./pages/ReviewsPage.jsx")
);
const UserInfo = React.lazy(() =>
  import("./components/user_Dashboard/profile/UserInfo")
);

const MyOrders = React.lazy(() =>
  import("./components/user_Dashboard/MyOrders")
);

const Notifications = React.lazy(() =>
  import("./components/user_Dashboard/Notifications")
);

const CheckoutPage = React.lazy(() =>
  import("./pages/CheckoutPage")
);

const OrderSuccess = React.lazy(() =>
  import("./components/checkout/OrderSuccsess")
);

const ResetPassword = React.lazy(() =>
  import("./components/auth/ResetPassword")
);


/* =========================
   INFORMATION PAGES
========================= */

const AboutUs = React.lazy(() =>
  import("./pages/aboutUs")
);

const ContactUs = React.lazy(() =>
  import("./pages/ContactUs")
);

const FAQ = React.lazy(() =>
  import("./components/user_Dashboard/Help-center/FAQ")
);

const PrivacyPolicy = React.lazy(() =>
  import("./components/polices/PrivacyPolicy")
);

const RefundPolicy = React.lazy(() =>
  import("./components/polices/RefundPolicy")
);

const TermsOfServices = React.lazy(() =>
  import("./components/polices/TermsOfServices")
);

const ShippingPolicy = React.lazy(() =>
  import("./components/polices/ShippingPolicy")
);

const FillterPage = React.lazy(() =>
  import("./pages/FillterPage")
);


/* =========================
   ADMIN PAGES
=========================

Admin code is particularly important
to split because normal customers never
need this JavaScript.
========================= */

const AdminDashboardPage = React.lazy(() =>
  import("./pages/AdminDashboardPage")
);

const HomeDashboard = React.lazy(() =>
  import("./components/adminDashboard/HomeDashboard")
);

const ProductsLayout = React.lazy(() =>
  import("./components/adminDashboard/Products/Products_Layout")
);

const Chart = React.lazy(() =>
  import("./components/adminDashboard/Chart")
);

const Orders = React.lazy(() =>
  import("./components/adminDashboard/Orders")
);

const Displaylayout = React.lazy(() =>
  import("./components/adminDashboard/display/DisplayLyout")
);

const Customers = React.lazy(() =>
  import("./components/adminDashboard/Customers")
);

const Email = React.lazy(() =>
  import("./components/adminDashboard/Email")
);

const AliExpressProductFetcher = React.lazy(() =>
  import(
    "./components/adminDashboard/AliDropship/AliExpressProductFetcher.jsx"
  )
);

const InsperationPage = React.lazy(() =>
  import(
    "./pages/InspirationPage.jsx"
  )
);


/* =========================
   404
========================= */

const PageNoteFound = React.lazy(() =>
  import("../common/PageNoteFound")
);


/* =========================================================
   ORDER CONTEXT
========================================================= */

export const OrderContext = createContext();


/* =========================================================
   APP
========================================================= */

function App() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const [retry, setRetry] = useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [formData, setFormData] = useState({
    logistics_address: {
      firstName: "",
      lastName: "",
      userId: "",
      email: "",
      phoneNumber: "",
      city: "",
      address2: "",
      zip: "",
      state: "",
      country: "",
      address1: "",
    },

    shippingMethod: null,

    shippingPrice: 0.0,

    deliveryTime: "",

    totalPrice: "",

    currency: "usd",

    ordered_products: cartItems,
  });

  const { i18n } = useTranslation();


  /*
  =========================================================
  INITIAL DATA
  =========================================================

  Keep this behavior unchanged.

  Product/display data is required by the homepage,
  so we still fetch it when the application starts.
  =========================================================
  */

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchExchangeRates());

  }, [retry, dispatch]);


  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <AppContainer
      style={{
        direction: i18n.dir(),
      }}
    >

      <Suspense fallback={null}>

        <OrderContext.Provider
          value={{
            formData,
            setFormData,
          }}
        >

          <BrowserRouter>

            <Routes>

              {/* =================================================
                  MAIN WEBSITE
              ================================================= */}

              <Route
                path="/"
                element={
                  <>
                    <NavBar
                      outlet={<Outlet />}
                      setSearchValue={
                        setSearchValue
                      }
                      value={searchValue}
                    />

                    <Footer />
                  </>
                }
              >

                {/* =========================
                    HOME
                ========================= */}

                <Route
                  index
                  element={
                    <>
                      <HomePage />

                      <BuyerTrustServices />
                    </>
                  }
                />


                {/* =========================
                    PRODUCT
                ========================= */}

                <Route
                  path="product/:slug"
                  element={
                    <ProductDetailsPage />
                  }
                />


                {/* =========================
                    COLLECTIONS
                ========================= */}

                <Route
                  path="collections"
                  element={
                    <FillterPage
                      value={searchValue}
                    />
                  }
                />


                {/* =========================
                    SHOPPING CART
                ========================= */}

                <Route
                  path="shopping-cart"
                  element={
                    <ShoppingCart />
                  }
                />
  <Route path="/reviews" element={<ReviewsPage />} />

                {/* =========================
                    INFORMATION
                ========================= */}

                <Route
                  path="contact-us"
                  element={
                    <ContactUs />
                  }
                />

                <Route
                  path="about-us"
                  element={
                    <AboutUs />
                  }
                />

                <Route
                  path="privacy-policy"
                  element={
                    <PrivacyPolicy />
                  }
                />

                <Route
                  path="terms-of-services"
                  element={
                    <TermsOfServices />
                  }
                />

                <Route
                  path="return-policy"
                  element={
                    <RefundPolicy />
                  }
                />

                <Route
                  path="shipping-policy"
                  element={
                    <ShippingPolicy />
                  }
                />

                <Route
                  path="faq"
                  element={
                    <FAQ />
                  }
                />

              </Route>


              {/* =================================================
                  AUTH
              ================================================= */}

              <Route
                path="/auth"
                element={
                  <Auth />
                }
              />


              {/* =================================================
                  RESET PASSWORD
              ================================================= */}

              <Route
                path="reset-password/:id/:token"
                element={
                  <ResetPassword />
                }
              />

             
             {/* <Route 
                 path="inspiration"
                 element={<InsperationPage/>}/>

                 */}
              {/* =================================================
                  USER PROFILE
              ================================================= */}

              <Route
                path="/profile"
                element={
                  <UserProfile />
                }
              >

                <Route
                  index
                  element={
                    <UserInfo />
                  }
                />

                <Route
                  path="my-orders"
                  element={
                    <MyOrders />
                  }
                />

                <Route
                  path="notifications"
                  element={
                    <Notifications />
                  }
                />

                <Route
                  path="faq"
                  element={
                    <FAQ />
                  }
                />

                <Route
                  path="contact-us"
                  element={
                    <ContactUs />
                  }
                />

              </Route>


              {/* =================================================
                  CHECKOUT
              ================================================= */}

              <Route
                path="/checkout"
                element={
                  <CheckoutPage />
                }
              />


              {/* =================================================
                  ORDER SUCCESS
              ================================================= */}

              <Route
                path="/order-success"
                element={
                  <OrderSuccess />
                }
              />


              {/* =================================================
                  ADMIN DASHBOARD
              ================================================= */}

              <Route
                path="/admin-dashboard"
                element={
                  <AdminDashboardPage />
                }
              >

                <Route
                  index
                  element={
                    <HomeDashboard />
                  }
                />

                <Route
                  path="dashproducts"
                  element={
                    <ProductsLayout />
                  }
                />

                <Route
                  path="analytics"
                  element={
                    <Chart />
                  }
                />

                <Route
                  path="display-setting"
                  element={
                    <Displaylayout />
                  }
                />

                <Route
                  path="dashboard-orders"
                  element={
                    <Orders />
                  }
                />

                <Route
                  path="emails"
                  element={
                    <Email />
                  }
                />

                <Route
                  path="customers"
                  element={
                    <Customers />
                  }
                />

                <Route
                  path="aliexpress-product-fetcher"
                  element={
                    <AliExpressProductFetcher />
                  }
                />

              </Route>


              {/* =================================================
                  404
              ================================================= */}

              <Route
                path="*"
                element={
                  <PageNoteFound />
                }
              />

            </Routes>

          </BrowserRouter>

        </OrderContext.Provider>

      </Suspense>

    </AppContainer>
  );
}

export default App;


/* =========================================================
   APP CONTAINER
========================================================= */

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

