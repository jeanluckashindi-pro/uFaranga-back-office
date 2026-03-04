# =====================================================
# Script PowerShell de Configuration Base de Données uFaranga
# =====================================================

# Configuration
$DB_NAME = "ufaranga"
$DB_USER = "ufaranga"
$DB_PASSWORD = "12345"
$POSTGRES_USER = "postgres"

Write-Host "=========================================" -ForegroundColor Blue
Write-Host "Configuration Base de Données uFaranga" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Fonction pour afficher les messages
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Vérifier si psql est disponible
Write-Info "Vérification de PostgreSQL..."
try {
    $version = & psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PostgreSQL détecté: $version"
    }
} catch {
    Write-Error-Custom "PostgreSQL n'est pas installé ou n'est pas dans le PATH!"
    Write-Host "Installez PostgreSQL 15+ avant de continuer."
    exit 1
}

# Demander confirmation
Write-Host ""
Write-Warning-Custom "Cette opération va:"
Write-Host "  1. Supprimer la base de données '$DB_NAME' si elle existe"
Write-Host "  2. Créer une nouvelle base de données '$DB_NAME'"
Write-Host "  3. Créer tous les schémas et tables"
Write-Host ""
$confirmation = Read-Host "Voulez-vous continuer? (o/N)"
if ($confirmation -ne 'o' -and $confirmation -ne 'O') {
    Write-Info "Opération annulée."
    exit 0
}

# Définir le mot de passe PostgreSQL
$env:PGPASSWORD = $DB_PASSWORD

# Exécuter le script principal
Write-Info "Exécution du script de création de la base de données..."
Write-Host ""

try {
    & psql -U $POSTGRES_USER -f "00_EXECUTE_ALL.sql"
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur lors de l'exécution du script"
    }
} catch {
    Write-Error-Custom "Échec de l'exécution du script: $_"
    exit 1
}

Write-Host ""
Write-Success "Base de données créée avec succès!"
Write-Host ""

# Vérification
Write-Info "Vérification de l'installation..."
try {
    $schemaCount = & psql -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')"
    
    if ($schemaCount -eq 9) {
        Write-Success "Tous les schémas ont été créés ($schemaCount/9)"
    } else {
        Write-Warning-Custom "Seulement $schemaCount/9 schémas créés"
    }
} catch {
    Write-Warning-Custom "Impossible de vérifier les schémas"
}

# Afficher les prochaines étapes
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Installation terminée!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:"
Write-Host ""
Write-Host "1. Configurer Django:"
Write-Host "   cd ..\backend"
Write-Host "   python manage.py migrate"
Write-Host ""
Write-Host "2. Initialiser la configuration:"
Write-Host "   python manage.py init_configuration"
Write-Host ""
Write-Host "3. Créer un superutilisateur:"
Write-Host "   python manage.py createsuperuser"
Write-Host ""
Write-Host "4. Lancer le serveur:"
Write-Host "   python manage.py runserver"
Write-Host ""
Write-Host "Informations de connexion:"
Write-Host "  Base de données: $DB_NAME"
Write-Host "  Utilisateur: $DB_USER"
Write-Host "  Mot de passe: $DB_PASSWORD"
Write-Host "  Host: localhost"
Write-Host "  Port: 5432"
Write-Host ""

# Nettoyer la variable d'environnement
Remove-Item Env:\PGPASSWORD
