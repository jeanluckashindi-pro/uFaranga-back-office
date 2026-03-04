-- =====================================================
-- Droits schéma NOTIFICATION pour l'utilisateur Django (ufaranga)
-- À exécuter en tant que superuser (postgres) si erreur "permission denied for schema notification"
-- Usage: psql -U postgres -d ufaranga -f grant_schema_notification.sql
-- =====================================================

\c ufaranga

GRANT USAGE ON SCHEMA notification TO ufaranga;
GRANT SELECT, INSERT, UPDATE, DELETE ON notification.notifications TO ufaranga;
