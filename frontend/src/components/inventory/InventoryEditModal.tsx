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

interface InventoryEditModalProps {
  open: boolean;
  item: PropertyInventoryItem | null;
  onClose: () => void;
  onSave: (updatedItem: PropertyInventoryItem) => Promise<void>;
}

const InventoryEditModal: React.FC<InventoryEditModalProps> = ({
  open,
  item,
  onClose,
  onSave
}) => {
  const [editedItem, setEditedItem] = useState<PropertyInventoryItem | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  
  // Inicializar o item editado quando o modal abre
  useEffect(() => {
    if (item) {
      setEditedItem({
        ...item,
        status: item.status || 'ok',
        quantity: item.quantity || 1,
        notes: item.notes || '',
        specifications: item.specifications || {
          dimensions: '',
          brand: '',
          model: '',
          serialNumber: '',
          value: ''
        }
      });
    }
  }, [item]);

  const handleChange = (field: keyof PropertyInventoryItem, value: any) => {
    if (editedItem) {
      setEditedItem(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSpecificationChange = (field: string, value: string) => {
    if (editedItem) {
      setEditedItem(prev => ({
        ...prev!,
        specifications: {
          ...prev!.specifications,
          [field]: value
        }
      }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!editedItem) return;

    try {
      logger.debug('InventoryEditModal', 'Saving item', {
        itemId: editedItem.id,
        status: editedItem.status,
        notes: editedItem.notes
      });

      // TODO: Implementar upload de fotos
      await onSave(editedItem);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      // Mostrar erro ao usuário
    }
  };

  if (!editedItem) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editedItem.id ? 'Edit Item' : 'Add Item'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Descrição/Notas */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description/Notes"
              placeholder="Describe the current state, issues, or any relevant information..."
              value={editedItem.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Grid>

          {/* Upload de Fotos */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Photos
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

          {/* Status */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" gutterBottom>
                Status
              </Typography>
              <RadioGroup
                row
                value={editedItem.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {Object.entries(INVENTORY_STATUS_LABELS).map(([value, label]) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={
                      <Radio 
                        sx={{
                          color: INVENTORY_STATUS_COLORS[value as INVENTORY_Status],
                          '&.Mui-checked': {
                            color: INVENTORY_STATUS_COLORS[value as INVENTORY_Status]
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: INVENTORY_STATUS_COLORS[value as INVENTORY_Status]
                          }}
                        />
                        {label}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
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
                  label="Dimensions"
                  value={editedItem.specifications?.dimensions || ''}
                  onChange={(e) => handleSpecificationChange('dimensions', e.target.value)}
                  placeholder="e.g., 100x60x75cm"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={editedItem.specifications?.brand || ''}
                  onChange={(e) => handleSpecificationChange('brand', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={editedItem.specifications?.model || ''}
                  onChange={(e) => handleSpecificationChange('model', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={editedItem.specifications?.serialNumber || ''}
                  onChange={(e) => handleSpecificationChange('serialNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={editedItem.specifications?.value || ''}
                  onChange={(e) => handleSpecificationChange('value', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography>$</Typography>
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Quantidade */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={editedItem.quantity || 1}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryEditModal;
