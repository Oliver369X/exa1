# 🔌 API Documentation - Backend Integration

## 📋 Resumen de Integración

Esta documentación describe cómo conectar el frontend de UML Class Diagram Designer con el backend colaborativo. El frontend está preparado para trabajar con WebSockets y APIs REST.

## 🌐 WebSocket API - Colaboración en Tiempo Real

### Conexión WebSocket

```typescript
// URL de conexión esperada
const WS_URL = process.env.VITE_WS_URL || 'ws://localhost:8080/collaboration';

// Eventos que el frontend puede enviar
interface ClientToServerEvents {
  'join_diagram': { diagramId: string; userId: string };
  'element_created': CollaborationEvent;
  'element_updated': CollaborationEvent;
  'element_deleted': CollaborationEvent;
  'relationship_created': CollaborationEvent;
  'relationship_updated': CollaborationEvent;
  'relationship_deleted': CollaborationEvent;
  'cursor_moved': { x: number; y: number; userId: string };
}

// Eventos que el backend debe enviar
interface ServerToClientEvents {
  'user_joined': { userId: string; userName: string };
  'user_left': { userId: string };
  'element_created': CollaborationEvent;
  'element_updated': CollaborationEvent;
  'element_deleted': CollaborationEvent;
  'relationship_created': CollaborationEvent;
  'relationship_updated': CollaborationEvent;
  'relationship_deleted': CollaborationEvent;
  'cursor_update': { x: number; y: number; userId: string; userName: string };
  'error': { message: string; code: string };
}
```

### Estructura de Eventos de Colaboración

```typescript
interface CollaborationEvent {
  type: 'element_added' | 'element_updated' | 'element_deleted' | 
        'relationship_added' | 'relationship_updated' | 'relationship_deleted';
  data: UMLElement | UMLRelationship;
  userId: string;
  timestamp: number;
  diagramId: string;
}

// Tipos de elementos UML
type UMLElement = UMLClass | UMLInterface | UMLNote;

interface UMLClass {
  id: string;
  type: 'class';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attributes: Array<{
    name: string;
    type: string;
    visibility: 'public' | 'private' | 'protected' | 'package';
  }>;
  methods: Array<{
    name: string;
    returnType: string;
    parameters: Array<{ name: string; type: string }>;
    visibility: 'public' | 'private' | 'protected' | 'package';
    isStatic: boolean;
    isAbstract: boolean;
  }>;
  isAbstract: boolean;
  stereotype?: string;
}

interface UMLRelationship {
  id: string;
  type: 'inheritance' | 'association' | 'composition' | 'aggregation' | 
        'dependency' | 'realization' | 'manyToMany';
  from: string; // ID del elemento origen
  to: string;   // ID del elemento destino
  label?: string;
  fromMultiplicity?: string;
  toMultiplicity?: string;
}
```

## 🚀 REST API Endpoints

### Diagramas

```typescript
// GET /api/diagrams
// Obtener lista de diagramas del usuario
interface DiagramListResponse {
  diagrams: Array<{
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    collaborators: string[];
  }>;
  total: number;
}

// GET /api/diagrams/:id
// Obtener diagrama específico
interface DiagramResponse {
  id: string;
  name: string;
  description?: string;
  data: UMLDiagramState;
  createdAt: string;
  updatedAt: string;
  owner: string;
  collaborators: Array<{
    userId: string;
    userName: string;
    permissions: 'read' | 'write' | 'admin';
  }>;
}

// POST /api/diagrams
// Crear nuevo diagrama
interface CreateDiagramRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  template?: 'blank' | 'basic-class' | 'mvc-pattern';
}

// PUT /api/diagrams/:id
// Actualizar diagrama
interface UpdateDiagramRequest {
  name?: string;
  description?: string;
  data?: UMLDiagramState;
  isPublic?: boolean;
}

// DELETE /api/diagrams/:id
// Eliminar diagrama
// Retorna: 204 No Content
```

### Colaboración y Permisos

```typescript
// POST /api/diagrams/:id/collaborators
// Agregar colaborador
interface AddCollaboratorRequest {
  userId: string;
  permissions: 'read' | 'write';
}

// PUT /api/diagrams/:id/collaborators/:userId
// Cambiar permisos de colaborador
interface UpdateCollaboratorRequest {
  permissions: 'read' | 'write' | 'admin';
}

// DELETE /api/diagrams/:id/collaborators/:userId
// Remover colaborador
// Retorna: 204 No Content
```

### Exportación

```typescript
// POST /api/export/:format
// Exportar diagrama (format: png | jpg | svg | pdf)
interface ExportRequest {
  diagramId: string;
  options?: {
    quality?: number;    // 0.1 - 1.0
    scale?: number;      // 1 - 5
    backgroundColor?: string;
    includeGrid?: boolean;
  };
}

interface ExportResponse {
  downloadUrl: string;
  expiresAt: string;
  format: string;
  fileSize: number;
}
```

## 🔐 Autenticación y Autorización

### Headers Requeridos

```typescript
// Todas las requests deben incluir:
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'X-Client-Version': '1.0.0'
};
```

### Manejo de Tokens

```typescript
// El frontend maneja refresh automático
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Refresh endpoint
// POST /api/auth/refresh
interface RefreshRequest {
  refreshToken: string;
}
```

## 🛠️ Implementación en el Frontend

### Configuración del Cliente WebSocket

```typescript
// src/services/collaborationService.ts
import { CollaborationManager } from '../utils/advancedUtils';

export class CollaborationService {
  private manager: CollaborationManager;
  private diagramId: string | null = null;

  constructor() {
    this.manager = new CollaborationManager();
  }

  async connect(diagramId: string, userId: string): Promise<void> {
    await this.manager.connect(`${process.env.VITE_WS_URL}`);
    
    // Unirse al diagrama
    this.manager.sendEvent({
      type: 'join_diagram',
      data: { diagramId, userId },
      userId,
      timestamp: Date.now()
    });
    
    this.diagramId = diagramId;
  }

  // Enviar cambio de elemento
  broadcastElementChange(element: UMLElement, action: 'added' | 'updated' | 'deleted'): void {
    if (!this.diagramId) return;
    
    this.manager.sendEvent({
      type: `element_${action}`,
      data: element,
      userId: this.getCurrentUserId(),
      timestamp: Date.now()
    });
  }
}
```

### Cliente REST API

```typescript
// src/services/apiService.ts
export class ApiService {
  private baseUrl = process.env.VITE_API_BASE_URL;
  
  async getDiagram(id: string): Promise<DiagramResponse> {
    const response = await fetch(`${this.baseUrl}/diagrams/${id}`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch diagram: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async saveDiagram(id: string, data: UMLDiagramState): Promise<void> {
    await fetch(`${this.baseUrl}/diagrams/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ data })
    });
  }
  
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.getAccessToken()}`,
      'Content-Type': 'application/json'
    };
  }
}
```

## 🔍 Testing y Debugging

### WebSocket Testing

```bash
# Usar wscat para probar conexión WebSocket
npm install -g wscat

# Conectar a WebSocket
wscat -c ws://localhost:8080/collaboration

# Enviar evento de prueba
{"type":"join_diagram","data":{"diagramId":"test","userId":"user1"},"timestamp":1634567890}
```

### API Testing con cURL

```bash
# Obtener diagramas
curl -X GET "http://localhost:8080/api/diagrams" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Crear diagrama
curl -X POST "http://localhost:8080/api/diagrams" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Diagrama","description":"Diagrama de prueba"}'
```

## 🚨 Manejo de Errores

```typescript
// Códigos de error esperados
interface ApiError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR';
  message: string;
  details?: Record<string, any>;
}

// WebSocket errors
interface WebSocketError {
  code: 'CONNECTION_FAILED' | 'INVALID_EVENT' | 'PERMISSION_DENIED' | 'DIAGRAM_NOT_FOUND';
  message: string;
}
```

---

🔗 **Enlaces relacionados:**
- [Arquitectura del Sistema](../architecture/README.md)
- [Guía de Despliegue](../deployment/README.md)
- [Manual de Usuario](../user-guide/README.md)