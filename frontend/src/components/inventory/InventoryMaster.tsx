import React from 'react';
import { Box, Typography } from '@mui/material';
import { PropertyInventoryItem } from '../../types/inventory-catalog';
import { ITEMS_BY_CATEGORY } from '../../constants/inventory';

interface InventoryMasterProps {
  selectedProperty: string;
  inventoryItems: PropertyInventoryItem[];
}

const InventoryMaster: React.FC<InventoryMasterProps> = ({ selectedProperty, inventoryItems }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Inventory Master for {selectedProperty}</Typography>
      {Object.keys(ITEMS_BY_CATEGORY).map((category) => (
        <Box key={category} sx={{ mt: 2 }}>
          <Typography variant="h6">{category}</Typography>
          {Object.keys(ITEMS_BY_CATEGORY[category]).map((area) => (
            <Box key={area} sx={{ mt: 1 }}>
              <Typography variant="subtitle1">{area.charAt(0).toUpperCase() + area.slice(1)}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {ITEMS_BY_CATEGORY[category][area].map((item, index) => (
                  <Typography key={index}>{item}</Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default InventoryMaster;
