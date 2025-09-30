# Integración Frontend-Backend

## Descripción General

Esta aplicación UML Designer ahora está completamente integrada con el backend, incluyendo:

- ✅ Sistema de autenticación (login/registro)
- ✅ Gestión de proyectos/salas colaborativas
- ✅ Colaboración en tiempo real con Socket.IO
- ✅ Generación de código Spring Boot desde el frontend
- ✅ Persistencia de diagramas en la base de datos

## Arquitectura

### Frontend (React + TypeScript)
- **Framework**: React 19 con TypeScript
- **Comunicación HTTP**: Axios
- **Comunicación WebSocket**: Socket.IO Client
- **Estilos**: Styled Components
- **Canvas**: React Konva para diagramas UML

### Backend (Node.js + Express)
- **Framework**: Express con TypeScript
- **Base de datos**: Prisma ORM (PostgreSQL/MySQL)
- **WebSockets**: Socket.IO
- **Autenticación**: JWT + bcrypt

## Estructura del Frontend

```
exa1/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx          # Componente de inicio de sesión
│   │   │   └── Register.tsx       # Componente de registro
│   │   ├── Salas/
│   │   │   └── SalasList.tsx      # Gestión de proyectos/salas
│   │   └── UMLDiagramEditor.tsx   # Editor con Socket.IO integrado
│   ├── services/
│   │   ├── api.ts                 # Servicios HTTP (Auth, Salas, IA)
│   │   └── socket.ts              # Servicio de Socket.IO
│   └── hooks/
│       ├── useSocketIntegration.ts # Hook para colaboración en tiempo real
│       └── useDiagramState.ts      # Estado del diagrama con persistencia
```

## Servicios API

### Autenticación (`authService`)

```typescript
// Login
await authService.login(correo, contrasena);

// Registro
await authService.register(nombre, correo, contrasena);

// Logout
authService.logout();

// Verificar autenticación
authService.isAuthenticated();
```

### Salas/Proyectos (`salaService`)

```typescript
// Obtener todas las salas
const salas = await salaService.getSalas();

// Obtener sala por ID
const sala = await salaService.getSalaById(idSala);

// Crear nueva sala
const nuevaSala = await salaService.createSala(nombre, descripcion, idHost);

// Actualizar diagrama de sala
await salaService.updateSala(idSala, data);
```

### IA y Generación de Código (`aiService`)

```typescript
// Generar proyecto Spring Boot desde UML
const zipBlob = await aiService.generateSpringBoot(umlData);
```

## Socket.IO - Colaboración en Tiempo Real

### Eventos del Cliente

```typescript
// Unirse a una sala
socketService.joinRoom(roomId);

// Salir de una sala
socketService.leaveRoom(roomId);

// Enviar actualización del diagrama
socketService.sendDiagramUpdate(data, roomId);
```

### Eventos del Servidor (Recibidos)

```typescript
// Diagrama cargado al unirse
socketService.onDiagramLoaded((data) => {
  console.log('Diagrama cargado:', data);
});

// Actualización de diagrama de otro usuario
socketService.onDiagramUpdate((data) => {
  console.log('Diagrama actualizado:', data);
});

// Usuario se unió a la sala
socketService.onUserJoined((data) => {
  console.log('Usuario nuevo:', data);
});

// Usuario salió de la sala
socketService.onUserLeft((data) => {
  console.log('Usuario salió:', data);
});
```

## Flujo de Usuario

### 1. Autenticación

```
Usuario visita la app
  → Pantalla de Login
  → Ingresa credenciales
  → Backend valida y retorna JWT
  → Token guardado en localStorage
  → Redirige a lista de proyectos
```

### 2. Gestión de Proyectos

```
Usuario autenticado
  → Ve lista de salas/proyectos
  → Puede crear nuevo proyecto
  → Selecciona un proyecto existente
  → Socket.IO conecta a la sala
  → Carga diagrama existente
  → Editor UML listo para colaboración
```

### 3. Colaboración en Tiempo Real

```
Usuario A edita diagrama
  → Cambios detectados en useDiagramState
  → useSocketIntegration envía actualización
  → Backend recibe y persiste en DB
  → Backend emite a todos en la sala
  → Usuario B recibe actualización
  → Diagrama se sincroniza automáticamente
```

### 4. Generación de Spring Boot

```
Usuario diseña UML
  → Clic en "Spring Boot" en MenuBar
  → Diagrama se envía al backend
  → Backend genera proyecto con plantillas
  → Retorna archivo ZIP
  → Usuario descarga proyecto completo
```

## Configuración

### Variables de Entorno (Frontend)

Crear archivo `.env` en `exa1/`:

```env
VITE_API_URL=http://localhost:4000
```

### Variables de Entorno (Backend)

Crear archivo `.env` en `backen_exa1/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="tu_clave_secreta_jwt"
PORT=4000
GEMINI_API_KEY="tu_api_key_de_google_gemini"
```

## Iniciar el Proyecto

### Backend

```bash
cd backen_exa1
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

El backend estará corriendo en `http://localhost:4000`

### Frontend

```bash
cd exa1
npm install
npm run dev
```

El frontend estará corriendo en `http://localhost:5173` (Vite)

## Endpoints del Backend

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Salas
- `GET /api/salas` - Obtener todas las salas
- `GET /api/salas/:id` - Obtener sala por ID
- `POST /api/salas` - Crear nueva sala
- `PUT /api/salas/:id` - Actualizar sala
- `GET /api/salas/:id/usuarios` - Obtener usuarios de la sala
- `GET /api/salas/:id/host/:userId` - Verificar si usuario es host

### IA/Generación de Código
- `POST /api/ai/springboot-template-zip` - Generar proyecto Spring Boot
- `POST /api/ai/audit-code` - Auditar código
- `POST /api/ai/uml-to-springboot` - Generar con IA

### WebSocket (Socket.IO)
- `join-room` - Unirse a una sala
- `leave-room` - Salir de una sala
- `diagram-update` - Actualizar diagrama
- `user-update` - Actualizar estado de usuario

## Formato de Datos para Spring Boot

El backend espera el diagrama UML en el siguiente formato:

```typescript
interface DiagramState {
  classes: UMLClass[];
  relationships: UMLRelationship[];
  interfaces: UMLInterface[];
  packages: UMLPackage[];
  notes: UMLNote[];
}

interface UMLClass {
  id: string;
  name: string;
  attributes: string[];  // Formato: "+ nombre: tipo"
  methods: string[];     // Formato: "+ nombreMetodo(params): retorno"
  stereotypes: string[]; // Ejemplo: ["<<Entity>>", "<<Service>>"]
}

interface UMLRelationship {
  id: string;
  type: 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency' | 'realization' | 'manyToMany';
  from: string;  // ID de clase origen
  to: string;    // ID de clase destino
  fromMultiplicity?: string;  // Ejemplo: "1", "*", "0..1"
  toMultiplicity?: string;
  label?: string;
}
```

## Notas de Seguridad

- Los tokens JWT expiran en 1 hora
- Las contraseñas se hashean con bcrypt (10 rounds)
- CORS está configurado para permitir todas las conexiones en desarrollo
- En producción, configurar CORS específicamente para tu dominio

## Próximas Mejoras

- [ ] Refresh token automático
- [ ] Roles y permisos de usuario en salas
- [ ] Historial de versiones del diagrama
- [ ] Chat en tiempo real
- [ ] Indicadores de presencia (quién está editando)
- [ ] Cursores colaborativos
- [ ] Exportar a otros formatos (PlantUML, etc.)

## Soporte

Si tienes problemas:
1. Verifica que el backend esté corriendo
2. Verifica las variables de entorno
3. Revisa la consola del navegador para errores
4. Revisa los logs del servidor backend
