import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Importez useNavigate
import { 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Container, 
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useUser } from '../../context';
import { FaStethoscope, FaEnvelope, FaPhone } from 'react-icons/fa';

const SymptomPage = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate(); // Utilisez useNavigate ici pour naviguer après l'envoi

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/patient/doctor/${doctorId}`);
        setDoctor(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des informations du médecin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!symptoms.trim()) {
      setError('Veuillez décrire vos symptômes avant de soumettre.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/patient/add-symptoms`,
        {
          doctor_id: doctorId,
          patient_id: user.id,
          symptoms,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const send = await axios.post("http://localhost:3000/docteur/addNotification",{
        doctorID:doctorId,
        patientID:user.id,
        patientName: user.name
      });
      console.log("notif",send);
      setSuccess(true);
      setError(null);
      setSymptoms('');
      // Redirigez l'utilisateur vers la page de conversation après l'envoi des symptômes
      navigate(`/conversation/${doctorId}`);  // Utilisez la route de la conversation
    } catch (err) {
      setError('Erreur lors de la soumission des symptômes.');
      console.error(err);
    }
  };


  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          pt: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        background: 'linear-gradient(135deg, #c3cfe2 0%, #ffffff 100%)',
        minHeight: '100vh',
        pt: '100px',
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: (theme) => theme.shadows[10],
            overflow: 'hidden',
            position: 'relative',
            mt: 4,
            mb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              py: 3,
              px: 2,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <FaStethoscope size={40} style={{ marginBottom: '1rem' }} />
            <Typography variant="h4" gutterBottom>
              Consultation en ligne
            </Typography>
            <Typography variant="subtitle1">
              Décrivez vos symptômes au Dr. {doctor?.username}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Informations du médecin
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                Spécialité : {doctor?.specialty}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaEnvelope color="#666" />
                  <Typography variant="body2" color="text.secondary">
                    {doctor?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaPhone color="#666" />
                  <Typography variant="body2" color="text.secondary">
                    {doctor?.phone}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Vos symptômes ont été soumis avec succès.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Décrivez vos symptômes en détail"
                multiline
                rows={6}
                fullWidth
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                variant="outlined"
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                placeholder="Décrivez vos symptômes, leur durée, leur intensité et tout autre détail pertinent..."
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s',
                  }
                }}
              >
                Envoyer ma consultation
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SymptomPage;
