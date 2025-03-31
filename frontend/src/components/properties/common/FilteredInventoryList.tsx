import React from 'react';
import { List, ListItem, ListItemText, Divider, Typography, Paper } from '@mui/material';

// Define AreaType and InventoryCategory
export type AreaType = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'game' | 'all';
export type InventoryCategory = 'Furniture' | 'Bed Linen' | 'Electronics' | 'Lighting' | 'Floor-Carpet' | 'Wall' | 'Towels';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  area: string;
}

interface FilteredInventoryListProps {
  inventoryItems: InventoryItem[];
  areaId?: AreaType;
}

const categoryGroups: Record<AreaType, InventoryCategory[]> = {
  bedroom: ['Furniture', 'Bed Linen'],
  bathroom: ['Towels'],
  kitchen: ['Furniture', 'Electronics'],
  living: ['Furniture', 'Electronics', 'Lighting'],
  game: ['Furniture', 'Electronics'],
  all: ['Furniture', 'Bed Linen', 'Electronics', 'Lighting', 'Floor-Carpet', 'Wall', 'Towels'],
};

const FilteredInventoryList: React.FC<FilteredInventoryListProps> = ({ inventoryItems, areaId }) => {
  const groupedItems = inventoryItems.reduce((acc, item) => {
    const group = item.area;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const categories = categoryGroups[areaId as AreaType || 'all'];

  console.log('Area ID:', areaId);
  console.log('Inventory Items:', inventoryItems);

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Inventory Items
      </Typography>
      {Object.keys(groupedItems).length === 0 ? (
        <Typography color="textSecondary">
          No inventory items found for this {areaId ? 'area' : 'property'}
        </Typography>
      ) : (
        categories.map((category: InventoryCategory) => (
          <div key={category}>
            <Typography variant="subtitle1" gutterBottom>
              {category}
            </Typography>
            <List>
              {groupedItems[category]?.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
                  </ListItem>
                </React.Fragment>
              )) || (
                <ListItem>
                  <ListItemText primary="No items in this category" />
                </ListItem>
              )}
            </List>
          </div>
        ))
      )}
    </Paper>
  );
};

export default FilteredInventoryList;
