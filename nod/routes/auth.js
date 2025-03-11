const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db-connection');

// Route d'inscription pour les patients
router.post('/register-patient', async (req, res) => {
  const {lastname, username, email, phone, age, password } = req.body;

  if (!lastname ||!username || !email || !phone || !age || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users_test (lastname,username, email, phone, age, password) VALUES (?, ?, ?, ?, ?,?)";
    const values = [lastname,username, email, phone, age, hashedPassword];

    db.query(query, values, (error, res) => {
      if (error) {
        console.error('erreur dans la requête sqL:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
      }
      res.status(201).json({ message: 'Patient inscrit avec succès' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Route d'inscription pour les docteurs
router.post('/register-docteur', async (req, res) => {
  const {lastname, username, email, specialty, phone, age, password } = req.body;

  if (!lastname || !username || !email || !specialty || !phone || !age || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO doctors (lastname,username, email, phone, age, password, specialty) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [lastname, username, email, phone, age, hashedPassword, specialty];

    db.query(query, values, (error, res) => {
      if (error) {
        console.error('Erreur dans la requête SQL:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
      }
      res.status(201).json({ message: 'Docteur inscrit avec succès' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { email, password, loginType } = req.body;

  if (!email || !password || !loginType) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    let query = '';
    if (loginType === 'patient') {
      query = 'SELECT * FROM users_test WHERE email = ?';
    } else if (loginType === 'doctor') {
      query = 'SELECT * FROM doctors WHERE email = ?';
    } else {
      return res.status(400).json({ message: 'Type de connexion invalide' });
    }

    const values = [email];
    db.query(query, values, async (error, results) => {
      if (error) {
        console.error('Erreur lors de la requête:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (results.length > 0) {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, loginType }, 'secret', { expiresIn: '1h' });

        return res.json({
          message: 'Connexion réussie',
          token,
          loginType,
          user: {
            id: user.id,
            name: user.username,
            email: user.email,
          },
        });
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    });
  } catch (error) {
    console.error('Erreur interne:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer les docteurs par spécialité
router.get('/consult', (req, res) => {
  const { specialty } = req.query;
  const query = "SELECT * FROM doctors WHERE specialty = ?";
  const values = [specialty];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des docteurs' });
    }
    res.json(results);
  });
});


module.exports = router;