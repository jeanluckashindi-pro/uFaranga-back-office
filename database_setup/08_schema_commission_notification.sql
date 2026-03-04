-- =====================================================
-- SCRIPT 8: SCHÉMAS COMMISSION ET NOTIFICATION
-- Tables pour commissions et notifications
-- =====================================================

\c ufaranga

-- =====================================================
-- SCHÉMA COMMISSION
-- =====================================================

-- Table des grilles de commissions
CREATE TABLE commission.grilles_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Applicabilité
    type_transaction VARCHAR(30) NOT NULL,
    type_utilisateur VARCHAR(20),
    niveau_kyc INTEGER CHECK (niveau_kyc BETWEEN 0 AND 3),
    
    -- Montant de transaction
    montant_min DECIMAL(18, 2) DEFAULT 0.00,
    montant_max DECIMAL(18, 2),
    
    -- Commission
    type_commission VARCHAR(20) NOT NULL CHECK (type_commission IN ('FIXE', 'POURCENTAGE', 'MIXTE')),
    montant_fixe DECIMAL(18, 2) DEFAULT 0.00,
    pourcentage DECIMAL(5, 2) DEFAULT 0.00,
    commission_min DECIMAL(18, 2),
    commission_max DECIMAL(18, 2),
    
    -- Priorité
    priorite INTEGER DEFAULT 0,
    
    -- Période de validité
    date_debut_validite DATE NOT NULL DEFAULT CURRENT_DATE,
    date_fin_validite DATE,
    
    -- Statut
    est_active BOOLEAN DEFAULT TRUE,
    
    -- Métadonnées
    description TEXT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    cree_par UUID REFERENCES identite.utilisateurs(id),
    modifie_par UUID REFERENCES identite.utilisateurs(id),
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_commission_grilles_type ON commission.grilles_commissions(type_transaction);
CREATE INDEX idx_commission_grilles_validite ON commission.grilles_commissions(date_debut_validite, date_fin_validite);
CREATE INDEX idx_commission_grilles_active ON commission.grilles_commissions(est_active) WHERE est_active = TRUE;

COMMENT ON TABLE commission.grilles_commissions IS 'Grilles de tarification des commissions';

-- Table des commissions calculées
CREATE TABLE commission.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Transaction liée
    transaction_id UUID UNIQUE NOT NULL REFERENCES transaction.transactions(id) ON DELETE RESTRICT,
    
    -- Bénéficiaire
    beneficiaire_id UUID REFERENCES identite.utilisateurs(id),
    type_beneficiaire VARCHAR(20) CHECK (type_beneficiaire IN ('AGENT', 'MARCHAND', 'PARRAIN', 'PLATEFORME')),
    
    -- Grille appliquée
    grille_commission_id UUID REFERENCES commission.grilles_commissions(id),
    
    -- Type et montant
    type_commission VARCHAR(50) NOT NULL,
    montant_commission DECIMAL(18, 2) NOT NULL CHECK (montant_commission >= 0),
    devise VARCHAR(3) DEFAULT 'BIF',
    
    -- Détails du calcul
    base_calcul DECIMAL(18, 2),
    pourcentage_applique DECIMAL(5, 2),
    montant_fixe_applique DECIMAL(18, 2),
    
    -- Statut de paiement
    statut_paiement VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut_paiement IN ('EN_ATTENTE', 'PAYEE', 'SUSPENDUE', 'ANNULEE')),
    date_paiement TIMESTAMP WITH TIME ZONE,
    reference_paiement VARCHAR(100),
    
    -- Horodatage
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_commissions_transaction ON commission.commissions(transaction_id);
CREATE INDEX idx_commissions_beneficiaire ON commission.commissions(beneficiaire_id);
CREATE INDEX idx_commissions_statut ON commission.commissions(statut_paiement);
CREATE INDEX idx_commissions_date ON commission.commissions(date_creation DESC);

COMMENT ON TABLE commission.commissions IS 'Commissions calculées et payées';

-- =====================================================
-- SCHÉMA NOTIFICATION
-- =====================================================

-- Table des notifications
CREATE TABLE notification.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES identite.utilisateurs(id) ON DELETE CASCADE,
    
    -- Type et canal
    type_notification VARCHAR(50) NOT NULL CHECK (type_notification IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WEBHOOK')),
    canal VARCHAR(20) NOT NULL,
    
    -- Destinataire
    destinataire VARCHAR(255) NOT NULL,
    
    -- Contenu
    sujet VARCHAR(255),
    message TEXT NOT NULL,
    message_html TEXT,
    
    -- Template
    template_id VARCHAR(100),
    variables_template JSONB,
    
    -- Priorité
    priorite VARCHAR(20) DEFAULT 'NORMALE' CHECK (priorite IN ('FAIBLE', 'NORMALE', 'HAUTE', 'URGENTE')),
    
    -- Envoi
    statut_envoi VARCHAR(20) DEFAULT 'EN_ATTENTE' CHECK (statut_envoi IN ('EN_ATTENTE', 'ENVOYE', 'ECHEC', 'ANNULE')),
    nombre_tentatives INTEGER DEFAULT 0,
    max_tentatives INTEGER DEFAULT 3,
    date_envoi TIMESTAMP WITH TIME ZONE,
    date_lecture TIMESTAMP WITH TIME ZONE,
    
    -- Erreurs
    erreur_envoi TEXT,
    code_erreur VARCHAR(50),
    
    -- Planification
    date_planification TIMESTAMP WITH TIME ZONE,
    
    -- Fournisseur
    fournisseur VARCHAR(50),
    id_externe VARCHAR(100),
    
    -- Métadonnées
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadonnees JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_notifications_utilisateur ON notification.notifications(utilisateur_id);
CREATE INDEX idx_notifications_statut ON notification.notifications(statut_envoi);
CREATE INDEX idx_notifications_type ON notification.notifications(type_notification);
CREATE INDEX idx_notifications_en_attente ON notification.notifications(statut_envoi, nombre_tentatives, date_planification) 
    WHERE statut_envoi = 'EN_ATTENTE';

COMMENT ON TABLE notification.notifications IS 'File de notifications';

-- =====================================================
-- Droits pour l'utilisateur Django (ufaranga)
-- À exécuter en tant que postgres si les schémas ont été créés par postgres
-- =====================================================
GRANT USAGE ON SCHEMA notification TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON notification.notifications TO ufaranga;

GRANT USAGE ON SCHEMA commission TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON commission.grilles_commissions TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON commission.commissions TO ufaranga;
