const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db-connection');

// Route pour ajouter des symptômes
router.post('/add-symptoms', (req, res) => {
  const { doctor_id, patient_id, symptoms } = req.body;

  // console.log(req.body)
  console.log(!doctor_id,!patient_id,!symptoms.length)

  if (!doctor_id || !patient_id || !symptoms.length) {
    // console.log("dd")
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  // console.log("done")

  const query = "INSERT INTO symptoms (doctor_id, patient_id, symptoms) VALUES (?, ?, ?)";
  const values = [doctor_id, patient_id, symptoms];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Erreur lors de l\'insertion:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout des symptômes' });
    }
    res.status(201).json({ message: 'Symptômes ajoutés avec succès' });
  });
});

// Route pour récupérer les informations d'un docteur par ID
router.get('/doctor/:id', (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM doctors WHERE id = ?";
  const values = [id];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des informations du docteur:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des informations du docteur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Docteur non trouvé' });
    }

    res.json(results[0]);
  });
});

// Route pour récupérer les patients du docteur
router.get('/doctor/patients', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    if (decoded.loginType !== 'doctor') {
      return res.status(403).json({ message: 'Accès réservé aux docteurs uniquement' });
    }

    const query = `
      SELECT u.id, u.username, s.symptoms 
      FROM users_test u 
      JOIN symptoms s ON u.id = s.patient_id 
      WHERE s.doctor_id = ?
    `;
    const values = [decoded.id];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des patients:', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
      }

      res.json({ patients: results });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour récupérer l'historique des docteurs consultés par un patient
router.get("/:id/historique", (req, res) => {
  const patientId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, "secret");

    if (decoded.loginType !== "patient" || decoded.id !== parseInt(patientId)) {
      return res.status(403).json({ message: "Accès interdit. Réservé aux patients." });
    }

    const query = `
      SELECT DISTINCT d.id, d.username, d.email, d.specialty 
      FROM doctors d
      JOIN symptoms s ON d.id = s.doctor_id
      WHERE s.patient_id = ?;
    `;

    db.query(query, [patientId], (error, results) => {
      if (error) {
        console.error("Erreur récupération historique", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(401).json({ message: "Token invalide." });
  }
});


// Récupération des informations d'un patient
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID requis" });
  }

  db.query("SELECT * FROM users_test WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.error("Erreur SQL :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json(results);
  });
});

// Mise à jour des informations d'un patient
router.put('/edit', (req, res) => {
  const { id, username, email, phone, age } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID requis pour la mise à jour" });
  }

  db.query(
    "UPDATE users_test SET username = ?, email = ?, phone = ?, age = ? WHERE id = ?",
    [username, email, phone, age, id],
    (error, results) => {
      if (error) {
        console.error("Erreur SQL :", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json({ message: "Mise à jour réussie", results });
    }
  );
});




module.exports = router;
