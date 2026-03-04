-- =====================================================================
-- SCHÉMA DEVELOPPEURS - Gestion des comptes développeurs et API keys
-- =====================================================================

-- Créer le schéma
CREATE SCHEMA IF NOT EXISTS developpeurs;

COMMENT ON SCHEMA developpeurs IS 'Gestion des comptes développeurs et accès API';

-- =====================================================================
-- TABLE: Comptes Développeurs
-- =====================================================================
CREATE TABLE developpeurs.comptes_developpeurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Utilisateur lié (optionnel si développeur externe)
    utilisateur_id UUID REFERENCES identite.utilisateurs(id) ON DELETE SET NULL,
    
    -- Informations du compte développeur
    nom_entreprise VARCHAR(200) NOT NULL,
    nom_contact VARCHAR(200) NOT NULL,
    prenom_contact VARCHAR(200),
    courriel_contact VARCHAR(255) UNIQUE NOT NULL,
    telephone_contact VARCHAR(20),
    
    -- Adresse
    pays VARCHAR(2) DEFAULT 'BI',
    ville VARCHAR(100),
    adresse_complete TEXT,
    
    -- Type de compte
    type_compte VARCHAR(30) DEFAULT 'SANDBOX' CHECK (type_compte IN (
        'SANDBOX',      -- Environnement de test
        'PRODUCTION',   -- Environnement de production
        'PARTENAIRE',   -- Partenaire stratégique
        'INTERNE'       -- Équipe interne
    )),
    
    -- Statut
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut IN (
        'EN_ATTENTE',   -- En attente d'approbation
        'ACTIF',        -- Compte actif
        'SUSPENDU',     -- Temporairement suspendu
        'BLOQUE',       -- Bloqué définitivement
        'FERME'         -- Compte fermé
    )),
    raison_statut TEXT,
    
    -- Vérification
    courriel_verifie BOOLEAN DEFAULT FALSE,
    date_verification_courriel TIMESTAMP WITH TIME ZONE,
    
    -- Approbation
    approuve_par UUID REFERENCES identite.utilisateurs(id),
    date_approbation TIMESTAMP WITH TIME ZONE,
    
    -- Limites et quotas
    quota_requetes_jour INTEGER DEFAULT 1000,
    quota_requetes_mois INTEGER DEFAULT 30000,
    limite_taux_par_minute INTEGER DEFAULT 60,
    
    -- Webhooks
    url_webhook VARCHAR(500),
    secret_webhook VARCHAR(255),
    
    -- Notifications
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_sms BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    cree_par UUID,
    modifie_par UUID
);

CREATE INDEX idx_comptes_dev_utilisateur ON developpeurs.comptes_developpeurs(utilisateur_id);
CREATE INDEX idx_comptes_dev_courriel ON developpeurs.comptes_developpeurs(courriel_contact);
CREATE INDEX idx_comptes_dev_statut ON developpeurs.comptes_developpeurs(statut);
CREATE INDEX idx_comptes_dev_type ON developpeurs.comptes_developpeurs(type_compte);

COMMENT ON TABLE developpeurs.comptes_developpeurs IS 'Comptes développeurs pour accès API';

-- =====================================================================
-- TABLE: Clés API
-- =====================================================================
CREATE TABLE developpeurs.cles_api (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Compte développeur
    compte_developpeur_id UUID NOT NULL REFERENCES developpeurs.comptes_developpeurs(id) ON DELETE CASCADE,
    
    -- Clé API
    cle_api VARCHAR(64) UNIQUE NOT NULL,  -- Hash de la clé
    prefixe_cle VARCHAR(20) NOT NULL,     -- Préfixe visible (ex: ufar_live_)
    hash_cle TEXT NOT NULL,               -- Hash sécurisé de la clé complète
    
    -- Nom et description
    nom_cle VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Type d'environnement
    environnement VARCHAR(20) DEFAULT 'SANDBOX' CHECK (environnement IN (
        'SANDBOX',      -- Test
        'PRODUCTION'    -- Production
    )),
    
    -- Permissions (scopes)
    scopes JSONB DEFAULT '["public:read"]'::jsonb,
    
    -- Restrictions
    adresses_ip_autorisees JSONB DEFAULT '[]'::jsonb,  -- Liste d'IPs autorisées (vide = toutes)
    domaines_autorises JSONB DEFAULT '[]'::jsonb,      -- Domaines autorisés pour CORS
    
    -- Limites spécifiques à cette clé
    limite_requetes_minute INTEGER,
    limite_requetes_jour INTEGER,
    
    -- Statut
    est_active BOOLEAN DEFAULT TRUE,
    date_expiration TIMESTAMP WITH TIME ZONE,
    
    -- Utilisation
    derniere_utilisation TIMESTAMP WITH TIME ZONE,
    nombre_utilisations BIGINT DEFAULT 0,
    
    -- Révocation
    est_revoquee BOOLEAN DEFAULT FALSE,
    date_revocation TIMESTAMP WITH TIME ZONE,
    revoquee_par UUID,
    raison_revocation TEXT,
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_cles_api_compte ON developpeurs.cles_api(compte_developpeur_id);
CREATE INDEX idx_cles_api_cle ON developpeurs.cles_api(cle_api);
CREATE INDEX idx_cles_api_prefixe ON developpeurs.cles_api(prefixe_cle);
CREATE INDEX idx_cles_api_active ON developpeurs.cles_api(est_active) WHERE est_active = TRUE;
CREATE INDEX idx_cles_api_environnement ON developpeurs.cles_api(environnement);

COMMENT ON TABLE developpeurs.cles_api IS 'Clés API pour authentification des développeurs';

-- =====================================================================
-- TABLE: Utilisation API (Logs) - IMMUABLE
-- =====================================================================
CREATE TABLE developpeurs.logs_utilisation_api (
    id BIGSERIAL PRIMARY KEY,
    
    -- Clé API utilisée
    cle_api_id UUID NOT NULL REFERENCES developpeurs.cles_api(id) ON DELETE CASCADE,
    compte_developpeur_id UUID NOT NULL REFERENCES developpeurs.comptes_developpeurs(id) ON DELETE CASCADE,
    
    -- Requête
    methode_http VARCHAR(10) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    chemin_complet TEXT,
    parametres_query JSONB DEFAULT '{}'::jsonb,
    
    -- Réponse
    statut_http INTEGER NOT NULL,
    temps_reponse_ms INTEGER,
    taille_reponse_bytes INTEGER,
    
    -- Erreurs
    code_erreur VARCHAR(50),
    message_erreur TEXT,
    
    -- Contexte
    adresse_ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    referer TEXT,
    pays VARCHAR(2),
    
    -- Horodatage (IMMUABLE)
    date_requete TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_logs_api_cle ON developpeurs.logs_utilisation_api(cle_api_id);
CREATE INDEX idx_logs_api_compte ON developpeurs.logs_utilisation_api(compte_developpeur_id);
CREATE INDEX idx_logs_api_date ON developpeurs.logs_utilisation_api(date_requete DESC);
CREATE INDEX idx_logs_api_endpoint ON developpeurs.logs_utilisation_api(endpoint);
CREATE INDEX idx_logs_api_statut ON developpeurs.logs_utilisation_api(statut_http);
CREATE INDEX idx_logs_api_ip ON developpeurs.logs_utilisation_api(adresse_ip);

COMMENT ON TABLE developpeurs.logs_utilisation_api IS 'Logs d''utilisation des API - TABLE IMMUABLE';

-- Trigger pour protéger les logs (IMMUABLE)
CREATE OR REPLACE FUNCTION developpeurs.proteger_logs_api()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INTERDIT: Les logs d''utilisation API ne peuvent pas être modifiés ou supprimés (TABLE IMMUABLE)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proteger_update_logs_api
BEFORE UPDATE ON developpeurs.logs_utilisation_api
FOR EACH ROW
EXECUTE PROCEDURE developpeurs.proteger_logs_api();

CREATE TRIGGER trigger_proteger_delete_logs_api
BEFORE DELETE ON developpeurs.logs_utilisation_api
FOR EACH ROW
EXECUTE PROCEDURE developpeurs.proteger_logs_api();

-- =====================================================================
-- TABLE: Quotas et Statistiques
-- =====================================================================
CREATE TABLE developpeurs.quotas_utilisation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Compte développeur
    compte_developpeur_id UUID NOT NULL REFERENCES developpeurs.comptes_developpeurs(id) ON DELETE CASCADE,
    cle_api_id UUID REFERENCES developpeurs.cles_api(id) ON DELETE CASCADE,
    
    -- Période
    date_periode DATE NOT NULL,
    type_periode VARCHAR(10) CHECK (type_periode IN ('JOUR', 'MOIS')),
    
    -- Compteurs
    nombre_requetes INTEGER DEFAULT 0,
    nombre_requetes_succes INTEGER DEFAULT 0,
    nombre_requetes_erreur INTEGER DEFAULT 0,
    
    -- Par statut HTTP
    requetes_2xx INTEGER DEFAULT 0,
    requetes_4xx INTEGER DEFAULT 0,
    requetes_5xx INTEGER DEFAULT 0,
    
    -- Performance
    temps_reponse_moyen_ms INTEGER,
    temps_reponse_max_ms INTEGER,
    
    -- Bande passante
    bande_passante_bytes BIGINT DEFAULT 0,
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(compte_developpeur_id, cle_api_id, date_periode, type_periode)
);

CREATE INDEX idx_quotas_compte ON developpeurs.quotas_utilisation(compte_developpeur_id);
CREATE INDEX idx_quotas_cle ON developpeurs.quotas_utilisation(cle_api_id);
CREATE INDEX idx_quotas_date ON developpeurs.quotas_utilisation(date_periode DESC);

COMMENT ON TABLE developpeurs.quotas_utilisation IS 'Statistiques et quotas d''utilisation API';

-- =====================================================================
-- TABLE: Applications Enregistrées
-- =====================================================================
CREATE TABLE developpeurs.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Compte développeur
    compte_developpeur_id UUID NOT NULL REFERENCES developpeurs.comptes_developpeurs(id) ON DELETE CASCADE,
    
    -- Informations de l'application
    nom_application VARCHAR(200) NOT NULL,
    description TEXT,
    url_application VARCHAR(500),
    url_logo VARCHAR(500),
    
    -- Type d'application
    type_application VARCHAR(30) CHECK (type_application IN (
        'WEB',
        'MOBILE_IOS',
        'MOBILE_ANDROID',
        'BACKEND',
        'PLUGIN',
        'AUTRE'
    )),
    
    -- URLs de callback
    urls_callback JSONB DEFAULT '[]'::jsonb,
    urls_webhook JSONB DEFAULT '[]'::jsonb,
    
    -- Statut
    statut VARCHAR(20) DEFAULT 'BROUILLON' CHECK (statut IN (
        'BROUILLON',
        'EN_REVISION',
        'APPROUVE',
        'REJETE',
        'SUSPENDU'
    )),
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_applications_compte ON developpeurs.applications(compte_developpeur_id);
CREATE INDEX idx_applications_statut ON developpeurs.applications(statut);

COMMENT ON TABLE developpeurs.applications IS 'Applications enregistrées par les développeurs';

-- =====================================================================
-- VUE: Statistiques par Développeur
-- =====================================================================
CREATE OR REPLACE VIEW developpeurs.vue_stats_developpeurs AS
SELECT 
    cd.id,
    cd.nom_entreprise,
    cd.courriel_contact,
    cd.type_compte,
    cd.statut,
    COUNT(DISTINCT ca.id) as nombre_cles_api,
    COUNT(DISTINCT ca.id) FILTER (WHERE ca.est_active = TRUE) as cles_actives,
    COUNT(DISTINCT a.id) as nombre_applications,
    COALESCE(SUM(qu.nombre_requetes), 0) as total_requetes_mois,
    cd.quota_requetes_mois,
    cd.date_creation
FROM developpeurs.comptes_developpeurs cd
LEFT JOIN developpeurs.cles_api ca ON cd.id = ca.compte_developpeur_id
LEFT JOIN developpeurs.applications a ON cd.id = a.compte_developpeur_id
LEFT JOIN developpeurs.quotas_utilisation qu ON cd.id = qu.compte_developpeur_id 
    AND qu.type_periode = 'MOIS'
    AND qu.date_periode = DATE_TRUNC('month', CURRENT_DATE)::DATE
GROUP BY cd.id;

COMMENT ON VIEW developpeurs.vue_stats_developpeurs IS 'Statistiques agrégées par compte développeur';

-- =====================================================================
-- FONCTION: Générer une clé API
-- =====================================================================
CREATE OR REPLACE FUNCTION developpeurs.generer_cle_api(
    p_compte_id UUID,
    p_environnement VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_prefixe VARCHAR;
    v_random VARCHAR;
    v_cle_complete VARCHAR;
BEGIN
    -- Définir le préfixe selon l'environnement
    IF p_environnement = 'PRODUCTION' THEN
        v_prefixe := 'ufar_live_';
    ELSE
        v_prefixe := 'ufar_test_';
    END IF;
    
    -- Générer une partie aléatoire (32 caractères)
    v_random := encode(gen_random_bytes(24), 'base64');
    v_random := REPLACE(REPLACE(REPLACE(v_random, '+', ''), '/', ''), '=', '');
    v_random := SUBSTRING(v_random, 1, 32);
    
    -- Clé complète
    v_cle_complete := v_prefixe || v_random;
    
    RETURN v_cle_complete;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION developpeurs.generer_cle_api IS 'Génère une clé API unique avec préfixe';

-- =====================================================================
-- Données initiales
-- =====================================================================

-- Compte développeur interne pour tests
INSERT INTO developpeurs.comptes_developpeurs (
    nom_entreprise,
    nom_contact,
    courriel_contact,
    type_compte,
    statut,
    quota_requetes_jour,
    quota_requetes_mois,
    courriel_verifie
) VALUES (
    'uFaranga Internal',
    'Équipe Technique',
    'tech@ufaranga.bi',
    'INTERNE',
    'ACTIF',
    100000,
    3000000,
    TRUE
);

COMMIT;
