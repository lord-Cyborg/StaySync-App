import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, LoginCredentials } from '../../services/authService';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obter o caminho de redirecionamento dos parâmetros da URL ou usar o padrão
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await authService.login(credentials);
      
      // Redirecionar para a página anterior ou dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro de login:', error);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container 
      maxWidth={false}
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Grid 
        container 
        spacing={1.5}
        sx={{
          justifyContent: 'center',
          margin: 0,
          width: '100%'
        }}
      >
        <Grid 
          item 
          sx={{ 
            width: '420px',
            flexGrow: 0,
            flexShrink: 0
          }}
        >
          <Card 
            sx={{ 
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image="/images/logos/logo-horizontal.png"
              alt="StaySync Logo"
              sx={{ 
                objectFit: 'contain',
                padding: 2,
                backgroundColor: '#f8f8f8'
              }}
            />
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom align="center">
                Login
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Entrar'}
                </Button>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Credenciais de teste: edmark@staysyncsolutions.com / senha123
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
