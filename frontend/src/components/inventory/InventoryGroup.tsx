import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Divider,
  Badge
} from '@mui/material';
import { Edit, PhotoLibrary } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { PropertyInventoryItem } from '../../types/inventory-catalog';
import { 
  InventoryCategoryType, 
  INVENTORY_STATUS_COLORS,
  INVENTORY_STATUS_LABELS,
  INVENTORY_Status
} from '../../types/inventory-types';
import SeverityIndicator from './SeverityIndicator';
import InventoryItemRow from './InventoryItemRow';
import AddSubItemModal from './AddSubItemModal';

interface InventoryGroupProps {
  category: InventoryCategoryType;
  items: PropertyInventoryItem[];
  expanded: boolean;
  onCheckChange: (id: string, checked: boolean) => void;
  onEditClick: (item: PropertyInventoryItem) => void;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  propertyId: string;
  roomId: string;
  areaType: string;
}

const MAX_DESCRIPTION_LENGTH = 100;

const InventoryGroup: React.FC<InventoryGroupProps> = ({
  category,
  items,
  expanded,
  onCheckChange,
  onEditClick,
  onChange,
  propertyId,
  roomId,
  areaType
}) => {
  const [selectedParentItem, setSelectedParentItem] = useState<PropertyInventoryItem | null>(null);
  const [isAddSubItemModalOpen, setIsAddSubItemModalOpen] = useState(false);

  const truncateDescription = (text: string = '') => {
    if (!text) return '';
    if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
    return `${text.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
  };

  // Contagem de itens por status
  const statusCounts = items.reduce((acc, item) => {
    if (item.status === 'problem' || item.status === 'attention') {
      acc[item.status] = (acc[item.status] || 0) + 1;
    }
    return acc;
  }, {} as Record<INVENTORY_Status, number>);

  const handleAddSubItemClick = (parentItem: PropertyInventoryItem) => {
    // Garantindo que temos todas as informações da hierarquia
    const enrichedParentItem = {
      ...parentItem,
      propertyId,
      roomId,
      areaType,
      category
    };
    setSelectedParentItem(enrichedParentItem);
    setIsAddSubItemModalOpen(true);
  };

  const handleAddSubItemSave = async (newSubItem: PropertyInventoryItem) => {
    try {
      // Agora temos certeza que o newSubItem terá todas as informações da hierarquia
      const subItem = {
        ...newSubItem,
        propertyId,
        roomId,
        areaType,
        category,
        parentId: selectedParentItem?.id
      };
      
      console.log('New sub-item with hierarchy:', subItem);
      setIsAddSubItemModalOpen(false);
      setSelectedParentItem(null);
      // Emitir evento para recarregar itens
      const event = new CustomEvent('inventoryUpdated', {
        detail: { propertyId, roomId }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving sub-item:', error);
    }
  };

  return (
    <Accordion 
      expanded={expanded}
      onChange={onChange}
      sx={{ 
        mb: 2,
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {category}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
          {statusCounts.problem > 0 && (
            <Badge 
              badgeContent={statusCounts.problem} 
              color="error"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: INVENTORY_STATUS_COLORS.problem
                }}
              />
            </Badge>
          )}
          {statusCounts.attention > 0 && (
            <Badge 
              badgeContent={statusCounts.attention} 
              color="warning"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: INVENTORY_STATUS_COLORS.attention
                }}
              />
            </Badge>
          )}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            ({items.length})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {items.map((item) => (
          <InventoryItemRow
            key={item.id}
            item={item}
            onCheckChange={onCheckChange}
            onEditClick={onEditClick}
          />
        ))}
        
        {/* Linha adicional para adicionar sub-item */}
        <Box sx={{ 
          mb: 1, 
          p: 1, 
          borderRadius: 1,
          backgroundColor: 'background.paper',
          '&:hover': { backgroundColor: 'action.hover' },
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {/* Espaço equivalente ao checkbox */}
          <Box sx={{ width: 42 }} />
          
          {/* Espaço equivalente ao texto */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Espaço equivalente ao status indicator */}
          <Box sx={{ width: 12 }} />
          
          {/* Botão de adicionar */}
          <IconButton 
            size="small"
            onClick={() => handleAddSubItemClick(items[items.length - 1])}
            sx={{ 
              color: 'action.active'
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Modal de Adicionar Sub-item */}
        {selectedParentItem && (
          <AddSubItemModal
            open={isAddSubItemModalOpen}
            parentItem={selectedParentItem}
            onClose={() => {
              setIsAddSubItemModalOpen(false);
              setSelectedParentItem(null);
            }}
            onSave={handleAddSubItemSave}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default InventoryGroup;
