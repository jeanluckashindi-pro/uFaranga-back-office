# 🚀 Démarrage Rapide - Base de Données uFaranga

## Installation en 3 étapes

### 1️⃣ Prérequis

Assurez-vous d'avoir PostgreSQL 15+ installé:

```bash
# Vérifier la version
psql --version

# Devrait afficher: psql (PostgreSQL) 15.x ou supérieur
```

### 2️⃣ Exécution

#### Sur Linux/Mac:

```bash
cd database_setup
chmod +x setup_database.sh
./setup_database.sh
```

#### Sur Windows (PowerShell):

```powershell
cd database_setup
.\setup_database.ps1
```

#### Méthode manuelle (tous systèmes):

```bash
cd database_setup
psql -U postgres -f 00_EXECUTE_ALL.sql
```

### 3️⃣ Configuration Django

```bash
cd ../backend

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# OU
venv\Scripts\activate     # Windows

# Migrations Django
python manage.py migrate

# Initialiser la configuration
python manage.py init_configuration

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

## ✅ Vérification

Connectez-vous à la base de données:

```bash
psql -U ufaranga -d ufaranga
```

Vérifiez les schémas:

```sql
\dn

-- Devrait afficher:
-- identite
-- bancaire
-- portefeuille
-- transaction
-- audit
-- compliance
-- commission
-- notification
-- configuration
```

## 🔧 Configuration

Paramètres de connexion par défaut:

```
Base de données: ufaranga
Utilisateur: ufaranga
Mot de passe: 12345
Host: localhost
Port: 5432
```

Pour modifier ces paramètres, éditez le fichier `backend/.env`:

```env
DB_NAME=ufaranga
DB_USER=ufaranga
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
```

## 🐛 Problèmes Courants

### "psql: command not found"

PostgreSQL n'est pas dans le PATH. Ajoutez-le:

**Linux/Mac:**
```bash
export PATH=$PATH:/usr/lib/postgresql/15/bin
```

**Windows:**
Ajoutez `C:\Program Files\PostgreSQL\15\bin` au PATH système.

### "FATAL: password authentication failed"

Modifiez le fichier `pg_hba.conf` pour autoriser les connexions locales:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5
```

Puis redémarrez PostgreSQL:

```bash
# Linux
sudo systemctl restart postgresql

# Mac
brew services restart postgresql

# Windows
net stop postgresql-x64-15
net start postgresql-x64-15
```

### "database already exists"

Supprimez la base existante:

```sql
DROP DATABASE IF EXISTS ufaranga;
```

Puis relancez le script.

## 📚 Documentation Complète

- [README.md](README.md) - Documentation détaillée
- [../backend/ARCHITECTURE.md](../backend/ARCHITECTURE.md) - Architecture du système
- [../backend/README.md](../backend/README.md) - Documentation backend

## 🎯 Prochaines Étapes

1. ✅ Base de données créée
2. ⏭️ Configurer Django
3. ⏭️ Créer un superutilisateur
4. ⏭️ Lancer le serveur
5. ⏭️ Tester l'API

Consultez le [README principal](../backend/README.md) pour continuer.
