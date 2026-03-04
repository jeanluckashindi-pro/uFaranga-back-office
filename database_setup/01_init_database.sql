-- =====================================================
-- SCRIPT 1: INITIALISATION BASE DE DONNÉES uFaranga
-- Création de la base et des extensions
-- =====================================================

-- Créer la base de données (à exécuter en tant que superuser)
-- DROP DATABASE IF EXISTS ufaranga;
-- CREATE DATABASE ufaranga
--     WITH 
--     OWNER = ufaranga
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'fr_FR.UTF-8'
--     LC_CTYPE = 'fr_FR.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Se connecter à la base ufaranga
\c ufaranga

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Génération UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Chiffrement
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Recherche full-text
CREATE EXTENSION IF NOT EXISTS "btree_gist";     -- Index temporels

-- =====================================================
-- CRÉATION DES SCHÉMAS
-- =====================================================

CREATE SCHEMA IF NOT EXISTS identite;
COMMENT ON SCHEMA identite IS 'Gestion des identités, authentification et profils utilisateurs';

CREATE SCHEMA IF NOT EXISTS bancaire;
COMMENT ON SCHEMA bancaire IS 'Intégration avec le système bancaire - Comptes réels et mouvements';

CREATE SCHEMA IF NOT EXISTS portefeuille;
COMMENT ON SCHEMA portefeuille IS 'Portefeuilles virtuels uFaranga - Interface utilisateur';

CREATE SCHEMA IF NOT EXISTS transaction;
COMMENT ON SCHEMA transaction IS 'Transactions financières et traitement';

CREATE SCHEMA IF NOT EXISTS audit;
COMMENT ON SCHEMA audit IS 'Audit et traçabilité - TABLES IMMUABLES (APPEND-ONLY)';

CREATE SCHEMA IF NOT EXISTS compliance;
COMMENT ON SCHEMA compliance IS 'KYC, AML, documents et vérifications réglementaires';

CREATE SCHEMA IF NOT EXISTS commission;
COMMENT ON SCHEMA commission IS 'Commissions, frais et rémunérations';

CREATE SCHEMA IF NOT EXISTS notification;
COMMENT ON SCHEMA notification IS 'File de notifications et alertes';

CREATE SCHEMA IF NOT EXISTS configuration;
COMMENT ON SCHEMA configuration IS 'Configuration système et données de référence';

CREATE SCHEMA IF NOT EXISTS localisation;
COMMENT ON SCHEMA localisation IS 'Hiérarchie géographique : Pays → Province → District → Quartier → Point de service / Agent';
