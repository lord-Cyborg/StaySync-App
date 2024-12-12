import { Container, Grid, Typography, Box } from '@mui/material'
import PropertyCard from './components/properties/common/PropertyCard'

function App() {
  const properties = [
    {
      id: '6301',
      name: 'Mansão de Luxo em Orlando',
      address: 'Orlando, Florida',
      bedrooms: 11,
      bathrooms: 11,
      features: ['Piscina', 'Sala de Jogos', 'Cozinha Gourmet']
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Box py={2}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Propriedades
        </Typography>
        <Grid container spacing={2}>
          {properties.map((property) => (
            <Grid item xs={12} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default App
