import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Conectado al servidor Socket.IO:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor Socket.IO');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  // Métodos específicos para la aplicación
  joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave-room', roomId);
  }

  sendDiagramUpdate(data: any, roomId: string) {
    this.socket?.emit('diagram-update', data, roomId);
  }

  onDiagramUpdate(callback: (data: any) => void) {
    this.socket?.on('diagram-update', callback);
  }

  onDiagramLoaded(callback: (data: any) => void) {
    this.socket?.on('diagram-loaded', callback);
  }

  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user-left', callback);
  }

  sendUserUpdate(data: any, roomId: string) {
    this.socket?.emit('user-update', data, roomId);
  }

  onUserUpdate(callback: (data: any) => void) {
    this.socket?.on('user-update', callback);
  }

  requestPageData(roomId: string, socketId: string) {
    this.socket?.emit('requestPageData', roomId, socketId);
  }

  // Limpiar todos los listeners
  removeAllListeners() {
    // Solo remover listeners de eventos de diagrama/sala, no de conexión
    this.socket?.off('diagram-update');
    this.socket?.off('diagram-loaded');
    this.socket?.off('user-joined');
    this.socket?.off('user-left');
    this.socket?.off('user-update');
  }

  // Remover un listener específico
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

// Exportar una instancia única (singleton)
export const socketService = new SocketService();
export default socketService;
