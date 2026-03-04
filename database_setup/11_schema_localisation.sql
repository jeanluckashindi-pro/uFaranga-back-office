-- =====================================================
-- SCRIPT 11: SCHÉMA LOCALISATION
-- Hiérarchie géographique avec coordonnées et autorisation système
-- Pays → Province/Région → District/Ville → Quartier/Zone → Point de service/Agent
-- Liaison à identite.utilisateurs pour localiser une personne
-- =====================================================

\c ufaranga

-- =====================================================
-- PAYS
-- =====================================================
CREATE TABLE localisation.pays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_iso_2 CHAR(2) UNIQUE NOT NULL,
    code_iso_3 CHAR(3),
    nom VARCHAR(100) NOT NULL,
    nom_anglais VARCHAR(100),
    -- Coordonnées du centre (pour affichage carte)
    latitude_centre DECIMAL(10, 7),
    longitude_centre DECIMAL(10, 7),
    -- La zone (pays) est-elle autorisée à utiliser le système ?
    autorise_systeme BOOLEAN DEFAULT TRUE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_pays_code ON localisation.pays(code_iso_2);
CREATE INDEX idx_pays_autorise ON localisation.pays(autorise_systeme) WHERE autorise_systeme = TRUE;
COMMENT ON TABLE localisation.pays IS 'Pays - niveau 1 de la hiérarchie géographique';

-- =====================================================
-- PROVINCES / RÉGIONS (rattachées à un pays)
-- =====================================================
CREATE TABLE localisation.provinces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pays_id UUID NOT NULL REFERENCES localisation.pays(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    latitude_centre DECIMAL(10, 7),
    longitude_centre DECIMAL(10, 7),
    autorise_systeme BOOLEAN DEFAULT TRUE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    UNIQUE(pays_id, code)
);

CREATE INDEX idx_provinces_pays ON localisation.provinces(pays_id);
CREATE INDEX idx_provinces_autorise ON localisation.provinces(autorise_systeme) WHERE autorise_systeme = TRUE;
COMMENT ON TABLE localisation.provinces IS 'Régions / Provinces - niveau 2';

-- =====================================================
-- DISTRICTS / VILLES (rattachés à une province)
-- =====================================================
CREATE TABLE localisation.districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province_id UUID NOT NULL REFERENCES localisation.provinces(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    latitude_centre DECIMAL(10, 7),
    longitude_centre DECIMAL(10, 7),
    autorise_systeme BOOLEAN DEFAULT TRUE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    UNIQUE(province_id, code)
);

CREATE INDEX idx_districts_province ON localisation.districts(province_id);
CREATE INDEX idx_districts_autorise ON localisation.districts(autorise_systeme) WHERE autorise_systeme = TRUE;
COMMENT ON TABLE localisation.districts IS 'Villes / Districts - niveau 3';

-- =====================================================
-- QUARTIERS / ZONES (rattachés à un district)
-- =====================================================
CREATE TABLE localisation.quartiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID NOT NULL REFERENCES localisation.districts(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    latitude_centre DECIMAL(10, 7),
    longitude_centre DECIMAL(10, 7),
    -- La zone est-elle autorisée à utiliser le système ?
    autorise_systeme BOOLEAN DEFAULT TRUE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    UNIQUE(district_id, code)
);

CREATE INDEX idx_quartiers_district ON localisation.quartiers(district_id);
CREATE INDEX idx_quartiers_autorise ON localisation.quartiers(autorise_systeme) WHERE autorise_systeme = TRUE;
COMMENT ON TABLE localisation.quartiers IS 'Quartiers / Zones - niveau 4';

-- =====================================================
-- POINTS DE SERVICE / AGENTS (rattachés à un quartier, optionnellement à un agent)
-- =====================================================
CREATE TABLE localisation.points_de_service (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quartier_id UUID NOT NULL REFERENCES localisation.quartiers(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    type_point VARCHAR(20) DEFAULT 'AGENT' CHECK (type_point IN ('AGENT', 'GUICHET', 'PARTENAIRE', 'AUTRE')),
    -- Agent (personne identite) rattachée à ce point
    agent_utilisateur_id UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    adresse_complementaire TEXT,
    autorise_systeme BOOLEAN DEFAULT TRUE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    UNIQUE(quartier_id, code)
);

CREATE INDEX idx_points_de_service_quartier ON localisation.points_de_service(quartier_id);
CREATE INDEX idx_points_de_service_agent ON localisation.points_de_service(agent_utilisateur_id);
CREATE INDEX idx_points_de_service_autorise ON localisation.points_de_service(autorise_systeme) WHERE autorise_systeme = TRUE;
COMMENT ON TABLE localisation.points_de_service IS 'Points de service / Agents - niveau 5, relié à un utilisateur (agent)';

-- =====================================================
-- LIAISON IDENTITÉ → LOCALISATION (adresse de la persaonne)
-- Colonnes ajoutées à identite.utilisateurs pour marquer la localisation
-- =====================================================
ALTER TABLE identite.utilisateurs
    ADD COLUMN IF NOT EXISTS pays_id UUID REFERENCES localisation.pays(id) ON DELETE SET NULL;
ALTER TABLE identite.utilisateurs
    ADD COLUMN IF NOT EXISTS province_id UUID REFERENCES localisation.provinces(id) ON DELETE SET NULL;
ALTER TABLE identite.utilisateurs
    ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES localisation.districts(id) ON DELETE SET NULL;
ALTER TABLE identite.utilisateurs
    ADD COLUMN IF NOT EXISTS quartier_id UUID REFERENCES localisation.quartiers(id) ON DELETE SET NULL;
ALTER TABLE identite.utilisateurs
    ADD COLUMN IF NOT EXISTS point_de_service_id UUID REFERENCES localisation.points_de_service(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_utilisateurs_pays ON identite.utilisateurs(pays_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_province ON identite.utilisateurs(province_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_district ON identite.utilisateurs(district_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_quartier ON identite.utilisateurs(quartier_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_point_de_service ON identite.utilisateurs(point_de_service_id);

COMMENT ON COLUMN identite.utilisateurs.pays_id IS 'Référence localisation : pays de résidence';
COMMENT ON COLUMN identite.utilisateurs.province_id IS 'Référence localisation : province / région';
COMMENT ON COLUMN identite.utilisateurs.district_id IS 'Référence localisation : district / ville';
COMMENT ON COLUMN identite.utilisateurs.quartier_id IS 'Référence localisation : quartier / zone';
COMMENT ON COLUMN identite.utilisateurs.point_de_service_id IS 'Référence localisation : point de service (ex. agent d’attachement)';

-- =====================================================
-- DROITS pour l'utilisateur Django (ufaranga)
-- =====================================================
GRANT USAGE ON SCHEMA localisation TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON localisation.pays TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON localisation.provinces TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON localisation.districts TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON localisation.quartiers TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON localisation.points_de_service TO ufaranga;




-- INSERTION PAYS
-- Insertion de tous les pays africains avec autorise_systeme = FALSE et est_actif = FALSE
INSERT INTO localisation.pays (code_iso_2, code_iso_3, nom, nom_anglais, latitude_centre, longitude_centre, autorise_systeme, est_actif) VALUES
('DZ', 'DZA', 'Algérie', 'Algeria', 28.0339, 1.6596, FALSE, FALSE),
('AO', 'AGO', 'Angola', 'Angola', -11.2027, 17.8739, FALSE, FALSE),
('BJ', 'BEN', 'Bénin', 'Benin', 9.3077, 2.3158, FALSE, FALSE),
('BW', 'BWA', 'Botswana', 'Botswana', -22.3285, 24.6849, FALSE, FALSE),
('BF', 'BFA', 'Burkina Faso', 'Burkina Faso', 12.2383, -1.5616, FALSE, FALSE),
('BI', 'BDI', 'Burundi', 'Burundi', -3.3731, 29.9189, FALSE, FALSE),
('CM', 'CMR', 'Cameroun', 'Cameroon', 7.3697, 12.3547, FALSE, FALSE),
('CV', 'CPV', 'Cap-Vert', 'Cape Verde', 16.5388, -23.0418, FALSE, FALSE),
('CF', 'CAF', 'République centrafricaine', 'Central African Republic', 6.6111, 20.9394, FALSE, FALSE),
('TD', 'TCD', 'Tchad', 'Chad', 15.4542, 18.7322, FALSE, FALSE),
('KM', 'COM', 'Comores', 'Comoros', -11.6455, 43.3333, FALSE, FALSE),
('CG', 'COG', 'Congo', 'Republic of the Congo', -0.2280, 15.8277, FALSE, FALSE),
('CD', 'COD', 'République démocratique du Congo', 'Democratic Republic of the Congo', -4.0383, 21.7587, FALSE, FALSE),
('CI', 'CIV', 'Côte d''Ivoire', 'Ivory Coast', 7.5400, -5.5471, FALSE, FALSE),
('DJ', 'DJI', 'Djibouti', 'Djibouti', 11.8251, 42.5903, FALSE, FALSE),
('EG', 'EGY', 'Égypte', 'Egypt', 26.8206, 30.8025, FALSE, FALSE),
('GQ', 'GNQ', 'Guinée équatoriale', 'Equatorial Guinea', 1.6508, 10.2679, FALSE, FALSE),
('ER', 'ERI', 'Érythrée', 'Eritrea', 15.1794, 39.7823, FALSE, FALSE),
('SZ', 'SWZ', 'Eswatini', 'Eswatini', -26.5225, 31.4659, FALSE, FALSE),
('ET', 'ETH', 'Éthiopie', 'Ethiopia', 9.1450, 40.4897, FALSE, FALSE),
('GA', 'GAB', 'Gabon', 'Gabon', -0.8037, 11.6094, FALSE, FALSE),
('GM', 'GMB', 'Gambie', 'Gambia', 13.4432, -15.3101, FALSE, FALSE),
('GH', 'GHA', 'Ghana', 'Ghana', 7.9465, -1.0232, FALSE, FALSE),
('GN', 'GIN', 'Guinée', 'Guinea', 9.9456, -9.6966, FALSE, FALSE),
('GW', 'GNB', 'Guinée-Bissau', 'Guinea-Bissau', 11.8037, -15.1804, FALSE, FALSE),
('KE', 'KEN', 'Kenya', 'Kenya', -0.0236, 37.9062, FALSE, FALSE),
('LS', 'LSO', 'Lesotho', 'Lesotho', -29.6100, 28.2336, FALSE, FALSE),
('LR', 'LBR', 'Libéria', 'Liberia', 6.4281, -9.4295, FALSE, FALSE),
('LY', 'LBY', 'Libye', 'Libya', 26.3351, 17.2283, FALSE, FALSE),
('MG', 'MDG', 'Madagascar', 'Madagascar', -18.7669, 46.8691, FALSE, FALSE),
('MW', 'MWI', 'Malawi', 'Malawi', -13.2543, 34.3015, FALSE, FALSE),
('ML', 'MLI', 'Mali', 'Mali', 17.5707, -3.9962, FALSE, FALSE),
('MR', 'MRT', 'Mauritanie', 'Mauritania', 21.0079, -10.9408, FALSE, FALSE),
('MU', 'MUS', 'Maurice', 'Mauritius', -20.3484, 57.5522, FALSE, FALSE),
('MA', 'MAR', 'Maroc', 'Morocco', 31.7917, -7.0926, FALSE, FALSE),
('MZ', 'MOZ', 'Mozambique', 'Mozambique', -18.6657, 35.5296, FALSE, FALSE),
('NA', 'NAM', 'Namibie', 'Namibia', -22.9576, 18.4904, FALSE, FALSE),
('NE', 'NER', 'Niger', 'Niger', 17.6078, 8.0817, FALSE, FALSE),
('NG', 'NGA', 'Nigéria', 'Nigeria', 9.0820, 8.6753, FALSE, FALSE),
('RW', 'RWA', 'Rwanda', 'Rwanda', -1.9403, 29.8739, FALSE, FALSE),
('ST', 'STP', 'Sao Tomé-et-Principe', 'Sao Tome and Principe', 0.1864, 6.6131, FALSE, FALSE),
('SN', 'SEN', 'Sénégal', 'Senegal', 14.4974, -14.4524, FALSE, FALSE),
('SC', 'SYC', 'Seychelles', 'Seychelles', -4.6796, 55.4920, FALSE, FALSE),
('SL', 'SLE', 'Sierra Leone', 'Sierra Leone', 8.4606, -11.7799, FALSE, FALSE),
('SO', 'SOM', 'Somalie', 'Somalia', 5.1521, 46.1996, FALSE, FALSE),
('ZA', 'ZAF', 'Afrique du Sud', 'South Africa', -30.5595, 22.9375, FALSE, FALSE),
('SS', 'SSD', 'Soudan du Sud', 'South Sudan', 6.8770, 31.3070, FALSE, FALSE),
('SD', 'SDN', 'Soudan', 'Sudan', 12.8628, 30.2176, FALSE, FALSE),
('TZ', 'TZA', 'Tanzanie', 'Tanzania', -6.3690, 34.8888, FALSE, FALSE),
('TG', 'TGO', 'Togo', 'Togo', 8.6195, 0.8248, FALSE, FALSE),
('TN', 'TUN', 'Tunisie', 'Tunisia', 33.8869, 9.5375, FALSE, FALSE),
('UG', 'UGA', 'Ouganda', 'Uganda', 1.3733, 32.2903, FALSE, FALSE),
('ZM', 'ZMB', 'Zambie', 'Zambia', -13.1339, 27.8493, FALSE, FALSE),
('ZW', 'ZWE', 'Zimbabwe', 'Zimbabwe', -19.0154, 29.1549, FALSE, FALSE);


-- =====================================================
-- INSERTION DES PROVINCES/RÉGIONS DES PAYS AFRICAINS
-- =====================================================

-- ALGÉRIE (18 provinces principales)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif) 
SELECT id, 'DZ-16', 'Alger', 36.7538, 3.0588, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-09', 'Blida', 36.4703, 2.8277, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-10', 'Bouira', 36.3687, 3.9014, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-35', 'Boumerdès', 36.7603, 3.4714, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-31', 'Oran', 35.6969, -0.6331, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-19', 'Sétif', 36.1905, 5.4106, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-25', 'Constantine', 36.3650, 6.6147, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-06', 'Béjaïa', 36.7525, 5.0556, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-13', 'Tlemcen', 34.8780, -1.3157, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-15', 'Tizi Ouzou', 36.7117, 4.0493, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-23', 'Annaba', 36.9000, 7.7667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-27', 'Mostaganem', 35.9315, 0.0891, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-03', 'Laghouat', 33.8000, 2.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-01', 'Adrar', 27.8700, -0.2900, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-30', 'Ouargla', 31.9500, 5.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-11', 'Tamanrasset', 22.7850, 5.5228, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-47', 'Ghardaïa', 32.4910, 3.6670, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ'
UNION ALL
SELECT id, 'DZ-32', 'El Bayadh', 33.6800, 1.0200, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DZ';

-- ANGOLA (18 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'AO-LUA', 'Luanda', -8.8383, 13.2344, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-BGU', 'Benguela', -12.5763, 13.4055, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-BGO', 'Bengo', -8.9667, 13.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-BIE', 'Bié', -12.5000, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-CAB', 'Cabinda', -5.5500, 12.2000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-CCU', 'Cuando Cubango', -15.5000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-CNO', 'Cuanza Norte', -9.2500, 14.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-CUS', 'Cuanza Sul', -10.7500, 15.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-CNN', 'Cunene', -16.5000, 15.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-HUA', 'Huambo', -12.7756, 15.7392, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-HUI', 'Huíla', -14.9167, 14.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-LNO', 'Lunda Norte', -8.8100, 20.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-LSU', 'Lunda Sul', -10.7500, 20.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-MAL', 'Malanje', -9.5400, 16.3400, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-MOX', 'Moxico', -13.5000, 20.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-NAM', 'Namibe', -15.1961, 12.1522, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-UIG', 'Uíge', -7.6086, 15.0614, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO'
UNION ALL
SELECT id, 'AO-ZAI', 'Zaire', -6.5000, 13.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'AO';

-- BÉNIN (12 départements)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BJ-AL', 'Alibori', 11.1333, 2.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-AK', 'Atakora', 10.8000, 1.6833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-AQ', 'Atlantique', 6.6500, 2.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-BO', 'Borgou', 9.8333, 2.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-CO', 'Collines', 8.3500, 2.3500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-KO', 'Kouffo', 7.0000, 1.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-DO', 'Donga', 9.7167, 1.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-LI', 'Littoral', 6.3654, 2.4183, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-MO', 'Mono', 6.6500, 1.7000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-OU', 'Ouémé', 6.5000, 2.6000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-PL', 'Plateau', 7.2667, 2.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ'
UNION ALL
SELECT id, 'BJ-ZO', 'Zou', 7.3667, 2.1167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BJ';

-- BOTSWANA (10 districts)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BW-CE', 'Central', -21.9000, 25.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-CH', 'Chobe', -18.5500, 24.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-GH', 'Ghanzi', -21.7000, 21.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-KG', 'Kgalagadi', -24.7500, 21.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-KL', 'Kgatleng', -24.2000, 26.1000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-KW', 'Kweneng', -23.5500, 25.4000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-NE', 'North East', -20.6000, 27.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-NW', 'North West', -19.5000, 23.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-SE', 'South East', -24.5500, 25.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW'
UNION ALL
SELECT id, 'BW-SO', 'Southern', -25.1667, 25.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BW';

-- BURKINA FASO (13 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BF-01', 'Boucle du Mouhoun', 12.2500, -3.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-02', 'Cascades', 10.5000, -4.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-03', 'Centre', 12.3703, -1.5247, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-04', 'Centre-Est', 11.5000, -0.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-05', 'Centre-Nord', 13.2000, -1.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-06', 'Centre-Ouest', 12.0000, -2.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-07', 'Centre-Sud', 11.5000, -1.2000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-08', 'Est', 12.0000, 0.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-09', 'Hauts-Bassins', 11.1817, -4.2980, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-10', 'Nord', 13.5000, -2.3667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-11', 'Plateau-Central', 12.3000, -0.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-12', 'Sahel', 14.0000, -0.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF'
UNION ALL
SELECT id, 'BF-13', 'Sud-Ouest', 10.4500, -3.0500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BF';

-- BURUNDI (18 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BI-BB', 'Bubanza', -3.0833, 29.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-BM', 'Bujumbura Mairie', -3.3822, 29.3644, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-BL', 'Bujumbura Rural', -3.5000, 29.3500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-BR', 'Bururi', -3.9500, 29.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-CA', 'Cankuzo', -3.2167, 30.6000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-CI', 'Cibitoke', -2.8833, 29.1167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-GI', 'Gitega', -3.4271, 29.9246, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-KR', 'Kirundo', -2.5833, 30.1000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-KY', 'Karuzi', -3.1000, 30.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-KI', 'Kayanza', -2.9167, 29.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-MA', 'Makamba', -4.1333, 29.8000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-MU', 'Muramvya', -3.2667, 29.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-MY', 'Muyinga', -2.8500, 30.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-MW', 'Mwaro', -3.5000, 29.7000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-NG', 'Ngozi', -2.9083, 29.8306, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-RT', 'Rutana', -3.9333, 30.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-RY', 'Ruyigi', -3.4833, 30.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI'
UNION ALL
SELECT id, 'BI-RM', 'Rumonge', -3.9667, 29.4333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'BI';

-- CAMEROUN (10 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CM-AD', 'Adamaoua', 7.0000, 13.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-CE', 'Centre', 4.0500, 11.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-ES', 'Est', 4.5000, 14.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-EN', 'Extrême-Nord', 10.5000, 14.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-LT', 'Littoral', 4.0511, 9.7679, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-NO', 'Nord', 8.5000, 13.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-NW', 'Nord-Ouest', 6.0000, 10.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-OU', 'Ouest', 5.5000, 10.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-SU', 'Sud', 2.5000, 11.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM'
UNION ALL
SELECT id, 'CM-SW', 'Sud-Ouest', 4.5000, 9.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CM';

-- CAP-VERT (22 municipalités regroupées par îles)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CV-BR', 'Brava', 14.8500, -24.7167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-BV', 'Boa Vista', 16.1000, -22.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-MA', 'Maio', 15.1333, -23.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-PR', 'Praia', 14.9177, -23.5092, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-RG', 'Ribeira Grande', 17.1833, -25.0667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-SL', 'Sal', 16.7500, -22.9333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-SN', 'Santiago Nord', 15.0833, -23.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-SO', 'Santiago Sud', 14.9000, -23.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-SV', 'São Vicente', 16.8833, -25.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV'
UNION ALL
SELECT id, 'CV-TA', 'Tarrafal', 15.2833, -23.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CV';

-- RÉPUBLIQUE CENTRAFRICAINE (16 préfectures + 1 commune)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CF-BGF', 'Bangui', 4.3947, 18.5582, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-BB', 'Bamingui-Bangoran', 8.0000, 20.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-BK', 'Basse-Kotto', 4.7500, 21.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-HK', 'Haute-Kotto', 6.5000, 23.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-HM', 'Haut-Mbomou', 6.2500, 25.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-HS', 'Mambéré-Kadéï', 4.5000, 15.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-KB', 'Nana-Grébizi', 7.0000, 19.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-KG', 'Kémo', 5.8333, 19.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-LB', 'Lobaye', 3.7500, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-MB', 'Mbomou', 5.5000, 23.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-MP', 'Ombella-M''Poko', 5.0000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-NM', 'Nana-Mambéré', 5.7500, 15.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-OP', 'Ouham-Pendé', 6.5000, 16.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-SE', 'Sangha-Mbaéré', 3.5000, 16.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-UK', 'Ouaka', 5.5000, 20.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-AC', 'Ouham', 7.0000, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF'
UNION ALL
SELECT id, 'CF-VK', 'Vakaga', 9.5000, 22.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CF';

-- TCHAD (23 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'TD-BA', 'Batha', 13.8333, 18.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-BG', 'Barh El Gazel', 15.0000, 16.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-BO', 'Borkou', 17.9167, 18.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-CB', 'Chari-Baguirmi', 11.4500, 15.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-EN', 'Ennedi-Est', 16.0000, 23.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-EO', 'Ennedi-Ouest', 16.5000, 21.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-GR', 'Guéra', 11.0000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-HL', 'Hadjer-Lamis', 12.4167, 16.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-KA', 'Kanem', 14.5000, 15.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-LC', 'Lac', 13.6667, 14.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-LO', 'Logone Occidental', 8.8333, 15.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-LR', 'Logone Oriental', 8.4167, 16.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-MA', 'Mandoul', 8.6167, 17.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-ME', 'Mayo-Kebbi Est', 9.3500, 14.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-MO', 'Mayo-Kebbi Ouest', 9.7500, 15.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-MC', 'Moyen-Chari', 9.0000, 18.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-ND', 'N''Djamena', 12.1348, 15.0557, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-OD', 'Ouaddaï', 13.8333, 21.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-SA', 'Salamat', 11.0000, 20.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-SI', 'Sila', 12.1667, 21.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-TA', 'Tandjilé', 9.5833, 16.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-TI', 'Tibesti', 21.0000, 17.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD'
UNION ALL
SELECT id, 'TD-WF', 'Wadi Fira', 15.0333, 21.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TD';

-- COMORES (3 îles autonomes)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'KM-G', 'Grande Comore', -11.7042, 43.2402, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KM'
UNION ALL
SELECT id, 'KM-A', 'Anjouan', -12.2167, 44.4333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KM'
UNION ALL
SELECT id, 'KM-M', 'Mohéli', -12.3500, 43.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KM';

-- CONGO-BRAZZAVILLE (12 départements)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CG-BZV', 'Brazzaville', -4.2634, 15.2429, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-11', 'Bouenza', -4.1167, 13.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-8', 'Cuvette', -0.5000, 16.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-15', 'Cuvette-Ouest', -0.8333, 14.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-5', 'Kouilou', -4.1500, 11.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-2', 'Lékoumou', -3.1667, 13.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-7', 'Likouala', 2.0000, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-9', 'Niari', -2.9167, 12.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-14', 'Plateaux', -2.7500, 15.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-16', 'Pointe-Noire', -4.7692, 11.8636, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-12', 'Pool', -3.8000, 15.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG'
UNION ALL
SELECT id, 'CG-13', 'Sangha', 2.0000, 16.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CG';

-- RD CONGO (26 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CD-KN', 'Kinshasa', -4.3276, 15.3136, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-BC', 'Bas-Congo (Kongo Central)', -5.0333, 14.3500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-BN', 'Bandundu', -3.3167, 17.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-EQ', 'Équateur', 0.5000, 23.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KE', 'Kasaï-Oriental', -5.8833, 23.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KW', 'Kasaï-Occidental', -5.5000, 21.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KA', 'Katanga', -9.5000, 26.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-MA', 'Maniema', -2.8333, 26.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-NK', 'Nord-Kivu', -0.7500, 29.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-OR', 'Orientale', 2.0000, 26.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-SK', 'Sud-Kivu', -3.2500, 28.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-HK', 'Haut-Katanga', -10.7000, 26.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-HL', 'Haut-Lomami', -7.5000, 25.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-HU', 'Haut-Uélé', 3.5000, 28.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-IT', 'Ituri', 1.5000, 29.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KS', 'Kasaï', -5.0000, 20.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KC', 'Kasaï Central', -5.0167, 21.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KG', 'Kwango', -5.5000, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-KL', 'Kwilu', -5.0000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-LO', 'Lomami', -6.0000, 24.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-LU', 'Lualaba', -10.5000, 25.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-MN', 'Mai-Ndombe', -2.5000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-MO', 'Mongala', 2.0000, 21.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-NU', 'Nord-Ubangi', 3.5000, 21.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-SA', 'Sankuru', -2.7500, 23.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-SU', 'Sud-Ubangi', 2.8333, 19.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-TA', 'Tanganyika', -6.5000, 27.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-TO', 'Tshopo', 0.7500, 24.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD'
UNION ALL
SELECT id, 'CD-TU', 'Tshuapa', -1.0000, 22.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CD';

-- CÔTE D'IVOIRE (14 districts)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CI-AB', 'Abidjan', 5.3600, -4.0083, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-BS', 'Bas-Sassandra', 5.0833, -6.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-CM', 'Comoé', 6.0000, -3.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-DN', 'Denguélé', 9.5000, -7.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-GD', 'Gôh-Djiboua', 5.7500, -5.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-LC', 'Lacs', 7.0000, -5.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-LG', 'Lagunes', 5.2500, -4.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-MG', 'Montagnes', 7.5000, -7.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-SM', 'Sassandra-Marahoué', 6.5000, -6.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-SV', 'Savanes', 9.5000, -5.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-VB', 'Vallée du Bandama', 8.0000, -5.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-WR', 'Woroba', 8.2500, -6.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-YM', 'Yamoussoukro', 6.8206, -5.2767, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI'
UNION ALL
SELECT id, 'CI-ZZ', 'Zanzan', 8.5000, -3.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'CI';

-- DJIBOUTI (6 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'DJ-AR', 'Arta', 11.5228, 42.8439, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ'
UNION ALL
SELECT id, 'DJ-AS', 'Ali Sabieh', 11.1558, 42.7128, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ'
UNION ALL
SELECT id, 'DJ-DI', 'Dikhil', 11.1056, 42.3706, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ'
UNION ALL
SELECT id, 'DJ-DJ', 'Djibouti', 11.8251, 42.5903, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ'
UNION ALL
SELECT id, 'DJ-OB', 'Obock', 12.0000, 43.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ'
UNION ALL
SELECT id, 'DJ-TA', 'Tadjourah', 11.7833, 42.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'DJ';

-- ÉGYPTE (27 gouvernorats)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'EG-C', 'Le Caire', 30.0444, 31.2357, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-ALX', 'Alexandrie', 31.2001, 29.9187, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-ASN', 'Assouan', 24.0889, 32.8998, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-AST', 'Assiout', 27.1809, 31.1837, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-BH', 'Béhéra', 30.8481, 30.3436, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-BNS', 'Beni Suef', 29.0661, 31.0994, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-DK', 'Dakahliya', 31.1656, 31.4913, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-DT', 'Damiette', 31.4175, 31.8144, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-FYM', 'Fayoum', 29.3084, 30.8428, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-GH', 'Gharbia', 30.8754, 31.0335, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-GZ', 'Gizeh', 30.0131, 31.2089, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-IS', 'Ismaïlia', 30.5833, 32.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-KFS', 'Kafr el-Cheikh', 31.1107, 30.9388, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-LX', 'Louxor', 25.6872, 32.6396, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-MT', 'Matrouh', 31.3543, 27.2373, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-MN', 'Minya', 28.0871, 30.7618, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-MNF', 'Menoufiya', 30.5972, 30.9876, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-KB', 'Qalyubia', 30.3293, 31.2158, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-KN', 'Qena', 26.1551, 32.7160, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-BA', 'Mer Rouge', 24.6826, 34.1532, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-SHR', 'Sharqiya', 30.7327, 31.7195, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-SHG', 'Sohag', 26.5569, 31.6948, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-SIN', 'Sinaï du Nord', 30.2824, 33.6176, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-SIS', 'Sinaï du Sud', 29.3250, 33.9750, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-SUZ', 'Suez', 29.9668, 32.5498, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-WAD', 'Nouvelle Vallée', 25.4500, 30.5500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG'
UNION ALL
SELECT id, 'EG-PTS', 'Port-Saïd', 31.2653, 32.3019, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'EG';

-- GUINÉE ÉQUATORIALE (8 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GQ-AN', 'Annobón', -1.4167, 5.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-BN', 'Bioko Nord', 3.7500, 8.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-BS', 'Bioko Sud', 3.4167, 8.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-CS', 'Centro Sud', 1.3500, 10.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-KN', 'Kié-Ntem', 2.0000, 10.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-LI', 'Litoral', 1.5000, 9.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-WN', 'Wele-Nzas', 1.5000, 11.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ'
UNION ALL
SELECT id, 'GQ-DJ', 'Djibloho', 1.6333, 10.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GQ';

-- ÉRYTHRÉE (6 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ER-MA', 'Maekel (Centre)', 15.3333, 38.9333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER'
UNION ALL
SELECT id, 'ER-AN', 'Anseba', 16.5000, 37.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER'
UNION ALL
SELECT id, 'ER-DK', 'Debub (Sud)', 14.5000, 39.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER'
UNION ALL
SELECT id, 'ER-GB', 'Gash-Barka', 15.5000, 37.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER'
UNION ALL
SELECT id, 'ER-SK', 'Semenawi Keyih Bahri (Nord Mer Rouge)', 16.5000, 39.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER'
UNION ALL
SELECT id, 'ER-DU', 'Debubawi Keyih Bahri (Sud Mer Rouge)', 13.5000, 41.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ER';

-- ESWATINI (4 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SZ-HH', 'Hhohho', -26.0000, 31.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SZ'
UNION ALL
SELECT id, 'SZ-LU', 'Lubombo', -26.5000, 31.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SZ'
UNION ALL
SELECT id, 'SZ-MA', 'Manzini', -26.5000, 31.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SZ'
UNION ALL
SELECT id, 'SZ-SH', 'Shiselweni', -27.1667, 31.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SZ';

-- ÉTHIOPIE (11 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ET-AA', 'Addis-Abeba', 9.0320, 38.7469, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-AF', 'Afar', 11.7500, 41.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-AM', 'Amhara', 11.5000, 38.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-BE', 'Benishangul-Gumuz', 10.7833, 35.5667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-DD', 'Dire Dawa', 9.5930, 41.8550, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-GA', 'Gambela', 8.2500, 34.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-HA', 'Harari', 9.3150, 42.1969, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-OR', 'Oromia', 9.0000, 39.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-SI', 'Sidama', 6.9167, 38.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-SO', 'Somali', 6.7500, 43.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-SN', 'Nations, Nationalités et Peuples du Sud', 6.5000, 37.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET'
UNION ALL
SELECT id, 'ET-TI', 'Tigré', 14.0000, 38.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ET';

-- GABON (9 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GA-1', 'Estuaire', 0.4500, 10.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-2', 'Haut-Ogooué', -1.4667, 13.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-3', 'Moyen-Ogooué', -0.6667, 10.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-4', 'Ngounié', -1.5167, 10.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-5', 'Nyanga', -2.9333, 11.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-6', 'Ogooué-Ivindo', 0.8333, 13.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-7', 'Ogooué-Lolo', -0.9667, 12.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-8', 'Ogooué-Maritime', -1.3333, 9.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA'
UNION ALL
SELECT id, 'GA-9', 'Woleu-Ntem', 2.3167, 11.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GA';

-- GAMBIE (6 divisions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GM-B', 'Banjul', 13.4549, -16.5790, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM'
UNION ALL
SELECT id, 'GM-L', 'Lower River', 13.3667, -15.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM'
UNION ALL
SELECT id, 'GM-M', 'Central River', 13.6667, -14.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM'
UNION ALL
SELECT id, 'GM-N', 'North Bank', 13.5000, -15.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM'
UNION ALL
SELECT id, 'GM-U', 'Upper River', 13.4500, -13.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM'
UNION ALL
SELECT id, 'GM-W', 'Western', 13.3000, -16.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GM';

-- GHANA (16 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GH-AA', 'Greater Accra', 5.6037, -0.1870, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-AH', 'Ashanti', 6.7500, -1.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-BA', 'Brong-Ahafo', 7.6667, -1.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-CP', 'Central', 5.5000, -1.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-EP', 'Eastern', 6.2500, -0.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-NP', 'Northern', 9.4000, -1.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-UE', 'Upper East', 10.7167, -0.9833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-UW', 'Upper West', 10.2833, -2.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-TV', 'Volta', 6.5833, 0.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-WP', 'Western', 5.5000, -2.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-AF', 'Ahafo', 7.5833, -2.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-BE', 'Bono East', 7.7500, -1.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-BO', 'Bono', 7.6500, -2.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-NE', 'North East', 10.5000, -0.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-OT', 'Oti', 7.9167, 0.0500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-SV', 'Savannah', 9.0833, -1.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH'
UNION ALL
SELECT id, 'GH-WN', 'Western North', 6.2000, -2.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GH';

-- GUINÉE (8 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GN-C', 'Conakry', 9.6412, -13.5784, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-B', 'Boké', 10.9333, -14.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-F', 'Faranah', 10.0333, -10.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-K', 'Kankan', 10.3850, -9.3061, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-D', 'Kindia', 10.0500, -12.8667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-L', 'Labé', 11.3167, -12.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-M', 'Mamou', 10.3750, -12.0917, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN'
UNION ALL
SELECT id, 'GN-N', 'Nzérékoré', 7.7569, -8.8179, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GN';

-- GUINÉE-BISSAU (9 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GW-BS', 'Bissau', 11.8636, -15.5982, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-BA', 'Bafatá', 12.1667, -14.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-BM', 'Biombo', 11.8833, -15.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-BL', 'Bolama', 11.5750, -15.4750, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-CA', 'Cacheu', 12.2667, -16.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-GA', 'Gabú', 12.2833, -14.2167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-OI', 'Oio', 12.3500, -15.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-QU', 'Quinara', 11.8833, -15.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW'
UNION ALL
SELECT id, 'GW-TO', 'Tombali', 11.3333, -14.9833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'GW';

-- KENYA (47 comtés)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'KE-110', 'Nairobi', -1.2864, 36.8172, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-200', 'Mombasa', -4.0435, 39.6682, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-300', 'Kisumu', -0.0917, 34.7680, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-400', 'Nakuru', -0.3031, 36.0800, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-500', 'Uasin Gishu', 0.5333, 35.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-600', 'Kiambu', -1.0317, 36.8350, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-700', 'Machakos', -1.5177, 37.2634, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-800', 'Kakamega', 0.2827, 34.7519, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-900', 'Kilifi', -3.5106, 39.9094, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1000', 'Bungoma', 0.5635, 34.5606, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1100', 'Garissa', -0.4536, 39.6401, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1200', 'Kitui', -1.3667, 38.0167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1300', 'Nyeri', -0.4197, 36.9475, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1400', 'Busia', 0.4350, 34.2478, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1500', 'Turkana', 3.3100, 35.5650, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1600', 'West Pokot', 1.6206, 35.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1700', 'Samburu', 1.2153, 36.9456, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1800', 'Trans Nzoia', 1.0517, 34.9503, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-1900', 'Nandi', 0.1836, 35.1269, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2000', 'Baringo', 0.6667, 36.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2100', 'Laikipia', 0.3619, 36.7819, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2200', 'Kajiado', -2.0978, 36.7820, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2300', 'Kericho', -0.3678, 35.2839, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2400', 'Bomet', -0.8000, 35.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2500', 'Kwale', -4.1742, 39.4521, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2600', 'Taita-Taveta', -3.3167, 38.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2700', 'Lamu', -2.2717, 40.9020, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2800', 'Tana River', -1.5667, 39.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-2900', 'Embu', -0.5389, 37.4575, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3000', 'Isiolo', 0.3556, 38.4822, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3100', 'Meru', 0.3500, 37.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3200', 'Tharaka-Nithi', -0.2767, 37.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3300', 'Marsabit', 2.3333, 37.9833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3400', 'Mandera', 3.5500, 41.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3500', 'Wajir', 1.7500, 40.0667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3600', 'Siaya', 0.0622, 34.2864, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3700', 'Kisii', -0.6775, 34.7800, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3800', 'Homa Bay', -0.5167, 34.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-3900', 'Migori', -1.0633, 34.4733, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4000', 'Nyamira', -0.5667, 34.9333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4100', 'Narok', -1.0833, 35.8667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4200', 'Muranga', -0.7833, 37.0333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4300', 'Kirinyaga', -0.6500, 37.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4400', 'Nyandarua', -0.1833, 36.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4500', 'Makueni', -2.2667, 37.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4600', 'Vihiga', 0.0667, 34.7167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE'
UNION ALL
SELECT id, 'KE-4700', 'Elgeyo-Marakwet', 0.8667, 35.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'KE';
-- LESOTHO (10 districts)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'LS-A', 'Maseru', -29.3167, 27.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-B', 'Butha-Buthe', -28.7667, 28.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-C', 'Leribe', -28.8717, 28.0489, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-D', 'Berea', -29.1500, 27.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-E', 'Mafeteng', -29.8167, 27.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-F', 'Mohale''s Hoek', -30.1500, 27.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-G', 'Quthing', -30.4000, 27.7000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-H', 'Qacha''s Nek', -30.1167, 28.6833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-J', 'Mokhotlong', -29.2833, 29.0667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS'
UNION ALL
SELECT id, 'LS-K', 'Thaba-Tseka', -29.5167, 28.6083, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LS';

-- LIBÉRIA (15 comtés)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'LR-MO', 'Montserrado', 6.5500, -10.5500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-NI', 'Nimba', 7.0000, -8.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-BG', 'Bong', 6.8333, -9.3667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-GP', 'Gbarpolu', 7.4950, -10.0806, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-LO', 'Lofa', 8.1917, -9.7231, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-MG', 'Margibi', 6.5167, -10.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-MY', 'Maryland', 4.7333, -7.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-CM', 'Grand Cape Mount', 7.0467, -11.0711, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-GB', 'Grand Bassa', 6.2306, -9.8122, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-GG', 'Grand Gedeh', 5.9222, -8.2211, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-GK', 'Grand Kru', 4.7617, -8.2211, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-BM', 'Bomi', 6.7561, -10.8450, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-RI', 'River Cess', 5.9025, -9.4564, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-RG', 'River Gee', 5.2606, -7.8722, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR'
UNION ALL
SELECT id, 'LR-SI', 'Sinoe', 5.4989, -8.6603, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LR';

-- LIBYE (22 districts)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'LY-TB', 'Tripoli', 32.8872, 13.1913, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-BA', 'Benghazi', 32.1167, 20.0686, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-MI', 'Misrata', 32.3754, 15.0925, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-BU', 'Al Butnan', 31.6167, 24.9667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-DR', 'Derna', 32.7500, 22.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-JA', 'Al Jabal al Akhdar', 32.8167, 21.8500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-JG', 'Al Jabal al Gharbi', 31.9500, 12.8000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-JI', 'Al Jafara', 32.4333, 13.1000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-JU', 'Al Jufrah', 27.0333, 16.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-KF', 'Al Kufrah', 24.1833, 23.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-MJ', 'Al Marj', 32.4917, 20.8306, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-MB', 'Al Marqab', 32.7500, 14.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-WA', 'Al Wahat', 29.0333, 21.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-NQ', 'An Nuqat al Khams', 32.6333, 12.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-ZA', 'Az Zawiyah', 32.7583, 12.7278, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-GT', 'Ghat', 24.9667, 10.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-MQ', 'Murzuq', 25.9167, 13.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-NL', 'Nalut', 31.8667, 10.9833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-SB', 'Sabha', 27.0377, 14.4283, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-SR', 'Surt', 31.2089, 16.5887, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-WD', 'Wadi al Hayaa', 26.4167, 12.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY'
UNION ALL
SELECT id, 'LY-WS', 'Wadi ash Shati', 27.7333, 12.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'LY';

-- MADAGASCAR (6 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MG-T', 'Antananarivo', -18.9333, 47.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG'
UNION ALL
SELECT id, 'MG-D', 'Antsiranana', -12.2787, 49.2917, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG'
UNION ALL
SELECT id, 'MG-F', 'Fianarantsoa', -21.4500, 47.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG'
UNION ALL
SELECT id, 'MG-M', 'Mahajanga', -15.7167, 46.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG'
UNION ALL
SELECT id, 'MG-A', 'Toamasina', -18.1492, 49.4022, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG'
UNION ALL
SELECT id, 'MG-U', 'Toliara', -23.3500, 43.6833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MG';

-- MALAWI (28 districts)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MW-C', 'Région Centre', -13.9833, 33.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-N', 'Région Nord', -11.4167, 34.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-S', 'Région Sud', -15.7833, 35.0167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-BA', 'Balaka', -14.9833, 34.9500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-BL', 'Blantyre', -15.7850, 35.0085, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-CK', 'Chikwawa', -16.0333, 34.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-CR', 'Chiradzulu', -15.6833, 35.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-CT', 'Chitipa', -9.7000, 33.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-DE', 'Dedza', -14.3783, 34.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-DO', 'Dowa', -13.6500, 33.9333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-KR', 'Karonga', -9.9333, 33.9333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-KS', 'Kasungu', -13.0333, 33.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-LI', 'Lilongwe', -13.9833, 33.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-LK', 'Likoma', -12.0583, 34.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MC', 'Mchinji', -13.8000, 32.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MG', 'Mangochi', -14.4667, 35.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MH', 'Machinga', -14.9667, 35.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MU', 'Mulanje', -16.0333, 35.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MW', 'Mwanza', -15.6167, 34.5333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-MZ', 'Mzimba', -11.9000, 33.6000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NB', 'Nkhata Bay', -11.6083, 34.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NE', 'Neno', -15.4000, 34.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NI', 'Ntchisi', -13.5167, 33.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NK', 'Nkhotakota', -12.9167, 34.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NS', 'Nsanje', -16.9167, 35.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-NU', 'Ntcheu', -14.8333, 34.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-PH', 'Phalombe', -15.8000, 35.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-RU', 'Rumphi', -10.8833, 34.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-SA', 'Salima', -13.7833, 34.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-TH', 'Thyolo', -16.0667, 35.1333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW'
UNION ALL
SELECT id, 'MW-ZO', 'Zomba', -15.3833, 35.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MW';

-- MALI (10 régions + 1 district)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ML-BKO', 'Bamako', 12.6392, -8.0029, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-1', 'Kayes', 14.4467, -11.4447, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-2', 'Koulikoro', 13.5500, -7.5600, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-3', 'Sikasso', 11.3167, -5.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-4', 'Ségou', 13.4317, -6.2633, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-5', 'Mopti', 14.4914, -4.1961, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-6', 'Tombouctou', 20.0000, -3.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-7', 'Gao', 16.2667, 0.0500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-8', 'Kidal', 18.4414, 1.4078, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-9', 'Ménaka', 15.9167, 2.4000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML'
UNION ALL
SELECT id, 'ML-10', 'Taoudénit', 22.6767, -3.9850, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ML';

-- MAURITANIE (15 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MR-NKC', 'Nouakchott', 18.0735, -15.9582, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-07', 'Adrar', 20.5022, -10.0711, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-03', 'Assaba', 16.7800, -11.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-05', 'Brakna', 17.2333, -13.1667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-08', 'Dakhlet Nouadhibou', 20.9000, -17.0333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-04', 'Gorgol', 15.9667, -12.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-10', 'Guidimaka', 15.2500, -12.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-01', 'Hodh Ech Chargui', 18.6833, -7.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-02', 'Hodh El Gharbi', 16.6833, -9.5333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-12', 'Inchiri', 20.0167, -15.4000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-13', 'Nouakchott Nord', 18.1500, -15.9500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-14', 'Nouakchott Ouest', 18.1167, -16.0167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-15', 'Nouakchott Sud', 17.9833, -15.9667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-09', 'Tagant', 18.5500, -9.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-11', 'Tiris Zemmour', 24.5833, -9.8500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR'
UNION ALL
SELECT id, 'MR-06', 'Trarza', 17.8667, -14.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MR';

-- MAURICE (9 districts + 3 dépendances)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MU-PL', 'Port-Louis', -20.1644, 57.5047, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-BL', 'Black River', -20.3667, 57.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-FL', 'Flacq', -20.2167, 57.7167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-GP', 'Grand Port', -20.4167, 57.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-MO', 'Moka', -20.2333, 57.5667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-PA', 'Pamplemousses', -20.1000, 57.5667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-PW', 'Plaines Wilhems', -20.3000, 57.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-RR', 'Rivière du Rempart', -20.0500, 57.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-SA', 'Savanne', -20.4833, 57.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-AG', 'Agalega', -10.4167, 56.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-RO', 'Rodrigues', -19.7167, 63.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU'
UNION ALL
SELECT id, 'MU-CC', 'Îles Cargados Carajos', -16.5833, 59.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MU';

-- MAROC (12 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MA-01', 'Tanger-Tétouan-Al Hoceïma', 35.5889, -5.3626, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-02', 'Oriental', 34.6814, -2.9336, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-03', 'Fès-Meknès', 33.9716, -5.0033, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-04', 'Rabat-Salé-Kénitra', 34.0181, -6.8411, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-05', 'Béni Mellal-Khénifra', 32.3372, -6.3498, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-06', 'Casablanca-Settat', 33.5731, -7.5898, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-07', 'Marrakech-Safi', 31.6295, -8.0089, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-08', 'Drâa-Tafilalet', 31.9314, -5.3330, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-09', 'Souss-Massa', 30.4211, -9.5981, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-10', 'Guelmim-Oued Noun', 28.9833, -10.0578, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-11', 'Laâyoune-Sakia El Hamra', 27.1536, -13.2033, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA'
UNION ALL
SELECT id, 'MA-12', 'Dakhla-Oued Ed-Dahab', 23.7144, -15.9582, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MA';

-- MOZAMBIQUE (11 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MZ-P', 'Maputo', -25.9653, 32.5892, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-MPM', 'Maputo (ville)', -25.9692, 32.5731, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-G', 'Gaza', -24.0500, 33.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-I', 'Inhambane', -23.8650, 35.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-S', 'Sofala', -19.8333, 34.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-B', 'Manica', -19.1333, 32.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-T', 'Tete', -16.1564, 33.5867, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-Q', 'Zambezia', -16.0500, 37.1167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-N', 'Nampula', -15.1194, 39.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-A', 'Niassa', -13.0167, 36.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ'
UNION ALL
SELECT id, 'MZ-L', 'Cabo Delgado', -12.3333, 39.5333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'MZ';

-- NAMIBIE (14 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'NA-ER', 'Erongo', -22.0000, 15.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-HA', 'Hardap', -24.5000, 18.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-KA', 'Karas', -27.0000, 18.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-KE', 'Kavango Est', -18.3333, 20.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-KW', 'Kavango Ouest', -18.0000, 18.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-KH', 'Khomas', -22.5667, 17.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-KU', 'Kunene', -19.0000, 14.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-OW', 'Ohangwena', -17.5833, 16.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-OH', 'Omaheke', -21.5000, 19.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-OS', 'Omusati', -18.2500, 15.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-ON', 'Oshana', -18.4167, 15.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-OT', 'Oshikoto', -18.4167, 16.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-OD', 'Otjozondjupa', -20.0000, 17.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA'
UNION ALL
SELECT id, 'NA-CA', 'Zambezi', -17.5000, 24.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NA';

-- NIGER (8 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'NE-1', 'Agadez', 18.0000, 9.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-2', 'Diffa', 13.3156, 12.6113, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-3', 'Dosso', 13.0450, 3.1939, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-4', 'Maradi', 13.5000, 7.1017, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-8', 'Niamey', 13.5127, 2.1128, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-5', 'Tahoua', 15.0000, 5.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-6', 'Tillabéri', 14.2119, 1.4528, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE'
UNION ALL
SELECT id, 'NE-7', 'Zinder', 13.8000, 8.9889, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NE';

-- NIGÉRIA (36 États + 1 territoire)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'NG-FC', 'Territoire de la capitale fédérale', 9.0765, 7.3986, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-AB', 'Abia', 5.4527, 7.5248, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-AD', 'Adamawa', 9.3265, 12.3984, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-AK', 'Akwa Ibom', 4.9057, 7.8537, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-AN', 'Anambra', 6.2209, 6.9370, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-BA', 'Bauchi', 10.7730, 9.9991, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-BY', 'Bayelsa', 4.7719, 6.0699, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-BE', 'Benue', 7.3373, 8.7404, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-BO', 'Borno', 11.8333, 13.1500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-CR', 'Cross River', 5.8735, 8.5989, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-DE', 'Delta', 5.6802, 5.9240, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-EB', 'Ebonyi', 6.2649, 8.0137, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-ED', 'Edo', 6.6345, 5.9366, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-EK', 'Ekiti', 7.7190, 5.3110, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-EN', 'Enugu', 6.5333, 7.4333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-GO', 'Gombe', 10.2896, 11.1670, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-IM', 'Imo', 5.5720, 7.0588, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-JI', 'Jigawa', 12.2289, 9.5619, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KD', 'Kaduna', 10.3759, 7.7064, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KN', 'Kano', 11.7480, 8.5219, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KT', 'Katsina', 12.3708, 7.6006, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KE', 'Kebbi', 11.4942, 4.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KO', 'Kogi', 7.7333, 6.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-KW', 'Kwara', 8.9670, 4.3828, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-LA', 'Lagos', 6.5244, 3.3792, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-NA', 'Nasarawa', 8.4970, 8.1963, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-NI', 'Niger', 9.9315, 5.5980, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-OG', 'Ogun', 6.9978, 3.4719, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-ON', 'Ondo', 6.9149, 5.1478, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-OS', 'Osun', 7.5629, 4.5200, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-OY', 'Oyo', 8.1575, 3.6173, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-PL', 'Plateau', 9.2182, 9.5179, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-RI', 'Rivers', 4.8396, 6.9115, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-SO', 'Sokoto', 13.0622, 5.2430, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-TA', 'Taraba', 7.9999, 10.7739, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-YO', 'Yobe', 12.2941, 11.4395, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG'
UNION ALL
SELECT id, 'NG-ZA', 'Zamfara', 12.1203, 6.2202, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'NG';

-- RWANDA (5 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'RW-01', 'Kigali', -1.9536, 30.0606, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'RW'
UNION ALL
SELECT id, 'RW-02', 'Est', -2.0000, 30.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'RW'
UNION ALL
SELECT id, 'RW-03', 'Nord', -1.5833, 29.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'RW'
UNION ALL
SELECT id, 'RW-04', 'Ouest', -2.2500, 29.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'RW'
UNION ALL
SELECT id, 'RW-05', 'Sud', -2.5833, 29.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'RW';

-- SAO TOMÉ-ET-PRINCIPE (2 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ST-P', 'Príncipe', 1.6140, 7.4056, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ST'
UNION ALL
SELECT id, 'ST-S', 'São Tomé', 0.3302, 6.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ST';

-- SÉNÉGAL (14 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SN-DK', 'Dakar', 14.7167, -17.4677, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-DB', 'Diourbel', 14.6500, -16.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-FK', 'Fatick', 14.3389, -16.4111, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-KA', 'Kaffrine', 14.1069, -15.5506, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-KL', 'Kaolack', 14.1500, -16.0800, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-KE', 'Kédougou', 12.5500, -12.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-KD', 'Kolda', 12.8956, -14.9506, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-LG', 'Louga', 15.6147, -16.2289, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-MT', 'Matam', 15.6558, -13.2553, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-SL', 'Saint-Louis', 16.0300, -16.0300, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-SE', 'Sédhiou', 12.7086, -15.5569, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-TC', 'Tambacounda', 13.7667, -13.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-TH', 'Thiès', 14.7886, -16.9261, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN'
UNION ALL
SELECT id, 'SN-ZG', 'Ziguinchor', 12.5636, -16.2722, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SN';

-- SEYCHELLES (26 districts regroupés en régions principales)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SC-01', 'Anse aux Pins', -4.6931, 55.5158, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-02', 'Anse Boileau', -4.7167, 55.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-03', 'Anse Etoile', -4.5833, 55.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-04', 'Au Cap', -4.6333, 55.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-05', 'Anse Royale', -4.7333, 55.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-06', 'Baie Lazare', -4.7500, 55.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-07', 'Baie Sainte Anne', -4.3667, 55.7333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-08', 'Beau Vallon', -4.6167, 55.4333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-09', 'Bel Air', -4.6167, 55.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-10', 'Bel Ombre', -4.6333, 55.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-11', 'Cascade', -4.6667, 55.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-12', 'Glacis', -4.5833, 55.4333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-13', 'Grand Anse Mahé', -4.6833, 55.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-14', 'Grand Anse Praslin', -4.3167, 55.7000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-15', 'La Digue', -4.3500, 55.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-16', 'English River', -4.6167, 55.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-17', 'Mont Buxton', -4.6000, 55.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-18', 'Mont Fleuri', -4.6333, 55.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-19', 'Plaisance', -4.6167, 55.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-20', 'Pointe Larue', -4.6667, 55.5333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-21', 'Port Glaud', -4.6500, 55.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-22', 'Saint Louis', -4.6333, 55.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-23', 'Takamaka', -4.7667, 55.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-24', 'Les Mamelles', -4.6500, 55.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-25', 'Roche Caïman', -4.6333, 55.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC'
UNION ALL
SELECT id, 'SC-26', 'Ile Perseverance', -4.6500, 55.4667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SC';

-- SIERRA LEONE (5 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SL-W', 'Western Area', 8.4845, -13.2342, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SL'
UNION ALL
SELECT id, 'SL-E', 'Est', 8.1500, -11.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SL'
UNION ALL
SELECT id, 'SL-N', 'Nord', 9.0500, -12.0333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SL'
UNION ALL
SELECT id, 'SL-NW', 'Nord-Ouest', 9.2000, -12.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SL'
UNION ALL
SELECT id, 'SL-S', 'Sud', 7.8833, -11.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SL';

-- SOMALIE (18 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SO-AW', 'Awdal', 10.6333, 43.3167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-BK', 'Bakool', 4.3667, 44.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-BN', 'Banaadir', 2.0469, 45.3182, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-BR', 'Bari', 10.8333, 50.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-BY', 'Bay', 3.1667, 43.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-GA', 'Galguduud', 5.1833, 46.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-GE', 'Gedo', 3.5000, 42.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-HI', 'Hiiraan', 4.3333, 45.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-JD', 'Jubbada Dhexe', 2.6333, 42.5500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-JH', 'Jubbada Hoose', 0.2250, 42.5467, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-MU', 'Mudug', 6.5667, 47.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-NU', 'Nugaal', 8.3667, 49.2667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-SA', 'Sanaag', 10.4000, 47.6333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-SD', 'Shabeellaha Dhexe', 2.3000, 45.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-SH', 'Shabeellaha Hoose', 1.7333, 44.2333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-SO', 'Sool', 8.8333, 47.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-TO', 'Togdheer', 9.4167, 45.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO'
UNION ALL
SELECT id, 'SO-WO', 'Woqooyi Galbeed', 10.0833, 44.0500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SO';

-- AFRIQUE DU SUD (9 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ZA-EC', 'Cap-Oriental', -32.2968, 26.4194, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-FS', 'État-Libre', -28.7282, 26.2726, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-GP', 'Gauteng', -26.2708, 28.1123, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-KZN', 'KwaZulu-Natal', -28.5305, 30.8958, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-LP', 'Limpopo', -23.4013, 29.4179, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-MP', 'Mpumalanga', -25.5653, 30.5279, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-NC', 'Cap-du-Nord', -29.0467, 21.8569, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-NW', 'Nord-Ouest', -26.6708, 25.2837, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA'
UNION ALL
SELECT id, 'ZA-WC', 'Cap-Occidental', -33.2277, 21.8568, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZA';

-- SOUDAN DU SUD (10 États)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SS-EC', 'Équatoria-Central', 4.6167, 31.2000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-EE', 'Équatoria-Oriental', 4.8167, 33.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-EW', 'Équatoria-Occidental', 4.9167, 28.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-JG', 'Jonglei', 7.3167, 32.3500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-LK', 'Lacs', 6.8333, 30.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-BN', 'Bahr el Ghazal du Nord', 8.6667, 27.9833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-UY', 'Unité', 9.2667, 30.2167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-NU', 'Haut-Nil', 9.8833, 32.7167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-WR', 'Warab', 8.1167, 28.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS'
UNION ALL
SELECT id, 'SS-BW', 'Bahr el Ghazal Occidental', 8.5000, 25.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SS';

-- SOUDAN (18 États)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'SD-KH', 'Khartoum', 15.5007, 32.5599, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-GZ', 'Al Jazirah', 14.4000, 33.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-NR', 'An Nil', 15.7000, 32.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-NW', 'An Nil al Abyad', 13.0000, 32.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-NB', 'An Nil al Azraq', 12.0000, 34.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-NO', 'Ash Shamaliyah', 19.7000, 30.2000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-GD', 'Al Qadarif', 14.0350, 35.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-GK', 'Gharb Kurdufan', 12.8667, 28.2167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-KA', 'Kassala', 15.4500, 36.4000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-KN', 'Shamal Kurdufan', 13.8167, 29.4167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-KS', 'Janub Kurdufan', 11.0000, 29.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-DN', 'Shamal Darfur', 15.0000, 24.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-DS', 'Janub Darfur', 11.6500, 24.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-DW', 'Gharb Darfur', 12.8333, 22.8833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-DE', 'Sharq Darfur', 14.0000, 27.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-DC', 'Wasat Darfur', 13.0000, 23.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-RS', 'Al Bahr al Ahmar', 18.8667, 37.2167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD'
UNION ALL
SELECT id, 'SD-SI', 'Sannar', 13.5667, 33.6167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'SD';

-- TANZANIE (31 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'TZ-01', 'Arusha', -3.3869, 36.6830, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-02', 'Dar es Salaam', -6.7924, 39.2083, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-03', 'Dodoma', -6.1630, 35.7516, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-04', 'Iringa', -7.7700, 35.6900, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-05', 'Kagera', -1.3000, 31.2600, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-06', 'Pemba Nord', -4.8667, 39.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-07', 'Zanzibar Nord', -5.9167, 39.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-08', 'Kigoma', -4.8800, 29.6300, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-09', 'Kilimanjaro', -3.3667, 37.3500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-10', 'Pemba Sud', -5.3167, 39.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-11', 'Zanzibar Sud', -6.1333, 39.3333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-12', 'Lindi', -10.0000, 39.7167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-13', 'Mara', -1.7750, 34.8689, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-14', 'Mbeya', -8.9000, 33.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-15', 'Morogoro', -6.8211, 37.6636, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-16', 'Mtwara', -10.2700, 40.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-17', 'Mwanza', -2.5167, 32.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-18', 'Pwani', -6.9167, 38.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-19', 'Rukwa', -7.9667, 31.4000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-20', 'Ruvuma', -10.6167, 36.3000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-21', 'Shinyanga', -3.6636, 33.4211, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-22', 'Singida', -4.8167, 34.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-23', 'Tabora', -5.0167, 32.8000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-24', 'Tanga', -5.0686, 38.3689, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-25', 'Zanzibar Ouest', -6.2278, 39.2139, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-26', 'Geita', -2.8711, 32.2269, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-27', 'Katavi', -6.3667, 31.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-28', 'Njombe', -9.3333, 34.7667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-29', 'Simiyu', -3.0000, 34.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-30', 'Songwe', -9.2000, 32.8000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ'
UNION ALL
SELECT id, 'TZ-31', 'Manyara', -4.3000, 36.7500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TZ';

-- TOGO (5 régions)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'TG-C', 'Centrale', 9.0000, 0.9167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TG'
UNION ALL
SELECT id, 'TG-K', 'Kara', 9.5500, 1.1833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TG'
UNION ALL
SELECT id, 'TG-M', 'Maritime', 6.3333, 1.2000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TG'
UNION ALL
SELECT id, 'TG-P', 'Plateaux', 7.5333, 0.9000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TG'
UNION ALL
SELECT id, 'TG-S', 'Savanes', 10.5167, 0.4500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TG';

-- TUNISIE (24 gouvernorats)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'TN-11', 'Tunis', 36.8065, 10.1815, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-12', 'Ariana', 36.8625, 10.1956, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-13', 'Ben Arous', 36.7528, 10.2281, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-14', 'La Manouba', 36.8081, 10.0975, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-21', 'Nabeul', 36.4561, 10.7356, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-22', 'Zaghouan', 36.4028, 10.1425, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-23', 'Bizerte', 37.2744, 9.8739, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-31', 'Béja', 36.7256, 9.1817, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-32', 'Jendouba', 36.5011, 8.7806, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-33', 'Le Kef', 36.1742, 8.7050, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-34', 'Siliana', 36.0850, 9.3706, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-41', 'Kairouan', 35.6781, 10.0967, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-42', 'Kasserine', 35.1672, 8.8306, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-43', 'Sidi Bouzid', 35.0381, 9.4839, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-51', 'Sousse', 35.8256, 10.6411, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-52', 'Monastir', 35.7772, 10.8264, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-53', 'Mahdia', 35.5047, 11.0622, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-61', 'Sfax', 34.7406, 10.7603, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-71', 'Gafsa', 34.4250, 8.7842, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-72', 'Tozeur', 33.9197, 8.1339, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-73', 'Kébili', 33.7050, 8.9700, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-81', 'Gabès', 33.8815, 10.0982, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-82', 'Médenine', 33.3545, 10.5053, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN'
UNION ALL
SELECT id, 'TN-83', 'Tataouine', 32.9297, 10.4517, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'TN';

-- OUGANDA (134 districts regroupés en 4 régions principales)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'UG-C', 'Région Centrale', 0.3476, 32.5825, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-E', 'Région Est', 1.0000, 33.8000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-N', 'Région Nord', 2.7500, 32.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-W', 'Région Ouest', 0.2500, 30.2500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-101', 'Kampala', 0.3136, 32.5811, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-102', 'Wakiso', 0.4044, 32.4594, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-103', 'Mukono', 0.3536, 32.7556, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-201', 'Jinja', 0.4244, 33.2042, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-202', 'Mbale', 1.0820, 34.1753, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-301', 'Gulu', 2.7747, 32.2992, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-302', 'Lira', 2.2497, 32.8986, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-401', 'Mbarara', -0.6031, 30.6581, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-402', 'Fort Portal', 0.6711, 30.2750, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG'
UNION ALL
SELECT id, 'UG-403', 'Kasese', 0.1833, 30.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'UG';

-- ZAMBIE (10 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ZM-01', 'Région Ouest', -15.4167, 23.1167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-02', 'Central', -14.4833, 28.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-03', 'Copperbelt', -12.8389, 27.8167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-04', 'Est', -13.6333, 32.6500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-05', 'Luapula', -11.4167, 29.0833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-06', 'Lusaka', -15.4167, 28.2833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-07', 'Muchinga', -11.0000, 31.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-08', 'Nord', -10.0667, 31.3833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-09', 'Nord-Ouest', -12.1667, 25.8500, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM'
UNION ALL
SELECT id, 'ZM-10', 'Sud', -16.8167, 26.4833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZM';

-- ZIMBABWE (10 provinces)
INSERT INTO localisation.provinces (pays_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'ZW-BU', 'Bulawayo', -20.1500, 28.5833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-HA', 'Harare', -17.8252, 31.0335, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MA', 'Manicaland', -18.9167, 32.6667, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MC', 'Mashonaland Central', -16.7667, 31.1167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-ME', 'Mashonaland East', -18.0000, 31.5000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MI', 'Midlands', -19.0500, 29.8167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MN', 'Matabeleland North', -18.5333, 27.5167, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MS', 'Matabeleland South', -21.0500, 29.0000, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MV', 'Masvingo', -20.0667, 30.8333, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW'
UNION ALL
SELECT id, 'ZW-MW', 'Mashonaland West', -17.2167, 29.7833, FALSE, FALSE FROM localisation.pays WHERE code_iso_2 = 'ZW';




-- Data Districtes Burundu

-- =====================================================
-- DISTRICTS DU BURUNDI (par province)
-- =====================================================

-- BUBANZA (5 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BBZ-01', 'Bubanza', -3.0833, 29.3833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BB'
UNION ALL
SELECT id, 'BBZ-02', 'Gihanga', -3.1500, 29.3000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BB'
UNION ALL
SELECT id, 'BBZ-03', 'Musigati', -2.9167, 29.5000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BB'
UNION ALL
SELECT id, 'BBZ-04', 'Mpanda', -3.2000, 29.4500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BB'
UNION ALL
SELECT id, 'BBZ-05', 'Rugazi', -3.0000, 29.2500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BB';

-- BUJUMBURA MAIRIE (13 communes/zones)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BJM-01', 'Mukaza', -3.3822, 29.3644, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-02', 'Muha', -3.3950, 29.3800, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-03', 'Ntahangwa', -3.3500, 29.3500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-04', 'Kamenge', -3.3400, 29.3500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-05', 'Ngagara', -3.3600, 29.3600, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-06', 'Nyakabiga', -3.3700, 29.3700, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-07', 'Kanyosha', -3.4500, 29.3500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-08', 'Kinama', -3.3300, 29.3600, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-09', 'Cibitoke', -3.3450, 29.3450, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-10', 'Gihosha', -3.3900, 29.3900, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-11', 'Buterere', -3.3200, 29.3700, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-12', 'Musaga', -3.4000, 29.3700, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM'
UNION ALL
SELECT id, 'BJM-13', 'Rohero', -3.3750, 29.3650, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BM';

-- BUJUMBURA RURAL (10 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BJR-01', 'Isale', -3.4167, 29.4167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-02', 'Kabezi', -3.4833, 29.4500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-03', 'Kanyosha', -3.4333, 29.3667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-04', 'Muhuta', -3.3667, 29.4833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-05', 'Mukike', -3.5833, 29.4167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-06', 'Mutambu', -3.5333, 29.5000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-07', 'Mutimbuzi', -3.3167, 29.3167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-08', 'Nyabiraba', -3.6167, 29.3833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-09', 'Mubimbi', -3.5667, 29.3500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL'
UNION ALL
SELECT id, 'BJR-10', 'Mugongo-Manga', -3.4500, 29.5167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BL';

-- BURURI (7 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'BRR-01', 'Bururi', -3.9500, 29.6167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-02', 'Buyengero', -3.8500, 29.5833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-03', 'Matana', -3.7833, 29.7167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-04', 'Mugamba', -3.8667, 29.6833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-05', 'Rutovu', -4.0167, 29.7000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-06', 'Songa', -4.0833, 29.5500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR'
UNION ALL
SELECT id, 'BRR-07', 'Vyanda', -4.0500, 29.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-BR';

-- CANKUZO (5 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CKZ-01', 'Cankuzo', -3.2167, 30.6000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CA'
UNION ALL
SELECT id, 'CKZ-02', 'Cendajuru', -3.1333, 30.5500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CA'
UNION ALL
SELECT id, 'CKZ-03', 'Gisagara', -3.2833, 30.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CA'
UNION ALL
SELECT id, 'CKZ-04', 'Kigamba', -3.1667, 30.6667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CA'
UNION ALL
SELECT id, 'CKZ-05', 'Mishiha', -3.3000, 30.5667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CA';

-- CIBITOKE (6 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'CBT-01', 'Buganda', -2.7167, 29.1667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI'
UNION ALL
SELECT id, 'CBT-02', 'Bukinanyana', -2.9833, 29.2667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI'
UNION ALL
SELECT id, 'CBT-03', 'Mabayi', -2.9333, 29.0833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI'
UNION ALL
SELECT id, 'CBT-04', 'Mugina', -2.8500, 29.2000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI'
UNION ALL
SELECT id, 'CBT-05', 'Murwi', -3.0333, 29.1167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI'
UNION ALL
SELECT id, 'CBT-06', 'Rugombo', -2.8167, 29.0500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-CI';

-- GITEGA (11 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'GTG-01', 'Gitega', -3.4271, 29.9246, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-02', 'Bugendana', -3.3333, 29.8833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-03', 'Bukirasazi', -3.3667, 30.0167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-04', 'Buraza', -3.2500, 29.9500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-05', 'Giheta', -3.2833, 30.0833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-06', 'Gishubi', -3.5833, 29.8667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-07', 'Itaba', -3.5500, 29.9833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-08', 'Makebuko', -3.3500, 29.7667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-09', 'Mutaho', -3.5167, 30.0500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-10', 'Nyarusange', -3.2167, 30.0000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI'
UNION ALL
SELECT id, 'GTG-11', 'Ryansoro', -3.4667, 29.8000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-GI';

-- KIRUNDO (7 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'KRD-01', 'Kirundo', -2.5833, 30.1000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-02', 'Bugabira', -2.4667, 30.0500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-03', 'Busoni', -2.6333, 30.1833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-04', 'Gitobe', -2.7167, 30.2167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-05', 'Ntega', -2.6833, 30.0333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-06', 'Vumbi', -2.5167, 30.2333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR'
UNION ALL
SELECT id, 'KRD-07', 'Bwambarangwe', -2.5500, 30.1500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KR';

-- KARUZI (10 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'KRZ-01', 'Buhiga', -3.0500, 30.2500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-02', 'Bugenyuzi', -3.1167, 30.3167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-03', 'Gihogazi', -3.1833, 30.0833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-04', 'Gitaramuka', -3.0167, 30.1333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-05', 'Mutumba', -3.0833, 30.1000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-06', 'Ndava', -3.2167, 30.2333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-07', 'Nyabikere', -3.1500, 30.1500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-08', 'Shombo', -3.2500, 30.0500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-09', 'Karuzi', -3.1000, 30.1667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY'
UNION ALL
SELECT id, 'KRZ-10', 'Buhinyuza', -3.0333, 30.3833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KY';

-- KAYANZA (11 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'KYZ-01', 'Butaganzwa', -2.8333, 29.6833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-02', 'Gahombo', -3.0167, 29.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-03', 'Gatara', -2.9333, 29.7500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-04', 'Kabarore', -2.8667, 29.5667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-05', 'Kayanza', -2.9167, 29.6167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-06', 'Matongo', -2.9667, 29.5333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-07', 'Muhanga', -2.8833, 29.8167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-08', 'Muruta', -2.9833, 29.7833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-09', 'Rango', -2.7833, 29.6167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-10', 'Bukeye', -2.8000, 29.7333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI'
UNION ALL
SELECT id, 'KYZ-11', 'Mukike', -2.7500, 29.5500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-KI';

-- MAKAMBA (8 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MKB-01', 'Kayogoro', -4.0000, 29.9167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-02', 'Kibago', -4.1833, 29.8333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-03', 'Makamba', -4.1333, 29.8000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-04', 'Mabanda', -4.3333, 29.7500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-05', 'Nyanza-Lac', -4.2833, 29.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-06', 'Vugizo', -4.0833, 29.7167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-07', 'Mbuye', -4.1500, 29.9500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA'
UNION ALL
SELECT id, 'MKB-08', 'Vurura', -4.0500, 29.8500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MA';

-- MURAMVYA (5 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MRV-01', 'Bukeye', -3.2333, 29.5833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MU'
UNION ALL
SELECT id, 'MRV-02', 'Kiganda', -3.1833, 29.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MU'
UNION ALL
SELECT id, 'MRV-03', 'Mbuye', -3.3167, 29.7000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MU'
UNION ALL
SELECT id, 'MRV-04', 'Muramvya', -3.2667, 29.6167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MU'
UNION ALL
SELECT id, 'MRV-05', 'Rutegama', -3.3833, 29.5500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MU';

-- MUYINGA (8 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MYG-01', 'Buhinyuza', -2.8000, 30.4500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-02', 'Butihinda', -2.9667, 30.4167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-03', 'Gasogwe', -2.7333, 30.2167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-04', 'Gatyazo', -2.9167, 30.2833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-05', 'Giteranyi', -2.8167, 30.3333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-06', 'Muyinga', -2.8500, 30.3333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-07', 'Mwakiro', -2.9333, 30.5000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY'
UNION ALL
SELECT id, 'MYG-08', 'Ndago', -2.7667, 30.3667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MY';

-- MWARO (5 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MWR-01', 'Bisoro', -3.5833, 29.6333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MW'
UNION ALL
SELECT id, 'MWR-02', 'Gisozi', -3.4500, 29.7833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MW'
UNION ALL
SELECT id, 'MWR-03', 'Kayokwe', -3.6333, 29.7500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MW'
UNION ALL
SELECT id, 'MWR-04', 'Mwaro', -3.5000, 29.7000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MW'
UNION ALL
SELECT id, 'MWR-05', 'Rusaka', -3.4167, 29.6500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-MW';

-- NGOZI (9 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'NGZ-01', 'Busiga', -2.8167, 29.8833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-02', 'Gashikanwa', -2.7833, 29.7667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-03', 'Kiremba', -2.9500, 29.7167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-04', 'Marangara', -2.8667, 29.9500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-05', 'Mwumba', -2.9833, 29.8500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-06', 'Ngozi', -2.9083, 29.8306, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-07', 'Nyamurenze', -2.8333, 29.7167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-08', 'Ruhororo', -2.7500, 29.8167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG'
UNION ALL
SELECT id, 'NGZ-09', 'Tangara', -2.9167, 29.9667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-NG';

-- RUTANA (6 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'RTN-01', 'Bukemba', -3.8333, 30.0833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT'
UNION ALL
SELECT id, 'RTN-02', 'Giharo', -3.8667, 29.9333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT'
UNION ALL
SELECT id, 'RTN-03', 'Gitanga', -4.0500, 30.0000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT'
UNION ALL
SELECT id, 'RTN-04', 'Mpinga-Kayove', -4.0167, 29.8667, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT'
UNION ALL
SELECT id, 'RTN-05', 'Musongati', -3.9667, 30.1500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT'
UNION ALL
SELECT id, 'RTN-06', 'Rutana', -3.9333, 30.0000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RT';

-- RUYIGI (6 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'RYG-01', 'Butaganzwa', -3.3833, 30.3500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY'
UNION ALL
SELECT id, 'RYG-02', 'Butezi', -3.5500, 30.4167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY'
UNION ALL
SELECT id, 'RYG-03', 'Gisuru', -3.5167, 30.2167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY'
UNION ALL
SELECT id, 'RYG-04', 'Kinyinya', -3.3333, 30.2000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY'
UNION ALL
SELECT id, 'RYG-05', 'Nyabitsinda', -3.6167, 30.3333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY'
UNION ALL
SELECT id, 'RYG-06', 'Ruyigi', -3.4833, 30.2500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RY';

-- RUMONGE (6 communes)
INSERT INTO localisation.districts (province_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'RMG-01', 'Bugarama', -3.9000, 29.4000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM'
UNION ALL
SELECT id, 'RMG-02', 'Burambi', -3.7500, 29.4833, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM'
UNION ALL
SELECT id, 'RMG-03', 'Buyengero', -3.8667, 29.5167, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM'
UNION ALL
SELECT id, 'RMG-04', 'Muhuta', -4.0833, 29.5000, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM'
UNION ALL
SELECT id, 'RMG-05', 'Rumonge', -3.9667, 29.4333, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM'
UNION ALL
SELECT id, 'RMG-06', 'Minago', -4.0167, 29.4500, FALSE, FALSE FROM localisation.provinces WHERE code = 'BI-RM';

-- =====================================================
-- QUARTIERS/ZONES (Exemple pour Bujumbura Mairie)
-- =====================================================

-- MUKAZA - Quartiers
INSERT INTO localisation.quartiers (district_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MKZ-Q01', 'Asiatique', -3.3850, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q02', 'Buyenzi', -3.3750, 29.3650, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q03', 'Bwiza', -3.3800, 29.3750, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q04', 'Kabondo', -3.3900, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q05', 'Kinindo', -3.3950, 29.3550, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q06', 'Nyakabiga', -3.3700, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q07', 'Rohero I', -3.3750, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q08', 'Rohero II', -3.3780, 29.3620, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01'
UNION ALL
SELECT id, 'MKZ-Q09', 'Vugizo', -3.3820, 29.3680, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-01';

-- MUHA - Quartiers
INSERT INTO localisation.quartiers (district_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'MHA-Q01', 'Gasenyi', -3.4000, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q02', 'Gihosha', -3.3900, 29.3900, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q03', 'Kanyosha', -3.4200, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q04', 'Kinindo', -3.3950, 29.3800, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q05', 'Kizingwe-Bihara', -3.4100, 29.3750, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q06', 'Musaga', -3.4000, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q07', 'Nyabugogo', -3.4050, 29.3850, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02'
UNION ALL
SELECT id, 'MHA-Q08', 'Ruziba', -3.3850, 29.3950, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-02';

-- NTAHANGWA - Quartiers
INSERT INTO localisation.quartiers (district_id, code, nom, latitude_centre, longitude_centre, autorise_systeme, est_actif)
SELECT id, 'NTH-Q01', 'Buterere I', -3.3200, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q02', 'Buterere II', -3.3250, 29.3750, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q03', 'Carama', -3.3400, 29.3400, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q04', 'Cibitoke', -3.3450, 29.3450, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q05', 'Gikoto', -3.3350, 29.3550, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q06', 'Gitega', -3.3500, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q07', 'Kamenge', -3.3400, 29.3500, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q08', 'Kanyosha', -3.3300, 29.3450, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q09', 'Kinama', -3.3300, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q10', 'Maramvya', -3.3550, 29.3500, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q11', 'Mubone', -3.3600, 29.3400, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q12', 'Mutanga-Nord', -3.3650, 29.3550, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q13', 'Ngagara', -3.3600, 29.3600, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03'
UNION ALL
SELECT id, 'NTH-Q14', 'Nyakabiga', -3.3700, 29.3700, FALSE, FALSE FROM localisation.districts WHERE code = 'BJM-03';