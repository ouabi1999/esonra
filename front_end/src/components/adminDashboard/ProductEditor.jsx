import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ProductForm from "./AliDropship/ProductForm";
import DescriptionEditor from "./AliDropship/DescriptionEditor";
import PackageInfo from "./AliDropship/PackageInfo";
import StoreInfo from "./AliDropship/StoreInfo";
import MediaGallery from "./AliDropship/MediaGallery";
import AdvancedSettings from "./AliDropship/AdvancedSettings";

const Container = styled.div`padding: 2rem; background: #f5f5f5; min-height: 100vh;`;
const CardWrapper = styled.div`background: #fff; padding: 1.5rem; margin-bottom: 2rem; border-radius: 12px;`;

const ProductEditor = ({ product }) => {
  const [editableProduct, setEditableProduct] = useState(product);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSKUIndex, setSelectedSKUIndex] = useState(0);

  const handleSKUChange = (e) => setSelectedSKUIndex(e.target.value);

  const currentSKU = editableProduct.ae_item_sku_info_dtos[selectedSKUIndex];

  return (
    <Container>
      {/* Main layout */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CardWrapper><ProductForm product={editableProduct} setProduct={setEditableProduct} /></CardWrapper>
          <CardWrapper><DescriptionEditor product={editableProduct} setProduct={setEditableProduct} /></CardWrapper>
          <CardWrapper><PackageInfo product={editableProduct} setProduct={setEditableProduct} /></CardWrapper>
          <CardWrapper><AdvancedSettings product={editableProduct} setProduct={setEditableProduct} /></CardWrapper>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardWrapper><MediaGallery product={editableProduct} /></CardWrapper>
          <CardWrapper><StoreInfo product={editableProduct} /></CardWrapper>
          <Button variant="contained" color="primary" fullWidth onClick={() => setPreviewOpen(true)}>
            Preview Product
          </Button>
        </Grid>
      </Grid>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Product Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom>{editableProduct.ae_item_base_info_dto.subject}</Typography>
          <Box dangerouslySetInnerHTML={{ __html: editableProduct.ae_item_base_info_dto.detail }} sx={{ mb: 2 }} />

          {/* SKU Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select SKU</InputLabel>
            <Select value={selectedSKUIndex} label="Select SKU" onChange={handleSKUChange}>
              {editableProduct.ae_item_sku_info_dtos.map((sku, idx) => (
                <MenuItem key={idx} value={idx}>{sku.sku_code || `SKU ${idx + 1}`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected SKU info */}
          {currentSKU && (
            <Box sx={{ mb: 2 }}>
              <Typography>Price: {currentSKU.sku_price} {currentSKU.currency_code}</Typography>
              <Typography>Stock: {currentSKU.sku_available_stock}</Typography>
              {/* SKU images */}
              {currentSKU.ae_sku_property_dtos?.length > 0 && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {currentSKU.ae_sku_property_dtos.map((img, idx) => (
                    <Grid item key={idx}>
                      <img src={img.sku_image} alt={`sku-img-${idx}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {/* SKU video */}
              {currentSKU.ae_video_dtos?.length > 0 && (
                <video
                  src={currentSKU.ae_video_dtos[0].media_url}
                  poster={currentSKU.ae_video_dtos[0].poster_url}
                  controls
                  style={{ width: '100%', maxHeight: 300, borderRadius: 8, marginBottom: 16 }}
                />
              )}
            </Box>
          )}

          {/* Store info */}
          <Typography variant="subtitle1">Store: {editableProduct.ae_store_info.store_name}</Typography>
          <Typography>Rating: {editableProduct.ae_store_info.item_as_described_rating}</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProductEditor;
