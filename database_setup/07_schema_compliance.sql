-- =====================================================
-- SCRIPT 7: SCHÉMA COMPLIANCE
-- Tables pour KYC, AML et conformité
-- =====================================================

\c ufaranga

-- Table des documents KYC
CREATE TABLE compliance.documents_kyc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Type de document
    type_document VARCHAR(50) NOT NULL CHECK (type_document IN (
        'CNI', 'PASSEPORT', 'PERMIS_CONDUIRE', 'CARTE_ELECTEUR',
        'SELFIE', 'SELFIE_AVEC_DOCUMENT', 'JUSTIFICATIF_DOMICILE',
        'ATTESTATION_RESIDENCE', 'EXTRAIT_NAISSANCE', 'AUTRE'
    )),
    
    -- Informations du document
    numero_document VARCHAR(100),
    date_emission DATE,
    date_expiration DATE,
    autorite_emission VARCHAR(200),
    pays_emission VARCHAR(2) NOT NULL,
    
    -- Fichiers
    url_fichier_recto VARCHAR(500) NOT NULL,
    url_fichier_verso VARCHAR(500),
    url_fichier_selfie VARCHAR(500),
    hash_fichier_recto VARCHAR(255),
    hash_fichier_verso VARCHAR(255),
    
    -- Statut de vérification
    statut_verification VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut_verification IN (
        'EN_ATTENTE', 'EN_COURS', 'APPROUVE', 'REJETE', 'EXPIRE', 'SUSPENDU'
    )),
    
    -- Vérification
    verifie_par UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    date_verification TIMESTAMP WITH TIME ZONE,
    methode_verification VARCHAR(50),
    score_confiance INTEGER CHECK (score_confiance BETWEEN 0 AND 100),
    
    -- Données extraites (OCR)
    donnees_extraites JSONB,
    
    -- Raisons
    raison_rejet TEXT,
    commentaire_verificateur TEXT,
    alerte_expiration_envoyee BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_compliance_documents_utilisateur ON compliance.documents_kyc(utilisateur_id);
CREATE INDEX idx_compliance_documents_type ON compliance.documents_kyc(type_document);
CREATE INDEX idx_compliance_documents_statut ON compliance.documents_kyc(statut_verification);
CREATE INDEX idx_compliance_documents_expiration ON compliance.documents_kyc(date_expiration) WHERE date_expiration IS NOT NULL;

COMMENT ON TABLE compliance.documents_kyc IS 'Documents KYC';

-- Table des vérifications KYC (IMMUABLE)
CREATE TABLE compliance.verifications_kyc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Type de vérification
    type_verification VARCHAR(50) NOT NULL CHECK (type_verification IN (
        'IDENTITE', 'ADRESSE', 'TELEPHONE', 'EMAIL',
        'BIOMETRIE_FACIALE', 'BIOMETRIE_EMPREINTE', 'LIVENESS_CHECK',
        'VERIFICATION_BANCAIRE', 'VERIFICATION_CREDIT', 'AML_SCREENING'
    )),
    
    -- Résultat
    resultat VARCHAR(20) NOT NULL CHECK (resultat IN ('SUCCES', 'ECHEC', 'PARTIEL', 'EN_ATTENTE')),
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    
    -- Détails
    fournisseur_verification VARCHAR(100),
    reference_externe VARCHAR(100),
    donnees_verification JSONB,
    
    -- Raisons
    raison_echec TEXT,
    recommandations TEXT,
    
    -- Horodatage (IMMUABLE)
    date_verification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_compliance_verif_utilisateur ON compliance.verifications_kyc(utilisateur_id);
CREATE INDEX idx_compliance_verif_type ON compliance.verifications_kyc(type_verification);
CREATE INDEX idx_compliance_verif_resultat ON compliance.verifications_kyc(resultat);
CREATE INDEX idx_compliance_verif_date ON compliance.verifications_kyc(date_verification DESC);

COMMENT ON TABLE compliance.verifications_kyc IS 'Vérifications KYC - TABLE IMMUABLE';

-- Trigger pour protéger les vérifications (IMMUABLE)
CREATE OR REPLACE FUNCTION compliance.proteger_verifications()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INTERDIT: Les vérifications KYC ne peuvent pas être modifiées ou supprimées (TABLE IMMUABLE)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proteger_update_verif
BEFORE UPDATE ON compliance.verifications_kyc
FOR EACH ROW
EXECUTE PROCEDURE compliance.proteger_verifications();

CREATE TRIGGER trigger_proteger_delete_verif
BEFORE DELETE ON compliance.verifications_kyc
FOR EACH ROW
EXECUTE PROCEDURE compliance.proteger_verifications();

-- Table screening AML (IMMUABLE)
CREATE TABLE compliance.screening_aml (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Type de screening
    type_screening VARCHAR(50) NOT NULL CHECK (type_screening IN (
        'SANCTIONS', 'PEP', 'ADVERSE_MEDIA', 'WATCHLIST', 'COMPLET'
    )),
    
    -- Résultat
    resultat VARCHAR(20) NOT NULL CHECK (resultat IN ('CLEAN', 'MATCH_POSSIBLE', 'MATCH_CONFIRME', 'ERREUR')),
    score_risque INTEGER CHECK (score_risque BETWEEN 0 AND 100),
    niveau_risque VARCHAR(20) CHECK (niveau_risque IN ('FAIBLE', 'MOYEN', 'ELEVE', 'CRITIQUE')),
    
    -- Détails du match
    donnees_match JSONB,
    listes_matchees TEXT[],
    
    -- Actions
    action_requise BOOLEAN DEFAULT FALSE,
    action_prise TEXT,
    prise_en_charge_par UUID REFERENCES identite.utilisateurs(id),
    date_prise_en_charge TIMESTAMP WITH TIME ZONE,
    
    -- Fournisseur
    fournisseur_screening VARCHAR(100),
    reference_externe VARCHAR(100),
    
    -- Horodatage (IMMUABLE)
    date_screening TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_compliance_aml_utilisateur ON compliance.screening_aml(utilisateur_id);
CREATE INDEX idx_compliance_aml_resultat ON compliance.screening_aml(resultat);
CREATE INDEX idx_compliance_aml_niveau_risque ON compliance.screening_aml(niveau_risque);
CREATE INDEX idx_compliance_aml_action ON compliance.screening_aml(action_requise) WHERE action_requise = TRUE;
CREATE INDEX idx_compliance_aml_date ON compliance.screening_aml(date_screening DESC);

COMMENT ON TABLE compliance.screening_aml IS 'Screening AML - TABLE IMMUABLE';

-- Trigger pour protéger les screenings (IMMUABLE)
CREATE TRIGGER trigger_proteger_update_aml
BEFORE UPDATE ON compliance.screening_aml
FOR EACH ROW
EXECUTE PROCEDURE compliance.proteger_verifications();

CREATE TRIGGER trigger_proteger_delete_aml
BEFORE DELETE ON compliance.screening_aml
FOR EACH ROW
EXECUTE PROCEDURE compliance.proteger_verifications();
