const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'database.sqlite');

// Créer une nouvelle base de données
const db = new sqlite3.Database(dbPath);

// Fonction pour supprimer toutes les données
function deleteAllData() {
    return new Promise((resolve, reject) => {
        const tables = [
            'Servi',
            'Exsit',
            'Employee',
            'Station_service',
            'Service_web',
            'Service',
            'Fournisseur',
            'Commune',
            'Wilaya'
        ];

        db.serialize(() => {
            tables.forEach(table => {
                db.run(`DELETE FROM ${table}`, (err) => {
                    if (err) {
                        console.error(`Erreur lors de la suppression des données de ${table}:`, err);
                    } else {
                        console.log(`Données supprimées avec succès de ${table}`);
                    }
                });
            });
            resolve();
        });
    });
}

// Lire le fichier SQL
const sql = fs.readFileSync(path.join(__dirname, 'data.sql'), 'utf8');

// Exécuter les commandes SQL
async function populateDatabase() {
    try {
        // Supprimer les données existantes
        await deleteAllData();
        
        // Exécuter chaque commande SQL séparément
        const commands = sql.split(';').filter(cmd => cmd.trim());
        for (const command of commands) {
            await new Promise((resolve, reject) => {
                db.run(command, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'exécution de la commande:', err);
                        reject(err);
                    } else {
                        console.log('Commande exécutée avec succès');
                        resolve();
                    }
                });
            });
        }
        
        console.log('Base de données remplie avec succès!');
    } catch (err) {
        console.error('Erreur lors du remplissage de la base de données:', err);
    } finally {
        // Fermer la base de données
        db.close((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la base de données:', err);
            }
        });
    }
}

// Exécuter le script
populateDatabase(); 