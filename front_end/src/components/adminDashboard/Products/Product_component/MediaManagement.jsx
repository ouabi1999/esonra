import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

/**
 * MediaManagement
 * - Keeps the main image upload separate, as in the original component.
 * - Lets existing URLs and newly selected files be reordered together in one gallery.
 * - Stores the gallery order in formData.multimediaInfo.image_order.
 * - Keeps existing upload fields: main_image, mainImageFile, mainImagePreview,
 *   mainImageExistingUrl, additionalImageFiles, multimediaInfo.image_urls.
 *
 * IMPORTANT: The product-save handler must resolve `new:<id>` entries in
 * multimediaInfo.image_order to the Cloudinary URLs returned after uploading
 * those files. See the note after the component for the exact expected format.
 */
function MediaManagement({ setFormData, formData }) {
  const mainImageInput = useRef(null);
  const additionalImageInput = useRef(null);
  const dragItemRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const existingImages = Array.isArray(formData?.multimediaInfo?.image_urls)
    ? formData.multimediaInfo.image_urls
    : [];

  const newImages = Array.isArray(formData?.additionalImageFiles)
    ? formData.additionalImageFiles
    : [];

  const makeExistingKey = (url) => `existing:${url}`;
  const makeNewKey = (item) => `new:${item.id}`;

  // Migrate/initialize order metadata without changing the underlying image arrays.
  useEffect(() => {
    const currentOrder = formData?.multimediaInfo?.image_order;
    const validKeys = new Set([
      ...existingImages.map(makeExistingKey),
      ...newImages.filter((item) => item?.id).map(makeNewKey),
    ]);

    const validCurrent = Array.isArray(currentOrder)
      ? currentOrder.filter((entry) => entry && validKeys.has(entry.key))
      : [];
    const present = new Set(validCurrent.map((entry) => entry.key));
    const missing = [
      ...existingImages.map((url) => ({ key: makeExistingKey(url), type: "existing", url })),
      ...newImages
        .filter((item) => item?.id)
        .map((item) => ({ key: makeNewKey(item), type: "new", id: item.id })),
    ].filter((entry) => !present.has(entry.key));

    const nextOrder = [...validCurrent, ...missing];
    const same = Array.isArray(currentOrder) &&
      currentOrder.length === nextOrder.length &&
      currentOrder.every((entry, index) => entry?.key === nextOrder[index]?.key);

    if (!same) {
      setFormData((prev) => ({
        ...prev,
        multimediaInfo: {
          ...(prev.multimediaInfo || {}),
          image_order: nextOrder,
        },
      }));
    }
    // Image identity/order is the intended trigger; setFormData is stable in normal use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingImages.join("\n"), newImages.map((item) => item?.id).join("\n")]);

  const galleryItems = useMemo(() => {
    const byKey = new Map();
    existingImages.forEach((url) => {
      const key = makeExistingKey(url);
      byKey.set(key, { key, type: "existing", url, preview: url });
    });
    newImages.forEach((item) => {
      if (!item?.id) return;
      const key = makeNewKey(item);
      byKey.set(key, {
        key,
        type: "new",
        id: item.id,
        file: item.file,
        preview: item.preview,
      });
    });

    const order = Array.isArray(formData?.multimediaInfo?.image_order)
      ? formData.multimediaInfo.image_order
      : [];
    const ordered = order.map((entry) => byKey.get(entry?.key)).filter(Boolean);
    const seen = new Set(ordered.map((item) => item.key));
    const remainder = [...byKey.values()].filter((item) => !seen.has(item.key));
    return [...ordered, ...remainder];
  }, [existingImages, newImages, formData?.multimediaInfo?.image_order]);

  const setImageOrder = (items) => {
    setFormData((prev) => ({
      ...prev,
      multimediaInfo: {
        ...(prev.multimediaInfo || {}),
        image_order: items.map((item) => {
          if (item.type === "existing") {
            return { key: makeExistingKey(item.url), type: "existing", url: item.url };
          }
          return { key: makeNewKey(item), type: "new", id: item.id };
        }),
      },
    }));
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
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
    event.target.value = "";
  };

  const handleMainImageDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const uri = event.dataTransfer.getData("text/uri-list");
    if (uri) {
      const imageUrl = uri.trim().split("\n")[0];
      if (!imageUrl) return;
      setFormData((prev) => ({
        ...prev,
        main_image: imageUrl,
        mainImageFile: null,
        mainImagePreview: imageUrl,
        mainImageExistingUrl: imageUrl,
      }));
      return;
    }
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
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
      multimediaInfo: {
        ...(prev.multimediaInfo || {}),
        main_image: null,
      },
      main_image: null,
      mainImageExistingUrl: null,
      mainImageFile: null,
      mainImagePreview: null,
    }));
  };

  const addAdditionalImages = (files) => {
    const validFiles = Array.from(files || []).filter((file) =>
      file?.type?.startsWith("image/")
    );
    if (!validFiles.length) return;

    const imagesWithPreview = validFiles.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => {
      const oldNew = Array.isArray(prev.additionalImageFiles)
        ? prev.additionalImageFiles
        : [];
      const oldOrder = Array.isArray(prev.multimediaInfo?.image_order)
        ? prev.multimediaInfo.image_order
        : [];
      const appendedOrder = imagesWithPreview.map((item) => ({
        key: `new:${item.id}`,
        type: "new",
        id: item.id,
      }));
      return {
        ...prev,
        additionalImageFiles: [...oldNew, ...imagesWithPreview],
        multimediaInfo: {
          ...(prev.multimediaInfo || {}),
          image_order: [...oldOrder, ...appendedOrder],
        },
      };
    });
  };

  const handleAdditionalImagesChange = (event) => {
    addAdditionalImages(event.target.files);
    event.target.value = "";
  };

  const handleAdditionalImagesDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const uri = event.dataTransfer.getData("text/uri-list");
    if (uri) {
      const imageUrl = uri.trim().split("\n")[0];
      if (!imageUrl) return;
      setFormData((prev) => {
        const urls = Array.isArray(prev.multimediaInfo?.image_urls)
          ? prev.multimediaInfo.image_urls
          : [];
        const order = Array.isArray(prev.multimediaInfo?.image_order)
          ? prev.multimediaInfo.image_order
          : [];
        return {
          ...prev,
          multimediaInfo: {
            ...(prev.multimediaInfo || {}),
            image_urls: [...urls, imageUrl],
            image_order: [...order, {
              key: `existing:${imageUrl}`,
              type: "existing",
              url: imageUrl,
            }],
          },
        };
      });
      return;
    }
    addAdditionalImages(event.dataTransfer.files);
  };

  const removeGalleryImage = (item) => {
    if (item.type === "existing") {
      setFormData((prev) => {
        const urls = Array.isArray(prev.multimediaInfo?.image_urls)
          ? prev.multimediaInfo.image_urls
          : [];
        const removedOnce = new Set();
        const nextUrls = urls.filter((url) => {
          if (url === item.url && !removedOnce.has(url)) {
            removedOnce.add(url);
            return false;
          }
          return true;
        });
        const order = (Array.isArray(prev.multimediaInfo?.image_order)
          ? prev.multimediaInfo.image_order
          : []).filter((entry) => entry?.key !== item.key);
        return {
          ...prev,
          multimediaInfo: {
            ...(prev.multimediaInfo || {}),
            image_urls: nextUrls,
            image_order: order,
          },
        };
      });
    } else {
      setFormData((prev) => {
        const images = Array.isArray(prev.additionalImageFiles)
          ? prev.additionalImageFiles
          : [];
        const removed = images.find((image) => image.id === item.id);
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        return {
          ...prev,
          additionalImageFiles: images.filter((image) => image.id !== item.id),
          multimediaInfo: {
            ...(prev.multimediaInfo || {}),
            image_order: (Array.isArray(prev.multimediaInfo?.image_order)
              ? prev.multimediaInfo.image_order
              : []).filter((entry) => entry?.key !== item.key),
          },
        };
      });
    }
    setOpenDropdown(null);
  };

  const setGalleryImageAsMain = (item) => {
    if (item.type === "existing") {
      setFormData((prev) => ({
        ...prev,
        main_image: item.url,
        mainImageFile: null,
        mainImagePreview: item.url,
        mainImageExistingUrl: item.url,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        main_image: item.file,
        mainImageFile: item.file,
        mainImagePreview: item.preview,
        mainImageExistingUrl: null,
      }));
    }
    setOpenDropdown(null);
  };

  const handleGalleryDragStart = (event, item) => {
    dragItemRef.current = item.key;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.key);
    event.currentTarget.classList.add("is-dragging");
  };

  const handleGalleryDragEnd = (event) => {
    event.currentTarget.classList.remove("is-dragging");
    dragItemRef.current = null;
    setDragOverKey(null);
  };

  const handleGalleryDrop = (event, targetItem) => {
    event.preventDefault();
    event.stopPropagation();
    const sourceKey = dragItemRef.current || event.dataTransfer.getData("text/plain");
    if (!sourceKey || sourceKey === targetItem.key) {
      setDragOverKey(null);
      return;
    }
    const fromIndex = galleryItems.findIndex((item) => item.key === sourceKey);
    const toIndex = galleryItems.findIndex((item) => item.key === targetItem.key);
    if (fromIndex < 0 || toIndex < 0) return;
    const reordered = [...galleryItems];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setImageOrder(reordered);
    setDragOverKey(null);
    setOpenDropdown(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  };

  const videoData = formData?.multimediaInfo?.ae_video_dtos;
  const video = Array.isArray(videoData) && videoData.length
    ? videoData[0]
    : videoData;

  // Revoke object URLs when the component unmounts.
  useEffect(() => {
    return () => {
      const current = formData?.additionalImageFiles || [];
      current.forEach((item) => {
        if (item?.preview?.startsWith("blob:")) URL.revokeObjectURL(item.preview);
      });
      if (formData?.mainImagePreview?.startsWith?.("blob:")) {
        URL.revokeObjectURL(formData.mainImagePreview);
      }
    };
    // Cleanup only on unmount; refs/state are intentionally captured from the final render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container>
        <SectionLabel>Main Image</SectionLabel>
        <div
          className="productImg-container main-dropzone"
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
                src={formData.mainImagePreview || formData.mainImageExistingUrl || formData.main_image}
                alt="Main product"
                className="imgpreview"
              />
              <button
                type="button"
                className="remove-image"
                onClick={removeMainImage}
                aria-label="Remove main image"
              >
                ×
              </button>
            </div>
          )}

          {video?.media_url && (
            <div className="video-wrapper">
              <video controls>
                <source src={video.media_url} type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          )}
        </div>
      </Container>

      <Container>
        <SectionLabel>Additional Images</SectionLabel>
        <p className="gallery-help">
          Drag any photo onto another photo to change its position. Existing and new images can be reordered together.
        </p>

        <div
          className="productImg-container gallery-dropzone"
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

          <button
            type="button"
            className="add-image"
            onClick={() => additionalImageInput.current?.click()}
          >
            <AddPhotoAlternateIcon className="add_photo_icon" />
            <span>Add images</span>
            <small>or drop files here</small>
          </button>

          {galleryItems.map((item, index) => (
            <div
              className={`image-wrapper gallery-image ${item.type === "new" ? "new-image" : ""} ${dragOverKey === item.key ? "drag-over" : ""}`}
              key={item.key}
              draggable
              onDragStart={(event) => handleGalleryDragStart(event, item)}
              onDragEnd={handleGalleryDragEnd}
              onDragOver={(event) => {
                handleDragOver(event);
                setDragOverKey(item.key);
              }}
              onDragLeave={() => setDragOverKey((current) => current === item.key ? null : current)}
              onDrop={(event) => handleGalleryDrop(event, item)}
              title="Drag to reorder"
            >
              <img
                src={item.preview}
                alt={`Product image ${index + 1}`}
                className="imgpreview"
                draggable={false}
              />

              <span className="position-badge">{index + 1}</span>
              <span className="drag-handle" aria-hidden="true">
                <DragIndicatorIcon fontSize="small" />
              </span>

              {item.type === "new" && <span className="new-badge">New</span>}

              <div className="image-menu-container">
                <button
                  type="button"
                  className="menu-button"
                  aria-label={`Options for image ${index + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenDropdown((current) => current === item.key ? null : item.key);
                  }}
                >
                  ⋮
                </button>

                {openDropdown === item.key && (
                  <div className="image-dropdown">
                    <button type="button" onClick={() => setGalleryImageAsMain(item)}>
                      Set as main image
                    </button>
                    <button type="button" className="danger" onClick={() => removeGalleryImage(item)}>
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

const Container = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  border: 1px solid #e4ded4;

  .productImg-container {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    min-height: 170px;
    padding: 12px;
    border: 1px dashed #d5d0c8;
    border-radius: 6px;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .productImg-container:hover {
    border-color: #b39a76;
    background: #faf9f6;
  }

  .gallery-help {
    margin: -3px 0 12px;
    color: #77736b;
    font-size: 12px;
    line-height: 1.5;
  }

  .add-image {
    flex: 0 0 150px;
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
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .add-image:hover {
    border-color: #b39a76;
    background: #f7f5f0;
  }

  .add_photo_icon {
    font-size: 4.5rem;
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

  .image-wrapper {
    position: relative;
    flex: 0 0 150px;
    width: 150px;
    height: 150px;
  }

  .imgpreview {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border: 1px solid #e4ded4;
    border-radius: 4px;
    display: block;
    user-select: none;
  }

  .gallery-image {
    cursor: grab;
    transition: opacity 0.15s ease, outline-color 0.15s ease, transform 0.15s ease;
  }

  .gallery-image:active { cursor: grabbing; }
  .gallery-image.is-dragging { opacity: 0.35; }
  .gallery-image.drag-over {
    outline: 3px solid #b39a76;
    outline-offset: 2px;
    transform: scale(1.02);
  }

  .position-badge {
    position: absolute;
    left: 6px;
    top: 6px;
    min-width: 23px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    border-radius: 4px;
    color: white;
    background: rgba(29, 28, 26, 0.82);
    font-size: 11px;
    font-weight: 600;
    pointer-events: none;
  }

  .drag-handle {
    position: absolute;
    left: 34px;
    top: 6px;
    width: 23px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #1d1c1a;
    background: rgba(255, 255, 255, 0.94);
    pointer-events: none;
  }

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

  .menu-button:hover { background: #f7f5f0; }

  .image-dropdown {
    position: absolute;
    top: 35px;
    right: 0;
    width: 170px;
    background: #ffffff;
    border: 1px solid #e4ded4;
    border-radius: 6px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
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

  .image-dropdown button:hover { background: #f7f5f0; }
  .image-dropdown button.danger { color: #c0392b; }

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

  .video-wrapper { width: 300px; height: 150px; }
  video {
    width: 300px;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    background: #000000;
  }

  @media (max-width: 600px) {
    .productImg-container { justify-content: center; }
    .add-image, .image-wrapper { flex-basis: 130px; width: 130px; height: 130px; }
    .imgpreview { width: 130px; height: 130px; }
    .add_photo_icon { font-size: 3.8rem; }
    .video-wrapper, video { width: 100%; max-width: 260px; }
  }
`;

const SectionLabel = styled.label`
  display: block;
  margin-bottom: 12px;
  font-family: sans-serif;
  font-weight: 500;
  color: #1d1c1a;
`;

