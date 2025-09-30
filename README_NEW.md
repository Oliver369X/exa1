# 📐 UML Class Diagram Designer

Una aplicación web profesional para crear y colaborar en diagramas de clases UML en tiempo real, desarrollada con React + TypeScript + Konva.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-green.svg)

## 🌟 Características Principales

- 🎨 **Interface Moderna**: React 18 + TypeScript + Styled Components
- 🖱️ **Drag & Drop Intuitivo**: Creación y edición visual de elementos UML
- 🔗 **Relaciones Dinámicas**: Las líneas siguen automáticamente a los elementos
- 🔄 **Colaboración en Tiempo Real**: WebSocket integrado (preparado)
- 📊 **Exportación Múltiple**: PNG, JPG, SVG, PDF
- 🏗️ **Elementos UML Completos**: Clases, interfaces, notas, relaciones
- 🎯 **Herramientas Profesionales**: Zoom, pan, grid, scroll avanzado
- 🐳 **Docker Ready**: Despliegue completo con un comando

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd exa1

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Con Docker (Recomendado)

```bash
# Desarrollo completo con backend mock
docker compose up -d

# Acceder a la aplicación
open http://localhost:5173
```

### Producción

```bash
# Desplegar en producción
cp .env.example .env
# Editar .env con tus configuraciones
./deploy.sh production latest
```

## 📁 Estructura del Proyecto

```
📁 exa1/
├── 📁 docs/                    # Documentación completa
│   ├── 📄 README.md           # Documentación principal  
│   ├── 📁 api/                # API y backend integration
│   ├── 📁 architecture/       # Arquitectura del sistema
│   ├── 📁 deployment/         # Guías de despliegue
│   └── 📁 user-guide/         # Manual de usuario
├── 📁 src/
│   ├── 📁 components/         # Componentes React
│   │   ├── 📁 UMLElements/    # Elementos UML específicos
│   │   ├── UMLDiagramEditor.tsx # Editor principal
│   │   ├── Toolbar.tsx        # Herramientas
│   │   ├── MenuBar.tsx        # Menú superior
│   │   └── ScrollControls.tsx # Navegación
│   ├── 📁 hooks/              # Custom Hooks
│   ├── 📁 types/              # Tipos TypeScript
│   ├── 📁 utils/              # Utilidades
│   └── 📁 styles/             # Temas y estilos
├── 📁 docker/                 # Configuración Docker
│   ├── nginx.conf             # Configuración Nginx
│   └── init.sql               # Schema de base de datos
├── 📄 Dockerfile             # Docker producción
├── 📄 docker-compose.yml     # Docker desarrollo
├── 📄 docker-compose.prod.yml # Docker producción
└── 📄 deploy.sh               # Script de despliegue
```

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Framework principal |
| **Canvas** | Konva.js + react-konva | Renderizado 2D |
| **Styling** | Styled Components | CSS-in-JS |
| **Build** | Vite | Bundler y dev server |
| **Container** | Docker + Nginx | Despliegue |
| **Database** | PostgreSQL | Persistencia |
| **Cache** | Redis | Colaboración |

## 🎯 Funcionalidades UML

### Elementos Soportados

- ✅ **Clases UML**: Con atributos, métodos, visibilidad
- ✅ **Interfaces**: Representación con líneas punteadas  
- ✅ **Notas**: Comentarios estilo post-it
- ✅ **Relaciones**: Herencia, asociación, composición, agregación

### Herramientas Disponibles

- 🖱️ **Selección**: Click y arrastrar elementos
- ✋ **Mover**: Drag & drop con snap-to-grid
- 🔗 **Relaciones**: Conectar elementos visualmente
- 🔍 **Zoom**: Rueda del mouse + controles
- 📜 **Scroll**: Navegación en canvas extendido
- 📝 **Edición**: Double-click para propiedades

## 🔌 Integración con Backend

### WebSocket Events

```typescript
// Eventos de colaboración
interface CollaborationEvent {
  type: 'element_added' | 'element_updated' | 'element_deleted';
  data: UMLElement | UMLRelationship;
  userId: string;
  timestamp: number;
}
```

### API Endpoints Esperados

```bash
GET    /api/diagrams           # Lista de diagramas
POST   /api/diagrams           # Crear diagrama  
GET    /api/diagrams/:id       # Obtener diagrama
PUT    /api/diagrams/:id       # Actualizar diagrama
DELETE /api/diagrams/:id       # Eliminar diagrama
WS     /collaboration          # WebSocket colaboración
```

Ver [documentación completa de API](./docs/api/README.md).

## 🐳 Despliegue con Docker

### Desarrollo

```bash
# Iniciar entorno completo de desarrollo
docker compose up -d

# Servicios disponibles:
# - Frontend: http://localhost:5173
# - Backend Mock: http://localhost:8080  
# - Database: localhost:5432
# - Redis: localhost:6379
# - PgAdmin: http://localhost:5050
```

### Producción

```bash
# Configurar variables de entorno
cp .env.example .env
nano .env

# Desplegar en producción
chmod +x deploy.sh
./deploy.sh production latest

# Verificar salud
curl -f http://localhost/health
```

## 📊 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor desarrollo
npm run build            # Build producción  
npm run preview          # Preview build
npm run lint             # Linting
npm test                 # Tests

# Docker
docker compose up -d     # Iniciar servicios
docker compose logs -f   # Ver logs
docker compose down      # Detener servicios

# Despliegue  
./deploy.sh development  # Deploy desarrollo
./deploy.sh production   # Deploy producción
```

## 🔒 Configuración de Seguridad

### Variables de Entorno Críticas

```bash
# Copiado desde .env.example
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
DB_PASSWORD=your-secure-database-password
REDIS_PASSWORD=your-redis-password
ENCRYPTION_KEY=your-encryption-key
```

### Headers de Seguridad

La configuración Nginx incluye headers de seguridad completos:
- Content Security Policy
- X-Frame-Options  
- X-XSS-Protection
- HSTS (producción)

## 📖 Documentación Completa

- 📚 [**Documentación Principal**](./docs/README.md) - Visión general completa
- 🔌 [**API Integration**](./docs/api/README.md) - Conexión con backend
- 🏗️ [**Arquitectura**](./docs/architecture/README.md) - Detalles técnicos
- 🚀 [**Despliegue**](./docs/deployment/README.md) - Guías de producción
- 👥 [**Manual de Usuario**](./docs/user-guide/README.md) - Cómo usar la app

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [React Team](https://reactjs.org/) - Framework increíble
- [Konva.js](https://konvajs.org/) - Canvas 2D poderoso
- [Vite](https://vitejs.dev/) - Build tool rápido
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático

---

💡 **¿Necesitas ayuda?** Revisa la [documentación completa](./docs/) o abre un issue.