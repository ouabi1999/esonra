import React, {  useState, useEffect } from "react";
import styled from "styled-components";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

import ApiInstance from "../../../../common/baseUrl";
import Stepper from "./Product_component/Stepper"
import AliExpressAuth from "../AliDropship/AliExpressAuth";
import AliExpressProductFetcher from "../AliDropship/AliExpressProductFetcher";
import { useSelector } from "react-redux";


function ProductManagement(props) {
  const productData = useSelector((state) => state.aliExpressProduct.product);
  const [sellingMarkUp, setSellingMarkUp] = useState(0.60)
  const [compareMarkUp, setCompareMarkUp] = useState(0.80)
  const { close_Modal, isEditProductOn, EditProduct, isAddProductOn } = props;

  const [formData, setFormData] = useState({
    product_id: "",
    name: { en: "", fr: "", es: "", ar: "" },
    description: { en: "", fr: "", es: "", ar: "" },
    brand: "",
    skuInfo: [],
    specifications: [],
    multimediaInfo: [],
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
    social_media_links: { facebook: "", instagram: "" },
    ali_express_ratings: []
  }
  );

useEffect(() => {
  if (!productData) return;

  const skuInfo = (
    productData.ae_item_sku_info_dtos || []
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

    /*
     * Find the attribute that owns the variant image.
     */
    const colorAttribute = Object.entries(attributes)
      .find(([, attribute]) => {
        return Boolean(attribute?.image);
      });

    const colorKey = colorAttribute
      ? colorAttribute[0]
      : null;

    const cost =
      Number(sku.offer_sale_price) || 0;

    const sellingPrice = Number(
      (cost * (1 + sellingMarkUp)).toFixed(2)
    );

    const comparePrice = Number(
      (
        sellingPrice *
        (1 + compareMarkUp)
      ).toFixed(2)
    );

    return {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `variant-${Date.now()}-${index}-${Math.random()
              .toString(36)
              .substring(2, 8)}`,

      sku_attr: sku.sku_attr || "",

      attributes,

      colorKey,

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

  /*
   * =========================================================
   * NORMALIZE MULTIMEDIA
   * =========================================================
   *
   * image_urls will ALWAYS become an array.
   *
   * Supports both:
   *
   * "image1;image2;image3"
   *
   * and:
   *
   * ["image1", "image2", "image3"]
   */

  const multimedia =  productData.ae_multimedia_info_dto || {};

  let imageUrls = multimedia.image_urls;

  if (Array.isArray(imageUrls)) {
    imageUrls = imageUrls.filter(
      (url) =>
        typeof url === "string" &&
        url.trim() !== ""
    );
  } else if (typeof imageUrls === "string") {
    imageUrls = imageUrls
      .split(";").filter(Boolean);
  } else {
    imageUrls = [];
  }

  /*
   * =========================================================
   * SET FORM DATA
   * =========================================================
   */

  setFormData((prev) => ({
    ...prev,

    product_id:
      productData.ae_item_base_info_dto?.product_id ||
      "",

    name: {
      ...prev.name,

      en:
        productData.ae_item_base_info_dto?.subject ||
        "",
    },
    

    /*
     * Keep every SKU combination exactly as
     * AliExpress returned it.
     */
    skuInfo,

    /*
     * Normalize multimediaInfo.
     */
    multimediaInfo: {
      ...multimedia,

      image_urls: imageUrls,
    },

    
  }));
}, [
  productData,
 
]);




  const [loading, setLoading] = useState(false);



  useEffect(() => {
  if (!isEditProductOn || !EditProduct) return;

setFormData({
  ...EditProduct,
  main_image: EditProduct.multimediaInfo.main_image,
  mainImagePreview:EditProduct.multimediaInfo.main_image,
});

}, [isEditProductOn, EditProduct]);

  /// send products info to the backend
  const product_submit = (value) => {
    const data = new FormData();
   
    formData.tags?.forEach((tag) => data.append("tags", tag));

    formData.ali_express_ratings?.forEach((rating) =>
      data.append("ali_express_ratings", JSON.stringify(rating))
    );

    formData.additionalImageFiles?.forEach((image) => {
    if (image?.file instanceof File) {
        data.append("additionalImageFiles", image.file);
    }
});

    data.append("available_shipping", JSON.stringify(formData.available_shipping))

    // Append nested objects like specifications, images, social_media_links, etc.
    data.append("specifications", JSON.stringify(formData.specifications));
    // Append `main_image` as a file if it exists
    data.append("main_image", formData.main_image);
   
 console.log(formData.main_image)


    data.append("skuInfo", JSON.stringify(formData.skuInfo));

    data.append("social_media_links", JSON.stringify(formData.social_media_links));

    // Append individual fields
    data.append("name", JSON.stringify(formData.name));
    data.append("description", JSON.stringify(formData.description));
    data.append("multimediaInfo", JSON.stringify(formData.multimediaInfo));
    data.append("brand", formData.brand);
    data.append("product_id", formData.product_id);


    data.append("discount", formData.discount);
    data.append("category", formData.category);

    data.append("quantity", formData.quantity);
    data.append("warranty", formData.warranty);
    data.append("care_instructions", formData.care_instructions);
    data.append("sale_end_date", formData.sale_end_date);
    data.append("return_policy", formData.return_policy);
    data.append("country_of_origin", formData.country_of_origin);
    data.append("global_coupon", formData.global_coupon);

    // Append SEO (which might be an array of objects or just simple strings)
    formData.seo?.forEach((seoItem) =>
      data.append("seo", JSON.stringify(seoItem))
    );
    

    // Append all data from formData to FormData
    setLoading(true);
    isAddProductOn && ApiInstance.post("product-api/", data)

      .then((response) => {
        setLoading(false);
        toast.success("A new Product has been added .");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops something went wrong!");
        setLoading(false);
      });

    isEditProductOn && ApiInstance.put(`product/${value.id}/`, data)

      .then((response) => {
        setLoading(false);
        toast.success("A Product has been updated .");
        return response.data
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops something went wrong!");
        setLoading(false);
      })




  };



  // handle change input
  const handelChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <AddNew_Product>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <ButtonsContainer>
        <AliExpressAuth />
        <AliExpressProductFetcher />


        <SubmitButton
          type="submit"
          onClick={() => product_submit(formData)}
          variant="contained"
          className="submitButton"
          disabled={loading}
        >
          <span>
            {" "}
            {isEditProductOn && "Update Product"}{" "}
            {isAddProductOn && "Push to store"}
          </span>
          {loading && (
            <CircularProgress
              style={{ marginLeft: "3px" }}
              size={22}
              thickness={6}
              value={100}
            />
          )}
        </SubmitButton>
      </ButtonsContainer>

      <Stepper
        setFormData={setFormData}
        formData={formData}
        handelChange={handelChange}
      />

    </AddNew_Product>
  );
}
export default ProductManagement;

const AddNew_Product = styled.div`
  position: relative;

  .loader {
    position: absolute;
    top: 50%;
    right: 50%;
  }

 
  .exit-button {
    cursor: pointer;
  }
`
const ButtonsContainer = styled.div`
display:flex;
justify-content:space-between;
`

const SubmitButton = styled.button`
  background-color: #00ad3cfc !important;
  color: #fff !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  transition: background 0.3s !important;
  margin-bottom: 15px;

  &:hover {
    background-color: #00ad3daa  !important;
  }

  &:disabled {
    background-color: #9ca3af !important;
    color: #f3f4f6 !important;
  }
`;