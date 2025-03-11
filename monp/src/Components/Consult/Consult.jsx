import { useNavigate } from 'react-router-dom';
import { FaBaby, FaTooth, FaStethoscope, FaHeart, FaBrain, FaEye, FaLungs, FaBone, FaFemale, FaUserMd } from 'react-icons/fa';
import { Grid, Card, CardContent, Typography, IconButton, Box, Container } from '@mui/material';
import { useUser } from '../../context';

const sectors = [
  { name: 'Pédiatrie', icon: FaBaby, path: 'pediatrie', color: '#3b82f6' },
  { name: 'Dentiste', icon: FaTooth, path: 'dentiste', color: '#10b981' },
  { name: 'Généraliste', icon: FaStethoscope, path: 'generaliste', color: '#ef4444' },
  { name: 'Cardiologie', icon: FaHeart, path: 'cardiologie', color: '#ec4899' },
  { name: 'Neurologie', icon: FaBrain, path: 'neurologie', color: '#fbbf24' },
  { name: 'Ophtalmologie', icon: FaEye, path: 'ophtalmologie', color: '#8b5cf6' },
  { name: 'Pneumologie', icon: FaLungs, path: 'pneumologie', color: '#14b8a6' },
  { name: 'Orthopédie', icon: FaBone, path: 'orthopedie', color: '#4c51bf' },
  { name: 'Gynécologie', icon: FaFemale, path: 'gynecologie', color: '#e11d48' },
  { name: 'Dermatologie', icon: FaUserMd, path: 'dermatologie', color: '#6b7280' }
];

const Consult = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleNavigation = (path) => {
    if (user) {
      navigate(`/specialty/${path}`);
    } else {
      navigate(`/login`);
    }
  };

  return (
    <Box 
      sx={{
        background: 'linear-gradient(135deg, #c3cfe2 0%, #ffffff 100%)',
        minHeight: '100vh',
        pt: '100px', // Ajout d'un padding en haut pour compenser l'en-tête fixe
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 6,
          position: 'relative'
        }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 'bold', 
              color: '#2d3748',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Choisissez votre Spécialité Médicale
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              px: 2
            }}
          >
            Sélectionnez une spécialité et envoyez vos symptômes directement à un professionnel de santé.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {sectors.map((sector, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  width: '100%',
                  height: { xs: 280, sm: 320 },
                  borderRadius: 3,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => theme.shadows[15],
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                    }
                  },
                  borderLeft: `6px solid ${sector.color}`,
                  backgroundColor: 'white',
                }}
                onClick={() => handleNavigation(sector.path)}
              >
                <CardContent 
                  sx={{ 
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    p: 3
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      backgroundColor: sector.color,
                      borderRadius: '50%',
                      p: 3,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: 3,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <IconButton 
                      sx={{ 
                        fontSize: { xs: 40, sm: 50 }, 
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      }}
                      disableRipple
                    >
                      <sector.icon />
                    </IconButton>
                  </Box>
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#2d3748',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    {sector.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Consult;
