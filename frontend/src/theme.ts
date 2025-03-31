import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface TypeBackground {
    neutral: string;
  }
}

// Cores principais do StaySync
const primaryMain = '#1E88E5'; // Azul oceano - cor principal e secundária
const secondaryMain = '#1E88E5'; // Usando o mesmo azul oceano

export const theme = createTheme({
  palette: {
    primary: {
      light: '#64B5F6',
      main: primaryMain,
      dark: '#1565C0',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#64B5F6', // Atualizando para tons de azul
      main: secondaryMain,
      dark: '#1565C0', // Atualizando para tons de azul
      contrastText: '#ffffff',
    },
    success: {
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    info: {
      light: '#4FC3F7',
      main: '#29B6F6',
      dark: '#0288D1',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
      light: '#E57373',
      main: '#F44336',
      dark: '#D32F2F',
      contrastText: '#ffffff',
    },
    neutral: {
      light: '#F5F5F5',
      main: '#9E9E9E',
      dark: '#616161',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      neutral: '#F5F5F5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: primaryMain,
          '&:hover': {
            backgroundColor: '#1976D2',
          },
        },
        containedSecondary: {
          backgroundColor: secondaryMain,
          '&:hover': {
            backgroundColor: '#1976D2', // Mesmo hover do primary
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `linear-gradient(135deg, ${alpha(primaryMain, 0.02)}, ${alpha(secondaryMain, 0.02)})`,
          backgroundColor: '#F5F5F5',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
