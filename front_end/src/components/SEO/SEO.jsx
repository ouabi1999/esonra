import React from "react";
import { Helmet } from "react-helmet-async";

function SEO({
  title,
  description = "",
  canonical,
  image,
  productData = null,
  type = "website",
}) {
  const siteName = "Enouza";
  const siteUrl = "https://www.enouza.com";

  // ============================================================
  // HTML → CLEAN TEXT
  // ============================================================
  const stripHtml = (html = "") => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.textContent
      .replace(/\s+/g, " ")
      .trim();
  };

  // ============================================================
  // PRODUCT NAME
  // ============================================================
  const productName =
    productData?.name?.en ||
    title ||
    "Luxury Lamps & Premium Home Lighting";

  // ============================================================
  // SEO DESCRIPTION
  // ============================================================
  const cleanDescription = (text = "") => {
    if (!text) return "";

    return stripHtml(text)
      .replace(/\s+/g, " ")
      .trim();
  };

  const finalDescription =
    cleanDescription(description) ||
    `Discover ${productName} at Enouza. Explore its design, features, and product details.`;

  // ============================================================
  // CANONICAL
  // ============================================================
 const finalCanonical = canonical
  ? `${siteUrl}${canonical}`
  : siteUrl;

  // ============================================================
  // IMAGE
  // ============================================================
  const finalImage =
    image ||
    productData?.multimediaInfo?.main_image ||
    `${siteUrl}/Asset%2012.svg`;

  // ============================================================
  // TITLE
  // ============================================================
  const finalTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} | Luxury Lamps & Premium Home Lighting`;

  // ============================================================
  // PRODUCT PRICE
  // ============================================================
  const skuPrices = Array.isArray(productData?.skuInfo)
    ? productData.skuInfo
        .map((sku) => Number(sku?.sellingPrice))
        .filter(
          (price) =>
            Number.isFinite(price) && price > 0
        )
    : [];

  const lowestPrice =
    skuPrices.length > 0
      ? Math.min(...skuPrices)
      : null;

  // ============================================================
  // RATINGS
  // ============================================================
  const ratings = Array.isArray(productData?.ratings)
    ? productData.ratings
    : [];

  const validRatings = ratings.filter(
    (rating) =>
      Number.isFinite(Number(rating?.stars))
  );

  const ratingCount = validRatings.length;

  const ratingSum = validRatings.reduce(
    (sum, rating) =>
      sum + Number(rating.stars),
    0
  );

  const averageRating =
    ratingCount > 0
      ? ratingSum / ratingCount
      : null;

  // ============================================================
  // PRODUCT STOCK
  // ============================================================
  const hasAvailableStock =
    Array.isArray(productData?.skuInfo) &&
    productData.skuInfo.some(
      (sku) => Number(sku?.available_stock) > 0
    );

  // ============================================================
  // PRODUCT STRUCTURED DATA
  // ============================================================
  const productStructuredData = productData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",

        name: productName,

        description: finalDescription,

        image: [finalImage],

        sku:
          productData?.product_id ||
          undefined,

        brand: {
          "@type": "Brand",
          name:
            productData?.brand ||
            siteName,
        },

        category:
          productData?.category ||
          undefined,

        ...(lowestPrice !== null && {
          offers: {
            "@type": "AggregateOffer",
            url: finalCanonical,
            priceCurrency: "USD",

            lowPrice: Math.min(
              ...skuPrices
            ).toFixed(2),

            highPrice: Math.max(
              ...skuPrices
            ).toFixed(2),

            offerCount:
              skuPrices.length,

            availability:
              hasAvailableStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",

            seller: {
              "@type": "Organization",
              name: siteName,
            },
          },
        }),

        ...(ratingCount > 0 &&
          averageRating !== null && {
            aggregateRating: {
              "@type": "AggregateRating",

              ratingValue:
                averageRating.toFixed(1),

              reviewCount:
                ratingCount,

              bestRating: "5",

              worstRating: "1",
            },
          }),
      }
    : null;

  // ============================================================
  // HEAD
  // ============================================================
  return (
    <Helmet>
      <title>{finalTitle}</title>

      <meta
        name="description"
        content={finalDescription}
      />

      <link
        rel="canonical"
        href={finalCanonical}
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content={finalTitle}
      />

      <meta
        property="og:description"
        content={finalDescription}
      />

      <meta
        property="og:url"
        content={finalCanonical}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:site_name"
        content={siteName}
      />

      <meta
        property="og:image"
        content={finalImage}
      />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={finalTitle}
      />

      <meta
        name="twitter:description"
        content={finalDescription}
      />

      <meta
        name="twitter:image"
        content={finalImage}
      />

      {/* Product JSON-LD */}
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            productStructuredData
          )}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;