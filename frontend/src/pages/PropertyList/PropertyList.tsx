import React from 'react';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SimpleCard from '../../components/properties/common/SimpleCard';
import { propertyService, Property } from '../../services/propertyService';

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchProperties();
  }, []);

  // Recarregar dados quando o componente recebe foco
  useEffect(() => {
    const handleFocus = () => {
      fetchProperties();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Atualizar dados a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(fetchProperties, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        maxWidth: '1200px',
        pt: 3, // Ajustando padding superior para 24px
        px: 3,
        bgcolor: '#f5f5f5',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center'
      }}
    >
      {properties.map((property) => (
        <Box 
          key={property.id} 
          sx={{ 
            width: '300px',
            flex: '0 0 auto' // Impede o stretching
          }}
        >
          <SimpleCard
            mainImage={property.mainImage}
            propertyId={property.id}
            gateCode={property.gateCode}
            doorCode={property.doorCode}
            wifiPassword={property.wifiPassword}
            addressNumber={property.addressNumber}
            addressStreet={property.addressStreet}
            isB2B={property.status === 'B2B'}
            reservationStatus={property.reservationStatus}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PropertyList;
