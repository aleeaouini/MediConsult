import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  List, 
  ListItem,  
  CircularProgress, 
  Typography,
  Container,
  Box,
  Paper,
  Avatar,
  Divider,
  Button,
  Alert,
  Chip
} from "@mui/material";
import { 
  FaHistory, 
  FaUserMd, 
  FaEnvelope, 
  FaComments,
  FaCalendarAlt
} from 'react-icons/fa';

const HistoriquePatient = () => {
  const { patientId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!patientId || !token) {
      setError("Accès refusé. Vous devez être connecté.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3000/patient/${patientId}/historique`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Impossible de récupérer l'historique.");
        setLoading(false);
      });
  }, [patientId, token]);

  const handleDoctorClick = (doctorId) => {
    navigate(`/conversation/${doctorId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <FaHistory size={40} color="#2563eb" style={{ marginBottom: '1rem' }} />
          <Typography 
            variant="h3" 
            sx={{
              fontWeight: 'bold',
              color: '#2d3748',
              mb: 2
            }}
          >
            Historique des Consultations
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Retrouvez l ensemble de vos échanges avec les médecins
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
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <List sx={{ p: 0 }}>
              {doctors.map((doctor, index) => (
                <Box key={doctor.id}>
                  <ListItem 
                    sx={{
                      p: 3,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.05)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 60,
                          height: 60,
                          mr: 3
                        }}
                      >
                        <FaUserMd size={24} />
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                            Dr. {doctor.username}
                          </Typography>
                          <Chip 
                            label={doctor.specialty}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          {doctor.lastConsultation && (
                            <Chip
                              icon={<FaCalendarAlt size={12} />}
                              label={formatDate(doctor.lastConsultation)}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                          <FaEnvelope size={14} style={{ marginRight: '8px' }} />
                          <Typography variant="body2">
                            {doctor.email}
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          startIcon={<FaComments />}
                          onClick={() => handleDoctorClick(doctor.id)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          Voir la conversation
                        </Button>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < doctors.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        ) : (
          <Alert 
            severity="info" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              borderRadius: 2
            }}
          >
            Vous n avez pas encore consulté de médecin.
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default HistoriquePatient;