-- =====================================================
-- SCRIPT 6: SCHÉMA AUDIT
-- Tables pour la traçabilité (IMMUABLES)
-- =====================================================

\c ufaranga

-- Table des sessions utilisateurs
CREATE TABLE audit.sessions_utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Session
    cle_session VARCHAR(255) UNIQUE NOT NULL,
    jeton_rafraichissement TEXT,
    
    -- Informations de connexion
    adresse_ip VARCHAR(45) NOT NULL,
    agent_utilisateur TEXT,
    type_appareil VARCHAR(20) CHECK (type_appareil IN ('MOBILE', 'WEB', 'TABLETTE', 'API')),
    id_appareil VARCHAR(255),
    empreinte_appareil VARCHAR(255),
    
    -- Localisation
    pays_connexion VARCHAR(2),
    ville_connexion VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    fournisseur_internet VARCHAR(100),
    
    -- Statut
    est_active BOOLEAN DEFAULT TRUE,
    
    -- Dates
    date_connexion TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_deconnexion TIMESTAMP WITH TIME ZONE,
    derniere_activite TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_expiration TIMESTAMP WITH TIME ZONE NOT NULL,
    duree_session_secondes INTEGER,
    
    -- Raison de déconnexion
    raison_deconnexion VARCHAR(50) CHECK (raison_deconnexion IN ('UTILISATEUR', 'EXPIRATION', 'SYSTEME', 'SECURITE', 'FORCEE')),
    
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_audit_sessions_utilisateur ON audit.sessions_utilisateurs(utilisateur_id);
CREATE INDEX idx_audit_sessions_date_connexion ON audit.sessions_utilisateurs(date_connexion DESC);
CREATE INDEX idx_audit_sessions_active ON audit.sessions_utilisateurs(est_active) WHERE est_active = TRUE;
CREATE INDEX idx_audit_sessions_ip ON audit.sessions_utilisateurs(adresse_ip);

COMMENT ON TABLE audit.sessions_utilisateurs IS 'Sessions utilisateurs';

-- Table des journaux d'événements (IMMUABLE)
CREATE TABLE audit.journaux_evenements (
    id BIGSERIAL PRIMARY KEY,
    
    -- Corrélation
    id_requete UUID NOT NULL,
    id_correlation UUID,
    
    -- Utilisateur et session
    utilisateur_id UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    session_id UUID REFERENCES audit.sessions_utilisateurs(id) ON DELETE SET NULL,
    
    -- Type d'événement
    categorie_evenement VARCHAR(50) NOT NULL CHECK (categorie_evenement IN (
        'AUTHENTIFICATION', 'AUTORISATION', 'TRANSACTION_FINANCIERE',
        'MODIFICATION_DONNEES', 'CONSULTATION_DONNEES', 'CONFIGURATION_SYSTEME',
        'SECURITE', 'ERREUR', 'ALERTE', 'SYNCHRONISATION_BANCAIRE',
        'NOTIFICATION', 'KYC_COMPLIANCE'
    )),
    action VARCHAR(100) NOT NULL,
    
    -- Ressource affectée
    type_ressource VARCHAR(50),
    id_ressource VARCHAR(100),
    
    -- Détails
    description TEXT NOT NULL,
    resultat VARCHAR(20) CHECK (resultat IN ('SUCCES', 'ECHEC', 'PARTIEL', 'EN_COURS')),
    
    -- Contexte technique
    nom_service VARCHAR(50),
    nom_module VARCHAR(100),
    nom_fonction VARCHAR(100),
    point_terminaison VARCHAR(255),
    methode_http VARCHAR(10),
    statut_http INTEGER,
    temps_execution_ms INTEGER,
    
    -- Informations réseau
    adresse_ip VARCHAR(45),
    agent_utilisateur TEXT,
    id_appareil VARCHAR(255),
    pays VARCHAR(2),
    ville VARCHAR(100),
    
    -- Données (sanitized)
    corps_requete JSONB,
    corps_reponse JSONB,
    
    -- Erreurs
    code_erreur VARCHAR(50),
    message_erreur TEXT,
    trace_erreur TEXT,
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_evenement TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_evenements_requete ON audit.journaux_evenements(id_requete);
CREATE INDEX idx_audit_evenements_utilisateur ON audit.journaux_evenements(utilisateur_id);
CREATE INDEX idx_audit_evenements_session ON audit.journaux_evenements(session_id);
CREATE INDEX idx_audit_evenements_categorie ON audit.journaux_evenements(categorie_evenement);
CREATE INDEX idx_audit_evenements_action ON audit.journaux_evenements(action);
CREATE INDEX idx_audit_evenements_date ON audit.journaux_evenements(date_evenement DESC);
CREATE INDEX idx_audit_evenements_resultat ON audit.journaux_evenements(resultat);

COMMENT ON TABLE audit.journaux_evenements IS 'Journal COMPLET des événements - TABLE IMMUABLE';

-- Trigger pour protéger les journaux (IMMUABLE)
CREATE OR REPLACE FUNCTION audit.proteger_journaux()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INTERDIT: Les journaux d''événements ne peuvent pas être modifiés ou supprimés (TABLE IMMUABLE)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proteger_update_journaux
BEFORE UPDATE ON audit.journaux_evenements
FOR EACH ROW
EXECUTE PROCEDURE audit.proteger_journaux();

CREATE TRIGGER trigger_proteger_delete_journaux
BEFORE DELETE ON audit.journaux_evenements
FOR EACH ROW
EXECUTE PROCEDURE audit.proteger_journaux();

-- Table historique des modifications (IMMUABLE)
CREATE TABLE audit.historique_modifications (
    id BIGSERIAL PRIMARY KEY,
    
    -- Table et enregistrement modifiés
    nom_table VARCHAR(100) NOT NULL,
    nom_schema VARCHAR(50) NOT NULL,
    id_enregistrement VARCHAR(100) NOT NULL,
    
    -- Type d'opération
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    
    -- Utilisateur
    utilisateur_id UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    
    -- Données avant/après
    donnees_avant JSONB,
    donnees_apres JSONB,
    champs_modifies TEXT[],
    
    -- Contexte
    raison_modification TEXT,
    id_requete UUID,
    
    -- Horodatage
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_audit_historique_table ON audit.historique_modifications(nom_schema, nom_table);
CREATE INDEX idx_audit_historique_enregistrement ON audit.historique_modifications(id_enregistrement);
CREATE INDEX idx_audit_historique_utilisateur ON audit.historique_modifications(utilisateur_id);
CREATE INDEX idx_audit_historique_date ON audit.historique_modifications(date_modification DESC);
CREATE INDEX idx_audit_historique_operation ON audit.historique_modifications(operation);

COMMENT ON TABLE audit.historique_modifications IS 'Historique des modifications - TABLE IMMUABLE';

-- Trigger pour protéger l'historique (IMMUABLE)
CREATE TRIGGER trigger_proteger_update_historique
BEFORE UPDATE ON audit.historique_modifications
FOR EACH ROW
EXECUTE PROCEDURE audit.proteger_journaux();

CREATE TRIGGER trigger_proteger_delete_historique
BEFORE DELETE ON audit.historique_modifications
FOR EACH ROW
EXECUTE PROCEDURE audit.proteger_journaux();
