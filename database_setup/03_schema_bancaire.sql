-- =====================================================
-- SCRIPT 3: SCHÉMA BANCAIRE
-- Tables pour l'intégration bancaire
-- =====================================================

\c ufaranga

-- Table des banques partenaires
CREATE TABLE bancaire.banques_partenaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    code_banque VARCHAR(20) UNIQUE NOT NULL,
    nom_banque VARCHAR(200) NOT NULL,
    code_swift VARCHAR(11) UNIQUE,
    code_bic VARCHAR(11),
    pays VARCHAR(2) NOT NULL DEFAULT 'BI',
    
    -- Contact
    adresse_siege TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    site_web VARCHAR(255),
    
    -- Intégration technique
    api_endpoint VARCHAR(500),
    api_version VARCHAR(20),
    cle_api_chiffree TEXT,
    certificat_ssl TEXT,
    
    -- Configuration
    supporte_temps_reel BOOLEAN DEFAULT FALSE,
    delai_traitement_heures INTEGER DEFAULT 24,
    frais_integration DECIMAL(18, 2) DEFAULT 0.00,
    
    -- Statut
    est_active BOOLEAN DEFAULT TRUE,
    date_partenariat DATE NOT NULL,
    date_fin_partenariat DATE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_banques_code ON bancaire.banques_partenaires(code_banque);
CREATE INDEX idx_banques_swift ON bancaire.banques_partenaires(code_swift);
CREATE INDEX idx_banques_active ON bancaire.banques_partenaires(est_active) WHERE est_active = TRUE;

COMMENT ON TABLE bancaire.banques_partenaires IS 'Banques partenaires';

-- Table des comptes bancaires RÉELS
CREATE TABLE bancaire.comptes_bancaires_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Liaison utilisateur
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE RESTRICT,
    
    -- Banque
    banque_id UUID NOT NULL REFERENCES bancaire.banques_partenaires(id) ON DELETE RESTRICT,
    
    -- Informations du compte
    numero_compte_bancaire VARCHAR(50) UNIQUE NOT NULL,
    rib VARCHAR(50),
    iban VARCHAR(34),
    swift_bic VARCHAR(11),
    
    -- Type de compte
    type_compte VARCHAR(30) NOT NULL CHECK (type_compte IN ('COMPTE_COURANT', 'COMPTE_EPARGNE', 'COMPTE_DEPOT', 'COMPTE_PROFESSIONNEL')),
    
    -- Titulaire
    nom_titulaire VARCHAR(200) NOT NULL,
    prenom_titulaire VARCHAR(200),
    
    -- Solde RÉEL
    solde_reel DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    devise VARCHAR(3) DEFAULT 'BIF' NOT NULL,
    
    -- Synchronisation
    derniere_synchronisation TIMESTAMP WITH TIME ZONE,
    frequence_synchronisation_minutes INTEGER DEFAULT 5,
    erreur_derniere_sync TEXT,
    
    -- Statut
    est_compte_principal BOOLEAN DEFAULT FALSE,
    statut VARCHAR(20) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'SUSPENDU', 'FERME', 'EN_VERIFICATION')),
    
    -- Validation
    compte_verifie BOOLEAN DEFAULT FALSE,
    date_verification TIMESTAMP WITH TIME ZONE,
    methode_verification VARCHAR(50),
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    cree_par UUID,
    modifie_par UUID,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT unique_compte_par_utilisateur_banque UNIQUE (utilisateur_id, numero_compte_bancaire)
);

CREATE INDEX idx_comptes_bancaires_utilisateur ON bancaire.comptes_bancaires_reels(utilisateur_id);
CREATE INDEX idx_comptes_bancaires_numero ON bancaire.comptes_bancaires_reels(numero_compte_bancaire);
CREATE INDEX idx_comptes_bancaires_banque ON bancaire.comptes_bancaires_reels(banque_id);

COMMENT ON TABLE bancaire.comptes_bancaires_reels IS 'Comptes bancaires RÉELS des utilisateurs';

-- Table des mouvements bancaires RÉELS (IMMUABLE)
CREATE TABLE bancaire.mouvements_bancaires_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Compte bancaire
    compte_bancaire_id UUID NOT NULL REFERENCES bancaire.comptes_bancaires_reels(id) ON DELETE RESTRICT,
    
    -- Référence bancaire
    reference_banque VARCHAR(100) UNIQUE NOT NULL,
    reference_externe VARCHAR(100),
    
    -- Type de mouvement
    type_mouvement VARCHAR(30) NOT NULL CHECK (type_mouvement IN ('CREDIT', 'DEBIT', 'FRAIS', 'INTERET', 'VIREMENT', 'PRELEVEMENT', 'CHEQUE', 'CARTE')),
    
    -- Montant
    montant DECIMAL(18, 2) NOT NULL CHECK (montant != 0),
    devise VARCHAR(3) DEFAULT 'BIF' NOT NULL,
    
    -- Soldes
    solde_avant DECIMAL(18, 2) NOT NULL,
    solde_apres DECIMAL(18, 2) NOT NULL,
    
    -- Description
    libelle TEXT NOT NULL,
    description_detaillee TEXT,
    
    -- Contrepartie
    compte_contrepartie VARCHAR(50),
    nom_contrepartie VARCHAR(200),
    banque_contrepartie VARCHAR(100),
    
    -- Dates
    date_operation DATE NOT NULL,
    date_valeur DATE NOT NULL,
    heure_operation TIME,
    
    -- Statut
    statut VARCHAR(20) DEFAULT 'COMPLETE' CHECK (statut IN ('COMPLETE', 'EN_ATTENTE', 'ANNULE', 'REJETE')),
    
    -- Synchronisation
    date_importation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    importe_par VARCHAR(50) DEFAULT 'SYSTEME',
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_mouvements_bancaires_compte ON bancaire.mouvements_bancaires_reels(compte_bancaire_id);
CREATE INDEX idx_mouvements_bancaires_reference ON bancaire.mouvements_bancaires_reels(reference_banque);
CREATE INDEX idx_mouvements_bancaires_date_operation ON bancaire.mouvements_bancaires_reels(date_operation DESC);
CREATE INDEX idx_mouvements_bancaires_type ON bancaire.mouvements_bancaires_reels(type_mouvement);

COMMENT ON TABLE bancaire.mouvements_bancaires_reels IS 'Mouvements bancaires RÉELS - TABLE IMMUABLE';

-- Trigger pour protéger les mouvements bancaires (IMMUABLE)
CREATE OR REPLACE FUNCTION bancaire.proteger_mouvements_bancaires()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INTERDIT: Les mouvements bancaires réels ne peuvent pas être modifiés ou supprimés (TABLE IMMUABLE)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proteger_update_mouvements
BEFORE UPDATE ON bancaire.mouvements_bancaires_reels
FOR EACH ROW
EXECUTE PROCEDURE bancaire.proteger_mouvements_bancaires();

CREATE TRIGGER trigger_proteger_delete_mouvements
BEFORE DELETE ON bancaire.mouvements_bancaires_reels
FOR EACH ROW
EXECUTE PROCEDURE bancaire.proteger_mouvements_bancaires();
