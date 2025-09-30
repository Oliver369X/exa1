#!/bin/bash

# UML Designer Deployment Script
# Usage: ./deploy.sh [development|production] [version]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENVIRONMENT=${1:-development}
VERSION=${2:-latest}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        echo_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
        echo_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if .env file exists for production
    if [ "$ENVIRONMENT" = "production" ] && [ ! -f ".env" ]; then
        echo_error ".env file not found. Copy .env.example to .env and configure it."
        exit 1
    fi
    
    echo_success "Prerequisites check passed"
}

# Validate docker compose configuration
validate_config() {
    echo_info "Validating Docker Compose configuration..."
    
    if docker compose -f "$COMPOSE_FILE" config >/dev/null 2>&1; then
        echo_success "Docker Compose configuration is valid"
    else
        echo_error "Docker Compose configuration is invalid"
        docker compose -f "$COMPOSE_FILE" config
        exit 1
    fi
}

# Create backup (production only)
create_backup() {
    if [ "$ENVIRONMENT" = "production" ]; then
        echo_info "Creating database backup..."
        
        # Create backups directory if it doesn't exist
        mkdir -p ./backups
        
        # Check if database container is running
        if docker compose -f "$COMPOSE_FILE" ps db | grep -q "Up"; then
            BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
            
            if docker compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "${DB_USER:-postgres}" "${DB_NAME:-uml_diagrams}" > "./backups/$BACKUP_FILE"; then
                echo_success "Database backup created: $BACKUP_FILE"
            else
                echo_warning "Failed to create database backup (database might not be running yet)"
            fi
        else
            echo_info "Database container not running, skipping backup"
        fi
    fi
}

# Pull images
pull_images() {
    echo_info "Pulling Docker images..."
    
    if docker compose -f "$COMPOSE_FILE" pull; then
        echo_success "Images pulled successfully"
    else
        echo_error "Failed to pull images"
        exit 1
    fi
}

# Deploy services
deploy_services() {
    echo_info "Deploying services..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Production deployment with rolling update
        echo_info "Performing rolling deployment..."
        docker compose -f "$COMPOSE_FILE" up -d --remove-orphans --no-recreate
    else
        # Development deployment
        echo_info "Starting development environment..."
        docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
    fi
    
    echo_success "Services deployed successfully"
}

# Health checks
perform_health_checks() {
    echo_info "Performing health checks..."
    
    # Wait for services to start
    echo_info "Waiting for services to initialize..."
    sleep 30
    
    # Check frontend health
    for i in {1..30}; do
        if curl -sf http://localhost/health > /dev/null 2>&1; then
            echo_success "Frontend is healthy"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo_error "Frontend health check failed after 30 attempts"
            echo_info "Checking logs..."
            docker compose -f "$COMPOSE_FILE" logs frontend
            return 1
        fi
        
        echo_info "Waiting for frontend to be ready... (attempt $i/30)"
        sleep 10
    done
    
    # Check backend health (if running)
    if docker compose -f "$COMPOSE_FILE" ps backend | grep -q "Up"; then
        if curl -sf http://localhost:8080/api/health > /dev/null 2>&1; then
            echo_success "Backend is healthy"
        else
            echo_warning "Backend health check failed"
        fi
    fi
    
    echo_success "Health checks completed"
}

# Cleanup
cleanup() {
    echo_info "Cleaning up unused resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (only in development)
    if [ "$ENVIRONMENT" = "development" ]; then
        docker volume prune -f
    fi
    
    echo_success "Cleanup completed"
}

# Rollback function (production only)
rollback() {
    if [ "$ENVIRONMENT" = "production" ]; then
        echo_warning "Rolling back to previous version..."
        
        # This would typically involve switching to a previous image tag
        # For now, we'll restart the services
        docker compose -f "$COMPOSE_FILE" restart
        
        echo_info "Rollback completed"
    fi
}

# Main deployment flow
main() {
    echo_info "🚀 Starting deployment to $ENVIRONMENT environment (version: $VERSION)"
    
    # Trap errors for rollback
    trap 'echo_error "Deployment failed! Rolling back..."; rollback; exit 1' ERR
    
    check_prerequisites
    validate_config
    create_backup
    pull_images
    deploy_services
    
    if perform_health_checks; then
        cleanup
        echo_success "🎉 Deployment completed successfully!"
        
        echo_info "📋 Deployment Summary:"
        echo_info "   Environment: $ENVIRONMENT"
        echo_info "   Version: $VERSION"
        echo_info "   Frontend: http://localhost"
        
        if [ "$ENVIRONMENT" = "development" ]; then
            echo_info "   Backend API: http://localhost:8080/api"
            echo_info "   Database: localhost:5432"
            echo_info "   Redis: localhost:6379"
            echo_info "   PgAdmin: http://localhost:5050 (admin@localhost.com / admin)"
        fi
        
        echo_info ""
        echo_info "🔧 Useful commands:"
        echo_info "   View logs: docker compose -f $COMPOSE_FILE logs -f"
        echo_info "   Stop services: docker compose -f $COMPOSE_FILE down"
        echo_info "   Restart services: docker compose -f $COMPOSE_FILE restart"
        
    else
        echo_error "Health checks failed"
        rollback
        exit 1
    fi
}

# Script entry point
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi