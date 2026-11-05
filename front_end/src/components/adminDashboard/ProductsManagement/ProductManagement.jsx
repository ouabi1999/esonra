
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

import ApiInstance from "../../../../common/baseUrl";

import Stepper from "./Product_component/Stepper";

import AliExpressAuth from "./AliDropship/AliExpressAuth";
import AliExpressProductFetcher from "./AliDropship/AliExpressProductFetcher";
import CODNetworkProductFetcher from "./CodNetwork/CODNetworkProductFetcher";


const createEmptyForm = () => ({
  external_product_id: "",

  name: {
    en: "",
    fr: "",
    es: "",
    ar: "",
  },

  description: {
    en: "",
    fr: "",
    es: "",
    ar: "",
  },

  brand: "",
  skuInfo: [],
  specifications: [],

  multimediaInfo: {
    image_urls: [],
  },

  main_image: null,

  in_stock: true,
  category: "",
  tags: [],

  warranty: "",
  care_instructions: "",
  sale_end_date: "",

  available_shipping: [],
  return_policy: "",
  country_of_origin: "",

  social_media_links: {
    facebook: "",
    instagram: "",
  },

  ali_express_ratings: [],
});


const createVariantId = (index) => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `variant-${Date.now()}-${index}`;
};


const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images.filter(
      (image) =>
        typeof image === "string" &&
        image.trim() !== ""
    );
  }

  if (typeof images === "string") {
    return images
      .split(";")
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};


const mapAliExpressProduct = (
  product,
  sellingMarkUp,
  compareMarkUp
) => {
  const skuInfo = (
    product.ae_item_sku_info_dtos || []
  ).map((sku, index) => {
    const attributes = {};

    (sku.ae_sku_property_dtos || []).forEach((attr) => {
      const propertyName =
        attr.sku_property_name?.trim() ||
        `Option ${index + 1}`;

      attributes[propertyName] = {
        value: attr.sku_property_value || "",
        image: attr.sku_image || null,

        propertyId:
          attr.sku_property_id || null,

        valueId:
          attr.property_value_id || null,

        definitionName:
          attr.property_value_definition_name || "",
      };
    });

    const colorAttribute = Object.entries(attributes).find(
      ([, attribute]) => Boolean(attribute?.image)
    );

    const cost = Number(sku.offer_sale_price) || 0;

    const sellingPrice = Number(
      (cost * (1 + sellingMarkUp)).toFixed(2)
    );

    const comparePrice = Number(
      (sellingPrice * (1 + compareMarkUp)).toFixed(2)
    );

    return {
      id: createVariantId(index),

      sku_attr: sku.sku_attr || "",

      attributes,

      colorKey: colorAttribute
        ? colorAttribute[0]
        : null,

      cost,
      sellingPrice,
      comparePrice,

      profitPrice: Number(
        (sellingPrice - cost).toFixed(2)
      ),

      available_stock:
        Number(sku.sku_available_stock) || 0,
    };
  });

  const multimedia =
    product.ae_multimedia_info_dto || {};

  return {
    external_product_id:
      product.ae_item_base_info_dto?.product_id || "",

    name: {
      en:
        product.ae_item_base_info_dto?.subject || "",
      fr: "",
      es: "",
      ar: "",
    },

    skuInfo,

    multimediaInfo: {
      ...multimedia,
      image_urls: normalizeImages(
        multimedia.image_urls
      ),
    },
  };
};


function ProductManagement({
  close_Modal,
  isEditProductOn,
  EditProduct,
  isAddProductOn,

  productSource = "manual",
  onProductSaved,
}) {
  const productData = useSelector(
    (state) => state.aliExpressProduct.product
  );

  const [sellingMarkUp, setSellingMarkUp] = useState(0.60);
  const [compareMarkUp, setCompareMarkUp] = useState(0.80);

  const [formData, setFormData] = useState(createEmptyForm);

  const [loading, setLoading] = useState(false);


  // --------------------------------------------------
  // Reset form when starting a new product
  // --------------------------------------------------

  useEffect(() => {
    if (!isAddProductOn || isEditProductOn) return;

    setFormData(createEmptyForm());
  }, [productSource, isAddProductOn, isEditProductOn]);


  // --------------------------------------------------
  // AliExpress product import
  // --------------------------------------------------

  useEffect(() => {
    if (
      productSource !== "aliexpress" ||
      !productData ||
      !isAddProductOn ||
      isEditProductOn
    ) {
      return;
    }

    const mappedProduct = mapAliExpressProduct(
      productData,
      sellingMarkUp,
      compareMarkUp
    );

    setFormData((previous) => ({
      ...previous,
      ...mappedProduct,
    }));

  }, [
    productData,
    productSource,
    isAddProductOn,
    isEditProductOn,
    sellingMarkUp,
    compareMarkUp,
  ]);


  // --------------------------------------------------
  // Edit existing product
  // --------------------------------------------------

  useEffect(() => {
    if (!isEditProductOn || !EditProduct) return;

    const multimediaInfo =
      EditProduct.multimediaInfo || {};

    setFormData({
      ...createEmptyForm(),
      ...EditProduct,

      name: {
        ...createEmptyForm().name,
        ...(EditProduct.name || {}),
      },

      description: {
        ...createEmptyForm().description,
        ...(EditProduct.description || {}),
      },

      multimediaInfo,

      main_image:
        multimediaInfo.main_image || null,

      mainImagePreview:
        multimediaInfo.main_image || null,

      skuInfo: EditProduct.skuInfo || [],
      specifications: EditProduct.specifications || [],
      tags: EditProduct.tags || [],
      available_shipping:
        EditProduct.available_shipping || [],
    });

  }, [isEditProductOn, EditProduct]);


  // --------------------------------------------------
  // Form data helper
  // --------------------------------------------------

  const appendJSON = (data, key, value) => {
    if (value !== undefined && value !== null) {
      data.append(key, JSON.stringify(value));
    }
  };


  const appendValue = (data, key, value) => {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  };


  // --------------------------------------------------
  // Build backend FormData
  // --------------------------------------------------

  const buildProductFormData = useCallback(() => {
    const data = new FormData();

    // Arrays
    formData.tags?.forEach((tag) => {
      data.append("tags", tag);
    });

    formData.ali_express_ratings?.forEach((rating) => {
      data.append(
        "ali_express_ratings",
        JSON.stringify(rating)
      );
    });

    formData.additionalImageFiles?.forEach((image) => {
      if (
        typeof File !== "undefined" &&
        image?.file instanceof File
      ) {
        data.append("additionalImageFiles", image.file);
      }
    });

    formData.seo?.forEach((seoItem) => {
      data.append("seo", JSON.stringify(seoItem));
    });


    // Nested objects
    appendJSON(
      data,
      "available_shipping",
      formData.available_shipping
    );

    appendJSON(
      data,
      "specifications",
      formData.specifications
    );

    appendJSON(
      data,
      "skuInfo",
      formData.skuInfo
    );

    appendJSON(
      data,
      "social_media_links",
      formData.social_media_links
    );

    appendJSON(
      data,
      "name",
      formData.name
    );

    appendJSON(
      data,
      "description",
      formData.description
    );

    appendJSON(
      data,
      "multimediaInfo",
      formData.multimediaInfo
    );


    // Main image: append only an actual uploaded file.
    // Existing image URLs are retained in multimediaInfo.
    // Main image
if (formData.main_image instanceof File) {
  data.append("main_image", formData.main_image);
} else if (
  typeof formData.main_image === "string" &&
  formData.main_image.trim()
) {
  data.append("main_image", formData.main_image.trim());
}

    // Regular fields
    const fields = [
      "slug",
      "brand",
      "external_product_id",
      "discount",
      "category",
      "quantity",
      "warranty",
      "care_instructions",
      "sale_end_date",
      "return_policy",
      "country_of_origin",
      "global_coupon",
    ];

    fields.forEach((field) => {
      appendValue(data, field, formData[field]);
    });

    return data;

  }, [formData]);


  // --------------------------------------------------
  // Submit product
  // --------------------------------------------------

  const product_submit = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const data = buildProductFormData();

      if (isEditProductOn) {
        if (!EditProduct?.id) {
          throw new Error("Product ID is missing.");
        }

        await ApiInstance.put(
          `product/${EditProduct.id}/`,
          data
        );

        toast.success("Product updated successfully.");

      } else if (isAddProductOn) {
        await ApiInstance.post(
          "product-api/",
          data
        );

        toast.success("Product added successfully.");

      } else {
        return;
      }

      if (onProductSaved) {
        await onProductSaved();
      }

      if (close_Modal) {
        close_Modal();
      }

    } catch (error) {
      console.error(
        "Product submission error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
        "Something went wrong. Please check your product information."
      );

    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Input change
  // --------------------------------------------------

  const handelChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // --------------------------------------------------
  // Source label
  // --------------------------------------------------

  const sourceLabels = {
    manual: "Manual product",
    aliexpress: "AliExpress import",
    cod_network: "COD Network import",
  };


  return (
    <Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />


      {/* Header */}

      <Header>
        <div>
          <Heading>
            {isEditProductOn
              ? "Edit product"
              : "Add new product"}
          </Heading>

          <Subtitle>
            Manage product details, pricing, images and inventory.
          </Subtitle>
        </div>

        <SourceBadge>
          {sourceLabels[productSource] || "Manual product"}
        </SourceBadge>
      </Header>


      {/* Supplier actions */}

      {isAddProductOn && (
        <SourcePanel>

          {productSource === "aliexpress" && (
            <>
              <SourceDescription>
                <strong>AliExpress integration</strong>
                <span>
                  Connect your account and import a product.
                </span>
              </SourceDescription>

              <SupplierActions>
                <AliExpressAuth />
                <AliExpressProductFetcher />
              </SupplierActions>
            </>
          )}


          {productSource === "cod_network" && (
            <>
              <SourceDescription>
                <strong>COD Network integration</strong>
                <span>
                  Select a product from your COD Network catalog.
                </span>
              </SourceDescription>

              <SupplierActions>
                <CODNetworkProductFetcher />
              </SupplierActions>
            </>
          )}


          {productSource === "manual" && (
            <SourceDescription>
              <strong>Manual product creation</strong>
              <span>
                Enter your product information below.
              </span>
            </SourceDescription>
          )}

        </SourcePanel>
      )}


      {/* Pricing controls for AliExpress */}

      {isAddProductOn && productSource === "aliexpress" && (
        <PricingPanel>
          <PricingHeading>
            Import pricing settings
          </PricingHeading>

          <PricingControls>

            <PricingField>
              <label>Selling markup</label>

              <div>
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={sellingMarkUp}
                  onChange={(event) =>
                    setSellingMarkUp(
                      Math.max(0, Number(event.target.value) || 0)
                    )
                  }
                />

                <span>
                  {Math.round(sellingMarkUp * 100)}%
                </span>
              </div>
            </PricingField>


            <PricingField>
              <label>Compare price markup</label>

              <div>
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={compareMarkUp}
                  onChange={(event) =>
                    setCompareMarkUp(
                      Math.max(0, Number(event.target.value) || 0)
                    )
                  }
                />

                <span>
                  {Math.round(compareMarkUp * 100)}%
                </span>
              </div>
            </PricingField>

          </PricingControls>
        </PricingPanel>
      )}


      {/* Form */}

      <FormSection>

        <FormHeader>
          <div>
            <FormTitle>Product information</FormTitle>

            <FormSubtitle>
              Complete the steps below to prepare your product for your store.
            </FormSubtitle>
          </div>
        </FormHeader>


        <Stepper
          setFormData={setFormData}
          formData={formData}
          handelChange={handelChange}
        />

      </FormSection>


      {/* Footer actions */}

      <Footer>

        <FooterInfo>
          {isEditProductOn
            ? "Changes will be saved to this product."
            : "Review your information before publishing."}
        </FooterInfo>

        <FooterActions>

          <CancelButton
            type="button"
            onClick={close_Modal}
            disabled={loading}
          >
            Cancel
          </CancelButton>

          <SubmitButton
            type="button"
            onClick={product_submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={18}
                  thickness={5}
                  color="inherit"
                />

                Saving...
              </>
            ) : (
              isEditProductOn
                ? "Save changes"
                : "Publish product"
            )}
          </SubmitButton>

        </FooterActions>

      </Footer>

    </Container>
  );
}

export default ProductManagement;


// --------------------------------------------------
// Styling
// --------------------------------------------------

const Container = styled.div`
  width: 100%;
  position: relative;
  color: #1d1c1a;
  padding: 4px 0 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Heading = styled.h2`
  margin: 0;
  font-size: 25px;
  font-weight: 650;
  letter-spacing: -0.6px;
  color: #1d1c1a;
`;

const Subtitle = styled.p`
  margin: 7px 0 0;
  color: #77736d;
  font-size: 13px;
`;

const SourceBadge = styled.span`
  background: #f1eee8;
  color: #806b4c;
  border: 1px solid #e4ded4;
  border-radius: 20px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

const SourcePanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  padding: 18px;
  margin-bottom: 18px;

  background: #faf9f6;
  border: 1px solid #e9e5dd;
  border-radius: 10px;
`;

const SourceDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong {
    font-size: 14px;
    color: #292722;
  }

  span {
    font-size: 12px;
    color: #827d75;
  }
`;

const SupplierActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PricingPanel = styled.div`
  padding: 17px 18px;
  margin-bottom: 20px;

  border: 1px solid #e9e5dd;
  border-radius: 10px;
  background: #fff;
`;

const PricingHeading = styled.h4`
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 650;
  color: #38352f;
`;

const PricingControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PricingField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  label {
    font-size: 12px;
    color: #77736d;
  }

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input {
    width: 100%;
    max-width: 130px;
    padding: 9px 10px;
    border: 1px solid #e5e1d9;
    border-radius: 7px;
    outline: none;
    font-size: 13px;

    &:focus {
      border-color: #b39a76;
    }
  }

  span {
    color: #806b4c;
    font-size: 12px;
    font-weight: 600;
  }
`;

const FormSection = styled.div`
  background: #fff;
  border: 1px solid #e9e5dd;
  border-radius: 10px;
  padding: 20px;

  @media (max-width: 600px) {
    padding: 13px;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 650;
`;

const FormSubtitle = styled.p`
  margin: 6px 0 0;
  color: #89847c;
  font-size: 12px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e9e5dd;
`;

const FooterInfo = styled.p`
  margin: 0;
  color: #89847c;
  font-size: 12px;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CancelButton = styled.button`
  border: 1px solid #ded9d0;
  background: #fff;
  color: #555149;
  padding: 10px 17px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8f6f2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: none;
  background: #1d1c1a;
  color: #fff;

  padding: 11px 20px;
  border-radius: 7px;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #4a443a;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
