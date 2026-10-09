
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";

import ApiInstance from "../../common/baseUrl";
import CollectionProducts from "../components/Product/home/CollectionProducts";
import { setSort } from "../features/filterSlice";
import SEO from "../components/SEO/SEO";
import { colors } from "../utilis/colors";

const pageReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const productsReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FilterPageStyled() {
  const [productsList, setProductsList] = useState([]);
  const [count, setCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const sort = useSelector((state) => state.filter.sort);
  const categories = useSelector((state) => state.filter.categories);
  const search = useSelector((state) => state.filter.search);

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [count]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    ApiInstance.get("product-search/", {
      params: {
        search: search || "",
        category: categories?.join(",") || "",
        sort: sort || "best_match",
        page: count,
        per_page: 12,
      },
    })
      .then((response) => {
        if (!isMounted) return;

        setProductsList(response.data.results || []);
        setTotalPages(response.data.total_pages || 0);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error(error);
        setProductsList([]);
        setTotalPages(0);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, categories, sort, count]);

  useEffect(() => {
    setCount(1);
  }, [search, categories, sort]);

  const getPriceArrow = () => {
    if (sort === "price_asc") return "↑";
    if (sort === "price_desc") return "↓";
    return "↕";
  };

  return (
    <Page dir={i18n.dir()}>
      <SEO
        title="A considered collection of smart tracking | Ensora"
        description="Thoughtfully designed tracking essentials that combine refined design, everyday functionality, and peace of mind."
        canonical="/collections"
      />

      <CollectionHeader
        as={motion.header}
        variants={pageReveal}
        initial="hidden"
        animate="visible"
      >
        <Eyebrow>{t("filterPage.collection")}</Eyebrow>
        <CollectionTitle>{t("filterPage.discover")}</CollectionTitle>
        <HeaderLine />
        <CollectionDescription>
          {t("filterPage.collection_description")}
        </CollectionDescription>
      </CollectionHeader>

      <ControlsSection
        as={motion.section}
        variants={pageReveal}
        initial="hidden"
        animate="visible"
      >
        <ControlsInner>
          <SortWrapper>
            <SortLabel>{t("common.sortBy")}</SortLabel>

            <SortBarContainer>
              <SortButton
                $active={sort === "best_match"}
                onClick={() => dispatch(setSort("best_match"))}
              >
                {t("common.bestMatch")}
              </SortButton>

              <SortButton
                $active={sort === "orders"}
                onClick={() => dispatch(setSort("orders"))}
              >
                {t("common.orders")}
              </SortButton>

              <SortButton
                $active={sort === "price_asc" || sort === "price_desc"}
                onClick={() =>
                  dispatch(
                    setSort(
                      sort === "price_asc" ? "price_desc" : "price_asc"
                    )
                  )
                }
              >
                {t("common.price")}
                <SortArrow
                  $direction={
                    sort === "price_asc"
                      ? "price_asc"
                      : sort === "price_desc"
                        ? "price_desc"
                        : "idle"
                  }
                >
                  {getPriceArrow()}
                </SortArrow>
              </SortButton>
            </SortBarContainer>
          </SortWrapper>
        </ControlsInner>
      </ControlsSection>

      <ProductsSection>
        {isLoading ? (
          <SkeletonGrid>
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index}>
                <Skeleton
                  variant="rectangular"
                  className="skeleton-image"
                />
                <SkeletonInfo>
                  <Skeleton variant="text" width="72%" height={22} />
                  <Skeleton variant="text" width="25%" height={18} />
                  <Skeleton variant="text" width="42%" height={26} />
                </SkeletonInfo>
              </SkeletonCard>
            ))}
          </SkeletonGrid>
        ) : productsList.length > 0 ? (
          <ProductGridWrapper
            as={motion.div}
            variants={productsReveal}
            initial="hidden"
            animate="visible"
          >
            <CollectionProducts
              columsNumber={4}
              products={productsList}
              placeItems="center"
            />
          </ProductGridWrapper>
        ) : (
          <EmptyState>
            <EmptyLogo>ENSORA</EmptyLogo>
            <EmptyTitle>
              {t("filterPage.search_did_not_match")}
            </EmptyTitle>
            <EmptyLine />
          </EmptyState>
        )}
      </ProductsSection>

      {totalPages > 1 && (
        <PaginationWrapper>
          <Pagination
            count={totalPages}
            page={count}
            onChange={(_, value) => setCount(value)}
            shape="rounded"
            hidePrevButton
            hideNextButton
          />
        </PaginationWrapper>
      )}
    </Page>
  );
}

const Page = styled.main`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px 90px;
  box-sizing: border-box;
  color: ${colors.text};
  background: ${colors.background};

  @media (max-width: 1100px) {
    padding: 0 28px 70px;
  }

  @media (max-width: 700px) {
    padding: 0 16px 60px;
  }

  @media (max-width: 480px) {
    padding: 0 12px 50px;
  }
`;

const CollectionHeader = styled.header`
  width: 100%;
  padding: 88px 20px 58px;
  box-sizing: border-box;
  text-align: center;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: 700px) {
    padding: 62px 12px 42px;
  }

  @media (max-width: 480px) {
    padding: 52px 8px 36px;
  }
`;

const Eyebrow = styled.span`
  display: block;
  margin-bottom: 18px;
  color: ${colors.accent};
  font-family: Arial, sans-serif;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 0.56rem;
    letter-spacing: 0.25em;
  }
`;

const CollectionTitle = styled.h1`
  margin: 0;
  color: ${colors.primary};
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 2.65rem;
  }

  @media (max-width: 400px) {
    font-size: 2.35rem;
  }
`;

const HeaderLine = styled.div`
  width: 46px;
  height: 1px;
  margin: 26px auto 0;
  background: ${colors.accent};
`;

const CollectionDescription = styled.p`
  width: min(100%, 590px);
  margin: 22px auto 0;
  color: ${colors.textSecondary};
  font-family: Arial, sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  line-height: 1.8;
  letter-spacing: 0.015em;

  @media (max-width: 600px) {
    font-size: 0.72rem;
    line-height: 1.75;
  }
`;

const ControlsSection = styled.section`
  width: 100%;
  padding: 24px 0;
  border-bottom: 1px solid ${colors.border};
`;

const ControlsInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

const SortWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  color: ${colors.textSecondary};
  font-family: Arial, sans-serif;

  @media (max-width: 480px) {
    gap: 8px;
    justify-content: center;
  }
`;

const SortLabel = styled.span`
  flex-shrink: 0;
  color: ${colors.textSecondary};
  font-size: 0.59rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const SortBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid ${colors.border};
  border-radius: 30px;
  background: ${colors.surface};
  box-shadow: 0 2px 12px rgba(7, 27, 27, 0.04);
  backdrop-filter: blur(8px);

  @media (max-width: 480px) {
    max-width: calc(100vw - 90px);
    overflow-x: auto;
    justify-content: flex-start;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 28px;
  padding: 7px 14px;
  border: none;
  border-radius: 30px;
  background: ${({ $active }) =>
    $active ? colors.primary : "transparent"};
  color: ${({ $active }) =>
    $active ? colors.surface : colors.textSecondary};
  font-family: Arial, sans-serif;
  font-size: 0.6rem;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  letter-spacing: 0.035em;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: ${({ $active }) =>
      $active ? colors.surface : colors.primary};
    background: ${({ $active }) =>
      $active ? colors.primary : colors.background};
  }

  @media (max-width: 480px) {
    padding: 7px 11px;
    font-size: 0.57rem;
  }
`;

const SortArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  font-size: 10px;
  transition: transform 0.25s ease;
  transform: ${({ $direction }) =>
    $direction === "desc" ? "rotate(180deg)" : "rotate(0deg)"};
`;

const ProductsSection = styled.section`
  width: 100%;
  padding-top: 42px;

  @media (max-width: 700px) {
    padding-top: 28px;
  }
`;

const ProductGridWrapper = styled.div`
  width: 100%;
`;

const SkeletonGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 10px;
  }
`;

const SkeletonCard = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${colors.background};

  .skeleton-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: ${colors.border};
    border-radius: 0;
  }
`;

const SkeletonInfo = styled.div`
  padding: 12px 4px 0;

  .MuiSkeleton-root {
    background: ${colors.border};
  }
`;

const EmptyState = styled.div`
  width: 100%;
  min-height: 430px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${colors.background};
`;

const EmptyLogo = styled.span`
  margin-bottom: 18px;
  color: ${colors.accent};
  font-family: Arial, sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.4em;
`;

const EmptyTitle = styled.p`
  max-width: 420px;
  margin: 0;
  color: ${colors.primary};
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.7;

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0 20px;
  }
`;

const EmptyLine = styled.div`
  width: 36px;
  height: 1px;
  margin-top: 24px;
  background: ${colors.accent};
`;

const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 62px;
  padding-top: 30px;
  border-top: 1px solid ${colors.border};
  direction: ltr;

  .MuiPagination-ul {
    gap: 4px;
  }

  .MuiPaginationItem-root {
    min-width: 32px;
    height: 32px;
    margin: 0;
    border-radius: 2px;
    color: ${colors.textSecondary};
    font-family: Arial, sans-serif;
    font-size: 0.68rem;
    font-weight: 400;
    background: transparent;
    border: none;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      color: ${colors.primary};
      background: ${colors.background};
    }
  }

  .MuiPaginationItem-root.Mui-selected {
    color: ${colors.surface};
    background: ${colors.primary};

    &:hover {
      background: ${colors.secondary};
    }
  }

  .MuiPaginationItem-root.Mui-disabled {
    opacity: 0;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    margin-top: 42px;
    padding-top: 22px;

    .MuiPaginationItem-root {
      min-width: 29px;
      height: 29px;
      font-size: 0.61rem;
    }
  }
`;
