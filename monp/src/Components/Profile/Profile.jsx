import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon
} from '@mui/icons-material';

function Profile() {
  const navigate = useNavigate();
  const { user, HandleLoginUser } = useUser();
  const [userInfo, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);

  const userType = user?.role === "doctor" ? "docteur" : "patient";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/${userType}/${user.id}`);
        if (response.data.length > 0) {
          const userData = response.data[0];
          setUser(userData);
          setName(userData.username);
          setEmail(userData.email);
          setPhone(userData.phone);
          setAge(userData.age);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des données utilisateur');
        console.error(err);
      }
    };

    if (user && user.id) {
      fetchUser();
    }
    
  }, 
  [editable, user, userType]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/${userType}/edit`, {
        id: user.id,
        username: name,
        email,
        phone,
        age,
      });

      setUser(response.data);
      setEditable(false);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour des données');
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      try {
        const response = await fetch(`http://localhost:3000/delete/${user.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          HandleLoginUser(null);
          navigate('/login');
          alert('Votre compte a été supprimé avec succès.');
        } else {
          alert(data.message || 'Erreur lors de la suppression de votre compte.');
        }
      } catch (error) {
        alert('Une erreur est survenue. Veuillez réessayer.');
        console.error("Erreur dans fetch :", error);
      }
    }
  };

  if (!userInfo) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      bgcolor: '#f5f5f5'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 3
            }}>
              <Box sx={{
                bgcolor: 'primary.main',
                p: 3,
                pb: 10,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)'
              }} />
              
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: -5,
                pb: 3
              }}>
                <Avatar sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  border: '4px solid white',
                  boxShadow: 2
                }}>
                  {getInitials(userInfo.username)}
                </Avatar>
                
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {userInfo.username}
                </Typography>
                <Typography color="textSecondary">
                  {userType === 'docteur' ? 'Médecin' : 'Patient'}
                </Typography>

                {!editable && (
                  <Box sx={{ mt: 3, width: '100%', px: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setEditable(true)}
                      sx={{ mb: 2 }}
                    >
                      Modifier mon profil
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleDeleteAccount}
                    >
                      Supprimer mon compte
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Details Card */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {editable ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        startAdornment: <PersonIcon color="primary" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: <EmailIcon color="primary" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        startAdornment: <PhoneIcon color="primary" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Âge"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      InputProps={{
                        startAdornment: <CakeIcon color="primary" sx={{ mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setEditable(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                      >
                        Sauvegarder
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ py: 2 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography color="textSecondary" gutterBottom>
                          Nom complet
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" />
                          <Typography>{userInfo.username}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography color="textSecondary" gutterBottom>
                          Email
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon color="primary" />
                          <Typography>{userInfo.email}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography color="textSecondary" gutterBottom>
                          Téléphone
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon color="primary" />
                          <Typography>{userInfo.phone || 'Non renseigné'}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography color="textSecondary" gutterBottom>
                          Âge
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CakeIcon color="primary" />
                          <Typography>
                            {userInfo.age ? `${userInfo.age} ans` : 'Non renseigné'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Profile;