import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import ApiInstance from "../../common/baseUrl";
import AdvertiseMain from "../components/Advertise/AdvertiseMain.jsx";
import { useTranslation } from "react-i18next";
import HeroSection from "../components/Product/home/HeroSection.jsx";
import DesignSection from "../components/Product/home/DesignSection.jsx";
import CTASection from "../components/Product/home/CTASection.jsx";
import MatricsSection from "../components/Product/home/MatricsSection.jsx";
import CustomersFeedback from "../components/Product/home/CustomersFeedbak.jsx";
import SEO from "../components/SEO/SEO.jsx";
import CollectionSection from "../components/Product/home/CollectionSection.jsx";

const NewArrival = lazy(() =>
  import("../components/newArrival/NewArrival.jsx")
);

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bestSellersProducts, setBestSellersProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [isNewArrivalLoading, setIsNewArrivalLoading] = useState(true);

  const { t, i18n } = useTranslation();

  const get_new_arrivals = async () => {
    try {
      const response = await ApiInstance.get("product-search/", {
        params: {
          sort: "newest",
          per_page: 5,
        },
      });

      const products = response.data?.results || [];

      setNewArrivalProducts(products);
    } catch (error) {
      console.error("Failed to get new arrivals:", error);
    } finally {
      setIsNewArrivalLoading(false);
    }
  };

  const get_best_sellers_products = async () => {
    setIsLoading(true);

    try {
      const response = await ApiInstance.get("product-search/", {
        params: {
          sort: "orders",
          per_page: 8,
        },
      });

      setBestSellersProducts(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get_best_sellers_products();
    get_new_arrivals();
  }, []);

  return (
    <Container>
      <SEO
        title="Home"
        description="Discover Enouza's curated collection of luxury lamps and premium home lighting, designed to bring warmth, elegance, and character to every space."
        canonical="/"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Enouza",
          url: "https://www.enouza.com/",
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Enouza",
          url: "https://www.enouza.com/",
          logo: "https://www.enouza.com/assestLogo.png",
        })}
      </script>

      <AdvertiseMain />

      <HeroSection />

      <SectionPlaceholder>
        <Suspense fallback={null}>
          <NewArrival
            products={bestSellersProducts}
            name="best_sellers"
            label="bestSellers"
            isAuto={false}
            isLoading={isLoading}
          />
        </Suspense>
      </SectionPlaceholder>

      <CollectionSection />

      <DesignSection />

      <MatricsSection />

      <SectionPlaceholder>
        <Suspense fallback={null}>
          <NewArrival
            products={newArrivalProducts}
            name="newArrival"
            label="new"
            isAuto={false}
            isLoading={isNewArrivalLoading}
          />
        </Suspense>
      </SectionPlaceholder>

      <CustomersFeedback />

      <CTASection />
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  width: 100%;
  margin: auto;
  min-height: 80vh;

  .product-header {
    display: flex;
    justify-content: center;
    border-bottom: 2px solid rgb(194, 193, 193);
    margin: 15px 5px;
    margin-top: 15px;
    background-color: white;
  }

  .product-header strong {
    padding: 15px;
    font-size: 1.8rem;
    font-weight: 500;
    font-family: "Playfair Display", serif;
  }

  .veiw-more {
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }

  .veiw-more > button {
    color: black;
    text-decoration: none;
    font-family: Arial, sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(26, 25, 25, 0.8);
    background: none;
    transition: 0.25s ease;

    &:hover {
      color: #ab9161;
      border-color: #ab9161;
    }
  }
`;

const SectionPlaceholder = styled.div`
  width: 100%;
  min-height: 520px;

  @media (max-width: 768px) {
    min-height: 500px;
  }
`;