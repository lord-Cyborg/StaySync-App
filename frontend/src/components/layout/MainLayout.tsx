import { useState } from 'react';
import { Box, useTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header-StaySync';
import Sidebar from '../common/Sidebar';

const DRAWER_WIDTH = 280;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controle do estado do sidemenu

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Header 
        drawerWidth={DRAWER_WIDTH} 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={handleToggleSidebar} // Passando a função para o header
      />
      
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          pt: '64px',
          px: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;