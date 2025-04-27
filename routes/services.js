const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware pour le logging
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Recherche station-service
router.get('/recherche-station-service/:code_St', (req, res) => {
  const code_St = req.params.code_St;
  console.log('Recherche station service avec code_St:', code_St);

  if (!code_St || isNaN(code_St)) {
    return res.status(400).json({ error: 'Code de station invalide' });
  }

  db.get(
    `SELECT Commune.lib_com, Wilaya.lib_w
     FROM Station_service
     JOIN Commune ON Station_service.code_com = Commune.Code_com
     JOIN Wilaya ON Commune.Code_w = Wilaya.Code_w
     WHERE Station_service.code_St = ?`,
    [code_St],
    (err, row) => {
      if (err) {
        console.error('Erreur recherche station:', err);
        return res.status(500).json({ error: 'Erreur lors de la recherche de la station' });
      }
      if (!row) {
        console.log('Aucune station trouvée pour code_St:', code_St);
        return res.status(404).json({ error: 'Station non trouvée' });
      }
      console.log('Station trouvée:', row);
      res.json(row);
    }
  );
});

// Service_station
router.get('/service-station/:code_St', (req, res) => {
  const code_St = req.params.code_St;
  console.log('Recherche services de la station avec code_St:', code_St);

  if (!code_St || isNaN(code_St)) {
    return res.status(400).json({ error: 'Code de station invalide' });
  }

  db.all(
    `SELECT Service.code_ser, Service.lib_ser
     FROM Exsit
     JOIN Service ON Exsit.code_ser = Service.code_ser
     WHERE Exsit.code_st = ?`,
    [code_St],
    (err, rows) => {
      if (err) {
        console.error('Erreur recherche services:', err);
        return res.status(500).json({ error: 'Erreur lors de la recherche des services' });
      }
      console.log('Services trouvés:', rows);
      res.json(rows || []);
    }
  );
});

// Servi_station (avec période)
router.get('/servi-station/:code_St', (req, res) => {
  const code_St = req.params.code_St;
  const { date_debut, date_fin } = req.query;
  console.log('Recherche services servis avec code_St:', code_St, 'période:', date_debut, 'à', date_fin);

  if (!code_St || isNaN(code_St)) {
    return res.status(400).json({ error: 'Code de station invalide' });
  }
  if (!date_debut || !date_fin) {
    return res.status(400).json({ error: 'Dates de début et de fin requises' });
  }

  db.all(
    `SELECT Servi.code_ser, Servi.code_emp, Servi.date_ser, Servi.heure_ser
     FROM Servi
     JOIN Employee ON Servi.code_emp = Employee.Code_emp
     WHERE Employee.code_st = ? AND Servi.date_ser BETWEEN ? AND ?`,
    [code_St, date_debut, date_fin],
    (err, rows) => {
      if (err) {
        console.error('Erreur recherche services servis:', err);
        return res.status(500).json({ error: 'Erreur lors de la recherche des services servis' });
      }
      console.log('Services servis trouvés:', rows);
      res.json(rows || []);
    }
  );
});

module.exports = router; 