-- =====================================================
-- SCRIPT 9: SCHÉMA CONFIGURATION
-- Tables pour paramètres système et référentiels
-- =====================================================

\c ufaranga

-- Table des paramètres système
CREATE TABLE configuration.parametres_systeme (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT NOT NULL,
    type_valeur VARCHAR(20) DEFAULT 'STRING' CHECK (type_valeur IN ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'JSON', 'ARRAY')),
    
    -- Métadonnées
    description TEXT,
    categorie VARCHAR(50),
    est_sensible BOOLEAN DEFAULT FALSE,
    est_modifiable BOOLEAN DEFAULT TRUE,
    
    -- Audit
    modifie_par UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_parametres_cle ON configuration.parametres_systeme(cle);
CREATE INDEX idx_parametres_categorie ON configuration.parametres_systeme(categorie);

COMMENT ON TABLE configuration.parametres_systeme IS 'Configuration globale du système';

-- Table des limites de transactions
CREATE TABLE configuration.limites_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Règle
    niveau_kyc INTEGER NOT NULL CHECK (niveau_kyc BETWEEN 0 AND 3),
    type_utilisateur VARCHAR(20) NOT NULL,
    type_transaction VARCHAR(30) NOT NULL,
    
    -- Limites
    montant_min DECIMAL(18, 2) DEFAULT 0.00,
    montant_max_unitaire DECIMAL(18, 2) NOT NULL,
    montant_max_quotidien DECIMAL(18, 2) NOT NULL,
    montant_max_hebdomadaire DECIMAL(18, 2),
    montant_max_mensuel DECIMAL(18, 2) NOT NULL,
    montant_max_annuel DECIMAL(18, 2),
    
    -- Nombre
    nombre_max_quotidien INTEGER,
    nombre_max_hebdomadaire INTEGER,
    nombre_max_mensuel INTEGER,
    
    -- Validité
    est_active BOOLEAN DEFAULT TRUE,
    date_debut_validite DATE NOT NULL DEFAULT CURRENT_DATE,
    date_fin_validite DATE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE (niveau_kyc, type_utilisateur, type_transaction, date_debut_validite)
);

CREATE INDEX idx_limites_kyc ON configuration.limites_transactions(niveau_kyc);
CREATE INDEX idx_limites_type_user ON configuration.limites_transactions(type_utilisateur);
CREATE INDEX idx_limites_active ON configuration.limites_transactions(est_active) WHERE est_active = TRUE;

COMMENT ON TABLE configuration.limites_transactions IS 'Limites de transaction par profil utilisateur';

-- Table des taux de change
CREATE TABLE configuration.taux_change (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    devise_source VARCHAR(3) NOT NULL,
    devise_cible VARCHAR(3) NOT NULL,
    taux DECIMAL(18, 6) NOT NULL CHECK (taux > 0),
    
    -- Source du taux
    source VARCHAR(50),
    
    -- Validité
    date_debut_validite TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_fin_validite TIMESTAMP WITH TIME ZONE,
    est_actif BOOLEAN DEFAULT TRUE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE (devise_source, devise_cible, date_debut_validite)
);

CREATE INDEX idx_taux_devises ON configuration.taux_change(devise_source, devise_cible);
CREATE INDEX idx_taux_actif ON configuration.taux_change(est_actif, date_debut_validite DESC) WHERE est_actif = TRUE;

COMMENT ON TABLE configuration.taux_change IS 'Taux de change avec historique';

-- Table blacklist
CREATE TABLE configuration.blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    type_entree VARCHAR(20) NOT NULL CHECK (type_entree IN ('UTILISATEUR', 'TELEPHONE', 'EMAIL', 'IP', 'DEVICE', 'COMPTE_BANCAIRE')),
    valeur VARCHAR(255) NOT NULL,
    
    -- Raison
    raison TEXT NOT NULL,
    categorie VARCHAR(50),
    gravite VARCHAR(20) CHECK (gravite IN ('FAIBLE', 'MOYENNE', 'ELEVEE', 'CRITIQUE')),
    
    -- Qui a ajouté
    ajoute_par UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE RESTRICT,
    
    -- Période
    date_debut TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_fin TIMESTAMP WITH TIME ZONE,
    est_permanent BOOLEAN DEFAULT FALSE,
    est_actif BOOLEAN DEFAULT TRUE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE (type_entree, valeur)
);

CREATE INDEX idx_blacklist_type ON configuration.blacklist(type_entree);
CREATE INDEX idx_blacklist_valeur ON configuration.blacklist(valeur);
CREATE INDEX idx_blacklist_actif ON configuration.blacklist(est_actif) WHERE est_actif = TRUE;
CREATE INDEX idx_blacklist_gravite ON configuration.blacklist(gravite);

COMMENT ON TABLE configuration.blacklist IS 'Liste noire - Utilisateurs, IPs, appareils bloqués';
