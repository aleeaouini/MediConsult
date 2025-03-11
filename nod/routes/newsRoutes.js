const express = require('express');
const router = express.Router();
const newsapi = require('./newsapi'); // Importez l'instance de NewsAPI

// Route pour récupérer les actualités sur la santé
router.get('/health', async (req, res) => {
    try {
      const response = await newsapi.v2.everything({
        q: 'santé',
        language: 'fr',
        sortBy: 'relevancy'
      });
      // console.log('Réponse de NewsAPI:', response); // Ajoutez ceci pour voir la réponse
      res.json(response);
    } catch (error) {
      console.error(error); // Ajoutez un log pour voir l'erreur
      res.status(500).json({ message: 'Erreur lors de la récupération des actualités' });
    }
  });
  

module.exports = router;
