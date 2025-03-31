import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { PhotoLibrary as PhotoLibraryIcon } from '@mui/icons-material';
import { ExternalProperty } from '../../../services/externalDbService';

interface PropertyConfigurationProps {
  property: ExternalProperty | null;
  config: {
    gateCode: string;
    doorCode: string;
    wifiPassword: string;
    status: string;
    addressNumber: string;
    addressStreet: string;
  };
  onChange: (field: string, value: string) => void;
}

const PropertyConfiguration: React.FC<PropertyConfigurationProps> = ({
  property,
  config,
  onChange
}) => {
  if (!property) {
    return (
      <Typography>
        No property selected. Please go back and select a property.
      </Typography>
    );
  }
  
  // Find main image (first photo or specific photo)
  const mainImage = property.photos['Living Room'] || 
                   property.photos['Uncategorized'] || 
                   Object.values(property.photos)[0];
  
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="240"
              image={mainImage}
              alt={property.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {property.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {property.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Max guests: {property.maxGuests}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {config.addressNumber && config.addressStreet 
                  ? `${config.addressNumber} ${config.addressStreet}${property.location?.city ? `, ${property.location.city}` : ''}`
                  : property.location?.address 
                    ? `${property.location.address}${property.location?.city ? `, ${property.location.city}` : ''}`
                    : 'Endereço não disponível'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Property Settings
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            gap: 2,
            mb: 2
          }}>
            <TextField
              label="Number"
              value={config.addressNumber}
              onChange={(e) => onChange('addressNumber', e.target.value)}
              fullWidth
              margin="dense"
              size="small"
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
              value={config.addressStreet}
              onChange={(e) => onChange('addressStreet', e.target.value)}
              fullWidth
              margin="dense"
              size="small"
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
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 2,
            mb: 2
          }}>
            <TextField
              label="Gate Code"
              value={config.gateCode}
              onChange={(e) => onChange('gateCode', e.target.value)}
              fullWidth
              margin="dense"
              size="small"
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
              label="Door Code"
              value={config.doorCode}
              onChange={(e) => onChange('doorCode', e.target.value)}
              fullWidth
              margin="dense"
              size="small"
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
              label="WiFi Password"
              value={config.wifiPassword}
              onChange={(e) => onChange('wifiPassword', e.target.value)}
              fullWidth
              margin="dense"
              size="small"
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
          
          <FormControl 
            component="fieldset" 
            sx={{ 
              width: '100%',
              position: 'relative',
              mb: 2
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
                value={config.status}
                onChange={(e) => onChange('status', e.target.value)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  '& .MuiFormControlLabel-root': {
                    margin: 0
                  }
                }}
              >
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
              </RadioGroup>
            </Box>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyConfiguration;
