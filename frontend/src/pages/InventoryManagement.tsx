import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import CatalogManager from '../components/inventory/CatalogManager';
import PropertyInventory from '../components/inventory/PropertyInventory';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`inventory-tabpanel-${index}`}
    aria-labelledby={`inventory-tab-${index}`}
    sx={{ py: 3 }}
  >
    {value === index && children}
  </Box>
);

const InventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getProperties();
      setProperties(data);
      if (data.length > 0) {
        setSelectedProperty(data[0].id);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getCurrentProperty = () => {
    return properties.find(p => p.id === selectedProperty);
  };

  const getAvailableRooms = () => {
    const property = getCurrentProperty();
    if (!property || !selectedArea) return [];

    switch (selectedArea) {
      case 'bedroom':
        return Array.from({ length: property.bedroomCount }, (_, i) => ({
          id: `bedroom-${i + 1}`,
          name: `Bedroom ${i + 1}`
        }));
      case 'bathroom':
        return Array.from({ length: property.bathroomCount }, (_, i) => ({
          id: `bathroom-${i + 1}`,
          name: `Bathroom ${i + 1}`
        }));
      case 'kitchen':
        return property.kitchens?.map((_, i) => ({
          id: `kitchen-${i + 1}`,
          name: `Kitchen ${i + 1}`
        })) || [];
      case 'living':
        return property.livingRooms?.map((_, i) => ({
          id: `living-${i + 1}`,
          name: `Living Room ${i + 1}`
        })) || [];
      default:
        return [];
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href="#"
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
          >
            <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Inventory Management
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Inventory Management
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Paper sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2]
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="inventory management tabs"
            sx={{
              px: 2,
              backgroundColor: theme.palette.background.default
            }}
          >
            <Tab 
              icon={<CategoryIcon sx={{ mr: 1 }} />}
              label="Global Catalog"
              iconPosition="start"
            />
            <Tab 
              icon={<InventoryIcon sx={{ mr: 1 }} />}
              label="Property Inventory"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <CatalogManager />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Property</InputLabel>
                <Select
                  value={selectedProperty}
                  label="Select Property"
                  onChange={(e) => {
                    setSelectedProperty(e.target.value);
                    setSelectedArea('');
                    setSelectedRoom('');
                  }}
                >
                  {properties.map((property) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Area</InputLabel>
                <Select
                  value={selectedArea}
                  label="Select Area"
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setSelectedRoom('');
                  }}
                >
                  <MenuItem value="bedroom">Bedroom</MenuItem>
                  <MenuItem value="bathroom">Bathroom</MenuItem>
                  <MenuItem value="kitchen">Kitchen</MenuItem>
                  <MenuItem value="living">Living Room</MenuItem>
                </Select>
              </FormControl>

              {selectedArea && (
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Room</InputLabel>
                  <Select
                    value={selectedRoom}
                    label="Select Room"
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    {getAvailableRooms().map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {selectedProperty && selectedArea && selectedRoom ? (
              <PropertyInventory
                propertyId={selectedProperty}
                roomId={selectedRoom}
                areaType={selectedArea}
              />
            ) : (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                <Typography>
                  Please select a property, area, and room to view inventory
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default InventoryManagement;
