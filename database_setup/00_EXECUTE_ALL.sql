-- =====================================================
-- SCRIPT PRINCIPAL D'EXÉCUTION
-- Exécute tous les scripts de création de la base de données
-- =====================================================
-- 
-- INSTRUCTIONS D'UTILISATION:
-- 
-- 1. Assurez-vous que PostgreSQL 15+ est installé
-- 2. Créez l'utilisateur ufaranga (si nécessaire):
--    CREATE USER ufaranga WITH PASSWORD 'votre_mot_de_passe';
-- 3. Exécutez ce script en tant que superuser:
--    psql -U postgres -f 00_EXECUTE_ALL.sql
-- 
-- =====================================================

-- Créer l'utilisateur (décommenter si nécessaire)
-- CREATE USER ufaranga WITH PASSWORD '12345';
-- ALTER USER ufaranga WITH SUPERUSER;

-- Créer la base de données
DROP DATABASE IF EXISTS ufaranga;
CREATE DATABASE ufaranga
    WITH 
    OWNER = ufaranga
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Donner tous les privilèges à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE ufaranga TO ufaranga;

-- Se connecter à la base de données
\c ufaranga

-- Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO ufaranga;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ufaranga;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ufaranga;

-- Exécuter les scripts dans l'ordre
\echo '========================================='
\echo 'ÉTAPE 1: Initialisation de la base'
\echo '========================================='
\i 01_init_database.sql

\echo '========================================='
\echo 'ÉTAPE 2: Création du schéma IDENTITE'
\echo '========================================='
\i 02_schema_identite.sql

\echo '========================================='
\echo 'ÉTAPE 3: Création du schéma BANCAIRE'
\echo '========================================='
\i 03_schema_bancaire.sql

\echo '========================================='
\echo 'ÉTAPE 4: Création du schéma PORTEFEUILLE'
\echo '========================================='
\i 04_schema_portefeuille.sql

\echo '========================================='
\echo 'ÉTAPE 5: Création du schéma TRANSACTION'
\echo '========================================='
\i 05_schema_transaction.sql

\echo '========================================='
\echo 'ÉTAPE 6: Création du schéma AUDIT'
\echo '========================================='
\i 06_schema_audit.sql

\echo '========================================='
\echo 'ÉTAPE 7: Création du schéma COMPLIANCE'
\echo '========================================='
\i 07_schema_compliance.sql

\echo '========================================='
\echo 'ÉTAPE 8: Création des schémas COMMISSION et NOTIFICATION'
\echo '========================================='
\i 08_schema_commission_notification.sql

\echo '========================================='
\echo 'ÉTAPE 9: Création du schéma CONFIGURATION'
\echo '========================================='
\i 09_schema_configuration.sql

\echo '========================================='
\echo 'BASE DE DONNÉES CRÉÉE AVEC SUCCÈS!'
\echo '========================================='
\echo ''
\echo 'Prochaines étapes:'
\echo '1. Vérifier les schémas: \dn'
\echo '2. Vérifier les tables: \dt identite.* bancaire.* portefeuille.* transaction.* audit.* compliance.* commission.* notification.* configuration.*'
\echo '3. Lancer les migrations Django: python manage.py migrate'
\echo '4. Initialiser la configuration: python manage.py init_configuration'
\echo ''
