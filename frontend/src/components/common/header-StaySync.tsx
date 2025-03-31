import { 
  AppBar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
  Avatar, 
  Badge, 
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  drawerWidth: number;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const HeaderStaySync = ({ drawerWidth, isSidebarOpen, onToggleSidebar }: HeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  return (
    <AppBar 
      className="header" 
      position="fixed"
      sx={{
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <IconButton
          onClick={onToggleSidebar}
          edge="start"
          sx={{
            color: 'white',
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <Box 
            component="img"
            src="/images/logos/logo-icon.png"
            alt="StaySync Logo"
            sx={{ 
              height: 32,
              filter: 'brightness(0) invert(1)',
              display: { xs: 'none', sm: 'block' }
            }}
          />
          
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              height: 32, 
              my: 'auto',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              display: { xs: 'none', md: 'block' }
            }} 
          />
          
          <Box
            component="img"
            src="/images/logos/StaySync_Brand.png"
            alt="StaySync"
            sx={{ 
              height: 24,
              filter: 'brightness(0) invert(1)',
              display: { xs: 'none', md: 'block' }
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton 
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <Badge 
              badgeContent={4} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  fontSize: '0.65rem'
                }
              }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Button
            onClick={handleMenuOpen}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
              px: 2,
              py: 1,
              borderRadius: 2,
              display: { xs: 'none', sm: 'flex' }
            }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.dark'
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Edmark
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.2 }}>
                  Developer
                </Typography>
              </Box>
            </Stack>
          </Button>

          <IconButton 
            sx={{ 
              color: 'white',
              display: { xs: 'flex', sm: 'none' }
            }}
            onClick={handleMenuOpen}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Stack>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => console.log('logout')}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          onClick={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 300,
              maxHeight: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You have 4 new notifications
            </Typography>
          </Box>
          <Divider />
          <MenuItem>
            <Stack spacing={0.5}>
              <Typography variant="body2">New property added</Typography>
              <Typography variant="caption" color="text.secondary">
                2 minutes ago
              </Typography>
            </Stack>
          </MenuItem>
          <MenuItem>
            <Stack spacing={0.5}>
              <Typography variant="body2">Maintenance request</Typography>
              <Typography variant="caption" color="text.secondary">
                1 hour ago
              </Typography>
            </Stack>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography color="primary" variant="body2">
              View All
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderStaySync;
