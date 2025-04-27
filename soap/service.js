const db = require('../db');

function recherche_station_service(args, callback) {
  const code_St = args.code_St;
  if (!code_St) {
    callback({ error: 'Le code de la station est requis' });
    return;
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
        console.error('Erreur de base de données:', err);
        callback({ error: 'Erreur lors de la recherche de la station' });
      } else if (!row) {
        callback({ error: 'Station non trouvée' });
      } else {
        callback({ lib_w: row.lib_w, lib_com: row.lib_com });
      }
    }
  );
}

function service_station(args, callback) {
  const code_St = args.code_St;
  if (!code_St) {
    callback({ error: 'Le code de la station est requis' });
    return;
  }

  db.all(
    `SELECT Service.code_ser, Service.lib_ser
     FROM Exsit
     JOIN Service ON Exsit.code_ser = Service.code_ser
     WHERE Exsit.code_st = ?`,
    [code_St],
    (err, rows) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        callback({ error: 'Erreur lors de la recherche des services' });
      } else if (!rows || rows.length === 0) {
        callback({ services: [] });
      } else {
        // Format the response according to the WSDL schema
        const services = rows.map(row => ({
          code_ser: row.code_ser,
          lib_ser: row.lib_ser
        }));
        callback({ services });
      }
    }
  );
}

function servi_station(args, callback) {
  const code_St = args.code_St;
  const date_debut = args.date_debut;
  const date_fin = args.date_fin;

  if (!code_St) {
    callback({ error: 'Le code de la station est requis' });
    return;
  }
  if (!date_debut || !date_fin) {
    callback({ error: 'Les dates de début et de fin sont requises' });
    return;
  }

  console.log('Recherche services servis avec code_St:', code_St, 'période:', date_debut, 'à', date_fin);

  db.all(
    `SELECT Servi.code_ser, Servi.code_emp, Servi.date_ser, Servi.heure_ser
     FROM Servi
     JOIN Employee ON Servi.code_emp = Employee.Code_emp
     WHERE Employee.code_st = ? AND Servi.date_ser BETWEEN ? AND ?`,
    [code_St, date_debut, date_fin],
    (err, rows) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        callback({ error: 'Erreur lors de la recherche des services servis' });
      } else if (!rows || rows.length === 0) {
        console.log('Aucun service servi trouvé pour la période spécifiée');
        callback({ servicesServi: [] });
      } else {
        console.log('Services servis trouvés:', rows);
        callback({ servicesServi: rows });
      }
    }
  );
}

const service = {
  StationService: {
    StationServicePort: {
      recherche_station_service,
      service_station,
      servi_station
    }
  }
};

module.exports = service; 