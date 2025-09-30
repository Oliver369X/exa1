import { useEffect, useRef } from 'react';
import socketService from '../services/socket';
import type { DiagramState } from '../types/UMLTypes';
import { authService } from '../services/api';

interface UseSocketIntegrationProps {
  salaId: string;
  diagramState: DiagramState;
  onDiagramUpdate: (state: DiagramState) => void;
}

export const useSocketIntegration = ({
  salaId,
  diagramState,
  onDiagramUpdate,
}: UseSocketIntegrationProps) => {
  const isLocalUpdate = useRef(false);
  const hasLoadedInitialDiagram = useRef(false); // ← NUEVO: track si ya cargamos el diagrama inicial
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    console.log('🔌 Conectando a sala:', salaId);
    
    // Resetear flag de carga inicial para esta sala
    hasLoadedInitialDiagram.current = false;
    
    // Conectar al servidor de sockets
    socketService.connect();

    // Limpiar listeners anteriores antes de configurar nuevos
    socketService.removeAllListeners();

    // Unirse a la sala
    socketService.joinRoom(salaId);

    // Definir callbacks para poder removerlos específicamente
    const handleDiagramLoaded = (data: any) => {
      console.log('📥 Diagrama cargado desde el servidor (sala: ' + salaId + '):', data);
      // Aceptar cualquier diagrama válido, incluso vacío
      if (data && typeof data === 'object' && 'classes' in data) {
        isLocalUpdate.current = true;
        hasLoadedInitialDiagram.current = true; // ← MARCAR QUE YA CARGAMOS
        onDiagramUpdate(data);
      }
    };

    const handleDiagramUpdate = (data: any) => {
      console.log('🔄 Actualización de diagrama recibida (sala: ' + salaId + '):', data);
      // Aceptar cualquier diagrama válido, incluso vacío
      if (data && typeof data === 'object' && 'classes' in data) {
        isLocalUpdate.current = true;
        onDiagramUpdate(data);
      }
    };

    const handleUserJoined = (data: any) => {
      console.log('👋 Usuario se unió (sala: ' + salaId + '):', data);
    };

    const handleUserLeft = (data: any) => {
      console.log('👋 Usuario salió (sala: ' + salaId + '):', data);
    };

    // Configurar listeners
    socketService.onDiagramLoaded(handleDiagramLoaded);
    socketService.onDiagramUpdate(handleDiagramUpdate);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);

    // Cleanup al desmontar o cambiar de sala
    return () => {
      console.log('🔌 Desconectando de sala:', salaId);
      socketService.leaveRoom(salaId);
      socketService.removeAllListeners();
    };
  }, [salaId, onDiagramUpdate]);

  // Enviar actualizaciones cuando el diagrama cambie localmente
  useEffect(() => {
    // ⚠️ IMPORTANTE: NO enviar si aún no hemos cargado el diagrama inicial
    if (!hasLoadedInitialDiagram.current) {
      console.log('⏳ Esperando carga inicial del diagrama...');
      return;
    }

    if (!isLocalUpdate.current) {
      // Solo enviar si el cambio fue local (no recibido de socket)
      console.log('📤 Enviando actualización local a sala:', salaId);
      const updateData = {
        ...diagramState,
        userInfo: {
          userId: currentUser?.id,
          userName: currentUser?.nombre,
        },
      };
      
      socketService.sendDiagramUpdate(updateData, salaId);
    } else {
      // Resetear el flag después de procesar una actualización remota
      isLocalUpdate.current = false;
    }
  }, [diagramState, salaId, currentUser]);

  return {
    isConnected: true,
  };
};
