import React from 'react';
import PropertyInventory from './PropertyInventory';
import { InventoryCategory, AreaType } from '../../types/inventory-catalog';

interface RoomInventoryProps {
  area: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'game';
  roomId: number;
  categories: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      status: string;
      quantity: number;
    }>;
  }>;
}

const areaToAreaType: Record<RoomInventoryProps['area'], AreaType> = {
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  kitchen: 'Kitchen',
  living: 'LivingRoom',
  game: 'GameRoom'
};

const RoomInventoryAdapter: React.FC<RoomInventoryProps> = ({
  area,
  roomId,
  categories
}) => {
  return (
    <PropertyInventory
      propertyId="6301" // Este é o ID fixo que estamos usando
      roomId={roomId.toString()}
      areaType={areaToAreaType[area]}
    />
  );
};

export default RoomInventoryAdapter;
