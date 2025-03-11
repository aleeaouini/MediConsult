import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Container, 
  CircularProgress,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import { FaUserMd, FaEnvelope, FaPhone, FaCalendarCheck } from 'react-icons/fa';

const SpecialtyPage = () => {
  const { specialty } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/consult?specialty=${specialty}`);
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur de récupération des docteurs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (specialty) {
      fetchDoctors();
    }
  }, [specialty]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box 
      sx={{
        background: 'linear-gradient(135deg, #c3cfe2 0%, #ffffff 100%)',
        minHeight: '100vh',
        pt: '100px',
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <FaUserMd size={40} color="#2563eb" style={{ marginBottom: '1rem' }} />
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#2d3748',
              mb: 2
            }}
          >
            {capitalizeFirstLetter(specialty)}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Sélectionnez un médecin pour démarrer votre consultation en ligne
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
            {error}
          </Alert>
        ) : doctors.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {doctors.map((doctor) => (
              <Grid item key={doctor.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[10],
                    },
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      height: '80px',
                      position: 'absolute',
                      width: '100%',
                      top: 0
                    }}
                  />
                  <CardContent sx={{ position: 'relative', pt: 7 }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          bgcolor: 'primary.dark',
                          border: '4px solid white'
                        }}
                      >
                        <Typography variant="h4" sx={{ color: 'white' }}>
                          {doctor.username.charAt(0)}
                        </Typography>
                      </Avatar>
                      <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Dr. {doctor.username}
                      </Typography>
                      <Chip 
                        label={capitalizeFirstLetter(specialty)}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FaEnvelope color="#666" size={16} style={{ marginRight: '8px' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <FaPhone color="#666" size={16} style={{ marginRight: '8px' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        }
                      }}
                      onClick={() => navigate(`/symptoms/${doctor.id}`)}
                      startIcon={<FaCalendarCheck />}
                    >
                      Démarrer la consultation
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert 
            severity="info" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              borderRadius: 2
            }}
          >
            Aucun médecin disponible pour cette spécialité actuellement.
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default SpecialtyPage;