const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db-connection');
const router = express.Router();

// Route protégée pour récupérer les conversations
router.get('/:id', (req, res) => {
  let doctorId;
  let patientId;
  if(req.query.type=="doctor"){
    doctorId = req.params.id;
    patientId = req.query.id;
  }
  if(req.query.type=="patient"){
    patientId = req.params.id;
    doctorId = req.query.id;
  }

  const query = `
    SELECT 'Symptom' AS type, symptoms AS description, created_at 
    FROM symptoms 
    WHERE doctor_id = ? AND patient_id = ?  

    UNION  

    SELECT 'Act' AS type, act_description AS description, created_at 
    FROM acts 
    WHERE doctor_id = ? AND patient_id = ?  

    ORDER BY created_at ASC
`;

  db.query(query, [doctorId, patientId, doctorId, patientId], (error, results) => {
    if (error) {
      console.error("Erreur SQL:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    console.log("Résultats SQL bruts:", results);  // Ajoute ce log pour vérifier les résultats bruts

    if (results.length === 0) {
      return res.json([]);  // Renvoie un tableau vide si aucune donnée trouvée
    }

    // Formatage des résultats avant de les renvoyer
    const formattedResults = results.map(result => ({
      type: result.type,
      description: result.description,
      created_at: result.created_at,
      symptom: result.type === 'Symptom' ? result.description : null,
      act: result.type === 'Act' ? result.description : null,
    }));

    console.log("Résultats formatés:", formattedResults);
    res.json(formattedResults);  // Envoie les résultats formatés au frontend
  });
});


router.post('/addSymptom', (req, res) => {
  const { doctor_id, patient_id, symptoms } = req.body;

  console.log("Données reçues :", { doctor_id, patient_id, symptoms });

  if (!doctor_id || !patient_id || !symptoms) {
    return res.status(400).json({ message: "Données manquantes." });
  }

  // Vérifier si le docteur existe
  const checkDoctorQuery = `SELECT id FROM doctors WHERE id = ?`;

  db.query(checkDoctorQuery, [doctor_id], (error, results) => {
    if (error) {
      console.error("Erreur SQL:", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Docteur introuvable." });
    }

    // Si le docteur existe, insérer le symptôme
    const insertQuery = `INSERT INTO symptoms (doctor_id, patient_id, symptoms, created_at) VALUES (?, ?, ?, NOW())`;

    db.query(insertQuery, [doctor_id, patient_id, symptoms], (error, result) => {
      if (error) {
        console.error("Erreur SQL:", error);
        return res.status(500).json({ message: "Erreur serveur." });
      }

      res.status(201).json({
        type: "Symptom",
        description: symptoms,
        created_at: new Date(),
      });
    });
  });
});




module.exports = router;
