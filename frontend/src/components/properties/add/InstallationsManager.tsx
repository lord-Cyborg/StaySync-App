import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  PhotoLibrary as PhotoLibraryIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ExternalProperty } from '../../../services/externalDbService';

interface Installation {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
}

interface InstallationsManagerProps {
  property: ExternalProperty | null;
  selectedPhotos: Record<string, string>;
  onPhotoSelection: (category: string, url: string, selected: boolean) => void;
  onPhotoUpload?: (file: File, category: string) => Promise<void>;
  onSave?: (installations: Installation[]) => Promise<void>;
}

const INSTALLATION_CATEGORIES = [
  'Bedroom',
  'Bathroom',
  'Kitchen',
  'Living Room',
  'Dining Room',
  'Outdoor',
  'Pool',
  'Garage',
  'Laundry',
  'Other'
];

const InstallationsManager: React.FC<InstallationsManagerProps> = ({
  property,
  selectedPhotos,
  onPhotoSelection,
  onPhotoUpload,
  onSave
}) => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentInstallation, setCurrentInstallation] = useState<Installation | null>(null);
  const [newInstallation, setNewInstallation] = useState<Partial<Installation>>({
    category: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize installations from selected photos
  useEffect(() => {
    if (selectedPhotos) {
      const initialInstallations = Object.entries(selectedPhotos).map(([category, url], index) => ({
        id: `inst-${index}-${Date.now()}`,
        category,
        description: `${category} installation`,
        imageUrl: url
      }));
      setInstallations(initialInstallations);
    }
  }, []);

  const handleAddInstallation = () => {
    setNewInstallation({
      category: '',
      description: '',
      imageUrl: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleEditInstallation = (installation: Installation) => {
    setCurrentInstallation(installation);
    setIsEditDialogOpen(true);
  };

  const handleDeleteInstallation = (id: string) => {
    setInstallations(prev => prev.filter(inst => inst.id !== id));
    
    // Also remove from selected photos if it exists there
    const installationToRemove = installations.find(inst => inst.id === id);
    if (installationToRemove) {
      onPhotoSelection(installationToRemove.category, installationToRemove.imageUrl, false);
    }
  };

  const handleSaveNewInstallation = () => {
    if (newInstallation.category && newInstallation.imageUrl) {
      const installation: Installation = {
        id: `inst-${installations.length}-${Date.now()}`,
        category: newInstallation.category,
        description: newInstallation.description || `${newInstallation.category} installation`,
        imageUrl: newInstallation.imageUrl
      };
      
      setInstallations(prev => [...prev, installation]);
      setIsAddDialogOpen(false);
      
      // Also add to selected photos
      onPhotoSelection(installation.category, installation.imageUrl, true);
    }
  };

  const handleUpdateInstallation = () => {
    if (currentInstallation) {
      setInstallations(prev => 
        prev.map(inst => 
          inst.id === currentInstallation.id ? currentInstallation : inst
        )
      );
      setIsEditDialogOpen(false);
      
      // Update in selected photos
      onPhotoSelection(currentInstallation.category, currentInstallation.imageUrl, true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onPhotoUpload && newInstallation.category) {
      try {
        setLoading(true);
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 200);
        
        await onPhotoUpload(files[0], newInstallation.category);
        
        // Get the URL from selectedPhotos after upload
        const uploadedUrl = selectedPhotos[newInstallation.category];
        if (uploadedUrl) {
          setNewInstallation(prev => ({
            ...prev,
            imageUrl: uploadedUrl
          }));
        }
        
        clearInterval(interval);
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleSaveAll = async () => {
    if (onSave) {
      setLoading(true);
      try {
        await onSave(installations);
      } catch (error) {
        console.error('Error saving installations:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter installations based on search term
  const filteredInstallations = installations.filter(installation => 
    installation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    installation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!property) {
    return (
      <Typography variant="body1">
        No property selected. Please go back and select a property.
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Property Installations Manager
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={handleAddInstallation}
          >
            Add Installation
          </Button>
          
          {onSave && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveAll}
              disabled={loading}
            >
              Save All
            </Button>
          )}
        </Box>
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search installations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      
      <Typography variant="subtitle1" gutterBottom>
        Current Installations ({filteredInstallations.length})
      </Typography>
      
      <Grid container spacing={1.5} sx={{ justifyContent: 'center' }}>
        {filteredInstallations.map(installation => (
          <Grid item key={installation.id} sx={{ width: '420px', flexGrow: 0, flexShrink: 0 }}>
            <Card sx={{ width: '100%', position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={installation.imageUrl}
                alt={installation.category}
              />
              <CardContent>
                <Typography variant="subtitle1">
                  {installation.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {installation.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditInstallation(installation)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteInstallation(installation.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredInstallations.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No installations found. Click "Add Installation" to add your first installation.
          </Typography>
        </Paper>
      )}
      
      {/* Add Installation Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Installation
          <IconButton
            aria-label="close"
            onClick={() => setIsAddDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newInstallation.category}
              label="Category"
              onChange={(e) => setNewInstallation(prev => ({ ...prev, category: e.target.value }))}
            >
              {INSTALLATION_CATEGORIES.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Description"
            value={newInstallation.description}
            onChange={(e) => setNewInstallation(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              disabled={!newInstallation.category || loading}
              fullWidth
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
            
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress variant="determinate" value={uploadProgress} size={24} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
          
          {newInstallation.imageUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <img 
                src={newInstallation.imageUrl} 
                alt="Preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNewInstallation}
            variant="contained"
            disabled={!newInstallation.category || !newInstallation.imageUrl}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Installation Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Installation
          <IconButton
            aria-label="close"
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentInstallation && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentInstallation.category}
                  label="Category"
                  onChange={(e) => setCurrentInstallation(prev => prev ? { ...prev, category: e.target.value } : null)}
                >
                  {INSTALLATION_CATEGORIES.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Description"
                value={currentInstallation.description}
                onChange={(e) => setCurrentInstallation(prev => prev ? { ...prev, description: e.target.value } : null)}
                margin="normal"
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Image:
                </Typography>
                <img 
                  src={currentInstallation.imageUrl} 
                  alt={currentInstallation.category} 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateInstallation}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstallationsManager;
