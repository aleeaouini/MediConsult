import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  TextField,
  Avatar,
  Box,
  Divider,
  InputAdornment,
  Fade,
  useTheme,
} from "@mui/material";
import { useUser } from "../../context";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const DoctorPage = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/docteur/list/${user.id}`,
          {
            headers: { id: user.id },
          }
        );
        const patientsData = response.data.patients || [];
        const uniquePatients = Array.from(
          new Map(patientsData.map((patient) => [patient.id, patient])).values()
        );
        setPatients(uniquePatients);
        setFilteredPatients(uniquePatients);
        setError("");
      } catch (err) {
        setError(
          err.response
            ? err.response.data.message
            : "Erreur lors du chargement des patients"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, navigate]);

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter((patient) =>
        patient.username.toLowerCase().includes(query)
      )
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        pt: { xs: 12, sm: 14 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 6,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <HealthAndSafetyIcon 
            sx={{ 
              fontSize: 40, 
              color: theme.palette.primary.main,
              display: { xs: 'none', sm: 'block' }
            }} 
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              textAlign: { xs: 'center', sm: 'left' },
              flex: 1,
            }}
          >
            Gestion des Patients
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <TextField
              variant="outlined"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'white',
                  },
                }
              }}
              sx={{ mb: 4 }}
            />

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress size={50} thickness={4} />
              </Box>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                }}
              >
                {error}
              </Alert>
            ) : filteredPatients.length === 0 ? (
              <Box 
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  Aucun patient trouvé
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredPatients.map((patient, index) => (
                  <Grid item xs={12} sm={6} md={4} key={patient.id}>
                    <Fade in timeout={300 + index * 100}>
                      <Card
                        onClick={() => handlePatientClick(patient.id)}
                        sx={{
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          bgcolor: 'white',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
                          },
                        }}
                      >
                        <Box p={3} textAlign="center">
                          <Avatar
                            src={patient.avatar || ""}
                            alt={patient.username}
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 2,
                              bgcolor: theme.palette.primary.main,
                              boxShadow: '0 4px 14px 0 rgba(31, 38, 135, 0.15)',
                            }}
                          />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {patient.username}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: '40px',
                            }}
                          >
                            {patient.symptoms && patient.symptoms.length > 0
                              ? patient.symptoms.split(",").pop()
                              : "Aucun symptôme enregistré"}
                          </Typography>
                        </Box>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorPage;