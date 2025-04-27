const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// Fonction pour vérifier si une table existe
function tableExists(tableName) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [tableName],
      (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      }
    );
  });
}

// Fonction pour créer les tables si elles n'existent pas
async function initializeDatabase() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS Fournisseur (ID_fournisseur INTEGER PRIMARY KEY, Nom_four TEXT)`,
    `CREATE TABLE IF NOT EXISTS Service_web (ID_ser INTEGER PRIMARY KEY, nom_ser TEXT, description TEXT, ID_fournisseur INTEGER)`,
    `CREATE TABLE IF NOT EXISTS Wilaya (Code_w INTEGER PRIMARY KEY, lib_w TEXT)`,
    `CREATE TABLE IF NOT EXISTS Commune (Code_com INTEGER PRIMARY KEY, lib_com TEXT, Code_w INTEGER)`,
    `CREATE TABLE IF NOT EXISTS Station_service (code_St INTEGER PRIMARY KEY, nom_quartier TEXT, code_com INTEGER)`,
    `CREATE TABLE IF NOT EXISTS Employee (Code_emp INTEGER PRIMARY KEY, nom TEXT, pren TEXT, code_st INTEGER)`,
    `CREATE TABLE IF NOT EXISTS Service (code_ser INTEGER PRIMARY KEY, lib_ser TEXT)`,
    `CREATE TABLE IF NOT EXISTS Servi (code_emp INTEGER, code_ser INTEGER, date_ser TEXT, heure_ser TEXT)`,
    `CREATE TABLE IF NOT EXISTS Exsit (code_st INTEGER, code_ser INTEGER)`
  ];

  for (const table of tables) {
    await new Promise((resolve, reject) => {
      db.run(table, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // Vérifier si les données existent déjà
  const hasData = await new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM Station_service', (err, row) => {
      if (err) reject(err);
      resolve(row.count > 0);
    });
  });

  if (!hasData) {
    // Insérer les données de test uniquement si la table est vide
    const insertStatements = [
      `INSERT INTO Fournisseur VALUES (1, 'FournisseurA')`,
      `INSERT INTO Fournisseur VALUES (2, 'FournisseurB')`,
      `INSERT INTO Service_web VALUES (1, 'Nettoyage', 'Nettoyage complet', 1)`,
      `INSERT INTO Service_web VALUES (2, 'Réparation', 'Réparation rapide', 2)`,
      `INSERT INTO Wilaya VALUES (1, 'WilayaA')`,
      `INSERT INTO Wilaya VALUES (2, 'WilayaB')`,
      `INSERT INTO Commune VALUES (1, 'CommuneA', 1)`,
      `INSERT INTO Commune VALUES (2, 'CommuneB', 2)`,
      `INSERT INTO Station_service VALUES (1, 'QuartierA', 1)`,
      `INSERT INTO Station_service VALUES (2, 'QuartierB', 2)`,
      `INSERT INTO Employee VALUES (1, 'Ali', 'Ben', 1)`,
      `INSERT INTO Employee VALUES (2, 'Sara', 'Khel', 2)`,
      `INSERT INTO Service VALUES (1, 'Lavage')`,
      `INSERT INTO Service VALUES (2, 'Vidange')`,
      `INSERT INTO Service VALUES (3, 'Réparation')`,
      `INSERT INTO Servi VALUES (1, 1, '2024-06-01', '10:00')`,
      `INSERT INTO Servi VALUES (2, 2, '2024-06-02', '11:00')`,
      `INSERT INTO Servi VALUES (2, 3, '2024-06-03', '12:00')`,
      `INSERT INTO Exsit VALUES (1, 1)`,
      `INSERT INTO Exsit VALUES (1, 2)`,
      `INSERT INTO Exsit VALUES (2, 2)`,
      `INSERT INTO Exsit VALUES (2, 3)`
    ];

    for (const statement of insertStatements) {
      await new Promise((resolve, reject) => {
        db.run(statement, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  }
}

// Initialiser la base de données
initializeDatabase().catch(err => {
  console.error('Erreur lors de l\'initialisation de la base de données:', err);
});

module.exports = db; 