# 🐳 Deployment Documentation

## 🚀 Estrategias de Despliegue

Esta documentación cubre el despliegue completo de UML Class Diagram Designer usando Docker y estrategias modernas de CI/CD.

## 📦 Docker Configuration

### 1. Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose para Desarrollo

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
      - VITE_WS_URL=ws://localhost:8080/collaboration
    depends_on:
      - backend

  backend:
    image: uml-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/uml_diagrams
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-key
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=uml_diagrams
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Docker Compose para Producción

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: uml-designer-frontend:${VERSION:-latest}
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./docker/nginx.prod.conf:/etc/nginx/nginx.conf:ro
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - uml-network

  backend:
    image: uml-designer-backend:${VERSION:-latest}
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    networks:
      - uml-network

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - uml-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - uml-network

  nginx-proxy:
    image: nginxproxy/nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./ssl:/etc/nginx/certs:ro

networks:
  uml-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

## ⚙️ Nginx Configuration

### 1. Nginx para Desarrollo

```nginx
# docker/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:8080/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket proxy
        location /collaboration {
            proxy_pass http://backend:8080/collaboration;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
```

### 2. Nginx para Producción

```nginx
# docker/nginx.prod.conf
events {
    worker_connections 2048;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=assets:10m rate=30r/s;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' wss://yourdomain.com;" always;

        # Static assets with caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            limit_req zone=assets burst=50 nodelay;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # API endpoints with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend:8080/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket with special handling
        location /collaboration {
            proxy_pass http://backend:8080/collaboration;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket timeout configuration
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
        }

        # Frontend routing
        location / {
            limit_req zone=assets burst=30 nodelay;
            try_files $uri $uri/ /index.html;
            
            # Cache HTML files for short time
            location ~* \.html$ {
                expires 1h;
                add_header Cache-Control "public";
            }
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write

    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./docker/Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    environment: production
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /opt/uml-designer
            
            # Pull new images
            docker compose -f docker-compose.prod.yml pull
            
            # Update with zero downtime
            docker compose -f docker-compose.prod.yml up -d --remove-orphans
            
            # Cleanup old images
            docker image prune -f
            
            # Health check
            sleep 30
            curl -f http://localhost/health || exit 1

  security-scan:
    needs: build
    runs-on: ubuntu-latest
    
    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image-tag }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

### 2. Deployment Scripts

```bash
#!/bin/bash
# deploy.sh

set -euo pipefail

# Configuration
DEPLOY_ENV=${1:-production}
VERSION=${2:-latest}
COMPOSE_FILE="docker-compose.${DEPLOY_ENV}.yml"

echo "🚀 Starting deployment to ${DEPLOY_ENV} environment..."

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."
if ! docker compose -f "$COMPOSE_FILE" config >/dev/null 2>&1; then
    echo "❌ Docker compose configuration is invalid"
    exit 1
fi

# Create backup
echo "💾 Creating database backup..."
docker compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "${DB_USER}" "${DB_NAME}" > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Pull new images
echo "⬇️ Pulling new images..."
docker compose -f "$COMPOSE_FILE" pull

# Deploy with rolling update
echo "🔄 Deploying with rolling update..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans --scale frontend=2

# Health check
echo "🏥 Performing health checks..."
sleep 30

for i in {1..30}; do
    if curl -sf http://localhost/health > /dev/null; then
        echo "✅ Application is healthy"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed after 30 attempts"
        echo "🔄 Rolling back..."
        docker compose -f "$COMPOSE_FILE" rollback
        exit 1
    fi
    
    echo "⏳ Waiting for application to be ready... (attempt $i/30)"
    sleep 10
done

# Scale down old instances
docker compose -f "$COMPOSE_FILE" up -d --scale frontend=1

# Cleanup
echo "🧹 Cleaning up..."
docker image prune -f
docker volume prune -f

echo "🎉 Deployment completed successfully!"
```

## ☁️ Cloud Deployment Options

### 1. AWS ECS Deployment

```yaml
# aws-ecs-task-definition.json
{
  "family": "uml-designer",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "ghcr.io/your-org/uml-designer:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/uml-designer",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "frontend"
        }
      }
    }
  ]
}
```

### 2. Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uml-designer-frontend
  labels:
    app: uml-designer
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: uml-designer
      tier: frontend
  template:
    metadata:
      labels:
        app: uml-designer
        tier: frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/your-org/uml-designer:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: uml-designer-service
spec:
  selector:
    app: uml-designer
    tier: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: uml-designer-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: uml-designer-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: uml-designer-service
            port:
              number: 80
```

## 📊 Monitoring y Observabilidad

### 1. Health Checks

```typescript
// src/utils/health.ts
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: number;
  version: string;
  uptime: number;
  checks: {
    api: boolean;
    websocket: boolean;
    localStorage: boolean;
  };
}

export async function performHealthCheck(): Promise<HealthCheck> {
  const startTime = performance.now();
  
  const checks = {
    api: await checkApiHealth(),
    websocket: await checkWebSocketHealth(),
    localStorage: checkLocalStorageHealth()
  };
  
  const allHealthy = Object.values(checks).every(Boolean);
  const status = allHealthy ? 'healthy' : 'unhealthy';
  
  return {
    status,
    timestamp: Date.now(),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    uptime: performance.now() - startTime,
    checks
  };
}
```

### 2. Error Tracking

```typescript
// src/utils/errorTracking.ts
export class ErrorTracker {
  static initialize(): void {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }
  
  static handleError(event: ErrorEvent): void {
    this.reportError({
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  }
  
  static handlePromiseRejection(event: PromiseRejectionEvent): void {
    this.reportError({
      type: 'unhandledPromise',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack
    });
  }
  
  private static reportError(error: ErrorReport): void {
    // Send to monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...error,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(() => {
      // Fallback: log to console
      console.error('Failed to report error:', error);
    });
  }
}
```

## 🔐 Security Considerations

### 1. Environment Variables

```bash
# .env.production
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/collaboration
VITE_APP_VERSION=1.0.0
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ENABLE_ANALYTICS=true

# Secrets (not in version control)
DATABASE_URL=postgresql://...
JWT_SECRET=...
REDIS_PASSWORD=...
```

### 2. Docker Security

```dockerfile
# Security-hardened Dockerfile
FROM node:18-alpine as builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Use non-root user
USER nextjs

# Production stage with minimal attack surface
FROM nginx:alpine
RUN apk --no-cache add curl
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Remove unnecessary packages
RUN apk del --purge wget

# Run as non-root
USER nginx

EXPOSE 80
```

---

🚀 **Quick Start Commands:**

```bash
# Development
docker compose up -d

# Production build
docker build -f docker/Dockerfile.prod -t uml-designer:latest .

# Production deployment
./deploy.sh production latest

# Health check
curl -f http://localhost/health
```