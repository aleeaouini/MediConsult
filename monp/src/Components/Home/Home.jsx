import { Box, Button, Typography, Container, CssBaseline, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const backgrounds = [
  'src/assets/m2.webp',
  'src/assets/m5.jpg',
  'src/assets/m3.jpg',
  'src/assets/m4.jpg',
];

const Home = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);

  const handleNextBackground = () => {
    setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
  };

  const handlePrevBackground = () => {
    setBgIndex((prevIndex) => (prevIndex - 1 + backgrounds.length) % backgrounds.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextBackground();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 3,
        position: 'relative',
        transition: 'background-image 0.5s ease-in-out',
        boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.6)',
      }}
    >
      <CssBaseline />
      
      {/* Icônes de navigation */}
      <IconButton onClick={handlePrevBackground} sx={{ position: 'absolute', left: 20, color: 'white' }}>
        <ArrowBack fontSize="large" />
      </IconButton>
      
      <IconButton onClick={handleNextBackground} sx={{ position: 'absolute', right: 20, color: 'white' }}>
        <ArrowForward fontSize="large" />
      </IconButton>

      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, whiteSpace: 'nowrap' }}>
          Bienvenue sur MediConsult
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
        La plateforme digitale qui révolutionne la gestion de vos consultations médicales en toute simplicité.
        </Typography>

        {/* Boutons de navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/Decouvrir')}
            sx={{ fontWeight: 'bold', fontSize: '0.875rem', borderRadius: 2, padding: '8px 16px' }}
          >
            Découvrir
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/Login')}
            sx={{ fontWeight: 'bold', fontSize: '0.875rem', borderRadius: 2, padding: '8px 16px' }}
          >
            Se Connecter
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
