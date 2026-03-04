-- =====================================================
-- SCRIPT 2: SCHÉMA IDENTITE
-- Tables pour la gestion des utilisateurs
-- =====================================================

\c ufaranga

-- Table principale des utilisateurs
CREATE TABLE identite.utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Authentification
    courriel VARCHAR(255) UNIQUE NOT NULL,
    numero_telephone VARCHAR(20) UNIQUE NOT NULL,
    hash_mot_de_passe VARCHAR(255) NOT NULL,
    
    -- Informations personnelles
    prenom VARCHAR(100) NOT NULL,
    nom_famille VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(2) DEFAULT 'BI',
    
    -- Adresse
    pays_residence VARCHAR(2) NOT NULL DEFAULT 'BI',
    province VARCHAR(100),
    ville VARCHAR(100),
    commune VARCHAR(100),
    quartier VARCHAR(100),
    avenue VARCHAR(100),
    numero_maison VARCHAR(50),
    adresse_complete TEXT,
    code_postal VARCHAR(20),
    
    -- Vérifications
    telephone_verifie BOOLEAN DEFAULT FALSE,
    telephone_verifie_le TIMESTAMP WITH TIME ZONE,
    courriel_verifie BOOLEAN DEFAULT FALSE,
    courriel_verifie_le TIMESTAMP WITH TIME ZONE,
    
    -- KYC
    niveau_kyc INTEGER DEFAULT 0 CHECK (niveau_kyc BETWEEN 0 AND 3),
    date_validation_kyc TIMESTAMP WITH TIME ZONE,
    validateur_kyc_id UUID,
    
    -- Type et statut
    type_utilisateur VARCHAR(20) NOT NULL CHECK (type_utilisateur IN ('CLIENT', 'AGENT', 'MARCHAND', 'ADMIN', 'SUPER_ADMIN', 'SYSTEME')),
    statut VARCHAR(20) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'SUSPENDU', 'BLOQUE', 'FERME', 'EN_VERIFICATION')),
    raison_statut TEXT,
    
    -- Sécurité
    nombre_tentatives_connexion INTEGER DEFAULT 0,
    bloque_jusqua TIMESTAMP WITH TIME ZONE,
    double_auth_activee BOOLEAN DEFAULT FALSE,
    secret_2fa VARCHAR(255),
    
    -- Métadonnées
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    derniere_connexion TIMESTAMP WITH TIME ZONE,
    derniere_modification_mdp TIMESTAMP WITH TIME ZONE,
    cree_par UUID,
    modifie_par UUID,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_utilisateurs_courriel ON identite.utilisateurs(courriel);
CREATE INDEX idx_utilisateurs_telephone ON identite.utilisateurs(numero_telephone);
CREATE INDEX idx_utilisateurs_type ON identite.utilisateurs(type_utilisateur);
CREATE INDEX idx_utilisateurs_statut ON identite.utilisateurs(statut);
CREATE INDEX idx_utilisateurs_niveau_kyc ON identite.utilisateurs(niveau_kyc);
CREATE INDEX idx_utilisateurs_date_creation ON identite.utilisateurs(date_creation DESC);

COMMENT ON TABLE identite.utilisateurs IS 'Table principale des utilisateurs';

-- Table des profils utilisateurs
CREATE TABLE identite.profils_utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID UNIQUE NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Profil visuel
    url_avatar VARCHAR(500),
    url_photo_couverture VARCHAR(500),
    biographie TEXT,
    
    -- Préférences
    langue VARCHAR(5) DEFAULT 'fr' CHECK (langue IN ('fr', 'en', 'sw', 'rn')),
    devise_preferee VARCHAR(3) DEFAULT 'BIF',
    fuseau_horaire VARCHAR(50) DEFAULT 'Africa/Bujumbura',
    format_date VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    format_heure VARCHAR(10) DEFAULT '24h',
    
    -- Notifications
    notifications_courriel BOOLEAN DEFAULT TRUE,
    notifications_sms BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    notifications_transactions BOOLEAN DEFAULT TRUE,
    notifications_marketing BOOLEAN DEFAULT FALSE,
    
    -- Confidentialité
    profil_public BOOLEAN DEFAULT FALSE,
    afficher_telephone BOOLEAN DEFAULT FALSE,
    afficher_courriel BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_profils_utilisateur ON identite.profils_utilisateurs(utilisateur_id);

COMMENT ON TABLE identite.profils_utilisateurs IS 'Profils et préférences des utilisateurs';
-- Ajoute les colonnes Django manquantes à identite.utilisateurs
-- (la table existante a été créée sans is_superuser / is_staff)
-- À exécuter une seule fois.

ALTER TABLE identite.utilisateurs
  ADD COLUMN IF NOT EXISTS is_superuser boolean NOT NULL DEFAULT false;

ALTER TABLE identite.utilisateurs
  ADD COLUMN IF NOT EXISTS is_staff boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN identite.utilisateurs.is_superuser IS 'Django: superuser status';
COMMENT ON COLUMN identite.utilisateurs.is_staff IS 'Django: staff status';
-- =============================================================================
-- Droits sur le schéma IDENTITE pour l'utilisateur Django (ex: ufaranga)
-- Tables concernées : identite.utilisateurs, identite.profils_utilisateurs
-- À exécuter en tant que superutilisateur PostgreSQL (postgres) ou propriétaire du schéma.
-- =============================================================================

-- 1. Créer le schéma s'il n'existe pas (optionnel)
CREATE SCHEMA IF NOT EXISTS identite;

-- 2. Donner USAGE et CREATE sur le schéma à l'utilisateur de l'app
-- Remplacer 'ufaranga' par le nom de l'utilisateur dans DATABASES['default']['USER']
GRANT USAGE ON SCHEMA identite TO ufaranga;
GRANT CREATE ON SCHEMA identite TO ufaranga;

-- 3. Droits sur les tables (INSERT/SELECT/UPDATE/DELETE) si les tables existent déjà
GRANT SELECT, INSERT, UPDATE, DELETE ON identite.utilisateurs TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON identite.profils_utilisateurs TO ufaranga;
-- =============================================================================
-- Droits sur les tables identite.utilisateurs et identite.profils_utilisateurs
-- Pour que l'utilisateur Django (ufaranga) puisse INSERT / SELECT / UPDATE / DELETE
-- À exécuter en tant que postgres ou propriétaire des tables.
-- =============================================================================

-- Remplacer 'ufaranga' si votre DB_USER est différent
GRANT SELECT, INSERT, UPDATE, DELETE ON identite.utilisateurs TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON identite.profils_utilisateurs TO ufaranga;

-- Si les tables ont des séquences (ex: bigserial)
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA identite TO ufaranga;

-- Pour les tables ManyToMany (auth_group, auth_permission) utilisées par identite
-- GRANT SELECT ON auth_group TO ufaranga;
-- GRANT SELECT ON auth_permission TO ufaranga;
