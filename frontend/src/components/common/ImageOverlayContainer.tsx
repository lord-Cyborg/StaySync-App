import React from 'react';
import { Box, CardMedia, alpha, IconButton, Chip } from '@mui/material';
import { Edit as EditIcon, PhotoCamera, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../properties/common/chips/StatusChip';

interface ImageOverlayContainerProps {
  // Imagem
  image: string;
  alt?: string;
  onImageClick?: () => void;
  onImageError?: (error: any) => void;
  
  // Dados da propriedade
  propertyId: string;
  status?: string;
  
  // Controles de exibição
  showEditButton?: boolean;
  showPhotoButton?: boolean;
  showBackButton?: boolean;
  onPhotoClick?: () => void;
  onBackClick?: () => void;
  
  // Estilo
  height?: number | string;
  gradient?: boolean;
  imageObjectFit?: 'cover' | 'contain';
  imageObjectPosition?: string;
}

const OVERLAY_ITEM_HEIGHT = 24;
const OVERLAY_ITEM_STYLE = {
  height: OVERLAY_ITEM_HEIGHT,
  width: OVERLAY_ITEM_HEIGHT,
  minHeight: OVERLAY_ITEM_HEIGHT,
  bgcolor: alpha('#000', 0.65),
  color: '#fff',
  padding: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1rem'
  },
  '&:hover': {
    bgcolor: alpha('#000', 0.85),
  }
};

const ImageOverlayContainer: React.FC<ImageOverlayContainerProps> = ({
  // Imagem
  image,
  alt = '',
  onImageClick,
  onImageError,
  
  // Dados
  propertyId,
  status,
  
  // Controles
  showEditButton = false,
  showPhotoButton = false,
  showBackButton = false,
  onPhotoClick,
  onBackClick,
  
  // Estilo
  height = 240,
  gradient = true,
  imageObjectFit = 'cover',
  imageObjectPosition = 'center'
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(`/property/${propertyId}`);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        backgroundColor: 'grey.100',
        '& img': {
          transition: 'transform 0.3s ease-in-out'
        },
        '&:hover img': {
          transform: 'scale(1.05)'
        }
      }}
    >
      {/* Imagem Principal */}
      <CardMedia
        component="img"
        image={image}
        alt={alt}
        onClick={onImageClick}
        onError={onImageError}
        sx={{ 
          width: '100%',
          height: '100%',
          objectFit: imageObjectFit,
          objectPosition: imageObjectPosition,
          cursor: onImageClick ? 'pointer' : 'default',
        }}
      />

      {/* Gradiente Overlay */}
      {gradient && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Back Button (condicional no canto superior esquerdo) */}
      {showBackButton && (
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            ...OVERLAY_ITEM_STYLE
          }}
        >
          <ArrowBack />
        </IconButton>
      )}

      {/* Property ID Chip (sempre no centro superior) */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        <Chip
          label={propertyId}
          sx={{
            height: OVERLAY_ITEM_HEIGHT,
            bgcolor: alpha('#000', 0.65),
            color: '#fff',
            '& .MuiChip-label': {
              px: 1,
              fontSize: '0.75rem',
              fontWeight: 400,
              lineHeight: 1,
            }
          }}
        />
      </Box>

      {/* Edit Button (condicional no canto superior direito) */}
      {showEditButton && (
        <IconButton
          onClick={() => navigate(`/edit-property/${propertyId}`)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            ...OVERLAY_ITEM_STYLE
          }}
        >
          <EditIcon />
        </IconButton>
      )}

      {/* Photo Button (condicional no canto inferior direito) */}
      {showPhotoButton && (
        <IconButton
          onClick={onPhotoClick}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            zIndex: 2,
            ...OVERLAY_ITEM_STYLE
          }}
        >
          <PhotoCamera />
        </IconButton>
      )}

      {/* Status Chip (condicional no canto inferior esquerdo) */}
      {status && (
        <StatusChip 
          status={status}
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            zIndex: 2
          }}
        />
      )}
    </Box>
  );
};

export default ImageOverlayContainer;
