// src/utils/analytics.js

/**
 * Enouza Analytics
 * Google Analytics 4 + Meta Pixel
 */

// ======================================================
// CORE TRACKING
// ======================================================

export const trackGAEvent = (eventName, parameters = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, parameters);
};

export const trackMetaEvent = (eventName, parameters = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;

  window.fbq("track", eventName, parameters);
};

// ======================================================
// HELPERS
// ======================================================

const getProductName = (name) => {
  if (typeof name === "string") return name;

  if (name && typeof name === "object") {
    return name.en || name.es || name.ar || name.fr || "Luxury Lamp";
  }

  return "Luxury Lamp";
};

const getNumericPrice = (price) => {
  const value = Number(price);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

const getNumericQuantity = (quantity = 1) => {
  const value = Number(quantity);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const getItem = ({
  productId,
  name,
  price,
  quantity = 1,
  category,
  brand = "Enouza",
  variant,
}) => {
  const numericPrice = getNumericPrice(price);
  const numericQuantity = getNumericQuantity(quantity);

  if (productId == null || numericPrice === null || !numericQuantity) {
    return null;
  }

  return {
    item_id: String(productId),
    item_name: getProductName(name),
    ...(category ? { item_category: category } : {}),
    ...(brand ? { item_brand: brand } : {}),
    ...(variant ? { item_variant: String(variant) } : {}),
    price: numericPrice,
    quantity: numericQuantity,
  };
};

const getItems = (items = []) =>
  items
    .map((item) => getItem(item))
    .filter(Boolean);

const getTotalValue = (items = []) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const getMetaProductIds = (items = []) =>
  items.map((item) => String(item.item_id));

const getMetaContents = (items = []) =>
  items.map((item) => ({
    id: String(item.item_id),
    quantity: item.quantity,
    item_price: item.price,
  }));

const trackEcommerceEvent = ({
  gaEvent,
  metaEvent,
  items = [],
  currency = "USD",
  value,
  extraGA = {},
  extraMeta = {},
}) => {
  const validItems = getItems(items);

  if (!validItems.length) return;

  const totalValue =
    Number.isFinite(Number(value)) && value !== undefined
      ? Number(value)
      : getTotalValue(validItems);

  trackGAEvent(gaEvent, {
    currency,
    value: totalValue,
    items: validItems,
    ...extraGA,
  });

  if (metaEvent) {
    trackMetaEvent(metaEvent, {
      content_ids: getMetaProductIds(validItems),
      contents: getMetaContents(validItems),
      content_type: "product",
      value: totalValue,
      currency,
      ...extraMeta,
    });
  }
};

// ======================================================
// 1. PRODUCT VIEW
// GA4: view_item
// Meta: ViewContent
// ======================================================

export const trackViewItem = ({
  productId,
  name,
  price,
  currency = "USD",
  category,
  variant,
}) => {
  const item = getItem({
    productId,
    name,
    price,
    quantity: 1,
    category,
    variant,
  });

  if (!item) return;

  trackEcommerceEvent({
    gaEvent: "view_item",
    metaEvent: "ViewContent",
    items: [{
      productId,
      name,
      price,
      quantity: 1,
      category,
      variant,
    }],
    currency,
    extraMeta: {
      content_name: item.item_name,
      content_category: category,
    },
  });
};

// ======================================================
// 2. PRODUCT LIST VIEW
// GA4: view_item_list
// ======================================================

export const trackViewItemList = ({
  items,
  itemListId,
  itemListName,
  currency = "USD",
}) => {
  const validItems = getItems(items);

  if (!validItems.length) return;

  trackGAEvent("view_item_list", {
    item_list_id: itemListId,
    item_list_name: itemListName,
    currency,
    items: validItems,
  });
};

// ======================================================
// 3. PRODUCT SELECTED FROM A LIST
// GA4: select_item
// ======================================================

export const trackSelectItem = ({
  productId,
  name,
  price,
  category,
  currency = "USD",
  itemListId,
  itemListName,
}) => {
  const item = getItem({ productId, name, price, category });

  if (!item) return;

  trackGAEvent("select_item", {
    item_list_id: itemListId,
    item_list_name: itemListName,
    currency,
    items: [item],
  });
};

// ======================================================
// 4. ADD TO CART
// GA4: add_to_cart
// Meta: AddToCart
// ======================================================

export const trackAddToCart = ({
  productId,
  name,
  price,
  quantity = 1,
  currency = "USD",
  category,
  variant,
}) => {
  trackEcommerceEvent({
    gaEvent: "add_to_cart",
    metaEvent: "AddToCart",
    items: [{
      productId,
      name,
      price,
      quantity,
      category,
      variant,
    }],
    currency,
  });
};

// ======================================================
// 5. REMOVE FROM CART
// GA4: remove_from_cart
// ======================================================

export const trackRemoveFromCart = ({
  productId,
  name,
  price,
  quantity = 1,
  currency = "USD",
  category,
  variant,
}) => {
  trackEcommerceEvent({
    gaEvent: "remove_from_cart",
    items: [{
      productId,
      name,
      price,
      quantity,
      category,
      variant,
    }],
    currency,
  });
};

// ======================================================
// 6. VIEW CART
// GA4: view_cart
// ======================================================

export const trackViewCart = ({
  items,
  currency = "USD",
}) => {
  trackEcommerceEvent({
    gaEvent: "view_cart",
    items,
    currency,
  });
};

// ======================================================
// 7. BEGIN CHECKOUT
// GA4: begin_checkout
// Meta: InitiateCheckout
// ======================================================

export const trackBeginCheckout = ({
  items,
  currency = "USD",
  value,
  coupon,
}) => {
  trackEcommerceEvent({
    gaEvent: "begin_checkout",
    metaEvent: "InitiateCheckout",
    items,
    currency,
    value,
    extraGA: coupon ? { coupon } : {},
    extraMeta: {
      num_items: items?.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
      ),
    },
  });
};

// ======================================================
// 8. ADD SHIPPING INFORMATION
// GA4: add_shipping_info
// ======================================================

export const trackAddShippingInfo = ({
  items,
  currency = "USD",
  value,
  shippingTier,
  coupon,
}) => {
  trackEcommerceEvent({
    gaEvent: "add_shipping_info",
    items,
    currency,
    value,
    extraGA: {
      ...(shippingTier ? { shipping_tier: shippingTier } : {}),
      ...(coupon ? { coupon } : {}),
    },
  });
};

// ======================================================
// 9. ADD PAYMENT INFORMATION
// GA4: add_payment_info
// Meta: AddPaymentInfo
// ======================================================

export const trackAddPaymentInfo = ({
  items,
  currency = "USD",
  value,
  paymentType,
  coupon,
}) => {
  trackEcommerceEvent({
    gaEvent: "add_payment_info",
    metaEvent: "AddPaymentInfo",
    items,
    currency,
    value,
    extraGA: {
      ...(paymentType ? { payment_type: paymentType } : {}),
      ...(coupon ? { coupon } : {}),
    },
  });
};

// ======================================================
// 10. PURCHASE
// GA4: purchase
// Meta: Purchase
//
// IMPORTANT: Call only after the order is confirmed.
// ======================================================

export const trackPurchase = ({
  transactionId,
  items,
  currency = "USD",
  value,
  tax = 0,
  shipping = 0,
  coupon,
}) => {
  if (!transactionId) return;

  const validItems = getItems(items);

  if (!validItems.length) return;

  const purchaseValue =
    value !== undefined
      ? Number(value)
      : getTotalValue(validItems);

  if (!Number.isFinite(purchaseValue) || purchaseValue < 0) return;

  const numericTax = Number(tax) || 0;
  const numericShipping = Number(shipping) || 0;

  trackGAEvent("purchase", {
    transaction_id: String(transactionId),
    currency,
    value: purchaseValue,
    tax: numericTax,
    shipping: numericShipping,
    items: validItems,
    ...(coupon ? { coupon } : {}),
  });

  trackMetaEvent("Purchase", {
    content_ids: getMetaProductIds(validItems),
    contents: getMetaContents(validItems),
    content_type: "product",
    value: purchaseValue,
    currency,
    num_items: validItems.reduce(
      (total, item) => total + item.quantity,
      0
    ),
  });
};

// ======================================================
// 11. REFUND
// GA4: refund
// ======================================================

export const trackRefund = ({
  transactionId,
  items,
  currency = "USD",
  value,
}) => {
  if (!transactionId) return;

  const validItems = getItems(items);

  trackGAEvent("refund", {
    transaction_id: String(transactionId),
    currency,
    ...(value !== undefined ? { value: Number(value) } : {}),
    ...(validItems.length ? { items: validItems } : {}),
  });
};

// ======================================================
// 12. SEARCH
// GA4: search
// Meta: Search
// ======================================================

export const trackSearch = ({
  searchTerm,
  currency = "USD",
}) => {
  if (!searchTerm || !String(searchTerm).trim()) return;

  const term = String(searchTerm).trim();

  trackGAEvent("search", {
    search_term: term,
  });

  trackMetaEvent("Search", {
    search_string: term,
    content_type: "product",
    currency,
  });
};

// ======================================================
// 13. SIGN UP
// GA4: sign_up
// Meta: CompleteRegistration
// ======================================================

export const trackSignUp = (method = "email") => {
  trackGAEvent("sign_up", { method });

  trackMetaEvent("CompleteRegistration", {
    content_name: "Account Registration",
    status: true,
  });
};

// ======================================================
// 14. LOGIN
// GA4: login
// ======================================================

export const trackLogin = (method = "email") => {
  trackGAEvent("login", { method });
};

// ======================================================
// 15. ADD TO WISHLIST
// GA4: add_to_wishlist
// Meta: AddToWishlist
// ======================================================

export const trackAddToWishlist = ({
  productId,
  name,
  price,
  currency = "USD",
  category,
}) => {
  trackEcommerceEvent({
    gaEvent: "add_to_wishlist",
    metaEvent: "AddToWishlist",
    items: [{
      productId,
      name,
      price,
      quantity: 1,
      category,
    }],
    currency,
  });
};

// ======================================================
// 16. APPLY COUPON
// Custom GA4 event
// ======================================================

export const trackApplyCoupon = ({
  coupon,
  value,
  currency = "USD",
}) => {
  if (!coupon) return;

  trackGAEvent("apply_coupon", {
    coupon,
    ...(value !== undefined ? { value: Number(value) } : {}),
    currency,
  });
};

// ======================================================
// 17. CONTACT
// Meta: Contact
// ======================================================

export const trackContact = () => {
  trackMetaEvent("Contact");
  trackGAEvent("contact");
};

// ======================================================
// 18. SUBMIT LEAD
// Meta: Lead
// ======================================================

export const trackLead = ({ contentName = "Enouza Lead" } = {}) => {
  trackMetaEvent("Lead", {
    content_name: contentName,
  });

  trackGAEvent("generate_lead", {
    currency: "USD",
  });
};

// ======================================================
// 19. SHARE
// GA4: share
// ======================================================

export const trackShare = ({
  method,
  contentType = "product",
  itemId,
}) => {
  trackGAEvent("share", {
    method,
    content_type: contentType,
    ...(itemId ? { item_id: String(itemId) } : {}),
  });
};

// ======================================================
// 20. CUSTOM EVENT
// ======================================================

export const trackCustomEvent = ({
  eventName,
  parameters = {},
  metaEventName,
  metaParameters = {},
}) => {
  if (!eventName) return;

  trackGAEvent(eventName, parameters);

  if (metaEventName) {
    trackMetaEvent(metaEventName, metaParameters);
  }
};
