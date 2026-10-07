const isCloudinaryUrl = (url) => {
  return (
    typeof url === "string" &&
    url.includes("res.cloudinary.com") &&
    url.includes("/upload/")
  );
};

/**
 * Optimize a Cloudinary image URL.
 *
 * The original URL stored in your database is never modified.
 * We only create an optimized delivery URL for the browser.
 */
export const optimizeCloudinaryImage = (
  url,
  {
    width,
    quality = "auto",
    format = "auto",
    dpr = "auto",
  } = {}
) => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
  ];

  if (width) {
    transformations.push(`w_${width}`);
  }

  if (dpr) {
    transformations.push(`dpr_${dpr}`);
  }

  return url.replace(
    "/upload/",
    `/upload/${transformations.join(",")}/`
  );
};

/**
 * Optimize a Cloudinary video URL.
 */
export const optimizeCloudinaryVideo = (
  url,
  {
    width,
    quality = "auto",
    format = "auto",
  } = {}
) => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
  ];

  if (width) {
    transformations.push(`w_${width}`);
  }

  return url.replace(
    "/upload/",
    `/upload/${transformations.join(",")}/`
  );
};