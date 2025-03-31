import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Collapse,
  IconButton,
  Divider,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Camera as CameraIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { InventoryCategory, InventoryItem } from '../../../types/inventory';

interface InspectionPanelProps {
  categories: InventoryCategory[];
  onCreateTask?: (item: InventoryItem) => void;
  onSaveInspection?: (data: any) => void;
}

const InspectionPanel: React.FC<InspectionPanelProps> = ({
  categories,
  onCreateTask,
  onSaveInspection
}) => {
  const [expanded, setExpanded] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Gera um código único para a inspeção
  const inspectionCode = `INS-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleCreateTask = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (selectedItem && onCreateTask) {
      onCreateTask(selectedItem);
    }
    setShowTaskDialog(false);
    setSelectedItem(null);
  };

  const handleSaveInspection = () => {
    if (onSaveInspection) {
      onSaveInspection({
        code: inspectionCode,
        notes: inspectionNotes,
        selectedItems,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getAllItems = () => {
    return categories.flatMap(category => category.items);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mt: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <AssessmentIcon color="primary" />
          <Typography variant="h6">
            Inspection
          </Typography>
          <Chip 
            label={inspectionCode}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <IconButton onClick={handleToggle}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Inspection Notes"
            value={inspectionNotes}
            onChange={(e) => setInspectionNotes(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Items to Inspect
          </Typography>

          <Stack spacing={1}>
            {getAllItems().map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">
                    {item.name}
                  </Typography>
                  {item.status === 'attention' && (
                    <Chip 
                      label="Needs Attention" 
                      size="small" 
                      color="warning"
                    />
                  )}
                </Stack>
                
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    size="small"
                    color="primary"
                  >
                    <CameraIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleCreateTask(item)}
                  >
                    <TaskIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveInspection}
            sx={{ mt: 2 }}
          >
            Save Inspection
          </Button>
        </Box>
      </Collapse>

      <Dialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)}>
        <DialogTitle>Create Maintenance Task</DialogTitle>
        <DialogContent>
          <Typography>
            Create a maintenance task for: {selectedItem?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InspectionPanel;
