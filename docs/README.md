# 📐 UML Class Diagram Designer - Documentación Completa

## 🎯 Resumen Ejecutivo

**UML Class Diagram Designer** es una aplicación web profesional desarrollada con React + TypeScript que permite crear, editar y colaborar en tiempo real en diagramas de clases UML. La aplicación está diseñada para competir con herramientas como ArchiMate, StarUML y Draw.io, ofreciendo una experiencia moderna y colaborativa.

### ✨ Características Principales

- 🎨 **Interface Moderna**: Diseñada con React 18 + TypeScript + Styled Components
- 🖱️ **Drag & Drop Avanzado**: Creación intuitiva de elementos UML
- 🔗 **Relaciones Dinámicas**: Líneas que siguen automáticamente a los elementos
- 🔄 **Colaboración en Tiempo Real**: WebSocket integrado para trabajo colaborativo
- 📊 **Exportación Múltiple**: PNG, JPG, SVG, PDF (preparado)
- 🌐 **Despliegue Docker**: Contenedorización completa
- 📱 **Responsive Design**: Adaptable a diferentes dispositivos

## 📁 Estructura del Proyecto

```
exa1/
├── 📁 docs/                     # Documentación completa
│   ├── 📁 api/                  # Documentación de APIs
│   ├── 📁 architecture/         # Arquitectura del sistema
│   ├── 📁 deployment/          # Guías de despliegue
│   └── 📁 user-guide/          # Manual de usuario
├── 📁 public/                  # Archivos estáticos
├── 📁 src/                     # Código fuente
│   ├── 📁 components/          # Componentes React
│   │   ├── 📁 UMLElements/     # Componentes UML específicos
│   │   ├── UMLDiagramEditor.tsx # Editor principal
│   │   ├── Toolbar.tsx         # Barra de herramientas
│   │   ├── MenuBar.tsx         # Menú superior
│   │   └── ScrollControls.tsx  # Controles de navegación
│   ├── 📁 hooks/               # Custom Hooks
│   │   ├── useDiagramState.ts  # Estado del diagrama
│   │   └── useToolbar.ts       # Estado de herramientas
│   ├── 📁 types/               # Definiciones TypeScript
│   ├── 📁 utils/               # Utilidades y helpers
│   │   ├── exportUtils.ts      # Exportación básica
│   │   └── advancedUtils.ts    # Funciones avanzadas + WebSocket
│   └── 📁 styles/              # Estilos y temas
├── 📄 docker/                  # Configuración Docker
├── 📄 package.json             # Dependencias NPM
├── 📄 vite.config.ts           # Configuración Vite
└── 📄 README.md                # Documentación principal
```

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Frontend Framework** | React | 18.x | Biblioteca principal UI |
| **Lenguaje** | TypeScript | 5.x | Tipado estático |
| **Build Tool** | Vite | 5.x | Bundler y dev server |
| **Canvas** | Konva.js | 9.x | Renderizado 2D |
| **Styling** | Styled Components | 6.x | CSS-in-JS |
| **Icons** | Lucide React | Latest | Iconografía |
| **State Management** | Custom Hooks | - | Estado local optimizado |

### Patrones Arquitectónicos

1. **Component-Based Architecture**: Cada elemento UML es un componente reutilizable
2. **Custom Hooks Pattern**: Lógica de estado encapsulada
3. **Render Props**: Para componentes flexibles
4. **Observer Pattern**: WebSocket para colaboración
5. **Factory Pattern**: Creación de elementos UML

## 🔌 Conexión con Backend

### Configuración de WebSocket

```typescript
// src/utils/advancedUtils.ts
import { CollaborationManager } from '../utils/advancedUtils';

// Inicialización
const collaborationManager = new CollaborationManager();

// Conectar al backend
collaborationManager.connect('ws://localhost:8080/collaboration');

// Escuchar eventos
collaborationManager.onEvent('element_updated', (event) => {
  // Actualizar diagrama en tiempo real
  updateDiagram(event.data);
});
```

### API Endpoints Esperados

```typescript
// Backend endpoints que debe implementar el servidor
interface BackendAPI {
  // Diagramas
  'GET /api/diagrams': DiagramList;
  'POST /api/diagrams': CreateDiagram;
  'PUT /api/diagrams/:id': UpdateDiagram;
  'DELETE /api/diagrams/:id': DeleteDiagram;
  
  // Colaboración WebSocket
  'WS /collaboration': CollaborationEvents;
  
  // Exportación
  'POST /api/export/:format': ExportDiagram;
}
```

### Variables de Entorno

```bash
# .env.production
VITE_API_BASE_URL=https://your-backend.com/api
VITE_WS_URL=wss://your-backend.com/collaboration
VITE_APP_VERSION=1.0.0
VITE_ENABLE_COLLABORATION=true
```

## 🚀 Instrucciones de Desarrollo

### Prerequisitos

- Node.js 18+
- npm o yarn
- Git

### Instalación Local

```bash
# Clonar repositorio
git clone <repository-url>
cd exa1

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "docker:build": "docker build -t uml-designer .",
  "docker:run": "docker run -p 3000:80 uml-designer"
}
```

## 📈 Roadmap de Funcionalidades

### Versión 1.0 (Actual)
- ✅ Creación de elementos UML básicos
- ✅ Relaciones dinámicas
- ✅ Exportación PNG
- ✅ Scroll y zoom
- ✅ Preparación WebSocket

### Versión 1.1 (Próxima)
- 🔄 Colaboración en tiempo real activa
- 🔄 Exportación SVG/PDF nativa
- 🔄 Templates predefinidos
- 🔄 Historial de cambios

### Versión 2.0 (Futuro)
- 📱 Aplicación móvil
- 🤖 IA para sugerencias
- 🔗 Integración con repositorios Git
- 🎨 Temas personalizables

---

📖 **Para documentación detallada, consultar las subcarpetas:**
- [`/docs/api/`](./api/README.md) - Documentación de APIs
- [`/docs/architecture/`](./architecture/README.md) - Detalles arquitectónicos
- [`/docs/deployment/`](./deployment/README.md) - Guías de despliegue
- [`/docs/user-guide/`](./user-guide/README.md) - Manual de usuario

🤝 **Contribuciones bienvenidas** - Revisa nuestras guías de contribución