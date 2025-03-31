import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Badge,
} from '@mui/material';
import { Edit, PhotoLibrary } from '@mui/icons-material';
import SeverityIndicator from './SeverityIndicator';
import EditItemModal, { ItemData } from './EditItemModal';

interface InventoryItem {
  id: string;
  description: string;
  shortDescription: string;
  severity: 'low' | 'medium' | 'high';
  images: string[];
}

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, data: ItemData) => void;
  onResolveItem: (id: string) => void;
}

const MAX_DESCRIPTION_LENGTH = 100;

const InventoryList: React.FC<InventoryListProps> = ({ items, onUpdateItem, onResolveItem }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleSave = (data: ItemData) => {
    if (selectedItem) {
      onUpdateItem(selectedItem.id, data);
    }
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  const truncateDescription = (text: string) => {
    if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
    return `${text.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
  };

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {item.images.length > 0 && (
                  <Badge badgeContent={item.images.length} color="primary">
                    <PhotoLibrary />
                  </Badge>
                )}
                <IconButton edge="end" onClick={() => handleEditClick(item)}>
                  <Edit />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SeverityIndicator severity={item.severity} />
                  <Typography variant="body1">
                    {truncateDescription(item.description)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {selectedItem && (
        <EditItemModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          onResolve={() => {
            if (selectedItem) {
              onResolveItem(selectedItem.id);
              setEditModalOpen(false);
              setSelectedItem(null);
            }
          }}
          initialData={{
            description: selectedItem.description,
            severity: selectedItem.severity,
            images: [],
          }}
        />
      )}
    </>
  );
};

export default InventoryList;
