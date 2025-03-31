import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
  CatalogItem, 
  InventoryCategory, 
  Specification 
} from '../../types/inventory-catalog';
import { inventoryCatalogService } from '../../services/inventoryCatalogService';

interface SpecificationFormProps {
  specification: Specification;
  onChange: (updated: Specification) => void;
  onDelete: () => void;
}

const SpecificationForm: React.FC<SpecificationFormProps> = ({
  specification,
  onChange,
  onDelete
}) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
    <TextField
      label="Name"
      value={specification.name}
      onChange={(e) => onChange({ ...specification, name: e.target.value })}
      size="small"
    />
    <TextField
      label="Value"
      value={specification.value}
      onChange={(e) => onChange({ ...specification, value: e.target.value })}
      size="small"
    />
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={specification.type}
        label="Type"
        onChange={(e) => onChange({ ...specification, type: e.target.value as Specification['type'] })}
      >
        <MenuItem value="text">Text</MenuItem>
        <MenuItem value="number">Number</MenuItem>
        <MenuItem value="dimension">Dimension</MenuItem>
        <MenuItem value="currency">Currency</MenuItem>
        <MenuItem value="serial">Serial Number</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Unit"
      value={specification.unit || ''}
      onChange={(e) => onChange({ ...specification, unit: e.target.value })}
      size="small"
    />
    <IconButton onClick={onDelete} color="error">
      <DeleteIcon />
    </IconButton>
  </Box>
);

const CatalogManager: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });

  // Form state
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    category: 'Furniture',
    name: '',
    specifications: []
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await inventoryCatalogService.getCatalogItems();
      setItems(data);
    } catch (error) {
      showSnackbar('Error loading catalog items', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedItem) {
        await inventoryCatalogService.updateCatalogItem(selectedItem.id, formData);
      } else {
        await inventoryCatalogService.createCatalogItem(formData as any);
      }
      setIsDialogOpen(false);
      loadItems();
      showSnackbar(`Item ${selectedItem ? 'updated' : 'created'} successfully`, 'success');
    } catch (error) {
      showSnackbar('Error saving item', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inventoryCatalogService.deleteCatalogItem(id);
      loadItems();
      showSnackbar('Item deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Error deleting item', 'error');
    }
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [
        ...(prev.specifications || []),
        {
          id: Date.now().toString(),
          name: '',
          value: '',
          type: 'text'
        }
      ]
    }));
  };

  const handleSpecificationChange = (index: number, updated: Specification) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications?.map((spec, i) =>
        i === index ? updated : spec
      )
    }));
  };

  const handleSpecificationDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index)
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const openDialog = (item?: CatalogItem) => {
    setSelectedItem(item || null);
    setFormData(item || {
      category: 'Furniture',
      name: '',
      specifications: []
    });
    setIsDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Inventory Catalog Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
        >
          Add New Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {item.category}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton onClick={() => openDialog(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Edit Catalog Item' : 'New Catalog Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category || ''}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
              >
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Bed Linen">Bed Linen</MenuItem>
                <MenuItem value="Lights">Lights</MenuItem>
                <MenuItem value="Floor-Carpet">Floor/Carpet</MenuItem>
                <MenuItem value="Wall">Wall</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Default Value"
              type="number"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({ ...formData, defaultValue: Number(e.target.value) })}
            />

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Specifications
              </Typography>
              {formData.specifications?.map((spec, index) => (
                <SpecificationForm
                  key={spec.id}
                  specification={spec}
                  onChange={(updated) => handleSpecificationChange(index, updated)}
                  onDelete={() => handleSpecificationDelete(index)}
                />
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddSpecification}
                variant="outlined"
                size="small"
              >
                Add Specification
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CatalogManager;
