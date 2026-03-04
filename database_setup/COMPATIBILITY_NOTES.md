# Notes de Compatibilité PostgreSQL

## Versions Supportées

Les scripts SQL sont compatibles avec:
- ✅ PostgreSQL 10+
- ✅ PostgreSQL 11+
- ✅ PostgreSQL 12+
- ✅ PostgreSQL 13+
- ✅ PostgreSQL 14+
- ✅ PostgreSQL 15+ (Recommandé)

## Changements de Syntaxe

### EXECUTE PROCEDURE vs EXECUTE FUNCTION

**PostgreSQL 11+** a introduit `EXECUTE FUNCTION` pour les triggers, mais `EXECUTE PROCEDURE` reste supporté pour la rétrocompatibilité.

Nos scripts utilisent `EXECUTE PROCEDURE` pour assurer la compatibilité avec PostgreSQL 10+.

```sql
-- ✅ Compatible PostgreSQL 10+
CREATE TRIGGER mon_trigger
BEFORE UPDATE ON ma_table
FOR EACH ROW
EXECUTE PROCEDURE ma_fonction();

-- ✅ Compatible PostgreSQL 11+ uniquement
CREATE TRIGGER mon_trigger
BEFORE UPDATE ON ma_table
FOR EACH ROW
EXECUTE FUNCTION ma_fonction();
```

## Extensions Requises

Toutes les extensions utilisées sont disponibles depuis PostgreSQL 9.6+:

| Extension | Version Min | Description |
|-----------|-------------|-------------|
| uuid-ossp | 9.4+ | Génération d'UUID |
| pgcrypto | 9.4+ | Fonctions de chiffrement |
| pg_trgm | 9.1+ | Recherche trigram (full-text) |
| btree_gist | 9.1+ | Index GiST pour types B-tree |

## Fonctionnalités Utilisées

### JSONB (PostgreSQL 9.4+)

Tous les champs `metadonnees` utilisent le type JSONB pour un stockage efficace.

```sql
metadonnees JSONB DEFAULT '{}'::jsonb
```

### CHECK Constraints avec IN (PostgreSQL 9.5+)

```sql
statut VARCHAR(20) CHECK (statut IN ('ACTIF', 'SUSPENDU', 'BLOQUE'))
```

### Partial Indexes (PostgreSQL 7.2+)

```sql
CREATE INDEX idx_actif ON ma_table(est_actif) WHERE est_actif = TRUE;
```

### Array Types (PostgreSQL 8.0+)

```sql
champs_modifies TEXT[]
listes_matchees TEXT[]
```

## Vérification de Version

Pour vérifier votre version de PostgreSQL:

```sql
SELECT version();
```

Ou en ligne de commande:

```bash
psql --version
```

## Migration depuis PostgreSQL < 10

Si vous utilisez PostgreSQL 9.x, nous recommandons fortement de migrer vers PostgreSQL 15+ pour:

1. **Meilleures performances** - Améliorations significatives des requêtes
2. **Partitionnement déclaratif** - Gestion plus simple des grandes tables
3. **Parallélisation** - Requêtes parallèles par défaut
4. **JIT compilation** - Compilation JIT pour les requêtes complexes
5. **Support étendu** - PostgreSQL 9.x n'est plus maintenu

### Guide de Migration

```bash
# 1. Sauvegarder la base existante
pg_dump -U postgres ufaranga > backup_ufaranga.sql

# 2. Installer PostgreSQL 15
# Suivre les instructions pour votre OS

# 3. Restaurer la base
psql -U postgres -d ufaranga < backup_ufaranga.sql
```

## Problèmes Connus

### PostgreSQL 10.x - Locale

Sur certaines installations PostgreSQL 10, la locale peut causer des problèmes:

```sql
-- Solution: Spécifier la locale lors de la création
CREATE DATABASE ufaranga
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C';
```

### PostgreSQL 9.x - JSONB Performance

Les performances JSONB sont significativement améliorées dans PostgreSQL 10+. Si vous restez sur 9.x, considérez:

```sql
-- Créer des index GIN sur les colonnes JSONB fréquemment requêtées
CREATE INDEX idx_metadonnees_gin ON ma_table USING GIN (metadonnees);
```

## Recommandations

### Pour Production

- ✅ Utilisez PostgreSQL 15+ pour les meilleures performances
- ✅ Activez la réplication pour la haute disponibilité
- ✅ Configurez les sauvegardes automatiques
- ✅ Surveillez les performances avec pg_stat_statements

### Pour Développement

- ✅ PostgreSQL 13+ est suffisant
- ✅ Utilisez Docker pour un environnement cohérent
- ✅ Activez les logs détaillés pour le débogage

## Support

Si vous rencontrez des problèmes de compatibilité:

1. Vérifiez votre version PostgreSQL
2. Consultez les logs PostgreSQL
3. Vérifiez que toutes les extensions sont installées
4. Contactez le support technique

## Ressources

- [PostgreSQL Release Notes](https://www.postgresql.org/docs/release/)
- [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/)
- [PostgreSQL Extensions](https://www.postgresql.org/docs/current/contrib.html)
