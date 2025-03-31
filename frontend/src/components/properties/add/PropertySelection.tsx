import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ExternalProperty } from '../../../services/externalDbService';

interface PropertySelectionProps {
  properties: ExternalProperty[];
  onSelect: (property: ExternalProperty) => void;
  selectedProperty: ExternalProperty | null;
  autoAdvance?: boolean;
}

const PropertySelection: React.FC<PropertySelectionProps> = ({
  properties,
  onSelect,
  selectedProperty,
  autoAdvance = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProperties = properties.filter(property => 
    property.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (property: ExternalProperty) => {
    onSelect(property);
  };
  
  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search property by ID or title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Grid 
        container 
        spacing={1.5}
        sx={{
          margin: 0,
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {filteredProperties.length === 0 ? (
          <Typography>No properties found</Typography>
        ) : (
          filteredProperties.map((property) => {
            // Find main image (first photo or specific photo)
            const mainImage = property.photos['Living Room'] || 
                             property.photos['Uncategorized'] || 
                             Object.values(property.photos)[0];
            const isSelected = selectedProperty?.id === property.id;
            
            return (
              <Grid 
                item 
                key={property.id}
                sx={{
                  width: '420px',
                  flexGrow: 0,
                  flexShrink: 0
                }}
              >
                <Card 
                  sx={{ 
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #1976d2' : 'none'
                  }}
                  onClick={() => handleSelect(property)}
                >
                  <Box
                    sx={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      height: '240px', 
                      '& img': {
                        transition: 'transform 0.3s ease-in-out',
                        objectFit: 'cover', 
                        width: '100%',
                        height: '100%'
                      },
                      '&:hover img': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={mainImage}
                      alt={`Property ${property.id}`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                      sx={{ 
                        height: '100%',
                        objectPosition: 'center'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ID: {property.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max guests: {property.maxGuests}
                    </Typography>
                    {property.amenities && property.amenities.length > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {property.amenities.slice(0, 3).join(', ')}
                        {property.amenities.length > 3 && '...'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default PropertySelection;
