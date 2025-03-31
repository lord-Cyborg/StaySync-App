import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container
} from '@mui/material';
import SimpleCard from '../../components/properties/common/SimpleCard';
import { propertyService, Property } from '../../services/propertyService';
import { useNavigate } from 'react-router-dom';

const SimpleCardList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const fetchedProperties = await propertyService.getProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

  // Esta função agora não retorna nada (void), apenas navega para a página da propriedade
  const handleCardClick = (propertyId: string) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        py: 1.5,
        px: { xs: 1.5, sm: 1.5 },
        minWidth: '444px'
      }}
    >
      <Grid 
        container 
        spacing={1.5}
        sx={{
          margin: 0,
          width: '100%',
          justifyContent: 'center' // Centraliza os cards
        }}
      >
        {properties.length === 0 ? (
          <div>No properties available</div>
        ) : (
          properties.map((property) => (
            <Grid 
              item 
              key={property.id}
              sx={{
                width: '420px',
                flexGrow: 0,
                flexShrink: 0
              }}
            >
              <SimpleCard 
                property={property} 
                onImageClick={handleCardClick}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default SimpleCardList;
