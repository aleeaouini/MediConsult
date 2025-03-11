const express = require('express');
const router = express.Router();
const db = require('../db-connection');

router.get('/list/:id', async (req, res) => {
  const { id: doctorId } = req.params;
if (!doctorId) { 
  return res.status(400).json({ message: "ID manquant" });
}
try {
  const query = `
    SELECT u.id, u.username, GROUP_CONCAT(s.symptoms SEPARATOR ', ') AS symptoms 
    FROM users_test u
    INNER JOIN symptoms s ON u.id = s.patient_id
    WHERE s.doctor_id = ?
    GROUP BY u.id
  `;

  db.query(query, [doctorId], (error, results) => {
    if (error) {
      console.error("Erreur SQL :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json({ patients: results });
  });
} catch (error) {
  console.error("Erreur lors de la récupération des patients :", error);
  return res.status(500).json({ message: "Erreur serveur" });
}
});


// Route pour récupérer les informations d'un patient par ID
router.get("/patient/:id", (req, res) => {
  const { id } = req.params;
  // console.log("Requête reçue pour ID du patient :", id); // Ajoutez ce log

  const query = `
    SELECT u.id, u.username, u.email, u.phone, u.age, s.symptoms
FROM users_test u
LEFT JOIN symptoms s ON u.id = s.patient_id
WHERE u.id = ?


  `;
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données du patient:", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    res.json(results[0]);
  });
});

// Route pour ajouter un acte médical pour un patient
router.post('/patient/add-act', (req, res) => {
  const { doctor_id, patient_id, act_description } = req.body;

  if (!doctor_id || !patient_id || !act_description) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  const query = "INSERT INTO acts (doctor_id, patient_id, act_description, created_at) VALUES (?, ?, ?, NOW())";
  db.query(query, [doctor_id, patient_id, act_description], (error, results) => {
    if (error) {
      console.error("Erreur lors de l'ajout de l'acte médical :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.status(201).json({ message: "Acte médical ajouté avec succès" });
  });
});

router.post('/addNotification',(req,res)=>{
  try {
    const {doctorID,patientID,patientName}=req.body;
    // console.log(req.body)
    const query = `
      INSERT INTO notifications (message,doctorId,patientId,createdAt) VALUES 
      (?,?,?,NOW());
    `;
    db.query(query, [`You have new symptom from ${patientName}`,doctorID,patientID], (error, results) => {
      if (error) {
        console.error("Erreur lors de l'ajout de la notification :", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      return res.status(200).json({ message: "Notification ajoutée avec succès" });
    });
    //return res.status(200).json({ message: "Notification ajoutée avec succès" });
  } catch(err){
    console.log("notification error",err);
    return res.status(500).json({ message: "Erreur serveur" });
    
  }
});
router.get('/notification/:id',(req,res)=>{
  try {
    const {id}=req.params;
    const query = `
      SELECT * FROM notifications WHERE doctorId = ?;
    `;
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      return res.status(200).json(results);
    });
  } catch(err){
    console.log("notification error",err);
    return res.status(500).json({ message: "Erreur serveur" });
    
  }
})




// Route pour récupérer les symptômes du patient
router.get('/patient/:id/symptoms', (req, res) => {
  const { id } = req.params;
  const { doctor_id } = req.query;

  if (!doctor_id) {
    return res.status(400).json({ message: "ID du docteur requis" });
  }

  const query = `
    SELECT symptoms
    FROM symptoms
    WHERE patient_id = ? AND doctor_id = ?
  `;

  db.query(query, [id, doctor_id], (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des symptômes:", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
    res.json(results.map(row => row.symptoms));
  });
});




router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID requis" });
  }

  db.query("SELECT * FROM doctors WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.error("Erreur SQL :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json(results);
  });
});

// Mise à jour des informations du docteur
router.put('/edit', (req, res) => {
  const { id, username, email, phone, age } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID requis pour la mise à jour" });
  }

  db.query(
    "UPDATE doctors SET username = ?, email = ?, phone = ?, age = ? WHERE id = ?",
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
