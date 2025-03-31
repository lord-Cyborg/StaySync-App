import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, Edmark
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your properties and bookings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Properties
            </Typography>
            <Typography component="p" variant="h4">
              12
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Active Properties • 2 new
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Bookings
            </Typography>
            <Typography component="p" variant="h4">
              48
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This Month • +12%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Revenue
            </Typography>
            <Typography component="p" variant="h4">
              $24k
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This Month • +15%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Occupancy Rate
            </Typography>
            <Typography component="p" variant="h4">
              85%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Average • Last 30 days
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
