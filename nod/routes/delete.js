const express = require('express');
const router = express.Router();
const con = require('../db-connection'); // Assurez-vous que la connexion est correctement importée

// Route pour supprimer un compte (patient ou docteur)
router.delete('/:id', (req, res) => {
    console.log(`Requête DELETE reçue pour l'ID: ${req.params.id}`);

    const userId = req.params.id;
    const checkPatientQuery = 'SELECT * FROM users_test WHERE id = ?';

    con.query(checkPatientQuery, [userId], (err, patientResults) => {
        if (err) {
            console.error('Erreur lors de la vérification du patient:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }

        console.log('Résultats de la vérification du patient:', patientResults);
        if (patientResults.length > 0) {
            const deletePatientQuery = 'DELETE FROM users_test WHERE id = ?';
            con.query(deletePatientQuery, [userId], (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression du patient:', err);
                    return res.status(500).json({ message: 'Erreur de suppression du patient' });
                }
                console.log('Patient supprimé avec succès.');
                return res.status(200).json({ message: 'Patient supprimé avec succès' });
            });
        } else {
            console.log('Utilisateur non trouvé dans users_test.');
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
    });
});


module.exports = router;
