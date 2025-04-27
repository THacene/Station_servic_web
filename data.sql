-- Insert Wilaya data
INSERT INTO Wilaya (Code_w, lib_w) VALUES (9, 'Blida');

-- Insert Communes of Blida
INSERT INTO Commune (Code_com, lib_com, Code_w) VALUES 
(901, 'Blida', 9),
(902, 'Oued El Alleug', 9),
(903, 'Ouled Yaich', 9),
(904, 'Chiffa', 9),
(905, 'Mouzaia', 9),
(906, 'Bouinan', 9),
(907, 'Boufarik', 9),
(908, 'El Affroun', 9),
(909, 'Chebli', 9),
(910, 'Benkhelil', 9),
(911, 'Soumaa', 9),
(912, 'Djebabra', 9),
(913, 'Meftah', 9),
(914, 'Ouled Slama', 9),
(915, 'Beni Tamou', 9),
(916, 'Bouarfa', 9),
(917, 'Beni Mered', 9),
(918, 'Bougara', 9),
(919, 'Guerrouaou', 9),
(920, 'Ain Romana', 9),
(921, 'Chrea', 9),
(922, 'Montagne', 9),
(923, 'Mouzaia', 9),
(924, 'Oued Djer', 9),
(925, 'Ouled El Alleug', 9);

-- Insert Fournisseurs
INSERT INTO Fournisseur (ID_fournisseur, Nom_four) VALUES 
(1, 'Naftal'),
(2, 'Sonatrach'),
(3, 'Shell'),
(4, 'Total'),
(5, 'Mobil');

-- Insert Services
INSERT INTO Service (code_ser, lib_ser) VALUES 
(1, 'Lavage'),
(2, 'Vidange'),
(3, 'Réparation mécanique'),
(4, 'Réparation électrique'),
(5, 'Gonflage pneus'),
(6, 'Vente accessoires'),
(7, 'Station de lavage automatique'),
(8, 'Service express'),
(9, 'Diagnostic électronique'),
(10, 'Service VIP');

-- Insert Station Services
INSERT INTO Station_service (code_St, nom_quartier, code_com) VALUES 
(1, 'Centre Ville', 901),
(2, 'El Kef', 901),
(3, 'Sidi Moussa', 901),
(4, 'Oued El Alleug Centre', 902),
(5, 'Ouled Yaich Centre', 903),
(6, 'Chiffa Centre', 904),
(7, 'Mouzaia Centre', 905),
(8, 'Bouinan Centre', 906),
(9, 'Boufarik Centre', 907),
(10, 'El Affroun Centre', 908),
(11, 'Chebli Centre', 909),
(12, 'Benkhelil Centre', 910),
(13, 'Soumaa Centre', 911),
(14, 'Djebabra Centre', 912),
(15, 'Meftah Centre', 913),
(16, 'Ouled Slama Centre', 914),
(17, 'Beni Tamou Centre', 915),
(18, 'Bouarfa Centre', 916),
(19, 'Beni Mered Centre', 917),
(20, 'Bougara Centre', 918),
(21, 'Guerrouaou Centre', 919),
(22, 'Ain Romana Centre', 920),
(23, 'Chrea Centre', 921),
(24, 'Montagne Centre', 922),
(25, 'Oued Djer Centre', 924);

-- Insert Employees
INSERT INTO Employee (Code_emp, nom, pren, code_st) VALUES 
(1, 'Benali', 'Mohamed', 1),
(2, 'Bouaziz', 'Karim', 1),
(3, 'Chaoui', 'Fatima', 1),
(4, 'Dahmani', 'Ali', 2),
(5, 'Fares', 'Samira', 2),
(6, 'Gacem', 'Nadia', 3),
(7, 'Hadj', 'Rachid', 3),
(8, 'Kaci', 'Yasmine', 4),
(9, 'Larbi', 'Said', 4),
(10, 'Mansouri', 'Leila', 5),
(11, 'Nacer', 'Amine', 5),
(12, 'Ouali', 'Sara', 6),
(13, 'Rahmani', 'Hakim', 6),
(14, 'Saadi', 'Nour', 7),
(15, 'Taleb', 'Mehdi', 7),
(16, 'Ziani', 'Salima', 8),
(17, 'Abdelkader', 'Farid', 8),
(18, 'Bouchenak', 'Malika', 9),
(19, 'Cherif', 'Nabil', 9),
(20, 'Dahmane', 'Samia', 10);

-- Insert Service_web
INSERT INTO Service_web (ID_ser, nom_ser, description, ID_fournisseur) VALUES 
(1, 'Service Express', 'Service rapide de lavage et vidange', 1),
(2, 'Service VIP', 'Service premium avec diagnostic complet', 1),
(3, 'Service Standard', 'Service de base avec lavage', 2),
(4, 'Service Pro', 'Service professionnel avec réparation', 2),
(5, 'Service Eco', 'Service économique avec vidange', 3),
(6, 'Service Plus', 'Service complet avec accessoires', 3),
(7, 'Service Elite', 'Service haut de gamme', 4),
(8, 'Service Basic', 'Service essentiel', 4),
(9, 'Service Gold', 'Service premium avec garantie', 5),
(10, 'Service Silver', 'Service standard avec garantie', 5);

-- Insert Exsit (Services available in stations)
INSERT INTO Exsit (code_st, code_ser) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 3), (3, 8),
(4, 1), (4, 2), (4, 9), (4, 10),
(5, 1), (5, 2), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 5), (6, 6),
(7, 1), (7, 2), (7, 7), (7, 8),
(8, 1), (8, 2), (8, 9), (8, 10),
(9, 1), (9, 2), (9, 3), (9, 4),
(10, 1), (10, 2), (10, 5), (10, 6);

-- Insert Servi (Services provided)
INSERT INTO Servi (code_emp, code_ser, date_ser, heure_ser) VALUES 
(1, 1, '2024-03-01', '08:00'),
(1, 2, '2024-03-01', '09:30'),
(2, 3, '2024-03-01', '10:15'),
(3, 4, '2024-03-01', '11:00'),
(4, 5, '2024-03-01', '13:30'),
(5, 6, '2024-03-01', '14:45'),
(6, 7, '2024-03-01', '15:30'),
(7, 8, '2024-03-01', '16:15'),
(8, 9, '2024-03-01', '17:00'),
(9, 10, '2024-03-01', '17:45'),
(10, 1, '2024-03-02', '08:00'),
(11, 2, '2024-03-02', '09:30'),
(12, 3, '2024-03-02', '10:15'),
(13, 4, '2024-03-02', '11:00'),
(14, 5, '2024-03-02', '13:30'),
(15, 6, '2024-03-02', '14:45'),
(16, 7, '2024-03-02', '15:30'),
(17, 8, '2024-03-02', '16:15'),
(18, 9, '2024-03-02', '17:00'),
(19, 10, '2024-03-02', '17:45'); 