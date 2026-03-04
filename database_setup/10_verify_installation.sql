-- =====================================================
-- SCRIPT 10: VÉRIFICATION DE L'INSTALLATION
-- Vérifie que tous les schémas, tables et relations sont créés
-- =====================================================

\c ufaranga

\echo '========================================='
\echo 'VÉRIFICATION DE L''INSTALLATION'
\echo '========================================='
\echo ''

-- Vérifier les extensions
\echo '1. Vérification des extensions PostgreSQL...'
SELECT 
    extname AS "Extension",
    extversion AS "Version"
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_trgm', 'btree_gist')
ORDER BY extname;

\echo ''
\echo '2. Vérification des schémas...'
SELECT 
    schema_name AS "Schéma",
    CASE 
        WHEN schema_name IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration') 
        THEN '✓ OK'
        ELSE '✗ Manquant'
    END AS "Statut"
FROM information_schema.schemata
WHERE schema_name IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
ORDER BY schema_name;

\echo ''
\echo '3. Nombre de tables par schéma...'
SELECT 
    table_schema AS "Schéma",
    COUNT(*) AS "Nombre de tables"
FROM information_schema.tables
WHERE table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
    AND table_type = 'BASE TABLE'
GROUP BY table_schema
ORDER BY table_schema;

\echo ''
\echo '4. Liste des tables créées...'
SELECT 
    table_schema AS "Schéma",
    table_name AS "Table"
FROM information_schema.tables
WHERE table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
    AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

\echo ''
\echo '5. Vérification des clés étrangères...'
SELECT 
    tc.table_schema AS "Schéma",
    tc.table_name AS "Table",
    kcu.column_name AS "Colonne",
    ccu.table_schema AS "Schéma référencé",
    ccu.table_name AS "Table référencée",
    ccu.column_name AS "Colonne référencée"
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
ORDER BY tc.table_schema, tc.table_name;

\echo ''
\echo '6. Vérification des index...'
SELECT 
    schemaname AS "Schéma",
    tablename AS "Table",
    indexname AS "Index"
FROM pg_indexes
WHERE schemaname IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
ORDER BY schemaname, tablename, indexname;

\echo ''
\echo '7. Vérification des triggers (protection IMMUABLE)...'
SELECT 
    event_object_schema AS "Schéma",
    event_object_table AS "Table",
    trigger_name AS "Trigger",
    event_manipulation AS "Événement"
FROM information_schema.triggers
WHERE event_object_schema IN ('bancaire', 'transaction', 'audit', 'compliance')
ORDER BY event_object_schema, event_object_table, trigger_name;

\echo ''
\echo '8. Vérification des contraintes CHECK...'
SELECT 
    tc.table_schema AS "Schéma",
    tc.table_name AS "Table",
    tc.constraint_name AS "Contrainte",
    cc.check_clause AS "Condition"
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
    AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_schema, tc.table_name;

\echo ''
\echo '9. Statistiques globales...'
SELECT 
    'Schémas créés' AS "Élément",
    COUNT(DISTINCT table_schema)::text AS "Nombre"
FROM information_schema.tables
WHERE table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
UNION ALL
SELECT 
    'Tables créées',
    COUNT(*)::text
FROM information_schema.tables
WHERE table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
    AND table_type = 'BASE TABLE'
UNION ALL
SELECT 
    'Clés étrangères',
    COUNT(*)::text
FROM information_schema.table_constraints
WHERE table_schema IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
    AND constraint_type = 'FOREIGN KEY'
UNION ALL
SELECT 
    'Index créés',
    COUNT(*)::text
FROM pg_indexes
WHERE schemaname IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')
UNION ALL
SELECT 
    'Triggers créés',
    COUNT(*)::text
FROM information_schema.triggers
WHERE event_object_schema IN ('bancaire', 'transaction', 'audit', 'compliance');

\echo ''
\echo '========================================='
\echo 'VÉRIFICATION TERMINÉE'
\echo '========================================='
\echo ''
\echo 'Si tous les éléments sont présents, l''installation est réussie!'
\echo ''
\echo 'Prochaines étapes:'
\echo '1. cd ../backend'
\echo '2. python manage.py migrate'
\echo '3. python manage.py init_configuration'
\echo '4. python manage.py createsuperuser'
\echo '5. python manage.py runserver'
\echo ''
