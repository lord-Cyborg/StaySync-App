import React, { useState, useRef } from 'react';
import {
  Card,
  Typography,
  TextField,
  Box,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { PropertyData, propertyService } from '../../../services/propertyService';
import { useNavigate } from 'react-router-dom';
import StatusChip from './chips/StatusChip';
import ImageOverlayContainer from '../../common/ImageOverlayContainer';

interface EditPropertyCardProps {
  initialData: PropertyData;
  onSave: (data: PropertyData) => void;
  onSaveAs: (data: PropertyData) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

// Tipo local que estende PropertyData para incluir o arquivo de imagem
interface FormDataWithImage extends PropertyData {
  _imageFile?: File;
}

type InspectionStatus = 'b2b' | 'N/R' | 'B2B';

const EditPropertyCard: React.FC<EditPropertyCardProps> = ({
  initialData,
  onSave,
  onSaveAs,
  onDelete,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormDataWithImage>({
    ...initialData,
    status: initialData.status || 'N/R'
  });
  const navigate = useNavigate();

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openSaveAsDialog, setOpenSaveAsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isSaveAsEnabled = initialData && formData.addressNumber !== initialData.addressNumber;

  const handleChange = (field: keyof FormDataWithImage) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prev: FormDataWithImage): FormDataWithImage => {
      if (field === 'status') {
        return {
          ...prev,
          [field]: value
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (['b2b', 'N/R', 'B2B'].includes(value)) {
      setFormData((prev: FormDataWithImage): FormDataWithImage => ({
        ...prev,
        status: value
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && formData.propertyId) {
      try {
        // Criar URL temporária para preview
        const imageUrl = URL.createObjectURL(file);
        
        // Atualizar o estado com o caminho que esperamos que a imagem tenha
        const expectedPath = `/images/${formData.propertyId}/gallery/main-${formData.propertyId}.JPG`;
        setFormData(prev => ({
          ...prev,
          mainImage: expectedPath,
          _imageFile: file // Guardar o arquivo para upload posterior
        }));

        // Fazer upload da imagem
        try {
          await propertyService.uploadImage(file, formData.propertyId);
          console.log('Imagem enviada com sucesso');
          setSuccessMessage('Imagem atualizada com sucesso!');
        } catch (uploadError) {
          console.error('Erro no upload:', uploadError);
          // Mesmo com erro no upload, mantemos a imagem local para preview
        }

        setOpenSuccessSnackbar(true);
      } catch (error) {
        console.error('Error handling image:', error);
        setSuccessMessage('Erro ao atualizar imagem. Tente novamente.');
        setOpenSuccessSnackbar(true);
      }
    }
  };

  const handleReset = () => {
    setFormData((prev: FormDataWithImage): FormDataWithImage => ({
      ...prev,
      status: (initialData.status || 'N/R'),
      mainImage: `/images/${prev.addressNumber}/gallery/main-${prev.addressNumber}.JPG`,
      propertyId: initialData.propertyId || prev.addressNumber
    }));
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (!formData || !formData.propertyId) return;

    try {
      console.log('Submitting property updates:', formData);
      await propertyService.updateProperty(formData.propertyId, formData);
      console.log('Property updated successfully');
      navigate('/properties'); // Atualizado para navegar para /properties
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleSaveClick = () => {
    setOpenSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    setOpenSaveDialog(false);
    await handleSubmit();
    setSuccessMessage('Changes saved successfully!');
    setOpenSuccessSnackbar(true);
  };

  const handleSaveAsClick = () => {
    setOpenSaveAsDialog(true);
  };

  const handleSaveAsConfirm = async () => {
    setOpenSaveAsDialog(false);
    if (!formData) return;
    await onSaveAs(formData);
    setSuccessMessage('New property created successfully!');
    setOpenSuccessSnackbar(true);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setOpenDeleteDialog(false);
    onDelete(initialData.propertyId);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenSaveDialog(false);
    setOpenSaveAsDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <>
      <Card sx={{ 
        width: '100%', 
        position: 'relative',
        borderRadius: '16px 16px 0 0',
        '& .MuiCardContent-root': {
          borderRadius: 0
        }
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
          accept="image/*"
        />

        <Box sx={{ position: 'relative' }}>
          <ImageOverlayContainer
            image={formData.mainImage || '/images/placeholder.jpg'}
            alt={`Property ${formData.propertyId}`}
            propertyId={formData.propertyId}
            status={formData.status}
            showPhotoButton={true}
            showBackButton={true}
            onPhotoClick={handleImageClick}
            onBackClick={onBack}
            height={240}
            gradient
          />
          <StatusChip 
            status={formData.status}
            absolute
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              zIndex: 2
            }}
          />
        </Box>
      </Card>

      <Card sx={{ 
        borderRadius: '0 0 16px 16px', // arredondado apenas embaixo
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ 
          px: 2, 
          pt: 1, 
          pb: 1
        }}>
          {/* Primeira linha: Number e Street */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            gap: 2,
            mb: 1
          }}>
            <TextField
              label="Number"
              value={formData.addressNumber}
              onChange={handleChange('addressNumber')}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem'
                }
              }}
            />
            <TextField
              label="Street"
              value={formData.addressStreet}
              onChange={handleChange('addressStreet')}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem'
                }
              }}
            />
          </Box>

          {/* Segunda linha: Gate, Door e WiFi */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 2,
            mb: 1
          }}>
            <TextField
              label="Gate"
              value={formData.gateCode}
              onChange={handleChange('gateCode')}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem'
                }
              }}
            />
            <TextField
              label="Door"
              value={formData.doorCode}
              onChange={handleChange('doorCode')}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem'
                }
              }}
            />
            <TextField
              label="WiFi"
              value={formData.wifiPassword}
              onChange={handleChange('wifiPassword')}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.75rem'
                }
              }}
            />
          </Box>

          {/* Terceira linha: Status com radio buttons */}
          <FormControl 
            component="fieldset" 
            sx={{ 
              width: '100%',
              position: 'relative',
              mb: 1
            }}
          >
            <Box sx={{
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: 1,
              padding: '8px 8px 8px',
              position: 'relative'
            }}>
              <FormLabel 
                component="legend" 
                sx={{ 
                  fontSize: '10px',
                  position: 'absolute',
                  top: '-0.7em',
                  left: '8px',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  color: 'primary.main',
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  fontWeight: 300
                }}
              >
                Status
              </FormLabel>
              <RadioGroup
                row
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  '& .MuiFormControlLabel-root': {
                    margin: 0
                  }
                }}
              >
                <FormControlLabel 
                  value="b2b" 
                  control={<Radio size="small" />} 
                  label="b2b"
                  sx={{ 
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '10px',
                      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      fontWeight: 300,
                      color: 'primary.main',
                      marginTop: '2px'
                    }
                  }}
                />
                <FormControlLabel 
                  value="N/R" 
                  control={<Radio size="small" />} 
                  label="N/R"
                  sx={{ 
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '10px',
                      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      fontWeight: 300,
                      color: 'primary.main',
                      marginTop: '2px'
                    }
                  }}
                />
                <FormControlLabel 
                  value="B2B" 
                  control={<Radio size="small" />} 
                  label="B2B"
                  sx={{ 
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiFormControlLabel-label': {
                      fontSize: '10px',
                      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      fontWeight: 300,
                      color: 'primary.main',
                      marginTop: '2px'
                    }
                  }}
                />
              </RadioGroup>
            </Box>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleSaveAsClick}
              disabled={!isSaveAsEnabled}
            >
              Save As
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveClick}
            >
              Save
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Diálogo de confirmação para Save */}
      <Dialog
        open={openSaveDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '350px',
            maxWidth: '90vw'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.1rem',
          py: 1.5
        }}>
          Confirm Save
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ 
            fontSize: '0.9rem',
            mb: 0.5 
          }}>
            Are you sure you want to save the changes to this property?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={handleCloseDialog} color="primary" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveConfirm} color="primary" variant="contained" size="small">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para Save As */}
      <Dialog
        open={openSaveAsDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '350px',
            maxWidth: '90vw'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.1rem',
          py: 1.5
        }}>
          Confirm Save As
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ 
            fontSize: '0.9rem',
            mb: 0.5
          }}>
            Are you sure you want to create a new property with these details?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={handleCloseDialog} color="primary" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveAsConfirm} color="primary" variant="contained" size="small">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this property? This action cannot be undone.
            All associated inventory items and images will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de sucesso */}
      <Snackbar 
        open={openSuccessSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditPropertyCard;
