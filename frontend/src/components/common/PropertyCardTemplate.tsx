import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  CircularProgress,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';

import {
  AccessTime as AccessTimeIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  Kitchen as KitchenIcon,
  Weekend as WeekendIcon,
  SportsEsports as SportsEsportsIcon,
  Pool as PoolIcon,
  LockOpen as LockOpenIcon,
  OutdoorGrill as OutdoorGrillIcon,
  Storage as StorageIcon,
  AcUnit as AcUnitIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

import { Property, AreaImage, Area } from '../../types/property';
import { useNavigate } from 'react-router-dom';
import ImageOverlayContainer from './ImageOverlayContainer';

interface PropertyCardTemplateProps {
  property: Property;
  onAreaSelect?: (area: string) => void;
  onRoomSelect?: (roomId: number) => void;
  onImageError?: (error: Error) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const PropertyCardTemplate: React.FC<PropertyCardTemplateProps> = ({ 
  property, 
  onAreaSelect, 
  onRoomSelect,
  onImageError, 
  isLoading,
  onBack 
}) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  const areaImages = useMemo(() => {
    if (!property?.id) return {};
    
    return {
      bedroom: Array.from({ length: property.bedroomCount || 0 }, (_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/Quarto-${String(i + 1).padStart(2, '0')}.JPG`,
        label: i + 1,
        hasCode: i + 1 >= 8
      })),
      bathroom: Array.from({ length: property.bathroomCount || 0 }, (_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/Banheiro_completo-${String(i + 1).padStart(2, '0')}.JPG`,
        label: i + 1
      })),
      kitchen: property.kitchens?.map((_, i) => ({
        id: i + 1,
        image: i === 0 ? `/images/${property.id}/gallery/Kitchen.JPG` : `/images/${property.id}/gallery/Pool_Kitchen.JPG`,
        label: i + 1
      })) || [],
      living: property.livingRooms?.map((_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/Living_Room-${String(i + 1).padStart(2, '0')}.JPG`,
        label: i + 1
      })) || [],
      game: property.gameRooms?.map((_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/Game_Room.JPG`,
        label: i + 1
      })) || [],
      pool: property.pools?.map((_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/Pool-Area.JPG`,
        label: i + 1
      })) || [],
      bbq: property.bbq?.map((_, i) => ({
        id: i + 1,
        image: `/images/${property.id}/gallery/BBQ.JPG`,
        label: i + 1
      })) || [],
      ownerCloset: property.ownerCloset?.map((_, i) => ({
        id: i + 1,
        image: '',
        label: i + 1
      })) || [],
      acRoom: property.acRoom?.map((_, i) => ({
        id: i + 1,
        image: '',
        label: i + 1
      })) || []
    };
  }, [property]) as Record<string, AreaImage[]>;

  const areas: Area[] = useMemo(() => [
    { id: 'bedroom', label: 'Bedroom', icon: <BedIcon />, count: property?.bedroomCount || 0 },
    { id: 'bathroom', label: 'Bathroom', icon: <BathtubIcon />, count: property?.bathroomCount || 0 },
    { id: 'kitchen', label: 'Kitchen', icon: <KitchenIcon />, count: property?.kitchens?.length || 0 },
    { id: 'living', label: 'Living', icon: <WeekendIcon />, count: property?.livingRooms?.length || 0 },
    { id: 'game', label: 'Game Room', icon: <SportsEsportsIcon />, count: property?.gameRooms?.length || 0 },
    { id: 'pool', label: 'Pool Area', icon: <PoolIcon />, count: property?.pools?.length || 0 },
    { id: 'bbq', label: 'BBQ', icon: <OutdoorGrillIcon />, count: property?.bbq?.length || 0 },
    { id: 'ownerCloset', label: 'Owner Closet', icon: <StorageIcon />, count: property?.ownerCloset?.length || 0 },
    { id: 'acRoom', label: 'A/C Room', icon: <AcUnitIcon />, count: property?.acRoom?.length || 0 }
  ], [property]);

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
    setImageError(false);
    setImageLoading(true);
    
    const selectedAreaImages = areaImages[areaId];
    if (selectedAreaImages && selectedAreaImages.length > 0) {
      setSelectedRoom(selectedAreaImages[0].id);
    } else {
      setSelectedRoom(null);
    }

    if (onAreaSelect) {
      onAreaSelect(areaId);
    }
  };

  const handleRoomClick = (roomId: number) => {
    setSelectedRoom(roomId);
    setImageError(false);
    setImageLoading(true);
    
    if (onRoomSelect) {
      onRoomSelect(roomId);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (error: any) => {
    if (!imageError) {
      setImageError(true);
      setImageLoading(false);
      if (onImageError) {
        onImageError(error);
      }
    }
  };

  const propertyImage = selectedArea && selectedRoom ? areaImages[selectedArea]?.find(img => img.id === selectedRoom)?.image : property.mainImage;

  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      width: '100%',
      maxWidth: { xs: '100%', sm: '600px' },
      borderRadius: 2,
      position: 'relative'
    }}>
      <Box sx={{ position: 'relative' }}>
        {/* Back/Home Button */}
        <IconButton
          onClick={() => selectedArea ? setSelectedArea(null) : navigate('/properties')}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,  
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: 'white',
            width: '32px',  
            height: '32px', 
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          {selectedArea ? <ArrowBackIcon /> : <HomeIcon />}
        </IconButton>

        {/* Edit Button */}
        <IconButton
          onClick={() => navigate(`/edit-property/${property.id}`)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: 'white',
            width: '32px',
            height: '32px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          <EditIcon />
        </IconButton>

        {/* Main Image or Area Image */}
        <ImageOverlayContainer
          image={propertyImage}
          alt={`Property ${property.propertyId}`}
          propertyId={property.propertyId}
          status={property.status}
          onImageError={handleImageError}
          height={240}
          gradient
          sx={{ objectFit: 'cover' }}
        />

        {/* Loading Overlay */}
        {imageLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      <CardContent>
        {/* Property Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="div" gutterBottom>
            {property.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" />
            {property.address}
          </Typography>
        </Box>

        {/* Property Details */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {areas.map((area) => (
            area.count > 0 && (
              <Chip
                key={area.id}
                icon={area.icon}
                label={`${area.count} ${area.label}${area.count > 1 ? 's' : ''}`}
                onClick={() => handleAreaClick(area.id)}
                color={selectedArea === area.id ? 'primary' : 'default'}
                sx={{ mb: 1 }}
              />
            )
          ))}
        </Box>

        {/* Room Selection */}
        {selectedArea && areaImages[selectedArea]?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {areaImages[selectedArea].map((room) => (
              <Chip
                key={room.id}
                label={`${room.label}`}
                onClick={() => handleRoomClick(room.id)}
                color={selectedRoom === room.id ? 'primary' : 'default'}
                icon={room.hasCode ? <LockOpenIcon /> : undefined}
              />
            ))}
          </Box>
        )}

        {/* Access Codes */}
        {property.gateCode && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <AccessTimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
              Gate Code: {property.gateCode}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCardTemplate;
