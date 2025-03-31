import { type FC, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Popover,
  alpha,
  useTheme,
  Stack,
  Box,
} from '@mui/material';
import {
  VpnKey as VpnKeyIcon,
  DoorFront as DoorFrontIcon,
  Wifi as WifiIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { PropertyData } from '../../../services/propertyService';
import ImageOverlayContainer from '../../common/ImageOverlayContainer';

interface SimpleCardProps {
  property: PropertyData;
  onImageClick?: (propertyId: string) => void;
}

export const SimpleCard: FC<SimpleCardProps> = ({ property, onImageClick }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, code: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCode(code);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCode('');
  };

  const open = Boolean(anchorEl);

  const propertyImage = imageError
    ? '/images/placeholder.jpg'
    : property.mainImage;
    
  // Função para lidar com o clique na imagem
  const handleImageClick = () => {
    // Tratamento especial para a propriedade com ID 6301
    if (property.propertyId === '6301' && onImageClick) {
      onImageClick(property.propertyId);
    }
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: { xs: '100%', sm: 420 },
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'none',
        borderRadius: '6px'
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          '& img': {
            transition: 'transform 0.3s ease-in-out'
          },
          '&:hover img': {
            transform: 'scale(1.05)'
          }
        }}
      >
        <ImageOverlayContainer
          image={propertyImage}
          alt={`Property ${property.propertyId}`}
          propertyId={property.propertyId}
          status={property.status}
          showEditButton={true}
          onImageError={handleImageError}
          height={240}
          gradient
          onImageClick={property.propertyId === '6301' ? handleImageClick : undefined}
        />
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {property.addressStreet}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VpnKeyIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => handleClick(e, property.gateCode)}
              sx={{ 
                flex: 1,
                height: 28,
                fontSize: '0.75rem',
                borderColor: alpha(theme.palette.primary.main, 0.32),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              Gate
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<DoorFrontIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => handleClick(e, property.doorCode)}
              sx={{ 
                flex: 1,
                height: 28,
                fontSize: '0.75rem',
                borderColor: alpha(theme.palette.primary.main, 0.32),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              Door
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<WifiIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => handleClick(e, property.wifiPassword)}
              sx={{ 
                flex: 1,
                height: 28,
                fontSize: '0.75rem',
                borderColor: alpha(theme.palette.primary.main, 0.32),
                color: 'text.secondary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              WiFi
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            padding: '8px 12px',
            maxWidth: '90%',
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {selectedCode}
        </Typography>
      </Popover>
    </Card>
  );
};

export default SimpleCard;
