const { buildSchema } = require('graphql');
const db = require('../db');

const schema = buildSchema(`
  type Station {
    lib_w: String
    lib_com: String
  }

  type Service {
    code_ser: Int
    lib_ser: String
  }

  type ServiceServi {
    code_ser: Int
    code_emp: Int
    date_ser: String
    heure_ser: String
  }

  type Query {
    rechercheStationService(code_St: Int!): Station
    serviceStation(code_St: Int!): [Service]
    serviceServi(code_St: Int!): [ServiceServi]
  }
`);

const root = {
  rechercheStationService: ({ code_St }) => {
    console.log('Recherche station service avec code_St:', code_St);
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT Commune.lib_com, Wilaya.lib_w
         FROM Station_service
         JOIN Commune ON Station_service.code_com = Commune.Code_com
         JOIN Wilaya ON Commune.Code_w = Wilaya.Code_w
         WHERE Station_service.code_St = ?`,
        [code_St],
        (err, row) => {
          if (err) {
            console.error('Erreur rechercheStationService:', err);
            reject(new Error('Erreur lors de la recherche de la station'));
          } else if (!row) {
            console.log('Aucune station trouvée pour code_St:', code_St);
            resolve(null);
          } else {
            console.log('Station trouvée:', row);
            resolve(row);
          }
        }
      );
    });
  },
  serviceStation: ({ code_St }) => {
    console.log('Recherche services de la station avec code_St:', code_St);
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT Service.code_ser, Service.lib_ser
         FROM Exsit
         JOIN Service ON Exsit.code_ser = Service.code_ser
         WHERE Exsit.code_st = ?`,
        [code_St],
        (err, rows) => {
          if (err) {
            console.error('Erreur serviceStation:', err);
            reject(new Error('Erreur lors de la recherche des services'));
          } else {
            console.log('Services trouvés:', rows);
            resolve(rows || []);
          }
        }
      );
    });
  },
  serviceServi: ({ code_St }) => {
    console.log('Recherche services servis avec code_St:', code_St);
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT Servi.code_ser, Servi.code_emp, Servi.date_ser, Servi.heure_ser
         FROM Servi
         JOIN Employee ON Servi.code_emp = Employee.Code_emp
         WHERE Employee.code_st = ?`,
        [code_St],
        (err, rows) => {
          if (err) {
            console.error('Erreur serviceServi:', err);
            reject(new Error('Erreur lors de la recherche des services servis'));
          } else {
            console.log('Services servis trouvés:', rows);
            resolve(rows || []);
          }
        }
      );
    });
  }
};

module.exports = { schema, root }; 