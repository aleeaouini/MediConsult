const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db-connection'); 

// Route pour mettre à jour les informations 
router.put('/edit', async (req, res) => {
  const { username, email,phone,age,id } = req.body;
  // console.log('Paramètres reçus :', { username, email, phone, age, id });
  try {
    db.query("UPDATE doctors SET username = ?, email = ?, phone = ?, age = ? WHERE id = ?",
      [username, email,phone,age, id],
      async (error, results) => {
      if(error){
        console.error('Erreur SQL :', error);
        res.status(400).send(error)
      }
      res.status(200).send(results);
    })
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



router.get('/:role/:id', async (req, res) => {
  const { role, id } = req.params;

  db.query(`SELECT * FROM ${role} WHERE id = ?`, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Erreur serveur', error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(results[0]);
  });
});



module.exports = router;















