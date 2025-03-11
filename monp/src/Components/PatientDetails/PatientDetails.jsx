import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  TextField, 
  Button,
  Container,
  Alert
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useUser } from '../../context';

const PatientDetails = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState([]);
  const [actDescription, setActDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useUser();
  

  useEffect(() => {
    if (!user || !user.id) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }
    const doctorId = user.id;
    axios.get(`http://localhost:3000/conversation/${doctorId}`, {
      params: { id, type: "doctor" }
    })
    .then((response) => {
      setConversation(response.data);
      setLoading(false);
    })
    .catch(() => {
      setError("Impossible de récupérer les données.");
      setLoading(false);
    });
  }, [user, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmitAct = (event) => {
    event.preventDefault();
    if (!user || !user.id) {
      setError("Vous devez être authentifié pour envoyer un message.");
      return;
    }
    if (!actDescription.trim()) {
      setError("La description ne peut pas être vide.");
      return;
    }

    axios.post("http://localhost:3000/docteur/patient/add-act", {
      doctor_id: user.id,
      patient_id: id,
      act_description: actDescription
    })
    .then(() => {
      setConversation([...conversation, { 
        type: "Act", 
        description: actDescription, 
        created_at: new Date() 
      }]);
      setActDescription("");
      setError(null);
    })
    .catch(() => setError("Erreur lors de l'ajout."));
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.02)'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: '84px',
        pb: 5,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}
    >
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f9f7f7 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography 
              variant="h5" 
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              Conversation avec le Patient
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                m: 2,
                borderRadius: 1
              }}
            >
              {error}
            </Alert>
          )}

<Box 
  sx={{ 
    height: '60vh',
    overflowY: 'auto',
    p: 3,
    backgroundColor: 'rgba(0,0,0,0.02)'
  }}
>
  {!user || !user.id ? (
    <Typography 
      sx={{ 
        textAlign: 'center',
        color: '#e74c3c',
        mt: 4,
        fontWeight: "bold"
      }}
    >
      Utilisateur non authentifié.
    </Typography>
  ) : conversation.length === 0 ? (
    <Typography 
      sx={{ 
        textAlign: 'center',
        color: '#95a5a6',
        mt: 4
      }}
    >
      Aucune information disponible.
    </Typography>
  ) : (
    conversation.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', justifyContent: item.type.toLowerCase() === "act" ? 'flex-end' : 'flex-start', mb: 2 }}>
        <Paper sx={{ p: 2, maxWidth: '70%', borderRadius: 2, bgcolor: item.type.toLowerCase() === "act" ? 'rgba(33, 150, 243, 0.1)' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography sx={{ color: '#2c3e50', fontWeight: 500, mb: 0.5 }}>
            {item.description}
          </Typography>
          <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block', textAlign: 'right' }}>
            {new Date(item.created_at).toLocaleString()}
          </Typography>
        </Paper>
      </Box>
    ))
  )}
  <div ref={messagesEndRef} />
</Box>


          <Box 
            component="form" 
            onSubmit={handleSubmitAct} 
            sx={{ 
              p: 3,
              borderTop: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Ajouter un acte médical..."
                variant="outlined"
                value={actDescription}
                onChange={(e) => setActDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: '#2196F3'
                      }
                    }
                  }
                }}
              />
              <Button 
                type="submit" 
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  color: 'white',
                  minWidth: '120px'
                }}
              >
                Envoyer
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PatientDetails;