import { useCallback, useState } from 'react';
import type { UMLRelationship } from '../types/UMLTypes';

export const useRelationships = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [tempLine, setTempLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const startConnection = useCallback((elementId: string, x: number, y: number) => {
    setIsConnecting(true);
    setConnectionStart(elementId);
    setTempLine({ x1: x, y1: y, x2: x, y2: y });
  }, []);

  const updateTempLine = useCallback((x: number, y: number) => {
    if (tempLine) {
      setTempLine(prev => prev ? { ...prev, x2: x, y2: y } : null);
    }
  }, [tempLine]);

  const endConnection = useCallback((targetElementId: string): UMLRelationship | null => {
    if (connectionStart && connectionStart !== targetElementId) {
      const relationship: UMLRelationship = {
        id: `rel-${Date.now()}`,
        type: 'association',
        from: connectionStart,
        to: targetElementId,
        points: [
          { x: tempLine?.x1 || 0, y: tempLine?.y1 || 0 },
          { x: tempLine?.x2 || 0, y: tempLine?.y2 || 0 }
        ]
      };
      
      // Reset state
      setIsConnecting(false);
      setConnectionStart(null);
      setTempLine(null);
      
      return relationship;
    }
    
    // Cancel connection
    setIsConnecting(false);
    setConnectionStart(null);
    setTempLine(null);
    return null;
  }, [connectionStart, tempLine]);

  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
    setTempLine(null);
  }, []);

  return {
    isConnecting,
    connectionStart,
    tempLine,
    startConnection,
    updateTempLine,
    endConnection,
    cancelConnection
  };
};