import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container
} from '@mui/material';
import SimpleCardWithOverlay from '../../components/properties/common/SimpleCardWithOverlay';
import { propertyService, Property } from '../../services/propertyService';

const SimpleCardListWithOverlay: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const fetchedProperties = await propertyService.getProperties();
        console.log('Fetched properties:', fetchedProperties);
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

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
          width: '100%'
        }}
      >
        {properties.length === 0 ? (
          <div>No properties available</div>
        ) : (
          properties.map((property) => (
            <Grid 
              item 
              key={property.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
            >
              <SimpleCardWithOverlay propertyId={property.id} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default SimpleCardListWithOverlay;
