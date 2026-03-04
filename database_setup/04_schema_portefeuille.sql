-- =====================================================
-- SCRIPT 4: SCHÉMA PORTEFEUILLE
-- Tables pour les portefeuilles virtuels
-- =====================================================

\c ufaranga

-- Table des portefeuilles virtuels
CREATE TABLE portefeuille.portefeuilles_virtuels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Liaison utilisateur
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE RESTRICT,
    
    -- Liaison au compte bancaire RÉEL
    compte_bancaire_reel_id UUID NOT NULL REFERENCES bancaire.comptes_bancaires_reels(id) ON DELETE RESTRICT,
    
    -- Numéro de portefeuille uFaranga
    numero_portefeuille VARCHAR(20) UNIQUE NOT NULL,
    
    -- Type de portefeuille
    type_portefeuille VARCHAR(20) NOT NULL CHECK (type_portefeuille IN ('PERSONNEL', 'PROFESSIONNEL', 'MARCHAND', 'AGENT', 'EPARGNE')),
    
    -- Alias et personnalisation
    nom_portefeuille VARCHAR(100),
    description TEXT,
    couleur_interface VARCHAR(7),
    icone VARCHAR(50),
    
    -- Solde VIRTUEL (miroir du compte bancaire)
    solde_affiche DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    devise VARCHAR(3) DEFAULT 'BIF' NOT NULL,
    
    -- Décomposition du solde
    solde_disponible DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    solde_en_attente DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    solde_bloque DECIMAL(18, 2) DEFAULT 0.00 NOT NULL,
    
    -- Spécifique agents
    solde_float DECIMAL(18, 2) DEFAULT 0.00,
    solde_especes DECIMAL(18, 2) DEFAULT 0.00,
    
    -- Limites
    limite_quotidienne DECIMAL(18, 2),
    limite_mensuelle DECIMAL(18, 2),
    limite_par_transaction DECIMAL(18, 2),
    
    -- Synchronisation
    derniere_synchronisation TIMESTAMP WITH TIME ZONE,
    en_cours_synchronisation BOOLEAN DEFAULT FALSE,
    
    -- Statut
    statut VARCHAR(20) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'GELE', 'SUSPENDU', 'FERME', 'EN_VERIFICATION')),
    raison_statut TEXT,
    
    -- Métadonnées
    est_portefeuille_principal BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    cree_par UUID,
    modifie_par UUID,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_solde_coherent CHECK (solde_affiche = solde_disponible + solde_en_attente + solde_bloque)
);

CREATE INDEX idx_portefeuilles_utilisateur ON portefeuille.portefeuilles_virtuels(utilisateur_id);
CREATE INDEX idx_portefeuilles_numero ON portefeuille.portefeuilles_virtuels(numero_portefeuille);
CREATE INDEX idx_portefeuilles_compte_bancaire ON portefeuille.portefeuilles_virtuels(compte_bancaire_reel_id);
CREATE INDEX idx_portefeuilles_type ON portefeuille.portefeuilles_virtuels(type_portefeuille);
CREATE INDEX idx_portefeuilles_statut ON portefeuille.portefeuilles_virtuels(statut);

COMMENT ON TABLE portefeuille.portefeuilles_virtuels IS 'Portefeuilles virtuels uFaranga';
