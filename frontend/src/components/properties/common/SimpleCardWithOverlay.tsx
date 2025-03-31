import { type FC, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { PropertyData, propertyService } from '../../../services/propertyService';
import ImageOverlayContainer from '../../common/ImageOverlayContainer';

interface SimpleCardWithOverlayProps {
  propertyId: string;
}

const SimpleCardWithOverlay: FC<SimpleCardWithOverlayProps> = ({ 
  propertyId
}) => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const fetchedProperty = await propertyService.getProperty(propertyId);
        console.log('Fetched property:', fetchedProperty);
        setProperty(fetchedProperty);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <Card sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (!property) {
    return (
      <Card sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Propriedade não encontrada</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      <ImageOverlayContainer
        imageSrc={property.mainImage}
        onImageError={handleImageError}
        fallbackSrc={`/images/placeholder.jpg`}
        alt={`Propriedade ${property.id}`}
        height={300}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            p: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Propriedade {property.id}
          </Typography>
          <Typography variant="body2">
            {property.addressStreet || 'Endereço não disponível'}
          </Typography>
        </Box>
      </ImageOverlayContainer>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Gate Code: {property.gateCode || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Door Code: {property.doorCode || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          WiFi: {property.wifiPassword || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleCardWithOverlay;
