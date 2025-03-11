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
  Container
} from "@mui/material";
import { useUser } from '../../context';

const Conversation = () => {
  const { doctorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSymptom, setNewSymptom] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (!doctorId || !user) return; 

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token manquant");
      setLoading(false);
      return;
    }

    const PatientId = user.id;
    axios.get(`http://localhost:3000/conversation/${PatientId}`, {
      params: {
        id: doctorId,
        type: "patient"
      }
    })
      .then((response) => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response ? error.response.data.message : "Erreur réseau");
        setLoading(false);
      });
  }, [doctorId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) return;

    const PatientId = user.id;
    axios.post("http://localhost:3000/conversation/addSymptom", {
      doctor_id: doctorId,
      patient_id: PatientId,
      symptoms: newSymptom
    })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewSymptom("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du symptôme:", error);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12 }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "calc(100vh - 150px)",
        maxWidth: "800px", 
        margin: "auto",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#333',
            fontWeight: 500,
            mb: 3
          }}
        >
          Conversation avec le Docteur
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
        ) : (
          <>
            <Paper 
              sx={{ 
                flexGrow: 1, 
                overflowY: "auto", 
                p: 2, 
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2
              }}
            >
              {messages.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: '#666' }}>
                  Aucun message trouvé.
                </Typography>
              ) : (
                messages.map((msg, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: msg.type === 'Symptom' ? 'flex-end' : 'flex-start', 
                      mb: 2 
                    }}
                  >
                    <Paper 
                      sx={{ 
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: msg.type === 'Symptom' ? 'primary.light' : '#F1F1F1',
                        color: msg.type === 'Symptom' ? 'white' : 'inherit',
                        borderRadius: msg.type === 'Symptom' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography sx={{ wordBreak: 'break-word' }}>
                        {msg.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mt: 1,
                          color: msg.type === 'Symptom' ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                        }}
                      >
                        {new Date(msg.created_at).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Ajouter un symptôme"
                variant="outlined"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddSymptom}
                sx={{
                  px: 4,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                Envoyer
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Conversation;