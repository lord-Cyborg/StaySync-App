import React from 'react';
import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { PropertyInventoryItem } from '../../types/inventory-catalog';
import { 
  STATUS_COLORS, 
  STATUS_LABELS 
} from '../../constants/inventory';
import { logger } from '../../utils/logger';

interface InventoryItemRowProps {
  item: PropertyInventoryItem;
  onCheckChange: (id: string, checked: boolean) => void;
  onEditClick: (item: PropertyInventoryItem) => void;
}

const InventoryItemRow: React.FC<InventoryItemRowProps> = ({
  item,
  onCheckChange,
  onEditClick
}) => {
  logger.debug('InventoryItemRow', 'Rendering item', { 
    id: item.id, 
    status: item.status,
    notes: item.notes,
    name: item.name
  });

  return (
    <Box sx={{ 
      mb: 1, 
      p: 1, 
      borderRadius: 1,
      backgroundColor: 'background.paper',
      '&:hover': { backgroundColor: 'action.hover' }
    }}>
      {/* Linha 1: Checkbox, Nome, Quantidade, Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox
          checked={item.isChecked}
          onChange={(e) => {
            logger.debug('InventoryItemRow', 'Checkbox changed', { 
              id: item.id, 
              checked: e.target.checked 
            });
            onCheckChange(item.id, e.target.checked);
          }}
        />
        <Typography 
          variant="body1" 
          sx={{ flexGrow: 1 }}
        >
          {item.name}
          {item.quantity > 1 && ` (${item.quantity})`}
        </Typography>

        {/* Status */}
        <Tooltip title={STATUS_LABELS[item.status]} placement="top">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: STATUS_COLORS[item.status],
            }}
          />
        </Tooltip>

        <IconButton 
          size="small" 
          onClick={() => {
            logger.debug('InventoryItemRow', 'Edit clicked', { id: item.id });
            onEditClick(item);
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      {/* Linha 2: Notas (se houver) */}
      {item.notes && (
        <Box sx={{ ml: 7 }}>
          <Tooltip title={item.notes} placement="bottom-start">
            <Typography
              variant="caption"
              color={item.status === 'problem' 
                ? 'error.main' 
                : item.status === 'attention'
                  ? 'warning.main'
                  : 'success.main'}  
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {item.notes}
            </Typography>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default InventoryItemRow;
