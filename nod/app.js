const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const docteurRoutes = require('./routes/docteur');
const userRoutes = require('./routes/user');
const conversationRoutes = require('./routes/conversation');
const newsRoutes = require('./routes/newsRoutes'); // Importer la route des actualités
const deleteRoutes = require('./routes/delete');
 // Importer la route des notifications

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());





// Routes
app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/docteur', docteurRoutes);
app.use('/user', userRoutes);
app.use('/conversation', conversationRoutes);
app.use('/newsRoutes', newsRoutes); // Utiliser la route des actualités
app.use('/delete', deleteRoutes);
// Utiliser la route des notifications

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
