# 📋 Ordre d'Exécution des Scripts SQL

Ce document explique l'ordre exact d'exécution des scripts pour créer la base de données uFaranga.

## 🎯 Méthode Recommandée

### Option 1: Script Automatique (Le plus simple)

```bash
# Linux/Mac
cd database_setup
chmod +x setup_database.sh
./setup_database.sh

# Windows PowerShell
cd database_setup
.\setup_database.ps1
```

### Option 2: Script SQL Principal

```bash
cd database_setup
psql -U postgres -f 00_EXECUTE_ALL.sql
```

## 📝 Ordre Manuel (si nécessaire)

Si vous devez exécuter les scripts manuellement, suivez cet ordre EXACT:

### 1️⃣ Initialisation (OBLIGATOIRE)

```bash
psql -U postgres -f 01_init_database.sql
```

**Ce script:**
- Crée la base de données `ufaranga`
- Installe les extensions PostgreSQL
- Crée les 9 schémas

**⚠️ Important:** Tous les scripts suivants doivent être exécutés sur la base `ufaranga`

### 2️⃣ Schéma IDENTITE (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 02_schema_identite.sql
```

**Tables créées:**
- `identite.utilisateurs`
- `identite.profils_utilisateurs`

**Dépendances:** Aucune

### 3️⃣ Schéma BANCAIRE (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 03_schema_bancaire.sql
```

**Tables créées:**
- `bancaire.banques_partenaires`
- `bancaire.comptes_bancaires_reels`
- `bancaire.mouvements_bancaires_reels` (IMMUABLE)

**Dépendances:**
- ✅ `identite.utilisateurs` (clé étrangère)

### 4️⃣ Schéma PORTEFEUILLE (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 04_schema_portefeuille.sql
```

**Tables créées:**
- `portefeuille.portefeuilles_virtuels`

**Dépendances:**
- ✅ `identite.utilisateurs`
- ✅ `bancaire.comptes_bancaires_reels`

### 5️⃣ Schéma TRANSACTION (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 05_schema_transaction.sql
```

**Tables créées:**
- `transaction.transactions`
- `transaction.grand_livre_comptable` (IMMUABLE)

**Dépendances:**
- ✅ `identite.utilisateurs`
- ✅ `portefeuille.portefeuilles_virtuels`
- ✅ `bancaire.comptes_bancaires_reels`

### 6️⃣ Schéma AUDIT (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 06_schema_audit.sql
```

**Tables créées:**
- `audit.sessions_utilisateurs`
- `audit.journaux_evenements` (IMMUABLE)
- `audit.historique_modifications` (IMMUABLE)

**Dépendances:**
- ✅ `identite.utilisateurs`

### 7️⃣ Schéma COMPLIANCE (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 07_schema_compliance.sql
```

**Tables créées:**
- `compliance.documents_kyc`
- `compliance.verifications_kyc` (IMMUABLE)
- `compliance.screening_aml` (IMMUABLE)

**Dépendances:**
- ✅ `identite.utilisateurs`

### 8️⃣ Schémas COMMISSION et NOTIFICATION (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 08_schema_commission_notification.sql
```

**Tables créées:**
- `commission.grilles_commissions`
- `commission.commissions`
- `notification.notifications`

**Dépendances:**
- ✅ `identite.utilisateurs`
- ✅ `transaction.transactions`

### 9️⃣ Schéma CONFIGURATION (OBLIGATOIRE)

```bash
psql -U postgres -d ufaranga -f 09_schema_configuration.sql
```

**Tables créées:**
- `configuration.parametres_systeme`
- `configuration.limites_transactions`
- `configuration.taux_change`
- `configuration.blacklist`

**Dépendances:**
- ✅ `identite.utilisateurs`

### 🔟 Schéma LOCALISATION (Pays → Province → District → Quartier → Point de service)

```bash
psql -U postgres -d ufaranga -f 11_schema_localisation.sql
```

**Tables créées:**
- `localisation.pays`
- `localisation.provinces`
- `localisation.districts`
- `localisation.quartiers`
- `localisation.points_de_service`

**Colonnes ajoutées à `identite.utilisateurs`:**
- `pays_id`, `province_id`, `district_id`, `quartier_id`, `point_de_service_id` (liaison à la localisation)

**Dépendances:**
- ✅ `identite.utilisateurs`

### 1️⃣1️⃣ Vérification (OPTIONNEL mais recommandé)

```bash
psql -U postgres -d ufaranga -f 10_verify_installation.sql
```

**Ce script vérifie:**
- ✅ Extensions installées
- ✅ Schémas créés
- ✅ Tables créées
- ✅ Clés étrangères
- ✅ Index
- ✅ Triggers de protection

### 1️⃣2️⃣ Tests (OPTIONNEL)

```bash
psql -U postgres -d ufaranga -f test_database.sql
```

**Ce script teste:**
- ✅ Création d'utilisateur
- ✅ Création de profil
- ✅ Création de banque
- ✅ Création de compte bancaire
- ✅ Création de portefeuille
- ✅ Contraintes de sécurité
- ✅ Tables IMMUABLES

## ⚠️ Erreurs Courantes

### Erreur: "database does not exist"

**Cause:** Vous n'avez pas exécuté le script 01 ou vous n'êtes pas connecté à la bonne base.

**Solution:**
```bash
# Exécuter d'abord le script 01
psql -U postgres -f 01_init_database.sql

# Puis se connecter à la base ufaranga
psql -U postgres -d ufaranga
```

### Erreur: "relation does not exist"

**Cause:** Vous n'avez pas respecté l'ordre d'exécution.

**Solution:** Recommencez depuis le début en suivant l'ordre exact.

### Erreur: "syntax error at or near FUNCTION"

**Cause:** Version PostgreSQL < 11 (voir [COMPATIBILITY_NOTES.md](COMPATIBILITY_NOTES.md))

**Solution:** Les scripts utilisent maintenant `EXECUTE PROCEDURE` compatible avec PostgreSQL 10+.

### Erreur: "permission denied"

**Cause:** L'utilisateur n'a pas les privilèges nécessaires.

**Solution:**
```sql
-- En tant que superuser
GRANT ALL PRIVILEGES ON DATABASE ufaranga TO ufaranga;
GRANT ALL ON SCHEMA public TO ufaranga;
```

## 🔄 Réinitialisation Complète

Si vous devez tout recommencer:

```bash
# Supprimer la base de données
psql -U postgres -c "DROP DATABASE IF EXISTS ufaranga;"

# Relancer le script principal
psql -U postgres -f 00_EXECUTE_ALL.sql
```

## 📊 Graphe de Dépendances

```
01_init_database.sql (Base + Extensions + Schémas)
    ↓
02_schema_identite.sql (Utilisateurs)
    ↓
    ├─→ 03_schema_bancaire.sql (Banques + Comptes)
    │       ↓
    │   04_schema_portefeuille.sql (Portefeuilles)
    │       ↓
    │   05_schema_transaction.sql (Transactions)
    │
    ├─→ 06_schema_audit.sql (Audit)
    │
    ├─→ 07_schema_compliance.sql (KYC/AML)
    │
    └─→ 08_schema_commission_notification.sql (Commissions + Notifications)
            ↓
        09_schema_configuration.sql (Configuration)
            ↓
        10_verify_installation.sql (Vérification)
            ↓
        test_database.sql (Tests)
```

## ✅ Checklist de Vérification

Après l'exécution, vérifiez:

- [ ] 9 schémas créés
- [ ] 20+ tables créées
- [ ] 4 extensions installées
- [ ] 50+ index créés
- [ ] 6 triggers de protection créés
- [ ] Toutes les clés étrangères en place
- [ ] Aucune erreur dans les logs

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs PostgreSQL
2. Consultez [COMPATIBILITY_NOTES.md](COMPATIBILITY_NOTES.md)
3. Exécutez le script de vérification
4. Contactez le support technique

## 🎓 Bonnes Pratiques

1. **Toujours sauvegarder** avant de modifier la base
2. **Tester sur un environnement de dev** avant la production
3. **Vérifier les logs** après chaque exécution
4. **Documenter** toute modification des scripts
5. **Versionner** les changements de schéma

---

**Note:** Ces scripts sont idempotents (peuvent être exécutés plusieurs fois) grâce aux clauses `IF NOT EXISTS` et `IF EXISTS`.
