import axios, { type InternalAxiosRequestConfig } from 'axios';
import { adaptDiagramForBackend } from '../utils/umlAdapter';

// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  login: async (correo: string, contrasena: string) => {
    const response = await api.post('/auth/login', { correo, contrasena });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  register: async (nombre: string, correo: string, contrasena: string) => {
    const response = await api.post('/auth/register', { nombre, correo, contrasena });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Servicios de Salas
export const salaService = {
  getSalas: async () => {
    const response = await api.get('/api/salas');
    return response.data;
  },

  getSalaById: async (idSala: string) => {
    const response = await api.get(`/api/salas/${idSala}`);
    return response.data;
  },

  createSala: async (nombre: string, descripcion: string, idHost: string) => {
    const response = await api.post('/api/salas', {
      nombre,
      descripcion,
      idHost,
      capacidad: 10, // Capacidad por defecto
      esPrivada: false, // Por defecto público
      diagrama: {
        classes: [],
        relationships: [],
        interfaces: [],
        notes: [],
        packages: [],
        selectedElements: [],
        zoom: 1,
        pan: { x: 0, y: 0 }
      }
    });
    return response.data;
  },

  updateSala: async (idSala: string, data: any) => {
    const response = await api.put(`/api/salas/${idSala}`, { data });
    return response.data;
  },

  updateSalaInfo: async (idSala: string, nombre: string, descripcion: string) => {
    const response = await api.put(`/api/salas/${idSala}`, { 
      data: { nombre, descripcion } 
    });
    return response.data;
  },

  deleteSala: async (idSala: string, idUsuario: string) => {
    const response = await api.delete(`/api/salas/${idSala}`, {
      data: { idUsuario }
    });
    return response.data;
  },

  isHostInSala: async (idSala: string, idUsuario: string) => {
    const response = await api.get(`/api/salas/${idSala}/host/${idUsuario}`);
    return response.data;
  },

  getUsuariosInSala: async (idSala: string) => {
    const response = await api.get(`/api/salas/${idSala}/usuarios`);
    return response.data;
  },
};

// Servicios de IA y Generación de Código
export const aiService = {
  generateSpringBoot: async (umlData: any) => {
    // Adaptar el diagrama al formato que espera el backend
    const adaptedDiagram = adaptDiagramForBackend(umlData);
    
    console.log('Diagrama adaptado para backend:', adaptedDiagram);
    
    const response = await api.post('/api/ai/springboot-template-zip', {
      umlDiagram: adaptedDiagram,
      config: {
        groupId: 'com.example',
        artifactId: 'uml-project',
        version: '1.0.0',
        javaVersion: '17'
      }
    }, {
      responseType: 'blob', // Para recibir el ZIP
    });
    return response.data;
  },

  auditCode: async (code: string) => {
    const response = await api.post('/api/ai/audit-code', { code });
    return response.data;
  },

  generateFromUML: async (umlData: any) => {
    const response = await api.post('/api/ai/uml-to-springboot', { umlData });
    return response.data;
  },

  // Nuevos agentes especializados
  generateDiagramFromText: async (prompt: string, style: string = 'class') => {
    const response = await api.post('/api/ai/generate-diagram', { prompt, style });
    return response.data;
  },

  chatWithAI: async (query: string, context?: any) => {
    const response = await api.post('/api/ai/chat', { query, context });
    return response.data;
  },

  // Convertir a Mermaid
  convertToMermaid: async (diagramData: any) => {
    const response = await api.post('/api/ai/mermaid', {
      action: 'toMermaid',
      diagramData
    });
    return response.data;
  },

  // Convertir desde Mermaid
  convertFromMermaid: async (mermaidCode: string) => {
    const response = await api.post('/api/ai/mermaid', {
      action: 'fromMermaid',
      mermaidCode
    });
    return response.data;
  },

  // Analizar imagen y generar diagrama
  analyzeImage: async (imageBase64: string, mimeType: string = 'image/png') => {
    const response = await api.post('/api/ai/analyze-image', {
      imageBase64,
      mimeType
    });
    return response.data;
  },

  // Editar diagrama con IA
  editDiagramWithAI: async (currentDiagram: any, instruction: string, context?: any) => {
    const response = await api.post('/api/ai/edit-diagram', {
      currentDiagram,
      instruction,
      context
    });
    return response.data;
  },

  // Generar Spring Boot directamente desde imagen
  generateSpringBootFromImage: async (imageBase64: string, mimeType: string = 'image/png', config?: any) => {
    const response = await api.post('/api/ai/image-to-springboot', {
      imageBase64,
      mimeType,
      config: config || {
        groupId: 'com.example',
        artifactId: 'uml-project',
        version: '1.0.0',
        javaVersion: '17'
      }
    }, {
      responseType: 'blob', // Para recibir el ZIP
    });
    return response.data;
  },
};

export default api;
