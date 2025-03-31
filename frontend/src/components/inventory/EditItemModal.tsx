import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ItemData) => void;
  onResolve: () => void;
  initialData?: ItemData;
}

export interface ItemData {
  description: string;
  severity: 'low' | 'medium' | 'high';
  images: File[];
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  open,
  onClose,
  onSave,
  onResolve,
  initialData,
}) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>(
    initialData?.severity || 'low'
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  }, [images, imagePreviewUrls]);

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleSave = () => {
    onSave({
      description,
      severity,
      images,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Severity</InputLabel>
          <Select
            value={severity}
            label="Severity"
            onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high')}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={handleImageUpload}
            disabled={images.length >= 5}
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<PhotoCamera />}
              disabled={images.length >= 5}
            >
              Upload Images ({images.length}/5)
            </Button>
          </label>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {imagePreviewUrls.map((url, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
              }}
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            if (window.confirm('Marcar este item como resolvido?')) {
              onResolve();
            }
          }}
          color="success"
        >
          Resolver
        </Button>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;
