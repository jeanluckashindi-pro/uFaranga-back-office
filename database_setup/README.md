# Scripts de Création de la Base de Données uFaranga

Ce dossier contient tous les scripts SQL nécessaires pour créer la base de données PostgreSQL complète pour uFaranga.

## 📋 Prérequis

- PostgreSQL 15 ou supérieur
- Accès superuser à PostgreSQL
- Extensions PostgreSQL: uuid-ossp, pgcrypto, pg_trgm, btree_gist

## 🚀 Installation Rapide

### Option 1: Exécution automatique (Recommandé)

```bash
# Se placer dans le dossier database_setup
cd database_setup

# Exécuter le script principal
psql -U postgres -f 00_EXECUTE_ALL.sql
```

Ce script va:
1. Créer la base de données `ufaranga`
2. Créer tous les schémas
3. Créer toutes les tables avec leurs relations
4. Créer tous les index
5. Créer tous les triggers de protection

### Option 2: Exécution manuelle étape par étape

```bash
# 1. Initialisation
psql -U postgres -f 01_init_database.sql

# 2. Schéma IDENTITE
psql -U postgres -d ufaranga -f 02_schema_identite.sql

# 3. Schéma BANCAIRE
psql -U postgres -d ufaranga -f 03_schema_bancaire.sql

# 4. Schéma PORTEFEUILLE
psql -U postgres -d ufaranga -f 04_schema_portefeuille.sql

# 5. Schéma TRANSACTION
psql -U postgres -d ufaranga -f 05_schema_transaction.sql

# 6. Schéma AUDIT
psql -U postgres -d ufaranga -f 06_schema_audit.sql

# 7. Schéma COMPLIANCE
psql -U postgres -d ufaranga -f 07_schema_compliance.sql

# 8. Schémas COMMISSION et NOTIFICATION
psql -U postgres -d ufaranga -f 08_schema_commission_notification.sql

# 9. Schéma CONFIGURATION
psql -U postgres -d ufaranga -f 09_schema_configuration.sql
```

## 📁 Structure des Scripts

| Script | Description |
|--------|-------------|
| `00_EXECUTE_ALL.sql` | Script principal qui exécute tous les autres |
| `01_init_database.sql` | Création de la base et des extensions |
| `02_schema_identite.sql` | Tables utilisateurs et profils |
| `03_schema_bancaire.sql` | Tables banques et comptes réels |
| `04_schema_portefeuille.sql` | Tables portefeuilles virtuels |
| `05_schema_transaction.sql` | Tables transactions et grand livre |
| `06_schema_audit.sql` | Tables audit et traçabilité |
| `07_schema_compliance.sql` | Tables KYC et AML |
| `08_schema_commission_notification.sql` | Tables commissions et notifications |
| `09_schema_configuration.sql` | Tables configuration système |

## 🔐 Configuration de l'Utilisateur

Par défaut, les scripts utilisent l'utilisateur `ufaranga`. Pour créer cet utilisateur:

```sql
-- En tant que superuser
CREATE USER ufaranga WITH PASSWORD 'votre_mot_de_passe_securise';
ALTER USER ufaranga WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE ufaranga TO ufaranga;
```

## ✅ Vérification de l'Installation

Après l'exécution des scripts, vérifiez que tout est en place:

```sql
-- Se connecter à la base
psql -U ufaranga -d ufaranga

-- Lister les schémas
\dn

-- Résultat attendu:
--   identite
--   bancaire
--   portefeuille
--   transaction
--   audit
--   compliance
--   commission
--   notification
--   configuration

-- Lister les tables de chaque schéma
\dt identite.*
\dt bancaire.*
\dt portefeuille.*
\dt transaction.*
\dt audit.*
\dt compliance.*
\dt commission.*
\dt notification.*
\dt configuration.*

-- Vérifier les extensions
\dx

-- Résultat attendu:
--   uuid-ossp
--   pgcrypto
--   pg_trgm
--   btree_gist
```

## 🏗️ Architecture de la Base de Données

### Schémas et leurs Tables

#### IDENTITE
- `utilisateurs` - Utilisateurs du système
- `profils_utilisateurs` - Profils et préférences

#### BANCAIRE
- `banques_partenaires` - Banques partenaires
- `comptes_bancaires_reels` - Comptes bancaires réels
- `mouvements_bancaires_reels` - Mouvements bancaires (IMMUABLE)

#### PORTEFEUILLE
- `portefeuilles_virtuels` - Portefeuilles virtuels uFaranga

#### TRANSACTION
- `transactions` - Transactions financières
- `grand_livre_comptable` - Grand livre comptable (IMMUABLE)

#### AUDIT
- `sessions_utilisateurs` - Sessions de connexion
- `journaux_evenements` - Journal des événements (IMMUABLE)
- `historique_modifications` - Historique des modifications (IMMUABLE)

#### COMPLIANCE
- `documents_kyc` - Documents d'identité
- `verifications_kyc` - Vérifications KYC (IMMUABLE)
- `screening_aml` - Screening AML (IMMUABLE)

#### COMMISSION
- `grilles_commissions` - Grilles de tarification
- `commissions` - Commissions calculées

#### NOTIFICATION
- `notifications` - File de notifications

#### CONFIGURATION
- `parametres_systeme` - Paramètres système
- `limites_transactions` - Limites de transaction
- `taux_change` - Taux de change
- `blacklist` - Liste noire

## 🔒 Tables IMMUABLES

Certaines tables sont protégées contre les modifications et suppressions:

- `bancaire.mouvements_bancaires_reels`
- `transaction.grand_livre_comptable`
- `audit.journaux_evenements`
- `audit.historique_modifications`
- `compliance.verifications_kyc`
- `compliance.screening_aml`

Ces tables ont des triggers qui empêchent toute modification après insertion.

## 🔗 Relations Principales

```
utilisateurs (identite)
    ↓
comptes_bancaires_reels (bancaire)
    ↓
portefeuilles_virtuels (portefeuille)
    ↓
transactions (transaction)
    ↓
grand_livre_comptable (transaction)
```

## 🐛 Dépannage

### Erreur: "database already exists"

```sql
-- Supprimer la base existante
DROP DATABASE IF EXISTS ufaranga;
```

### Erreur: "extension does not exist"

```sql
-- Installer les extensions (en tant que superuser)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
```

### Erreur: "permission denied"

```sql
-- Donner les privilèges nécessaires
GRANT ALL PRIVILEGES ON DATABASE ufaranga TO ufaranga;
GRANT ALL ON SCHEMA public TO ufaranga;
```

## 📝 Prochaines Étapes

Après la création de la base de données:

1. **Migrations Django**
   ```bash
   cd backend
   python manage.py migrate
   ```

2. **Initialiser la configuration**
   ```bash
   python manage.py init_configuration
   ```

3. **Créer un superutilisateur**
   ```bash
   python manage.py createsuperuser
   ```

4. **Lancer le serveur**
   ```bash
   python manage.py runserver
   ```

## 📞 Support

Pour toute question ou problème:
- Consultez la documentation complète dans `backend/ARCHITECTURE.md`
- Vérifiez les logs PostgreSQL: `/var/log/postgresql/`
- Contactez l'équipe technique

## 📄 Licence

Propriétaire - uFaranga © 2024
