#!/bin/bash

# =====================================================
# Script de Configuration de la Base de Données uFaranga
# =====================================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
DB_NAME="ufaranga"
DB_USER="ufaranga"
DB_PASSWORD="12345"
POSTGRES_USER="postgres"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Configuration Base de Données uFaranga${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Fonction pour afficher les messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Vérifier si PostgreSQL est installé
print_info "Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL n'est pas installé!"
    echo "Installez PostgreSQL 15+ avant de continuer."
    exit 1
fi

POSTGRES_VERSION=$(psql --version | awk '{print $3}' | cut -d. -f1)
if [ "$POSTGRES_VERSION" -lt 15 ]; then
    print_warning "PostgreSQL version $POSTGRES_VERSION détectée. Version 15+ recommandée."
fi

print_success "PostgreSQL version $POSTGRES_VERSION détecté"

# Demander confirmation
echo ""
print_warning "Cette opération va:"
echo "  1. Supprimer la base de données '$DB_NAME' si elle existe"
echo "  2. Créer une nouvelle base de données '$DB_NAME'"
echo "  3. Créer tous les schémas et tables"
echo ""
read -p "Voulez-vous continuer? (o/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    print_info "Opération annulée."
    exit 0
fi

# Créer l'utilisateur si nécessaire
print_info "Vérification de l'utilisateur '$DB_USER'..."
USER_EXISTS=$(psql -U $POSTGRES_USER -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "0")

if [ "$USER_EXISTS" != "1" ]; then
    print_info "Création de l'utilisateur '$DB_USER'..."
    psql -U $POSTGRES_USER -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || {
        print_error "Échec de la création de l'utilisateur"
        exit 1
    }
    psql -U $POSTGRES_USER -c "ALTER USER $DB_USER WITH CREATEDB;" || {
        print_error "Échec de l'attribution des privilèges"
        exit 1
    }
    print_success "Utilisateur '$DB_USER' créé"
else
    print_success "Utilisateur '$DB_USER' existe déjà"
fi

# Exécuter le script principal
print_info "Exécution du script de création de la base de données..."
echo ""

psql -U $POSTGRES_USER -f 00_EXECUTE_ALL.sql || {
    print_error "Échec de l'exécution du script"
    exit 1
}

echo ""
print_success "Base de données créée avec succès!"
echo ""

# Vérification
print_info "Vérification de l'installation..."
SCHEMA_COUNT=$(psql -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('identite', 'bancaire', 'portefeuille', 'transaction', 'audit', 'compliance', 'commission', 'notification', 'configuration')")

if [ "$SCHEMA_COUNT" -eq 9 ]; then
    print_success "Tous les schémas ont été créés ($SCHEMA_COUNT/9)"
else
    print_warning "Seulement $SCHEMA_COUNT/9 schémas créés"
fi

# Afficher les prochaines étapes
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Installation terminée!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. Configurer Django:"
echo "   cd ../backend"
echo "   python manage.py migrate"
echo ""
echo "2. Initialiser la configuration:"
echo "   python manage.py init_configuration"
echo ""
echo "3. Créer un superutilisateur:"
echo "   python manage.py createsuperuser"
echo ""
echo "4. Lancer le serveur:"
echo "   python manage.py runserver"
echo ""
echo "Informations de connexion:"
echo "  Base de données: $DB_NAME"
echo "  Utilisateur: $DB_USER"
echo "  Mot de passe: $DB_PASSWORD"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
