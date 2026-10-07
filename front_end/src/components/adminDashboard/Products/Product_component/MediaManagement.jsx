import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

function MediaManagement({ setFormData, formData }) {
  const mainImageInput = useRef(null);
  const additionalImageInput = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  /*
  ============================================================
  DATA
  ============================================================
  */


const existingImages = formData.multimediaInfo?.image_urls

  const newImages = Array.isArray(formData?.additionalImageFiles)
    ? formData.additionalImageFiles
    : [];

  /*
  ============================================================
  CLEAN OBJECT URLS
  ============================================================
  */

  useEffect(() => {
    return () => {
      newImages.forEach((file) => {
        if (file?.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  /*
  ============================================================
  MAIN IMAGE
  ============================================================
  */

  const handleMainImageChange = (e) => {
  e.preventDefault();

  const file = e.target.files?.[0];

  if (!file) return;
  if (!file.type.startsWith("image/")) {
    e.target.value = "";
    return;
  }

  const preview = URL.createObjectURL(file);

  setFormData((prev) => ({
    ...prev,
    main_image: file,
    mainImageFile: file,
    mainImagePreview: preview,
    mainImageExistingUrl: null,
  }));

  e.target.value = "";
};

 const handleMainImageDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Image URL dragged from another website
  const uri = e.dataTransfer.getData("text/uri-list");

  if (uri) {
    const imageUrl = uri.trim();

    setFormData((prev) => ({
      ...prev,
      main_image: imageUrl,
      mainImageFile: null,
      mainImagePreview: imageUrl,
      mainImageExistingUrl: imageUrl,
    }));

    return;
  }

  // Image/file dragged from computer
  const file = e.dataTransfer.files?.[0];

  if (!file) return;
  if (!file.type.startsWith("image/")) return;

  const preview = URL.createObjectURL(file);

  setFormData((prev) => ({
    ...prev,
    main_image: file,
    mainImageFile: file,
    mainImagePreview: preview,
    mainImageExistingUrl: null,
  }));
};
  const removeMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimediaInfo:{
        ...prev.multimediaInfo,
              main_image: null,

      },
      main_image: null,
  
    mainImageExistingUrl: null,
        
      

      mainImageFile: null,
      mainImagePreview: null,
    }));
  };

  /*
  ============================================================
  ADDITIONAL IMAGES
  ============================================================
  */

  const addAdditionalImages = (files) => {
    const validFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validFiles.length) return;

    const imagesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,

      additionalImageFiles: [
        ...(prev.additionalImageFiles || []),
        ...imagesWithPreview,
      ],

    


    }));
    
  };

  const handleAdditionalImagesChange = (e) => {
    e.preventDefault();

    addAdditionalImages(e.target.files);


  };

  const handleAdditionalImagesDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();

 

  

  // Image URL from another website
const uri = e.dataTransfer.getData("text/uri-list");

 if (uri) {
    setFormData((prev) => ({
      ...prev,
      multimediaInfo: {
        ...prev.multimediaInfo,
        image_urls: [
          ...(prev.multimediaInfo?.image_urls || []),
          uri.trim(),
        ],
      },
    }));

    return;
  }
  // Image/file dragged from the computer
  const files = Array.from(e.dataTransfer.files || []);

  if (files.length) {
    addAdditionalImages(files);
  }
};

  /*
  ============================================================
  REMOVE EXISTING IMAGE
  ============================================================
  */

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,

      multimediaInfo: {
        ...prev.multimediaInfo,

        image_urls: (
          Array.isArray(prev.multimediaInfo?.image_urls)
            ? prev.multimediaInfo.image_urls
            : []
        ).filter((_, i) => i !== index),
      },
    }));

    setOpenDropdown(null);
  };

  /*
  ============================================================
  REMOVE NEW IMAGE
  ============================================================
  */

  const removeNewImage = (index) => {
    setFormData((prev) => {
      const images = [...(prev.additionalImageFiles || [])];

      const removed = images[index];

      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      images.splice(index, 1);

      return {
        ...prev,
        additionalImageFiles: images,
      };
    });

    setOpenDropdown(null);
  };

  /*
  ============================================================
  SET EXISTING IMAGE AS MAIN
  ============================================================
  */
const setExistingImageAsMain = (index) => {
  const image = existingImages[index];

  if (!image) return;

  setFormData((prev) => ({
    ...prev,

    main_image: image,              // ✅ existing URL
    mainImageFile: null,            // ✅ no File
    mainImagePreview: image,       // ✅ preview
    mainImageExistingUrl: image,   // ✅ existing URL
  }));

  setOpenDropdown(null);
};

  /*
  ============================================================
  SET NEW IMAGE AS MAIN
  ============================================================
  */

  const setNewImageAsMain = (index) => {
  const selected = newImages[index];

  if (!selected) return;

  setFormData((prev) => ({
    ...prev,
    
    main_image: selected.file,
    mainImageFile: selected.file,
    mainImagePreview: selected.preview,
    mainImageExistingUrl: null,
  }));

  setOpenDropdown(null);
};
  /*
  ============================================================
  DRAG OVER
  ============================================================
  */

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /*
  ============================================================
  VIDEO
  ============================================================
  */

  const videoData = formData?.multimediaInfo?.ae_video_dtos;

  /*
  Your API sometimes may return an array:
  
  ae_video_dtos: [...]

  So support both:
  
  ae_video_dtos: {...}
  ae_video_dtos: [...]
  */

  const video =
    Array.isArray(videoData) && videoData.length
      ? videoData[0]
      : videoData;

  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <>
      {/* ======================================================
          MAIN IMAGE
      ====================================================== */}

      <Container>
        <label>Main Image</label>

        <div
          className="productImg-container"
          onDrop={handleMainImageDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={mainImageInput}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleMainImageChange}
          />

          {!formData?.main_image && (
            <button
              type="button"
              className="add-image"
              onClick={() => mainImageInput.current?.click()}
            >
              <AddPhotoAlternateIcon className="add_photo_icon" />

              <span>Drop image here</span>

              <small>or click to browse</small>
            </button>
          )}

          {formData?.main_image && (
            <div className="image-wrapper main-image-wrapper">
              <img
                src={formData.mainImagePreview}
                alt="Main product"
                className="imgpreview"
              />

              <button
                type="button"
                className="remove-image"
                onClick={removeMainImage}
              >
                ×
              </button>
            </div>
          )}

          {/* ==================================================
              VIDEO
          ================================================== */}

          {video?.media_url && (
            <div className="video-wrapper">
              <video controls>
                <source
                  src={video.media_url}
                  type="video/mp4"
                />

                Your browser does not support video.
              </video>
            </div>
          )}
        </div>
      </Container>

      {/* ======================================================
          ADDITIONAL IMAGES
      ====================================================== */}

      <Container>
        <label>Additional Images</label>

        <div
          className="productImg-container"
          onDrop={handleAdditionalImagesDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={additionalImageInput}
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesChange}
          />

          {/* ==================================================
              ADD BUTTON
          ================================================== */}

          <button
            type="button"
            className="add-image"
            onClick={() =>
              additionalImageInput.current?.click()
            }
          >
            <AddPhotoAlternateIcon className="add_photo_icon" />

            <span>Drop images here</span>

            <small>or click to browse</small>
          </button>

          {/* ==================================================
              EXISTING IMAGES
          ================================================== */}

          {existingImages.map((image, index) => (
            <div
              className="image-wrapper"
              key={`existing-${index}`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="imgpreview"
              />

              {/* DROPDOWN */}

              <div className="image-menu-container">
                <button
                  type="button"
                  className="menu-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenDropdown(
                      openDropdown === `existing-${index}`
                        ? null
                        : `existing-${index}`
                    );
                  }}
                >
                  ⋮
                </button>

                {openDropdown === `existing-${index}` && (
                  <div className="image-dropdown">
                    <button
                      type="button"
                      onClick={() =>
                        setExistingImageAsMain(index)
                      }
                    >
                      Set as main image
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() =>
                        removeExistingImage(index)
                      }
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ==================================================
              NEW IMAGES
          ================================================== */}

          {newImages.map((image, index) => (
            <div
              className="image-wrapper new-image"
              key={`new-${index}`}
            >
              <img
                src={image.preview}
                alt={`New product ${index + 1}`}
                className="imgpreview"
              />

              {/* NEW IMAGE BADGE */}

              <span className="new-badge">
                New
              </span>

              {/* DROPDOWN */}

              <div className="image-menu-container">
                <button
                  type="button"
                  className="menu-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenDropdown(
                      openDropdown === `new-${index}`
                        ? null
                        : `new-${index}`
                    );
                  }}
                >
                  ⋮
                </button>

                {openDropdown === `new-${index}` && (
                  <div className="image-dropdown">
                    <button
                      type="button"
                      onClick={() =>
                        setNewImageAsMain(index)
                      }
                    >
                      Set as main image
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() =>
                        removeNewImage(index)
                      }
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

export default MediaManagement;


/* ============================================================
   STYLES
============================================================ */

const Container = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  border: 1px solid #e4ded4;

  label {
    display: block;
    margin-bottom: 12px;
    font-family: sans-serif;
    font-weight: 500;
    color: #1d1c1a;
  }

  .productImg-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    min-height: 170px;
    padding: 12px;

    border: 1px dashed #d5d0c8;
    border-radius: 6px;

    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .productImg-container:hover {
    border-color: #b39a76;
    background: #faf9f6;
  }

  /* ==========================================================
     ADD IMAGE
  ========================================================== */

  .add-image {
    width: 150px;
    height: 150px;

    border: 1px dashed #d5d0c8;
    border-radius: 6px;

    background: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .add-image:hover {
    border-color: #b39a76;
    background: #f7f5f0;
  }

  .add_photo_icon {
    font-size: 5rem;
    color: lightgray;
  }

  .add-image span {
    font-size: 13px;
    color: #5a534a;
    margin-top: 3px;
  }

  .add-image small {
    font-size: 11px;
    color: #77736b;
    margin-top: 3px;
  }

  /* ==========================================================
     IMAGE
  ========================================================== */

  .image-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
  }

  .imgpreview {
    width: 150px;
    height: 150px;

    object-fit: cover;

    border: 1px solid #e4ded4;
    border-radius: 4px;

    cursor: pointer;
    display: block;
  }

  /* ==========================================================
     IMAGE MENU
  ========================================================== */

  .image-menu-container {
    position: absolute;
    top: 6px;
    right: 6px;

    z-index: 20;
  }

  .menu-button {
    width: 30px;
    height: 30px;

    border: none;
    border-radius: 50%;

    background: rgba(255, 255, 255, 0.95);

    color: #1d1c1a;

    font-size: 20px;
    font-weight: bold;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }

  .menu-button:hover {
    background: #f7f5f0;
  }

  /* ==========================================================
     DROPDOWN
  ========================================================== */

  .image-dropdown {
    position: absolute;

    top: 35px;
    right: 0;

    width: 170px;

    background: #ffffff;

    border: 1px solid #e4ded4;
    border-radius: 6px;

    box-shadow:
      0 5px 20px rgba(0, 0, 0, 0.12);

    overflow: hidden;

    z-index: 100;
  }

  .image-dropdown button {
    width: 100%;

    padding: 10px 12px;

    border: none;
    background: #ffffff;

    text-align: left;

    font-size: 13px;

    color: #3a332d;

    cursor: pointer;
  }

  .image-dropdown button:hover {
    background: #f7f5f0;
  }

  .image-dropdown button.danger {
    color: #c0392b;
  }

  /* ==========================================================
     NEW IMAGE
  ========================================================== */

  .new-image {
    border-radius: 4px;
  }

  .new-badge {
    position: absolute;

    bottom: 6px;
    left: 6px;

    padding: 3px 7px;

    background: #1d1c1a;
    color: #ffffff;

    border-radius: 3px;

    font-size: 10px;
    font-weight: 500;

    pointer-events: none;
  }

  /* ==========================================================
     VIDEO
  ========================================================== */

  .video-wrapper {
    width: 300px;
    height: 150px;
  }

  video {
    width: 300px;
    height: 150px;

    object-fit: cover;

    border-radius: 4px;

    background: #000000;
  }

  /* ==========================================================
     MOBILE
  ========================================================== */

  @media (max-width: 600px) {
    .productImg-container {
      justify-content: center;
    }

    .add-image,
    .image-wrapper,
    .imgpreview {
      width: 130px;
      height: 130px;
    }

    .add_photo_icon {
      font-size: 4rem;
    }

    .video-wrapper,
    video {
      width: 100%;
      max-width: 260px;
    }
  }
`;