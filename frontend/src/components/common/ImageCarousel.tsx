import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  IconButton,
  Box,
  Paper,
  Grid,
  DialogContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { PropertyImage } from '../../services/propertyService';

interface ImageCarouselProps {
  images: PropertyImage[];
  onClose?: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log('Images in carousel:', images);
  }, [images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      setIsZoomed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => {
      window.removeEventListener('keydown', handleKeyDown as any);
    };
  }, []);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    console.log('No images to display');
    return null;
  }

  const currentImage = images[currentIndex];
  console.log('Current image:', currentImage);

  const renderMainImage = () => (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isZoomed ? '90vh' : '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <img
        src={currentImage.path}
        alt={`Property ${currentIndex + 1}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
        onError={(e) => {
          console.error('Error loading image:', currentImage.path);
          e.currentTarget.src = '/placeholder-image.jpg';
        }}
      />
      <IconButton
        onClick={handlePrevious}
        sx={{
          position: 'absolute',
          left: 8,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 8,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <NavigateNextIcon />
      </IconButton>
      <IconButton
        onClick={() => setIsZoomed(true)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <ZoomInIcon />
      </IconButton>
    </Box>
  );

  const renderThumbnails = () => (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 1,
        p: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
      }}
    >
      {images.map((image, index) => (
        <Paper
          key={image.id}
          elevation={currentIndex === index ? 8 : 1}
          sx={{
            width: 80,
            height: 80,
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: currentIndex === index ? 'scale(1.1)' : 'scale(1)',
            border: currentIndex === index ? '2px solid primary.main' : 'none',
          }}
          onClick={() => handleThumbnailClick(index)}
        >
          <img
            src={image.path}
            alt={`Thumbnail ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              console.error('Error loading thumbnail:', image.path);
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
        </Paper>
      ))}
    </Box>
  );

  const renderZoomDialog = () => (
    <Dialog
      open={isZoomed}
      onClose={() => setIsZoomed(false)}
      maxWidth={false}
      fullScreen={isMobile}
    >
      <DialogContent
        sx={{
          p: 0,
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => setIsZoomed(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={currentImage.path}
          alt={`Property ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
          onError={(e) => {
            console.error('Error loading zoomed image:', currentImage.path);
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {renderMainImage()}
      {renderThumbnails()}
      {renderZoomDialog()}
    </Box>
  );
};
