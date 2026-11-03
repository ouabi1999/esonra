import React, { useState } from "react";
import styled from "styled-components";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function AdminProducts(props) {
  const {
    isLoading,
    products = [],
    open_add_rating,
    open_addProduct_Modal,
    deleteProduct,
    open_Edit_Modal,
    openModal,
  } = props;

  const [showSourceModal, setShowSourceModal] = useState(false);

  const handleAddProduct = (source) => {
    setShowSourceModal(false);

    // Pass the selected source to your existing product modal handler.
    // Expected values: "aliexpress", "cod_network", "manual"
    open_addProduct_Modal?.(source);
  };

  const getProductImage = (product) => {
    return (
      product.multimediaInfo?.image_urls?.[0] ||
      product.image ||
      product.image_url ||
      ""
    );
  };

  const getProductPrice = (product) => {
    return product.skuInfo?.[0]?.sellingPrice ?? product.price ?? null;
  };

  const getProductSku = (product) => {
    return product.skuInfo?.[0]?.sku ||
      product.sku ||
      product.product_sku ||
      "—";
  };

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => Number(product.quantity ?? 0) <= 5
  ).length;

  return (
    <>
      <ProductContainer>
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p>Manage your products, inventory, and product sources.</p>
          </div>

          <button
            className="add-product-button"
            onClick={() => setShowSourceModal(true)}
          >
            <AddIcon />
            Add Product
          </button>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <Inventory2OutlinedIcon />
            </div>

            <div>
              <span className="stat-label">Total Products</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <ShoppingBagOutlinedIcon />
            </div>

            <div>
              <span className="stat-label">Low Stock</span>
              <strong>{lowStockProducts}</strong>
            </div>
          </div>
        </div>

        <div className="products-section">
          <div className="section-header">
            <div>
              <h2>Product Catalog</h2>
              <p>{totalProducts} products in your catalog</p>
            </div>

            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loader" />
              <span>Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Inventory2OutlinedIcon />
              </div>

              <h3>No products yet</h3>

              <p>
                Add your first product from AliExpress, COD Network, or
                create one manually.
              </p>

              <button
                className="add-product-button"
                onClick={() => setShowSourceModal(true)}
              >
                <AddIcon />
                Add Your First Product
              </button>
            </div>
          ) : (
            <TableWrap>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Status</th>
                    <th className="actions-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const image = getProductImage(product);
                    const price = getProductPrice(product);
                    const quantity = Number(product.skuInfo.filter((sku) => sku.quantity !== undefined).map((sku) => sku.quantity).reduce((a, b) => a + b, 0) ?? 0);

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="product-info">
                            <button
                              type="button"
                              className="product-image-button"
                              onClick={() => openModal?.(product)}
                              aria-label={`View ${product.name["en"]}`}

                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={product.name["en"] || "Product"}
                                />
                              ) : (
                                <div className="image-placeholder">
                                  <Inventory2OutlinedIcon />
                                </div>
                              )}
                            </button>

                            <div className="product-details">
                              <span className="product-name">
                                {product.name["en"] || "Unnamed product"}
                              </span>

                              <span className="product-id">
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="sku">{getProductSku(product)}</span>
                        </td>

                        <td>
                          <span className="price">
                            {price !== null
                              ? `US $${Number(price).toFixed(2)}`
                              : "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`quantity ${
                              quantity <= 5 ? "low-quantity" : ""
                            }`}
                          >
                            {quantity} {quantity === 1 ? "piece" : "pieces"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status ${
                              product.is_enabled === false
                                ? "inactive"
                                : "active"
                            }`}
                          >
                            <span className="status-dot" />
                            {product.is_enabled === false
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              type="button"
                              className="action-button edit"
                              onClick={() => open_Edit_Modal?.(product)}
                              title="Edit product"
                              aria-label="Edit product"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              className="action-button delete"
                              onClick={() => deleteProduct?.(product.id)}
                              title="Delete product"
                              aria-label="Delete product"
                            >
                              <DeleteIcon />
                            </button>

                            {open_add_rating && (
                              <button
                                type="button"
                                className="rating-button"
                                onClick={() => open_add_rating(product)}
                              >
                                Add rating
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrap>
          )}
        </div>
      </ProductContainer>

      {showSourceModal && (
        <SourceModalOverlay
          onClick={() => setShowSourceModal(false)}
        >
          <SourceModal
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">PRODUCT SETUP</span>
                <h2>Add a product</h2>
                <p>Choose where you want to get your product from.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowSourceModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="source-options">
              <button
                type="button"
                className="source-option"
                onClick={() => handleAddProduct("aliexpress")}
              >
                <div className="source-icon aliexpress">
                  <LinkOutlinedIcon />
                </div>

                <div className="source-content">
                  <div className="source-title-row">
                    <h3>AliExpress</h3>
                    <span className="source-tag">Import</span>
                  </div>

                  <p>
                    Import product details, images, and pricing from
                    AliExpress.
                  </p>
                </div>

                <span className="source-arrow">→</span>
              </button>

              <button
                type="button"
                className="source-option"
                onClick={() => handleAddProduct("cod_network")}
              >
                <div className="source-icon cod">
                  <StorefrontIcon />
                </div>

                <div className="source-content">
                  <div className="source-title-row">
                    <h3>COD Network</h3>
                    <span className="source-tag">Catalog</span>
                  </div>

                  <p>
                    Choose a product from your COD Network catalog.
                  </p>
                </div>

                <span className="source-arrow">→</span>
              </button>

              <button
                type="button"
                className="source-option"
                onClick={() => handleAddProduct("manual")}
              >
                <div className="source-icon manual">
                  <AddIcon />
                </div>

                <div className="source-content">
                  <div className="source-title-row">
                    <h3>Manual Product</h3>
                    <span className="source-tag">Create</span>
                  </div>

                  <p>
                    Add your own product with custom details and images.
                  </p>
                </div>

                <span className="source-arrow">→</span>
              </button>
            </div>

            <div className="modal-footer">
              <span>
                You can edit product details after adding it.
              </span>
            </div>
          </SourceModal>
        </SourceModalOverlay>
      )}
    </>
  );
}

const ProductContainer = styled.div`
  width: 100%;
  padding: 24px;
  color: #202124;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }

  .page-header h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.6px;
  }

  .page-header p {
    margin: 7px 0 0;
    color: #777;
    font-size: 14px;
  }

  .add-product-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 18px;
    background: #1c1c1c;
    color: #fff;
    border: 1px solid #1c1c1c;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
    white-space: nowrap;
  }

  .add-product-button svg {
    font-size: 19px;
  }

  .add-product-button:hover {
    background: #383838;
    border-color: #383838;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 240px));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 10px;
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 9px;
    background: #f1f1f1;
    color: #292929;
  }

  .stat-icon.warning {
    background: #fff5e6;
    color: #b7791f;
  }

  .stat-label {
    display: block;
    margin-bottom: 5px;
    color: #777;
    font-size: 12px;
  }

  .stat-card strong {
    font-size: 22px;
    font-weight: 700;
  }

  .products-section {
    overflow: hidden;
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 10px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 22px;
    border-bottom: 1px solid #eee;
  }

  .section-header h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
  }

  .section-header p {
    margin: 6px 0 0;
    color: #888;
    font-size: 13px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 260px;
    padding: 10px 12px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    color: #888;
  }

  .search-box svg {
    font-size: 19px;
  }

  .search-box input {
    width: 100%;
    border: none;
    outline: none;
    color: #222;
    background: transparent;
    font-size: 13px;
  }

  .loading-state,
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 60px 20px;
    color: #777;
    text-align: center;
  }

  .loading-state {
    gap: 14px;
  }

  .loader {
    width: 28px;
    height: 28px;
    border: 3px solid #eee;
    border-top-color: #222;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin-bottom: 12px;
    border-radius: 12px;
    background: #f5f5f5;
    color: #777;
  }

  .empty-icon svg {
    font-size: 28px;
  }

  .empty-state h3 {
    margin: 0;
    color: #222;
    font-size: 17px;
  }

  .empty-state p {
    max-width: 380px;
    margin: 8px 0 20px;
    font-size: 13px;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 14px;

    .page-header {
      align-items: flex-start;
    }

    .page-header h1 {
      font-size: 22px;
    }

    .stats-container {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .stat-card {
      padding: 13px;
      gap: 10px;
    }

    .section-header {
      align-items: flex-start;
      flex-direction: column;
      padding: 16px;
    }

    .search-box {
      width: 100%;
    }
  }
`;

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap;
  }

  thead {
    background: #fafafa;
  }

  th {
    padding: 14px 18px;
    color: #777;
    font-size: 11px;
    font-weight: 600;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 15px 18px;
    border-top: 1px solid #f0f0f0;
    font-size: 13px;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #fcfcfc;
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 220px;
  }

  .product-image-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    padding: 0;
    overflow: hidden;
    background: #f7f7f7;
    border: 1px solid #eee;
    border-radius: 7px;
    cursor: pointer;
  }

  .product-image-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
  }

  .product-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .product-name {
    max-width: 250px;
    overflow: hidden;
    color: #292929;
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
  }

  .product-id {
    color: #999;
    font-size: 11px;
  }

  .sku {
    color: #777;
    font-size: 12px;
  }

  .price {
    color: #222;
    font-weight: 600;
  }

  .quantity {
    color: #555;
  }

  .quantity.low-quantity {
    color: #b7791f;
    font-weight: 600;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .status.active {
    background: #edf8f0;
    color: #278044;
  }

  .status.inactive {
    background: #f5f5f5;
    color: #777;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #fff;
    color: #777;
    cursor: pointer;
    transition: 0.15s ease;
  }

  .action-button svg {
    font-size: 17px;
  }

  .action-button.edit:hover {
    color: #222;
    border-color: #ccc;
    background: #f8f8f8;
  }

  .action-button.delete:hover {
    color: #c53030;
    border-color: #fed7d7;
    background: #fff5f5;
  }

  .rating-button {
    padding: 7px 9px;
    border: none;
    border-radius: 6px;
    background: #fff6cc;
    color: #7a6415;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .rating-button:hover {
    background: #ffefad;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 12px;
    }
  }
`;

const SourceModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 15, 15, 0.48);
  backdrop-filter: blur(3px);
`;

const SourceModal = styled.div`
  width: 100%;
  max-width: 520px;
  padding: 26px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }

  .eyebrow {
    color: #999;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
  }

  h2 {
    margin: 8px 0 7px;
    color: #202020;
    font-size: 23px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .modal-header p {
    margin: 0;
    color: #777;
    font-size: 13px;
    line-height: 1.5;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #fff;
    color: #777;
    cursor: pointer;
    transition: 0.15s ease;
  }

  .close-button:hover {
    background: #f5f5f5;
    color: #222;
  }

  .source-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .source-option {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 16px;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.18s ease, background 0.18s ease,
      transform 0.18s ease;
  }

  .source-option:hover {
    border-color: #bdbdbd;
    background: #fcfcfc;
    transform: translateY(-1px);
  }

  .source-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: 9px;
  }

  .source-icon svg {
    font-size: 23px;
  }

  .source-icon.aliexpress {
    background: #fff0e8;
    color: #e85b24;
  }

  .source-icon.cod {
    background: #edf3ff;
    color: #4169b2;
  }

  .source-icon.manual {
    background: #f1f1f1;
    color: #333;
  }

  .source-content {
    flex: 1;
    min-width: 0;
  }

  .source-title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
  }

  .source-title-row h3 {
    margin: 0;
    color: #222;
    font-size: 14px;
    font-weight: 700;
  }

  .source-tag {
    padding: 4px 7px;
    border-radius: 5px;
    background: #f5f5f5;
    color: #777;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .source-content p {
    margin: 6px 0 0;
    color: #888;
    font-size: 12px;
    line-height: 1.5;
  }

  .source-arrow {
    color: #aaa;
    font-size: 20px;
    transition: transform 0.18s ease;
  }

  .source-option:hover .source-arrow {
    color: #222;
    transform: translateX(3px);
  }

  .modal-footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    color: #999;
    font-size: 11px;
    text-align: center;
  }

  @media (max-width: 520px) {
    padding: 20px;

    h2 {
      font-size: 21px;
    }

    .source-option {
      gap: 11px;
      padding: 13px;
    }

    .source-icon {
      width: 40px;
      height: 40px;
    }

    .source-content p {
      font-size: 11px;
    }
  }
`;