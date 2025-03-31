import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  Box,
  Typography,
  IconButton,
  Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { PropertyInventoryItem } from '../../types/inventory-types';
import { 
  INVENTORY_STATUS_COLORS, 
  INVENTORY_STATUS_LABELS,
  INVENTORY_Status 
} from '../../types/inventory-types';
import { logger } from '../../utils/logger';
import { inventoryCatalogService } from '../../services/inventoryCatalogService';

// Estilização do upload de fotos
const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover
  }
}));

interface AddSubItemModalProps {
  open: boolean;
  parentItem: PropertyInventoryItem;
  onClose: () => void;
  onSave: (newSubItem: PropertyInventoryItem) => Promise<void>;
}

const AddSubItemModal: React.FC<AddSubItemModalProps> = ({
  open,
  parentItem,
  onClose,
  onSave
}) => {
  const [newSubItem, setNewSubItem] = useState<Partial<PropertyInventoryItem>>({
    status: 'ok',
    quantity: 1,
    notes: '',
    specifications: {
      dimensions: '',
      brand: '',
      model: '',
      serialNumber: '',
      value: '',
      material: '',
      manufacturer: ''
    }
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar itens do catálogo quando o modal abrir
  useEffect(() => {
    if (open) {
      loadCatalogItems();
    }
  }, [open]);

  const loadCatalogItems = async () => {
    try {
      setLoading(true);
      const items = await inventoryCatalogService.getCatalogItems({
        category: parentItem.category,
        areaType: parentItem.areaType
      });
      setCatalogItems(items);
    } catch (error) {
      console.error('Error loading catalog items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyInventoryItem, value: any) => {
    setNewSubItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationChange = (field: string, value: string) => {
    setNewSubItem(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + photos.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const generateItemId = (category: string, type: string) => {
    // Pega o prefixo da categoria (ex: 'bed' de 'Furniture-Bed')
    const prefix = category.toLowerCase().split('-')[0];
    // Gera um número sequencial de 3 dígitos
    const sequence = String(Math.floor(Math.random() * 999)).padStart(3, '0');
    return `${prefix}-${sequence}`;
  };

  const generateSpecId = (index: number) => {
    // Gera IDs no formato spec-001, spec-002, etc.
    return `spec-${String(index + 1).padStart(3, '0')}`;
  };

  const handleSave = async () => {
    try {
      if (!newSubItem.name) return;

      // Gerar ID para novo item do catálogo se necessário
      const catalogId = newSubItem.catalogItemId || 
        generateItemId(parentItem.category, parentItem.type);

      // Gerar ID para o item da propriedade
      const propertyItemId = `prop-${catalogId}`;

      // Preparar especificações
      const specifications = [
        {
          id: generateSpecId(0),
          name: "Dimensions",
          value: newSubItem.specifications?.dimensions || '',
          unit: "inches",
          type: "dimension" as const
        },
        {
          id: generateSpecId(1),
          name: "Material",
          value: newSubItem.specifications?.material || '',
          unit: "",
          type: "material" as const
        },
        {
          id: generateSpecId(2),
          name: "Brand",
          value: newSubItem.specifications?.brand || '',
          unit: "",
          type: "other" as const
        },
        {
          id: generateSpecId(3),
          name: "Model",
          value: newSubItem.specifications?.model || '',
          unit: "",
          type: "other" as const
        },
        {
          id: generateSpecId(4),
          name: "Serial Number",
          value: newSubItem.specifications?.serialNumber || '',
          unit: "",
          type: "other" as const
        },
        {
          id: generateSpecId(5),
          name: "Value",
          value: newSubItem.specifications?.value || '0',
          unit: "USD",
          type: "other" as const
        }
      ].filter(spec => spec.value !== ''); // Remove specs vazias

      // Preparar os dados do sub-item
      const subItemData: Partial<PropertyInventoryItem> = {
        ...newSubItem,
        id: propertyItemId,
        catalogItemId: catalogId,
        propertyId: parentItem.propertyId,
        roomId: parentItem.roomId,
        areaType: parentItem.areaType,
        category: parentItem.category,
        type: parentItem.type,
        groups: parentItem.groups,
        parentId: parentItem.id,
        specifications,
        manufacturer: newSubItem.specifications?.manufacturer
      };

      // Se não tem catalogItemId, é um item novo
      if (!newSubItem.catalogItemId) {
        // Criar novo item no catálogo
        const catalogItem = await inventoryCatalogService.createCatalogItem({
          id: catalogId,
          name: newSubItem.name!,
          category: parentItem.category,
          type: parentItem.type,
          groups: parentItem.groups || [],
          description: newSubItem.notes,
          specifications: subItemData.specifications || [],
          defaultValue: parseFloat(newSubItem.specifications?.value || '0'),
          manufacturer: newSubItem.specifications?.manufacturer,
          propertyIds: [parentItem.propertyId]
        });
      }

      // Upload das fotos
      if (photos.length > 0) {
        // TODO: Implementar upload de fotos
        // const uploadedPhotos = await Promise.all(
        //   photos.map(photo => uploadPhoto(photo))
        // );
        // subItemData.photos = uploadedPhotos;
      }

      // Salvar o sub-item
      await onSave(subItemData as PropertyInventoryItem);
      
      onClose();
    } catch (error) {
      console.error('Error saving sub-item:', error);
      // TODO: Mostrar erro ao usuário
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Add Sub-item</Typography>
        <Typography variant="body2" color="textSecondary">
          {`Area: ${parentItem.areaType} | Category: ${parentItem.category}`}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Nome com Autocomplete */}
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              loading={loading}
              options={catalogItems}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.name
              }
              onChange={(_, value) => {
                if (value && typeof value !== 'string') {
                  // Se selecionou um item existente do catálogo
                  setNewSubItem(prev => ({
                    ...prev,
                    catalogItemId: value.id,
                    name: value.name,
                    specifications: value.specifications || prev.specifications
                  }));
                }
              }}
              onInputChange={(_, value) => {
                // Se digitou um novo nome
                handleChange('name', value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Quantidade */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={newSubItem.quantity || 1}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>

          {/* Especificações */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={newSubItem.specifications?.brand || ''}
                  onChange={(e) => handleSpecificationChange('brand', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={newSubItem.specifications?.model || ''}
                  onChange={(e) => handleSpecificationChange('model', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={newSubItem.specifications?.serialNumber || ''}
                  onChange={(e) => handleSpecificationChange('serialNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={newSubItem.specifications?.value || ''}
                  onChange={(e) => handleSpecificationChange('value', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dimensions"
                  placeholder="e.g., 100x60x75 cm"
                  value={newSubItem.specifications?.dimensions || ''}
                  onChange={(e) => handleSpecificationChange('dimensions', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material"
                  value={newSubItem.specifications?.material || ''}
                  onChange={(e) => handleSpecificationChange('material', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={newSubItem.specifications?.manufacturer || ''}
                  onChange={(e) => handleSpecificationChange('manufacturer', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              placeholder="Additional information..."
              value={newSubItem.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Grid>

          {/* Upload de Fotos */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Photos (Max 5)
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <UploadBox>
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography color="textSecondary">
                  Drop photos here or click to upload
                </Typography>
              </UploadBox>
            </label>

            {/* Preview de Fotos */}
            {photos.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {photos.map((photo, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100
                    }}
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePhoto(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'background.paper'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!newSubItem.name}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubItemModal;
