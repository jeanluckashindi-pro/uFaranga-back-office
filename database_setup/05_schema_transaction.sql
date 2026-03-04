-- =====================================================
-- SCRIPT 5: SCHÉMA TRANSACTION
-- Tables pour les transactions financières
-- =====================================================

\c ufaranga

-- Table principale des transactions
CREATE TABLE transaction.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Référence unique
    reference_transaction VARCHAR(50) UNIQUE NOT NULL,
    
    -- Type de transaction
    type_transaction VARCHAR(30) NOT NULL CHECK (type_transaction IN (
        'P2P', 'DEPOT', 'RETRAIT', 'PAIEMENT_MARCHAND', 'PAIEMENT_FACTURE',
        'RECHARGE_TELEPHONIQUE', 'VIREMENT_BANCAIRE', 'TRANSFERT_INTERNATIONAL',
        'COMMISSION', 'FRAIS', 'REMBOURSEMENT', 'AJUSTEMENT', 'INTEREST'
    )),
    
    -- Portefeuilles impliqués
    portefeuille_source_id UUID REFERENCES portefeuille.portefeuilles_virtuels(id) ON DELETE RESTRICT,
    portefeuille_destination_id UUID REFERENCES portefeuille.portefeuilles_virtuels(id) ON DELETE RESTRICT,
    
    -- Utilisateurs impliqués
    utilisateur_source_id UUID REFERENCES identite.utilisateurs(id) ON DELETE RESTRICT,
    utilisateur_destination_id UUID REFERENCES identite.utilisateurs(id) ON DELETE RESTRICT,
    
    -- Comptes bancaires RÉELS impliqués
    compte_bancaire_source_id UUID REFERENCES bancaire.comptes_bancaires_reels(id) ON DELETE RESTRICT,
    compte_bancaire_dest_id UUID REFERENCES bancaire.comptes_bancaires_reels(id) ON DELETE RESTRICT,
    
    -- Montants
    montant DECIMAL(18, 2) NOT NULL CHECK (montant > 0),
    devise VARCHAR(3) DEFAULT 'BIF' NOT NULL,
    montant_frais DECIMAL(18, 2) DEFAULT 0.00 CHECK (montant_frais >= 0),
    montant_commission DECIMAL(18, 2) DEFAULT 0.00 CHECK (montant_commission >= 0),
    montant_total DECIMAL(18, 2) NOT NULL,
    
    -- Taux de change
    taux_change DECIMAL(18, 6),
    devise_destination VARCHAR(3),
    montant_destination DECIMAL(18, 2),
    
    -- Description
    description TEXT NOT NULL,
    description_detaillee TEXT,
    motif VARCHAR(200),
    
    -- Statut
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut IN (
        'EN_ATTENTE', 'VALIDATION', 'TRAITEMENT', 'COMPLETE',
        'ECHEC', 'ANNULEE', 'REMBOURSEE', 'SUSPENDUE'
    )),
    
    -- Flux de traitement
    date_initiation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_validation TIMESTAMP WITH TIME ZONE,
    date_debut_traitement TIMESTAMP WITH TIME ZONE,
    date_completion TIMESTAMP WITH TIME ZONE,
    date_echec TIMESTAMP WITH TIME ZONE,
    date_annulation TIMESTAMP WITH TIME ZONE,
    duree_traitement_ms INTEGER,
    
    -- Raisons d'échec/annulation
    code_erreur VARCHAR(50),
    raison_echec TEXT,
    raison_annulation TEXT,
    annulee_par UUID REFERENCES identite.utilisateurs(id),
    
    -- Détection de fraude
    score_fraude INTEGER CHECK (score_fraude BETWEEN 0 AND 100),
    raison_score_fraude TEXT,
    flagged_fraude BOOLEAN DEFAULT FALSE,
    date_flag_fraude TIMESTAMP WITH TIME ZONE,
    
    -- Référence bancaire
    reference_banque VARCHAR(100),
    reference_externe VARCHAR(100),
    
    -- Localisation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    adresse_ip VARCHAR(45),
    pays_origine VARCHAR(2),
    ville_origine VARCHAR(100),
    
    -- Appareil
    id_appareil VARCHAR(255),
    type_appareil VARCHAR(20) CHECK (type_appareil IN ('MOBILE', 'WEB', 'TABLETTE', 'USSD', 'API')),
    agent_utilisateur TEXT,
    
    -- Canal
    canal VARCHAR(30) DEFAULT 'APP_MOBILE' CHECK (canal IN ('APP_MOBILE', 'APP_WEB', 'USSD', 'API', 'AGENT', 'GUICHET')),
    
    -- Métadonnées
    metadonnees JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    cree_par UUID,
    modifie_par UUID,
    
    CONSTRAINT chk_montant_total CHECK (montant_total = montant + montant_frais + montant_commission)
);

CREATE INDEX idx_transactions_reference ON transaction.transactions(reference_transaction);
CREATE INDEX idx_transactions_type ON transaction.transactions(type_transaction);
CREATE INDEX idx_transactions_statut ON transaction.transactions(statut);
CREATE INDEX idx_transactions_source_wallet ON transaction.transactions(portefeuille_source_id);
CREATE INDEX idx_transactions_dest_wallet ON transaction.transactions(portefeuille_destination_id);
CREATE INDEX idx_transactions_source_user ON transaction.transactions(utilisateur_source_id);
CREATE INDEX idx_transactions_dest_user ON transaction.transactions(utilisateur_destination_id);
CREATE INDEX idx_transactions_date_initiation ON transaction.transactions(date_initiation DESC);
CREATE INDEX idx_transactions_date_completion ON transaction.transactions(date_completion DESC);
CREATE INDEX idx_transactions_fraude ON transaction.transactions(score_fraude) WHERE score_fraude >= 70;

COMMENT ON TABLE transaction.transactions IS 'Transactions financières';

-- Table du grand livre comptable (IMMUABLE)
CREATE TABLE transaction.grand_livre_comptable (
    id BIGSERIAL PRIMARY KEY,
    
    -- Transaction liée
    transaction_id UUID NOT NULL REFERENCES transaction.transactions(id) ON DELETE RESTRICT,
    
    -- Compte affecté
    portefeuille_id UUID REFERENCES portefeuille.portefeuilles_virtuels(id) ON DELETE RESTRICT,
    compte_bancaire_id UUID REFERENCES bancaire.comptes_bancaires_reels(id) ON DELETE RESTRICT,
    
    -- Type d'écriture
    type_ecriture VARCHAR(10) NOT NULL CHECK (type_ecriture IN ('DEBIT', 'CREDIT')),
    
    -- Montants
    montant DECIMAL(18, 2) NOT NULL CHECK (montant > 0),
    devise VARCHAR(3) DEFAULT 'BIF' NOT NULL,
    
    -- Soldes
    solde_avant DECIMAL(18, 2) NOT NULL,
    solde_apres DECIMAL(18, 2) NOT NULL,
    
    -- Description
    libelle TEXT NOT NULL,
    reference VARCHAR(100),
    
    -- Compte de contrepartie
    compte_contrepartie_id UUID,
    type_compte_contrepartie VARCHAR(20) CHECK (type_compte_contrepartie IN ('PORTEFEUILLE', 'COMPTE_BANCAIRE', 'AUTRE')),
    
    -- Horodatage (IMMUABLE)
    date_ecriture TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT chk_solde_coherence CHECK (
        (type_ecriture = 'DEBIT' AND solde_apres = solde_avant - montant) OR
        (type_ecriture = 'CREDIT' AND solde_apres = solde_avant + montant)
    ),
    CONSTRAINT chk_compte_specifie CHECK (portefeuille_id IS NOT NULL OR compte_bancaire_id IS NOT NULL)
);

CREATE INDEX idx_grand_livre_transaction ON transaction.grand_livre_comptable(transaction_id);
CREATE INDEX idx_grand_livre_portefeuille ON transaction.grand_livre_comptable(portefeuille_id);
CREATE INDEX idx_grand_livre_compte_bancaire ON transaction.grand_livre_comptable(compte_bancaire_id);
CREATE INDEX idx_grand_livre_date ON transaction.grand_livre_comptable(date_ecriture DESC);
CREATE INDEX idx_grand_livre_type ON transaction.grand_livre_comptable(type_ecriture);

COMMENT ON TABLE transaction.grand_livre_comptable IS 'Grand livre comptable - TABLE IMMUABLE';

-- Trigger pour protéger le grand livre (IMMUABLE)
CREATE OR REPLACE FUNCTION transaction.proteger_grand_livre()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'INTERDIT: Le grand livre comptable ne peut pas être modifié ou supprimé (TABLE IMMUABLE)';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_proteger_update_grand_livre
BEFORE UPDATE ON transaction.grand_livre_comptable
FOR EACH ROW
EXECUTE PROCEDURE transaction.proteger_grand_livre();

CREATE TRIGGER trigger_proteger_delete_grand_livre
BEFORE DELETE ON transaction.grand_livre_comptable
FOR EACH ROW
EXECUTE PROCEDURE transaction.proteger_grand_livre();
