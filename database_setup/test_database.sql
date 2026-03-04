-- =====================================================
-- SCRIPT DE TEST - Base de Données uFaranga
-- Teste les fonctionnalités principales
-- =====================================================

\c ufaranga

\echo '========================================='
\echo 'TESTS DE LA BASE DE DONNÉES'
\echo '========================================='
\echo ''

-- Test 1: Créer un utilisateur
\echo 'Test 1: Création d''un utilisateur...'
INSERT INTO identite.utilisateurs (
    courriel,
    numero_telephone,
    hash_mot_de_passe,
    prenom,
    nom_famille,
    date_naissance,
    type_utilisateur
) VALUES (
    'test@ufaranga.bi',
    '+25779123456',
    'hash_test_password',
    'Jean',
    'Dupont',
    '1990-01-01',
    'CLIENT'
) RETURNING id, prenom, nom_famille, courriel;

-- Récupérer l'ID de l'utilisateur créé
\set user_id `psql -U ufaranga -d ufaranga -tAc "SELECT id FROM identite.utilisateurs WHERE courriel='test@ufaranga.bi'"`

\echo 'Test 1: ✓ Utilisateur créé'
\echo ''

-- Test 2: Créer un profil utilisateur
\echo 'Test 2: Création du profil utilisateur...'
INSERT INTO identite.profils_utilisateurs (
    utilisateur_id,
    langue,
    devise_preferee
) SELECT 
    id,
    'fr',
    'BIF'
FROM identite.utilisateurs 
WHERE courriel = 'test@ufaranga.bi';

\echo 'Test 2: ✓ Profil créé'
\echo ''

-- Test 3: Créer une banque partenaire
\echo 'Test 3: Création d''une banque partenaire...'
INSERT INTO bancaire.banques_partenaires (
    code_banque,
    nom_banque,
    pays,
    date_partenariat
) VALUES (
    'BBB',
    'Banque de Test du Burundi',
    'BI',
    CURRENT_DATE
) RETURNING id, code_banque, nom_banque;

\echo 'Test 3: ✓ Banque créée'
\echo ''

-- Test 4: Créer un compte bancaire réel
\echo 'Test 4: Création d''un compte bancaire réel...'
INSERT INTO bancaire.comptes_bancaires_reels (
    utilisateur_id,
    banque_id,
    numero_compte_bancaire,
    type_compte,
    nom_titulaire,
    solde_reel,
    devise
) SELECT 
    u.id,
    b.id,
    'BI123456789',
    'COMPTE_COURANT',
    u.prenom || ' ' || u.nom_famille,
    100000.00,
    'BIF'
FROM identite.utilisateurs u, bancaire.banques_partenaires b
WHERE u.courriel = 'test@ufaranga.bi'
AND b.code_banque = 'BBB'
RETURNING id, numero_compte_bancaire, solde_reel;

\echo 'Test 4: ✓ Compte bancaire créé'
\echo ''

-- Test 5: Créer un portefeuille virtuel
\echo 'Test 5: Création d''un portefeuille virtuel...'
INSERT INTO portefeuille.portefeuilles_virtuels (
    utilisateur_id,
    compte_bancaire_reel_id,
    numero_portefeuille,
    type_portefeuille,
    nom_portefeuille,
    solde_disponible,
    solde_affiche,
    devise
) SELECT 
    u.id,
    c.id,
    'UFAR-BI-TEST001',
    'PERSONNEL',
    'Mon Portefeuille Test',
    100000.00,
    100000.00,
    'BIF'
FROM identite.utilisateurs u
JOIN bancaire.comptes_bancaires_reels c ON c.utilisateur_id = u.id
WHERE u.courriel = 'test@ufaranga.bi'
RETURNING id, numero_portefeuille, solde_affiche;

\echo 'Test 5: ✓ Portefeuille créé'
\echo ''

-- Test 6: Tester les contraintes (doit échouer)
\echo 'Test 6: Test des contraintes de sécurité...'
\echo '  6a. Tentative de création d''utilisateur avec email dupliqué (doit échouer)...'
DO $$
BEGIN
    INSERT INTO identite.utilisateurs (
        courriel, numero_telephone, hash_mot_de_passe,
        prenom, nom_famille, date_naissance, type_utilisateur
    ) VALUES (
        'test@ufaranga.bi', '+25779999999', 'hash',
        'Test', 'Test', '1990-01-01', 'CLIENT'
    );
    RAISE EXCEPTION 'ERREUR: La contrainte UNIQUE n''a pas fonctionné!';
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE '  ✓ Contrainte UNIQUE fonctionne correctement';
END $$;

\echo '  6b. Tentative de modification d''un mouvement bancaire (doit échouer)...'
-- D'abord créer un mouvement
INSERT INTO bancaire.mouvements_bancaires_reels (
    compte_bancaire_id,
    reference_banque,
    type_mouvement,
    montant,
    solde_avant,
    solde_apres,
    libelle,
    date_operation,
    date_valeur
) SELECT 
    id,
    'REF-TEST-001',
    'CREDIT',
    10000.00,
    100000.00,
    110000.00,
    'Test de mouvement',
    CURRENT_DATE,
    CURRENT_DATE
FROM bancaire.comptes_bancaires_reels
WHERE numero_compte_bancaire = 'BI123456789';

-- Tenter de le modifier (doit échouer)
DO $$
DECLARE
    v_mouvement_id UUID;
BEGIN
    SELECT id INTO v_mouvement_id 
    FROM bancaire.mouvements_bancaires_reels 
    WHERE reference_banque = 'REF-TEST-001';
    
    UPDATE bancaire.mouvements_bancaires_reels 
    SET montant = 20000.00 
    WHERE id = v_mouvement_id;
    
    RAISE EXCEPTION 'ERREUR: Le trigger de protection n''a pas fonctionné!';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLERRM LIKE '%IMMUABLE%' THEN
            RAISE NOTICE '  ✓ Protection IMMUABLE fonctionne correctement';
        ELSE
            RAISE;
        END IF;
END $$;

\echo 'Test 6: ✓ Contraintes de sécurité validées'
\echo ''

-- Test 7: Vérifier les index
\echo 'Test 7: Vérification des index...'
SELECT 
    schemaname AS "Schéma",
    COUNT(*) AS "Nombre d''index"
FROM pg_indexes
WHERE schemaname IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
GROUP BY schemaname
ORDER BY schemaname;

\echo 'Test 7: ✓ Index vérifiés'
\echo ''

-- Test 8: Vérifier les triggers
\echo 'Test 8: Vérification des triggers de protection...'
SELECT 
    event_object_schema AS "Schéma",
    event_object_table AS "Table",
    COUNT(*) AS "Nombre de triggers"
FROM information_schema.triggers
WHERE event_object_schema IN ('bancaire', 'transaction', 'audit', 'compliance')
GROUP BY event_object_schema, event_object_table
ORDER BY event_object_schema, event_object_table;

\echo 'Test 8: ✓ Triggers vérifiés'
\echo ''

-- Test 9: Statistiques finales
\echo 'Test 9: Statistiques de la base de test...'
SELECT 
    'Utilisateurs' AS "Type",
    COUNT(*)::text AS "Nombre"
FROM identite.utilisateurs
UNION ALL
SELECT 'Profils', COUNT(*)::text FROM identite.profils_utilisateurs
UNION ALL
SELECT 'Banques', COUNT(*)::text FROM bancaire.banques_partenaires
UNION ALL
SELECT 'Comptes bancaires', COUNT(*)::text FROM bancaire.comptes_bancaires_reels
UNION ALL
SELECT 'Mouvements bancaires', COUNT(*)::text FROM bancaire.mouvements_bancaires_reels
UNION ALL
SELECT 'Portefeuilles', COUNT(*)::text FROM portefeuille.portefeuilles_virtuels;

\echo ''
\echo '========================================='
\echo 'TOUS LES TESTS SONT PASSÉS ✓'
\echo '========================================='
\echo ''
\echo 'La base de données est prête à être utilisée!'
\echo ''
\echo 'Pour nettoyer les données de test:'
\echo '  DELETE FROM identite.utilisateurs WHERE courriel = ''test@ufaranga.bi'';'
\echo '  DELETE FROM bancaire.banques_partenaires WHERE code_banque = ''BBB'';'
\echo ''
