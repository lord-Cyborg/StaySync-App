import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { ExternalProperty } from '../../../services/externalDbService';

interface PropertyPhotosProps {
  property: ExternalProperty | null;
  selectedPhotos: Record<string, string>;
  onPhotoSelection: (category: string, url: string, selected: boolean) => void;
  onPhotoUpload?: (file: File, category: string) => Promise<void>;
  onPhotoDelete?: (category: string) => Promise<void>;
  onPhotoEdit?: (oldCategory: string, newCategory: string) => Promise<void>;
}

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({
  property,
  selectedPhotos,
  onPhotoSelection,
  onPhotoUpload,
  onPhotoDelete,
  onPhotoEdit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  if (!property) {
    return (
      <Typography variant="body1">
        No property selected. Please go back and select a property.
      </Typography>
    );
  }
  
  const { photos } = property;
  
  if (!photos || Object.keys(photos).length === 0) {
    return (
      <Typography variant="body1">
        This property has no available photos.
      </Typography>
    );
  }
  
  // Filter categories based on search term
  const filteredCategories = Object.keys(photos).filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onPhotoUpload && newPhotoCategory) {
      onPhotoUpload(files[0], newPhotoCategory);
      setNewPhotoCategory('');
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };

  const submitCategoryEdit = () => {
    if (editingCategory && newCategoryName && onPhotoEdit) {
      onPhotoEdit(editingCategory, newCategoryName);
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Property Photos
      </Typography>
      
      <Typography variant="body1" paragraph>
        Select the photos you want to import for this property. These photos will be used in the property card and gallery.
      </Typography>
      
      {/* Upload New Photo Section */}
      {onPhotoUpload && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Upload New Photo
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Photo Category"
              placeholder="e.g., Living Room, Kitchen, Bedroom 1"
              value={newPhotoCategory}
              onChange={(e) => setNewPhotoCategory(e.target.value)}
              fullWidth
              size="small"
            />
            
            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              disabled={!newPhotoCategory}
            >
              Upload
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Selected Photos Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PhotoLibraryIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            Selected Photos: {Object.keys(selectedPhotos).length}
          </Typography>
        </Box>
        
        <Grid container spacing={1.5}>
          {Object.entries(selectedPhotos).map(([category, url]) => (
            <Grid item key={category} sx={{ width: '420px', flexGrow: 0, flexShrink: 0 }}>
              <Card sx={{ width: '100%', position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={url}
                  alt={category}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {editingCategory === category ? (
                      <TextField
                        size="small"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onBlur={submitCategoryEdit}
                        onKeyPress={(e) => e.key === 'Enter' && submitCategoryEdit()}
                        autoFocus
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {category}
                      </Typography>
                    )}
                    <Box>
                      {onPhotoEdit && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditCategory(category)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onPhotoDelete ? (
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => onPhotoDelete(category)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Chip 
                          label="Selected" 
                          size="small" 
                          color="primary" 
                          onDelete={() => onPhotoSelection(category, url, false)}
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Search Field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by category (e.g., Bedroom, Kitchen, Bathroom)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Divider sx={{ mb: 3 }} />
      
      {/* All Available Photos */}
      <Typography variant="subtitle1" gutterBottom>
        All Available Photos ({filteredCategories.length})
      </Typography>
      
      <Grid container spacing={1.5} sx={{ justifyContent: 'center' }}>
        {filteredCategories.map(category => {
          const url = photos[category];
          const isSelected = !!selectedPhotos[category];
          
          return (
            <Grid item key={category} sx={{ width: '420px', flexGrow: 0, flexShrink: 0 }}>
              <Card sx={{ width: '100%', position: 'relative' }}>
                <CardActionArea 
                  onClick={() => onPhotoSelection(category, url, !isSelected)}
                  sx={{
                    position: 'relative',
                    '&:hover img': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={url}
                    alt={category}
                    sx={{
                      transition: 'transform 0.3s ease-in-out',
                      filter: isSelected ? 'none' : 'grayscale(30%)'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      boxShadow: 2
                    }}
                  >
                    {isSelected ? (
                      <CheckCircleIcon color="primary" fontSize="large" />
                    ) : (
                      <RadioButtonUncheckedIcon color="action" fontSize="large" />
                    )}
                  </Box>
                </CardActionArea>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PropertyPhotos;
