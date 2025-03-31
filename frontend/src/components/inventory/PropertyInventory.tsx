import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { 
  PropertyInventoryItem,
  CatalogItem
} from '../../types/inventory-catalog';
import { InventoryCategoryType } from '../../types/inventory-types';
import { inventoryCatalogService } from '../../services/inventoryCatalogService';
import { logger } from '../../utils/logger';
import InventoryGroup from './InventoryGroup';
import InventoryEditModal from './InventoryEditModal';

interface PropertyInventoryProps {
  propertyId: string;
  roomId: string;
  areaType: string;
}

const PropertyInventory: React.FC<PropertyInventoryProps> = ({
  propertyId,
  roomId,
  areaType
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PropertyInventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PropertyInventoryItem | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFromCatalogOpen, setIsAddFromCatalogOpen] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });
  
  // Form state for editing
  const [formData, setFormData] = useState<Partial<PropertyInventoryItem>>({
    status: 'ok',
    quantity: 1
  });

  useEffect(() => {
    loadItems();
    loadCatalogItems();

    // Adicionar listener para recarregar itens quando houver mudanças
    const handleInventoryUpdate = (event: CustomEvent) => {
      const { propertyId: updatedPropertyId, roomId: updatedRoomId } = event.detail;
      if (propertyId === updatedPropertyId && roomId === updatedRoomId) {
        loadItems();
      }
    };

    window.addEventListener('inventoryUpdated', handleInventoryUpdate as EventListener);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate as EventListener);
    };
  }, [propertyId, roomId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      
      // Log dos valores recebidos das props
      console.log('PropertyInventory - Props recebidas:', {
        propertyId,
        roomId,
        areaType
      });

      // Log do filtro enviado ao serviço
      console.log('PropertyInventory - Filtro enviado:', { roomId });
      
      const propertyItems = await inventoryCatalogService.getPropertyInventoryItems(
        propertyId,
        { roomId }
      );

      // Log dos itens recebidos
      console.log('PropertyInventory - Itens recebidos:', propertyItems);
      
      setItems(propertyItems);
      setError(null);
    } catch (err) {
      console.error('Error loading items:', err);
      logger.error('PropertyInventory', 'Error loading items', { error: err });
      setError('Error loading inventory items');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogItems = async () => {
    try {
      const data = await inventoryCatalogService.getCatalogItems();
      setCatalogItems(data);
    } catch (error) {
      showSnackbar('Error loading catalog items', 'error');
    }
  };

  // Handlers
  const handleCheckChange = async (id: string, checked: boolean) => {
    try {
      await inventoryCatalogService.updatePropertyItem(propertyId, id, { isChecked: checked });
      setItems(items.map(item => 
        item.id === id ? { ...item, isChecked: checked } : item
      ));
    } catch (err) {
      console.error('Error updating item check:', err);
      showSnackbar('Error updating item', 'error');
    }
  };

  const handleEditClick = (item: PropertyInventoryItem) => {
    logger.debug('PropertyInventory', 'Edit clicked for item', { id: item.id });
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = async (updatedItem: PropertyInventoryItem) => {
    try {
      logger.debug('PropertyInventory', '1. Recebendo item para salvar', {
        id: updatedItem.id,
        status: updatedItem.status,
        notes: updatedItem.notes
      });
      
      // Atualizar no backend
      const savedItem = await inventoryCatalogService.updatePropertyItem(
        propertyId,
        updatedItem.id,
        updatedItem
      );

      logger.debug('PropertyInventory', '2. Item retornado do backend', {
        id: savedItem.id,
        status: savedItem.status,
        notes: savedItem.notes
      });

      // Recarregar todos os itens para garantir que temos os dados mais recentes
      await loadItems();
      
      setIsDialogOpen(false);
      setSelectedItem(null);
      showSnackbar('Item updated successfully', 'success');
    } catch (error) {
      console.error('Error saving item:', error);
      showSnackbar('Error updating item', 'error');
    }
  };

  const handleAddFromCatalog = async () => {
    try {
      await inventoryCatalogService.addItemToProperty(propertyId, selectedCatalogItem, {
        roomId,
        status: 'ok',
        quantity: 1
      });
      setIsAddFromCatalogOpen(false);
      loadItems();
      showSnackbar('Item added successfully', 'success');
    } catch (error) {
      showSnackbar('Error adding item', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleGroup = (category: string) => {
    setExpandedGroups(prev => {
      // Se o grupo clicado já está expandido, fecha ele
      if (prev[category]) {
        return {
          ...prev,
          [category]: false
        };
      }
      
      // Se o grupo clicado está fechado, fecha todos os outros e abre ele
      const allClosed = Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {});
      
      return {
        ...allClosed,
        [category]: true
      };
    });
  };

  // Define a ordem das categorias
  const categoryOrder: InventoryCategoryType[] = [
    'Furniture',
    'Bed Linen',
    'Electronics',
    'Lighting',
    'Floor-Carpet',
    'Wall'
  ];

  // Initialize all categories with empty arrays
  const initialGroups = categoryOrder.reduce((acc, category) => ({
    ...acc,
    [category]: []
  }), {} as Record<string, PropertyInventoryItem[]>);

  // Group items by category, starting with all possible categories
  const groupedItems = items.reduce((acc, item) => {
    if (categoryOrder.includes(item.category as InventoryCategoryType)) {
      acc[item.category].push(item);
    }
    return acc;
  }, initialGroups);

  // Initialize expanded groups based on available categories
  useEffect(() => {
    setExpandedGroups(
      categoryOrder.reduce((acc, category) => ({
        ...acc,
        [category]: category === 'Furniture' // Apenas Furniture começa aberto
      }), {})
    );
  }, [items]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Add from Catalog Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddFromCatalogOpen(true)}
        >
          Add Item
        </Button>
      </Box>

      {/* Inventory Groups */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <InventoryGroup
          key={category}
          category={category as InventoryCategoryType}
          items={items}
          expanded={expandedGroups[category] || false}
          onCheckChange={handleCheckChange}
          onEditClick={handleEditClick}
          onChange={(_, isExpanded) => handleToggleGroup(category, isExpanded)}
          propertyId={propertyId}
          roomId={roomId}
          areaType={areaType}
        />
      ))}

      {/* Add from Catalog Dialog */}
      <Dialog open={isAddFromCatalogOpen} onClose={() => setIsAddFromCatalogOpen(false)}>
        <DialogTitle>Add Item from Catalog</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Item</InputLabel>
            <Select
              value={selectedCatalogItem}
              onChange={(e) => setSelectedCatalogItem(e.target.value)}
            >
              {catalogItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddFromCatalogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddFromCatalog} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <InventoryEditModal
        open={isDialogOpen}
        item={selectedItem}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyInventory;
