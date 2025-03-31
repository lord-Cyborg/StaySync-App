import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoLibrary as PhotoLibraryIcon } from '@mui/icons-material';
import PropertySelection from '../components/properties/add/PropertySelection';
import PropertyConfiguration from '../components/properties/add/PropertyConfiguration';
import PropertyPhotos from '../components/properties/add/PropertyPhotos';
import InstallationsManager from '../components/properties/add/InstallationsManager';
import { propertyService } from '../services/propertyService';
import { externalDbService, ExternalProperty } from '../services/externalDbService';

const AddPropertyPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [externalProperties, setExternalProperties] = useState<ExternalProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<ExternalProperty | null>(null);
  const [propertyConfig, setPropertyConfig] = useState({
    gateCode: '',
    doorCode: '',
    wifiPassword: '',
    status: 'B2B',
    addressNumber: '',
    addressStreet: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Record<string, string>>({});
  const [useInstallationsManager, setUseInstallationsManager] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadExternalProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading external properties...');
        const properties = await externalDbService.getProperties();
        console.log(`Loaded ${properties.length} external properties`);
        setExternalProperties(properties);
      } catch (error) {
        console.error('Error loading external properties:', error);
        setError('Could not load properties. Please check if the server is running and the JSON file is accessible.');
      } finally {
        setLoading(false);
      }
    };
    
    loadExternalProperties();
  }, []);
  
  useEffect(() => {
    if (!selectedProperty) return;
    
    setPropertyConfig({
      gateCode: '',
      doorCode: '',
      wifiPassword: '',
      status: 'B2B',
      addressNumber: selectedProperty.location?.address?.split(' ')[0] || '',
      addressStreet: selectedProperty.location?.address?.split(' ').slice(1).join(' ') || ''
    });
    
    // Carregar fotos
    const photos: Record<string, string> = {};
    Object.entries(selectedProperty.photos).forEach(([category, url]) => {
      photos[category] = url;
    });
    setSelectedPhotos(photos);
    
  }, [selectedProperty]);
  
  const handlePropertySelect = (property: ExternalProperty) => {
    setSelectedProperty(property);
    // Avança automaticamente para a próxima etapa
    setActiveStep(1);
    
    // Pre-fill configurations with available data
    setPropertyConfig({
      gateCode: property.gateCode || '',
      doorCode: property.doorCode || '',
      wifiPassword: property.wifiPassword || '',
      status: property.status || 'B2B',
      addressNumber: property.location?.address?.split(' ')[0] || '',
      addressStreet: property.location?.address?.split(' ').slice(1).join(' ') || ''
    });

    // Pre-select main images
    if (property.photos) {
      const mainPhotos: Record<string, string> = {};
      
      // Always include Living Room if available
      if (property.photos['Living Room']) {
        mainPhotos['Living Room'] = property.photos['Living Room'];
      }
      
      // Always include Kitchen if available
      if (property.photos['Kitchen']) {
        mainPhotos['Kitchen'] = property.photos['Kitchen'];
      }
      
      // Include first bedroom
      const bedrooms = Object.keys(property.photos).filter(key => key.includes('Bedroom'));
      if (bedrooms.length > 0) {
        mainPhotos[bedrooms[0]] = property.photos[bedrooms[0]];
      }
      
      setSelectedPhotos(mainPhotos);
    }
  };
  
  const handleConfigChange = (field: string, value: string) => {
    setPropertyConfig({
      ...propertyConfig,
      [field]: value
    });
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setIsPhotosDialogOpen(true);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  const handleSave = async () => {
    if (!selectedProperty) return;
    
    setLoading(true);
    
    try {
      // Prepare property data
      const propertyData: any = {
        id: selectedProperty.id,
        propertyId: selectedProperty.id,
        addressNumber: selectedProperty.id, // Garantir consistência com o ID
        addressStreet: propertyConfig.addressStreet || selectedProperty.location?.address?.split(' ').slice(1).join(' ') || '',
        address: `${selectedProperty.id} ${propertyConfig.addressStreet || selectedProperty.location?.address?.split(' ').slice(1).join(' ') || ''}`,
        gateCode: propertyConfig.gateCode || '',
        doorCode: propertyConfig.doorCode || '',
        wifiPassword: propertyConfig.wifiPassword || '',
        status: (propertyConfig.status === 'B2B' || propertyConfig.status === 'N/R' || propertyConfig.status === 'b2b') 
               ? 'ok' as any // Convertendo para um valor válido de InspectionStatus
               : 'ok' as any,
        mainImage: selectedProperty.photos['Living Room'] || 
                  selectedProperty.photos['Uncategorized'] || 
                  Object.values(selectedProperty.photos)[0] || '',
        images: [], // Inicializa com array vazio, será preenchido posteriormente
        // Adicionar outros campos necessários
        location: {
          address: `${selectedProperty.id} ${propertyConfig.addressStreet || selectedProperty.location?.address?.split(' ').slice(1).join(' ') || ''}`,
          city: selectedProperty.location?.city || '',
          country: selectedProperty.location?.country || '',
        },
        photos: selectedPhotos,
        title: selectedProperty.title || `Property ${selectedProperty.id}`,
      };
      
      console.log('Saving property:', propertyData);
      
      // Save to database
      const savedProperty = await propertyService.createProperty(propertyData);
      console.log('Property saved successfully:', savedProperty);
      
      setSuccess('Propriedade adicionada com sucesso!');
      setTimeout(() => {
        navigate('/properties');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao salvar propriedade:', error);
      let errorMessage = 'Erro ao salvar propriedade. Por favor, tente novamente.';
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `${error.response.data.error}: ${error.response.data.details || ''}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to map external property to internal format
  const mapExternalToInternal = (externalProperty: ExternalProperty, config: any) => {
    const { id, photos, bedrooms, bathrooms, maxGuests, title, type } = externalProperty;
    
    // Find main image (first photo or specific photo)
    const mainImageUrl = photos['Living Room'] || 
                        photos['Uncategorized'] || 
                        Object.values(photos)[0];
    
    // Extract street name and address number
    const address = externalProperty.location?.address || 'Address not available';
    
    return {
      id: id,
      name: title || `Property ${id}`,
      type: type || 'House',
      propertyId: id,
      addressNumber: id,
      address: address,
      addressStreet: address,
      mainImage: mainImageUrl, // Main image URL
      gateCode: config.gateCode,
      doorCode: config.doorCode,
      wifiPassword: config.wifiPassword,
      status: config.status,
      bedroomCount: bedrooms || 0,
      bathroomCount: bathrooms || 0,
      maxGuests: maxGuests || 0,
      images: Object.entries(selectedPhotos).map(([category, url], index) => ({
        id: `${id}-${index}`,
        path: url,
        category: category,
        order: index
      })),
      // Add empty arrays for property areas
      kitchens: [{ name: 'Kitchen' }],
      livingRooms: [{ name: 'Living Room' }],
      gameRooms: [],
      pools: [],
      bbq: [],
      ownerCloset: [],
      acRoom: [],
      createdAt: new Date().toISOString() // Adding createdAt field
    };
  };

  // Handle photo selection
  const handlePhotoSelection = (category: string, url: string, selected: boolean) => {
    if (selected) {
      setSelectedPhotos(prev => ({
        ...prev,
        [category]: url
      }));
    } else {
      const newSelectedPhotos = { ...selectedPhotos };
      delete newSelectedPhotos[category];
      setSelectedPhotos(newSelectedPhotos);
    }
  };

  // Handle photo upload (mock implementation)
  const handlePhotoUpload = async (file: File, category: string) => {
    try {
      setLoading(true);
      // In a real implementation, you would upload the file to a server
      // and get back a URL to the uploaded file
      
      // For now, we'll create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Add the new photo to the selected photos
      setSelectedPhotos(prev => ({
        ...prev,
        [category]: fileUrl
      }));
      
      setSuccess(`Photo uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  // Handle close photos dialog with confirmation if photos were selected
  const handleClosePhotosDialog = () => {
    if (Object.keys(selectedPhotos).length > 0) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsPhotosDialogOpen(false);
    }
  };

  // Handle confirm save photos
  const handleConfirmSavePhotos = () => {
    setIsConfirmDialogOpen(false);
    setIsPhotosDialogOpen(false);
    setSuccess('Installations saved successfully!');
  };

  // Handle cancel save photos
  const handleCancelSavePhotos = () => {
    setIsConfirmDialogOpen(false);
  };

  // Open photos management dialog
  const handleOpenPhotosDialog = () => {
    setIsPhotosDialogOpen(true);
  };

  // Close photos management dialog
  const handleClosePhotosDialogWithConfirmation = () => {
    handleClosePhotosDialog();
  };
  
  const steps = ['Select Property', 'Configure Details', 'Manage Installations'];
  
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 3,
        px: { xs: 1.5, sm: 3 }
      }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Property
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {loading && activeStep === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeStep === 0 ? (
              <PropertySelection 
                properties={externalProperties}
                onSelect={handlePropertySelect}
                selectedProperty={selectedProperty}
                autoAdvance={true}
              />
            ) : (
              <PropertyConfiguration
                property={selectedProperty}
                config={propertyConfig}
                onChange={handleConfigChange}
              />
            )}
          </>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep === 1 && (
              <Button 
                variant="contained" 
                onClick={handleSave}
                disabled={loading || Object.keys(selectedPhotos).length === 0}
              >
                {loading ? 'Saving...' : 'Save Property'}
              </Button>
            )}
            {activeStep === 1 && (
              <Button 
                variant="outlined"
                color="primary"
                onClick={handleNext}
              >
                Manage Installations
              </Button>
            )}
            {activeStep < 1 && (
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={!selectedProperty}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Photos Management Dialog */}
      <Dialog 
        open={isPhotosDialogOpen} 
        onClose={handleClosePhotosDialogWithConfirmation}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Manage Property Installations
        </DialogTitle>
        <DialogContent dividers>
          {selectedProperty && (
            <>
              {/* Progress Stepper */}
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={2} sx={{ mb: 2 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Typography variant="body2" align="center" color="text.secondary">
                  Step 3 of 3: Select the photos you want to include for this property
                </Typography>
              </Box>
              
              <PropertyPhotos
                property={selectedProperty}
                selectedPhotos={selectedPhotos}
                onPhotoSelection={handlePhotoSelection}
                onPhotoUpload={handlePhotoUpload}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClosePhotosDialogWithConfirmation}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCancelSavePhotos}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Save Installations
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You have selected {Object.keys(selectedPhotos).length} photos for this property.
          </Typography>
          <Typography variant="body1" paragraph>
            These photos will be saved and visible in the property card and gallery. Do you want to continue?
          </Typography>
          
          <Grid container spacing={1.5} sx={{ mt: 1, justifyContent: 'center' }}>
            {Object.entries(selectedPhotos).slice(0, 3).map(([category, url], index) => (
              <Grid item key={index} sx={{ width: '120px', flexGrow: 0, flexShrink: 0 }}>
                <Card sx={{ width: '100%' }}>
                  <CardMedia
                    component="img"
                    height="80"
                    image={url}
                    alt={category}
                  />
                </Card>
              </Grid>
            ))}
            {Object.keys(selectedPhotos).length > 3 && (
              <Grid item sx={{ width: '120px', flexGrow: 0, flexShrink: 0 }}>
                <Card sx={{ width: '100%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'action.hover' }}>
                  <Typography variant="body2" color="text.secondary">
                    +{Object.keys(selectedPhotos).length - 3} more
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSavePhotos}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConfirmSavePhotos}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddPropertyPage;
