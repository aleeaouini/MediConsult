const mysql = require('mysql2');

// Créer une connexion à la base de données
const con = mysql.createConnection({
  host: 'localhost', 
  user: 'root',       
  password: '',       
  database: 'medicaldb' 
});

// Tester la connexion
con.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
});

// Exporter la connexion
module.exports = con;
