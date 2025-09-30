import { Stage } from 'konva/lib/Stage';

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
}

export const exportDiagram = async (
  stageRef: React.RefObject<Stage>, 
  options: ExportOptions
): Promise<void> => {
  if (!stageRef.current) {
    throw new Error('Stage reference not available');
  }

  const stage = stageRef.current;
  
  switch (options.format) {
    case 'png':
      return exportAsPNG(stage, options);
    case 'jpg':
      return exportAsJPG(stage, options);
    case 'svg':
      return exportAsSVG(stage, options);
    case 'pdf':
      return exportAsPDF(stage, options);
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
};

const exportAsPNG = async (stage: Stage, options: ExportOptions): Promise<void> => {
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: options.quality || 1,
    pixelRatio: options.scale || 2
  });
  
  downloadFile(dataURL, 'diagram.png');
};

const exportAsJPG = async (stage: Stage, options: ExportOptions): Promise<void> => {
  const dataURL = stage.toDataURL({
    mimeType: 'image/jpeg',
    quality: options.quality || 0.9,
    pixelRatio: options.scale || 2
  });
  
  downloadFile(dataURL, 'diagram.jpg');
};

const exportAsSVG = async (stage: Stage, options: ExportOptions): Promise<void> => {
  // Para SVG necesitaremos una implementación más compleja
  // Por ahora exportamos como PNG de alta calidad
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: options.quality || 1,
    pixelRatio: options.scale || 4
  });
  
  downloadFile(dataURL, 'diagram_hq.png');
};

const exportAsPDF = async (stage: Stage, options: ExportOptions): Promise<void> => {
  // Para PDF necesitaremos jsPDF o similar
  // Por ahora exportamos como PNG
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: options.quality || 1,
    pixelRatio: options.scale || 3
  });
  
  downloadFile(dataURL, 'diagram_pdf.png');
};

const downloadFile = (dataURL: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Preparado para WebSocket y colaboración
export interface CollaborationEvent {
  type: 'element_added' | 'element_updated' | 'element_deleted' | 'relationship_added' | 'relationship_updated' | 'relationship_deleted';
  data: Record<string, unknown>;
  userId: string;
  timestamp: number;
}

export class CollaborationManager {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, (event: CollaborationEvent) => void> = new Map();
  
  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('Collaboration WebSocket connected');
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const collaborationEvent: CollaborationEvent = JSON.parse(event.data);
          this.handleEvent(collaborationEvent);
        } catch (error) {
          console.error('Error parsing collaboration event:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        console.log('Collaboration WebSocket disconnected');
        // Intentar reconectar después de 3 segundos
        setTimeout(() => this.connect(url), 3000);
      };
    });
  }
  
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  sendEvent(event: CollaborationEvent): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }
  
  onEvent(type: string, handler: (event: CollaborationEvent) => void): void {
    this.eventHandlers.set(type, handler);
  }
  
  private handleEvent(event: CollaborationEvent): void {
    const handler = this.eventHandlers.get(event.type);
    if (handler) {
      handler(event);
    }
  }
}