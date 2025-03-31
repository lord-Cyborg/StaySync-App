import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse,
  alpha,
  Avatar,
  Divider,
  Stack,
  IconButton,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  HomeWork as HomeWorkIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  subItems?: MenuItem[];
}

const Sidebar = ({ drawerWidth, open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    {
      text: 'Properties',
      icon: <HomeWorkIcon />,
      subItems: [
        { text: 'All Properties', icon: <ViewListIcon />, path: '/properties' },
        { text: 'Add Property', icon: <AddIcon />, path: '/add-property' },
        { text: 'Property 6301', icon: <HomeWorkIcon />, path: '/property/6301' },
      ]
    },
    {
      text: 'Inventory',
      icon: <InventoryIcon />,
      subItems: [
        { text: 'Overview', icon: <ViewListIcon />, path: '/inventory' },
        { text: 'Add Item', icon: <AddIcon />, path: '/inventory/add' },
        { text: 'Categories', icon: <CategoryIcon />, path: '/inventory/categories' },
      ]
    },
    {
      text: 'Tasks',
      icon: <AssignmentIcon />,
      subItems: [
        { text: 'All Tasks', icon: <ViewListIcon />, path: '/tasks' },
        { text: 'Add Task', icon: <AddIcon />, path: '/tasks/add' },
      ]
    },
    {
      text: 'Team',
      icon: <PeopleIcon />,
      subItems: [
        { text: 'Members', icon: <ViewListIcon />, path: '/team' },
        { text: 'Add Member', icon: <AddIcon />, path: '/team/add' },
      ]
    },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  ];

  const renderMenuItem = (item: MenuItem, paddingLeft = 2) => {
    const isSelected = location.pathname === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSubMenuOpen = openSubMenus[item.text];

    return (
      <Box key={item.text}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasSubItems) {
                handleSubMenuClick(item.text);
              } else if (item.path) {
                navigate(item.path);
                if (isMobile) onClose();
              }
            }}
            sx={{
              pl: paddingLeft,
              py: 1,
              ...(isSelected && {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiTypography-root': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: isSelected ? 600 : 400,
              }}
            />
            {hasSubItems && (
              isSubMenuOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasSubItems && (
          <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => renderMenuItem(subItem, paddingLeft + 2))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: 'background.paper',
          boxShadow: theme.shadows[8],
          borderRadius: 0,
          height: '100%',
          pt: '64px', // Padding top consistente para todas as telas
          zIndex: theme.zIndex.drawer // Garante que fique abaixo do AppBar
        },
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative' // Para posicionar o botão de fechar
      }}>
        {isMobile && (
          <IconButton 
            onClick={onClose}
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              },
              zIndex: 1
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        )}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Edmark
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List component="nav" sx={{ px: 2, py: 1 }}>
            {menuItems.map((item) => renderMenuItem(item))}
          </List>
        </Box>

        <Divider />

        <List sx={{ px: 2, py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/settings')}
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
