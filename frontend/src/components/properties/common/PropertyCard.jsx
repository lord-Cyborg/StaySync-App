import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WeekendIcon from '@mui/icons-material/Weekend';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PoolIcon from '@mui/icons-material/Pool';

const PropertyCard = ({ property }) => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const areaImages = {
    bedroom: Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      image: `/images/6301/gallery/Quarto-${String(i + 1).padStart(2, '0')}.JPG`,
      label: `Quarto ${i + 1}`
    })),
    bathroom: Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      image: `/images/6301/gallery/Banheiro_completo-${String(i + 1).padStart(2, '0')}.JPG`,
      label: `Banheiro ${i + 1}`
    })),
    kitchen: [
      { id: 1, image: '/images/6301/gallery/Kitchen.JPG', label: 'Cozinha Principal' },
      { id: 2, image: '/images/6301/gallery/Pool-kitchen.JPG', label: 'Cozinha da Piscina' }
    ],
    living: [
      { id: 1, image: '/images/6301/gallery/Living_Room-01.JPG', label: 'Sala de Estar 1' },
      { id: 2, image: '/images/6301/gallery/Living_Room-02.JPG', label: 'Sala de Estar 2' }
    ],
    game: [
      { id: 1, image: '/images/6301/gallery/Game_Room.JPG', label: 'Sala de Jogos' }
    ],
    pool: [
      { id: 1, image: '/images/6301/gallery/Pool-Area.JPG', label: 'Área da Piscina' }
    ]
  };

  const areas = [
    { id: 'bedroom', label: 'Bedrooms', icon: <BedIcon />, count: 11 },
    { id: 'bathroom', label: 'Bathrooms', icon: <BathtubIcon />, count: 11 },
    { id: 'kitchen', label: 'Kitchen', icon: <KitchenIcon />, count: 2 },
    { id: 'living', label: 'Living', icon: <WeekendIcon />, count: 2 },
    { id: 'game', label: 'Game Room', icon: <SportsEsportsIcon />, count: 1 },
    { id: 'pool', label: 'Pool Area', icon: <PoolIcon />, count: 1 },
  ];

  const handleAreaClick = (areaId) => {
    setSelectedArea(areaId);
    setSelectedRoom(null);
  };

  const handleRoomClick = (roomNumber) => {
    setSelectedRoom(roomNumber);
  };

  return (
    <Card sx={{ 
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={selectedRoom && selectedArea 
            ? areaImages[selectedArea].find(img => img.id === selectedRoom)?.image
            : '/images/6301/gallery/main.JPG'}
          alt={property.name}
          sx={{
            objectFit: 'cover',
            width: '100%'
          }}
        />
        {/* Property ID Chip - Top Center */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1
          }}
        >
          <Chip
            icon={<HomeIcon />}
            label="6301"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-icon': {
                color: 'white'
              },
              fontSize: '1rem',
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          />
        </Box>

        {/* B2B Info Chip - Bottom Left */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1
          }}
        >
          <Chip
            icon={<AccessTimeIcon />}
            label="B2B"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              '& .MuiChip-icon': {
                color: 'white'
              },
              fontSize: '0.9rem',
              height: 32,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="h2"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            fontWeight: 'bold'
          }}
        >
          {property.name || 'Mansão de Luxo'}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: 2
          }}
        >
          {property.address || 'Orlando, Florida'}
        </Typography>

        {/* Primeira linha de navegação - Áreas */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2, 
            flexWrap: 'wrap',
            pb: 2
          }}
        >
          {areas.map((area) => (
            <Chip
              key={area.id}
              icon={area.icon}
              label={area.label}
              onClick={() => handleAreaClick(area.id)}
              color={selectedArea === area.id ? "primary" : "default"}
              sx={{
                fontSize: '0.9rem',
                '& .MuiChip-icon': {
                  color: selectedArea === area.id ? 'inherit' : 'action.active'
                }
              }}
            />
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Segunda linha de navegação - Números */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2, 
            flexWrap: 'wrap',
            overflowX: 'auto',
            pb: 1
          }}
        >
          {selectedArea && areas.find(a => a.id === selectedArea)?.count > 0 && (
            Array.from({ length: areas.find(a => a.id === selectedArea).count }, (_, i) => (
              <Chip
                key={i}
                label={`${i + 1}`}
                variant={selectedRoom === (i + 1) ? "filled" : "outlined"}
                color={selectedRoom === (i + 1) ? "primary" : "default"}
                onClick={() => handleRoomClick(i + 1)}
                sx={{
                  minWidth: '40px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              />
            ))
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="large" 
          color="primary"
          variant="contained"
          fullWidth
          sx={{ mr: 1 }}
        >
          Ver Detalhes
        </Button>
        <Button 
          size="large" 
          color="secondary"
          variant="outlined"
          fullWidth
        >
          Inventário
        </Button>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
