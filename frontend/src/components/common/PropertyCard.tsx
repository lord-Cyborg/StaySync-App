import React, { useState, useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  CircularProgress,
  IconButton
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

import { Property, AreaImage, Area } from '../../../types/property';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../properties/common/chips/StatusChip';

interface PropertyCardProps {
  property: Property;
  onAreaSelect?: (area: string) => void;
  onRoomSelect?: (roomId: number) => void;
  onImageError?: (error: Error) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
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
    
    // Verifica se a área selecionada tem unidades disponíveis
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
            '& .MuiSvgIcon-root': {
              fontSize: '1.2rem'
            }
          }}
        >
          {selectedArea ? <HomeIcon /> : <ArrowBackIcon />}
        </IconButton>

        <Box sx={{ position: 'relative' }}>
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
                bgcolor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {selectedArea && selectedRoom && areaImages[selectedArea] ? (
            <>
              <CardMedia
                component="img"
                height="300"
                image={areaImages[selectedArea].find(img => img.id === selectedRoom)?.image || ''}
                alt={`${selectedArea} ${selectedRoom}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sx={{
                  objectFit: 'cover',
                  opacity: imageError ? 0.3 : 1
                }}
              />
              {areaImages[selectedArea].find(img => img.id === selectedRoom)?.hasCode && (
                <Chip
                  label="1234"  
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    color: 'white',
                    '& .MuiChip-label': {
                      px: 2,
                      fontWeight: 600
                    }
                  }}
                />
              )}
            </>
          ) : (
            <>
              <CardMedia
                component="img"
                height="300"
                image={imageError ? '/images/placeholder.jpg' : property.mainImage}
                alt={`Property ${property.id}`}
                onError={handleImageError}
                onLoad={() => setImageLoading(false)}
                sx={{ objectFit: 'cover' }}
              />
              
              {/* Status Chip */}
              <StatusChip status={property.status} sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                '& .MuiChip-label': {
                  px: 2,
                  fontWeight: 600
                }
              }}/>

              {/* Property ID Chip */}
              <Chip
                label={property.addressNumber || property.id}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 2,
                    fontWeight: 600
                  }
                }}
              />

              {/* Edit Chip */}
              <Chip
                icon={<EditIcon />}
                onClick={() => navigate(`/edit-property/${property.id}`)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  cursor: 'pointer',
                  '& .MuiChip-icon': {
                    color: 'white',
                    margin: 0.5
                  },
                  '& .MuiChip-label': {
                    display: 'none'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.6)'
                  }
                }}
              />
            </>
          )}
        </Box>

        <CardContent>
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            py: 1.5
          }}>
            {areas.filter(area => area.count > 0).map((area) => (
              <Chip
                key={area.id}
                icon={area.icon}
                label={`${area.label} ${area.count > 1 ? `(${area.count})` : ''}`}
                onClick={() => handleAreaClick(area.id)}
                color={selectedArea === area.id ? 'primary' : 'default'}
              />
            ))}
          </Box>

          {/* Room Numbers - mantido como estava */}
          {selectedArea && areaImages[selectedArea] && areaImages[selectedArea].length > 1 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {areaImages[selectedArea].map((room) => (
                <Chip
                  key={room.id}
                  label={room.label}
                  onClick={() => handleRoomClick(room.id)}
                  color={selectedRoom === room.id ? 'primary' : 'default'}
                  icon={room.hasCode ? <LockOpenIcon /> : undefined}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default PropertyCard;
