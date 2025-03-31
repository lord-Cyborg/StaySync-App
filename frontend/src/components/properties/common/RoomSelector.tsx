import React from 'react';
import { Box, Chip } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Property } from '../../../types/property';

interface RoomSelectorProps {
  property: Property;
  selectedArea: string;
  selectedRoomId: number | null;
  onRoomSelect: (roomId: number) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  property,
  selectedArea,
  selectedRoomId,
  onRoomSelect
}) => {
  // Get rooms based on selected area
  const getRooms = () => {
    switch (selectedArea) {
      case 'living':
        return property.livingRooms?.map((room, index) => ({
          id: index + 1,
          label: `Living Room ${index + 1}`
        })) || [];
      case 'kitchen':
        return property.kitchens?.map((room, index) => ({
          id: index + 1,
          label: `Kitchen ${index + 1}`
        })) || [];
      case 'bedroom':
        return Array.from({ length: property.bedroomCount || 0 }, (_, index) => ({
          id: index + 1,
          label: `Bedroom ${index + 1}`
        }));
      case 'bathroom':
        return Array.from({ length: property.bathroomCount || 0 }, (_, index) => ({
          id: index + 1,
          label: `Bathroom ${index + 1}`
        }));
      case 'game':
        return property.gameRooms?.map((room, index) => ({
          id: index + 1,
          label: `Game Room ${index + 1}`
        })) || [];
      default:
        return [];
    }
  };

  const rooms = getRooms();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {rooms.map((room) => (
        <Chip
          key={room.id}
          label={room.label}
          onClick={() => onRoomSelect(room.id)}
          color={selectedRoomId === room.id ? 'primary' : 'default'}
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
};

export default RoomSelector;
