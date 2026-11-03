
import React, { useEffect, useRef, useState, useCallback } from "react";
import AdminProducts from "./Admin_Products";
import { Stack } from "@mui/system";
import Pagination from "@mui/material/Pagination";

import ApiInstance from "../../../../common/baseUrl";
import ProductManagement from "../ProductsManagement/ProductManagement";
import AliExpressRating from "./AliExpressRating";

export default function ProductsLayout() {
  const PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSource, setProductSource] = useState("manual");

  const [isLoading, setIsLoading] = useState(false);
  const [isEditProductOn, setIsEditProductOn] = useState(false);
  const [isAddProductOn, setIsAddProductOn] = useState(false);
  const [isAddRatingOn, setIsAddRatingOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollRef = useRef(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await ApiInstance.get(
        "get_dashboard_products/",
        {
          params: {
            currentPage,
            per_page: PER_PAGE,
          },
        }
      );

      setProducts(response.data.products || []);
      setTotalProducts(response.data.total_products || 0);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Close product modal
  const close_Modal = () => {
    setIsModalOpen(false);
    setIsEditProductOn(false);
    setIsAddProductOn(false);
    setSelectedProduct(null);
    setProductSource("manual");
  };

  // Open add product with selected source
  const open_addProduct_Modal = (source = "manual") => {
    setSelectedProduct(null);
    setProductSource(source);
    setIsEditProductOn(false);
    setIsAddProductOn(true);
    setIsModalOpen(true);
  };

  // Open edit product
  const open_Edit_Modal = (product) => {
    setSelectedProduct(product);
    setProductSource("manual");
    setIsEditProductOn(true);
    setIsAddProductOn(false);
    setIsModalOpen(true);
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await ApiInstance.delete(`product/${id}/`);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      setTotalProducts((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open ratings
  const open_add_rating = (product) => {
    setSelectedProduct(product);
    setIsAddRatingOn(true);
  };

  // Close ratings
  const close_add_rating = () => {
    setIsAddRatingOn(false);
    setSelectedProduct(null);
  };

  // Pagination
  const handleChange = (event, value) => {
    setCurrentPage(value);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={scrollRef}>
      {!isModalOpen && (
        <>
          <AdminProducts
            products={products}
            deleteProduct={deleteProduct}
            open_addProduct_Modal={open_addProduct_Modal}
            open_Edit_Modal={open_Edit_Modal}
            open_add_rating={open_add_rating}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                margin: "20px 0",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  page={currentPage}
                  onChange={handleChange}
                  count={totalPages}
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <ProductManagement
          products={products}
          EditProduct={selectedProduct}
          isLoading={isLoading}
          close_Modal={close_Modal}
          isEditProductOn={isEditProductOn}
          isAddProductOn={isAddProductOn}
          productSource={productSource}
          onProductSaved={fetchProducts}
        />
      )}

      {isAddRatingOn && (
        <AliExpressRating
          isAddRatingOn={isAddRatingOn}
          product={selectedProduct}
          closeModal={close_add_rating}
        />
      )}
    </div>
  );
}
