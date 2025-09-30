import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import styled from 'styled-components';
import { Download, ZoomIn, ZoomOut, RotateCcw, Grid3x3, Trash2 } from 'lucide-react';
import { useDiagramState } from '../hooks/useDiagramState';
import { useSocketIntegration } from '../hooks/useSocketIntegration';
import type { ToolType } from '../hooks/useToolbar';
import { UMLClassComponent } from './UMLElements/UMLClassComponent';
import { UMLInterfaceComponent } from './UMLElements/UMLInterfaceComponent';
import { UMLNoteComponent } from './UMLElements/UMLNoteComponent';
import { UMLRelationshipComponent } from './UMLElements/UMLRelationshipComponent';
import EditModal from './EditModal';
import RelationshipEditModal from './RelationshipEditModal';
import { ScrollControls } from './ScrollControls';
import type { UMLClass, UMLInterface, UMLNote, UMLRelationship, DiagramState } from '../types/UMLTypes';

const EditorContainer = styled.div`
  flex: 1;
  position: relative;
  background: white;
  overflow: hidden;
`;

const TopToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 8px;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const ZoomLevel = styled.span`
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
`;

const CanvasContainer = styled.div<{ showGrid: boolean }>`
  flex: 1;
  position: relative;
  overflow: auto;
  width: 100%;
  height: calc(100vh - 120px);
  ${props => props.showGrid && `
    background-image: 
      linear-gradient(to right, #e0e0e0 1px, transparent 1px),
      linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
    background-size: 20px 20px;
  `}
  
  /* Estilos de scrollbar personalizados */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  &::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }
`;

const CanvasWrapper = styled.div`
  width: 3000px;
  height: 3000px;
  min-width: 100%;
  min-height: 100%;
`;



interface UMLDiagramEditorProps {
  className?: string;
  selectedTool?: ToolType;
  salaId?: string;
  onDiagramChange?: (state: DiagramState) => void;
}

const UMLDiagramEditor = forwardRef<any, UMLDiagramEditorProps>(({ selectedTool: externalSelectedTool, salaId, onDiagramChange }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const selectedTool = externalSelectedTool || 'select';
  const [showGrid, setShowGrid] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<UMLClass | UMLInterface | UMLNote | null>(null);
  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);
  const [relationshipToEdit, setRelationshipToEdit] = useState<UMLRelationship | null>(null);
  
  // Estados para crear relaciones
  const [isCreatingRelation, setIsCreatingRelation] = useState(false);
  const [relationStart, setRelationStart] = useState<string | null>(null);
  const [tempRelationLine, setTempRelationLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const {
    diagramState,
    addClass,
    addInterface,
    addNote,
    addRelationship,
    updateElement,
    deleteElement,
    setSelectedElements,
    setZoom,
    undo,
    canUndo,
    loadDiagram
  } = useDiagramState();

  // Exponer método loadDiagram al componente padre
  useImperativeHandle(ref, () => ({
    loadDiagram: (diagram: DiagramState) => {
      loadDiagram(diagram);
    }
  }));

  // Integración de Socket.IO para colaboración en tiempo real
  useSocketIntegration({
    salaId: salaId || '',
    diagramState,
    onDiagramUpdate: loadDiagram,
  });

  // Notificar cambios del diagrama al componente padre
  useEffect(() => {
    if (onDiagramChange) {
      onDiagramChange(diagramState);
    }
  }, [diagramState, onDiagramChange]);

  // Manejar tecla Delete/Suprimir para eliminar elementos seleccionados
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Solo eliminar si hay elementos seleccionados
        if (diagramState.selectedElements.length > 0) {
          e.preventDefault();
          // Eliminar todos los elementos seleccionados
          diagramState.selectedElements.forEach(elementId => {
            deleteElement(elementId);
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [diagramState.selectedElements, deleteElement]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const mousePointTo = {
      x: pointer.x / oldScale - stage.x() / oldScale,
      y: pointer.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    if (newScale > 0.1 && newScale < 5) {
      setZoom(newScale);
      stage.scale({ x: newScale, y: newScale });
      
      const newPointer = stage.getPointerPosition();
      if (newPointer) {
        const newPos = {
          x: -(mousePointTo.x - newPointer.x / newScale) * newScale,
          y: -(mousePointTo.y - newPointer.y / newScale) * newScale,
        };
        stage.position(newPos);
      }
      stage.batchDraw();
    }
  };

  // Función para manejar movimiento del mouse durante creación de relaciones
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isCreatingRelation && relationStart) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        // Encontrar la posición del elemento de inicio
        const startElement = [...diagramState.classes, ...diagramState.interfaces, ...diagramState.notes]
          .find(el => el.id === relationStart);
        if (startElement) {
          setTempRelationLine({
            x1: startElement.x + startElement.width / 2,
            y1: startElement.y + startElement.height / 2,
            x2: pos.x / diagramState.zoom,
            y2: pos.y / diagramState.zoom
          });
        }
      }
    }
  };

  // Función para manejar clic en elementos para relaciones
  const handleElementClick = (elementId: string) => {
    const relationTypes: ToolType[] = ['association', 'inheritance', 'composition', 'aggregation', 'manyToMany'];
    
    if (relationTypes.includes(selectedTool)) {
      if (!relationStart) {
        // Iniciar relación
        setRelationStart(elementId);
        setIsCreatingRelation(true);
      } else if (relationStart !== elementId) {
        // Encontrar elementos para calcular puntos
        const fromElement = [...diagramState.classes, ...diagramState.interfaces, ...diagramState.notes]
          .find(el => el.id === relationStart);
        const toElement = [...diagramState.classes, ...diagramState.interfaces, ...diagramState.notes]
          .find(el => el.id === elementId);
          
        if (fromElement && toElement) {
          const newRelation: UMLRelationship = {
            id: `relation-${Date.now()}`,
            type: selectedTool as UMLRelationship['type'],
            from: relationStart,
            to: elementId,
            points: [] // Los puntos se calcularán dinámicamente
          };
          
          // Agregar multiplicidades para muchos a muchos
          if (selectedTool === 'manyToMany') {
            newRelation.fromMultiplicity = '*';
            newRelation.toMultiplicity = '*';
          }
          
          // Para muchos a muchos, crear tabla intermedia
          if (selectedTool === 'manyToMany') {
            const getElementName = (element: UMLClass | UMLInterface | UMLNote) => 
              'name' in element ? element.name : 'text' in element ? element.text : 'Element';
            
            const intermediateTable: UMLClass = {
              id: `table-${Date.now()}`,
              name: `${getElementName(fromElement)}_${getElementName(toElement)}`,
              x: (fromElement.x + toElement.x) / 2,
              y: (fromElement.y + toElement.y) / 2 - 50,
              width: 200,
              height: 100,
              attributes: [
                `+ ${getElementName(fromElement).toLowerCase()}_id: int`,
                `+ ${getElementName(toElement).toLowerCase()}_id: int`
              ],
              methods: [],
              stereotypes: ['<<tabla intermedia>>'],
              visibility: 'public'
            };
            addClass(intermediateTable);
          }
          
          addRelationship(newRelation);
        }
        
        setRelationStart(null);
        setIsCreatingRelation(false);
        setTempRelationLine(null);
      }
    }
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    if (selectedTool === 'class') {
      const newClass: UMLClass = {
        id: `class-${Date.now()}`,
        name: 'NewClass',
        x: pos.x / diagramState.zoom,
        y: pos.y / diagramState.zoom,
        width: 200,
        height: 150,
        attributes: ['- attribute: String'],
        methods: ['+ method(): void'],
        stereotypes: [],
        visibility: 'public'
      };
      addClass(newClass);
    } else if (selectedTool === 'interface') {
      const newInterface: UMLInterface = {
        id: `interface-${Date.now()}`,
        name: 'INewInterface',
        x: pos.x / diagramState.zoom,
        y: pos.y / diagramState.zoom,
        width: 200,
        height: 100,
        methods: ['+ method(): void']
      };
      addInterface(newInterface);
    } else if (selectedTool === 'note') {
      const newNote: UMLNote = {
        id: `note-${Date.now()}`,
        text: 'Nueva nota',
        x: pos.x / diagramState.zoom,
        y: pos.y / diagramState.zoom,
        width: 150,
        height: 100
      };
      addNote(newNote);
    } else {
      if (e.target === stage) {
        // Cancelar relación si se hace clic en espacio vacío
        if (isCreatingRelation) {
          setRelationStart(null);
          setIsCreatingRelation(false);
          setTempRelationLine(null);
        }
        setSelectedElements([]);
      }
    }
  };

  const handleExportPNG = async () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'uml-diagram.png';
      link.href = uri;
      link.click();
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(diagramState.zoom * 1.2, 5);
    setZoom(newZoom);
    if (stageRef.current) {
      stageRef.current.scale({ x: newZoom, y: newZoom });
      stageRef.current.batchDraw();
    }
  };

  const zoomOut = () => {
    const newZoom = Math.max(diagramState.zoom / 1.2, 0.1);
    setZoom(newZoom);
    if (stageRef.current) {
      stageRef.current.scale({ x: newZoom, y: newZoom });
      stageRef.current.batchDraw();
    }
  };

  const resetZoom = () => {
    setZoom(1);
    if (stageRef.current) {
      stageRef.current.scale({ x: 1, y: 1 });
      stageRef.current.position({ x: 0, y: 0 });
      stageRef.current.batchDraw();
    }
  };

  const handleElementSelect = (elementId: string) => {
    // Si estamos creando una relación, usar handleElementClick
    const relationTypes: ToolType[] = ['association', 'inheritance', 'composition', 'aggregation', 'manyToMany'];
    if (relationTypes.includes(selectedTool)) {
      handleElementClick(elementId);
    } else {
      setSelectedElements([elementId]);
    }
  };

  const handleElementDragEnd = (elementId: string, x: number, y: number) => {
    updateElement(elementId, { x, y });
  };

  const handleElementDoubleClick = (element: UMLClass | UMLInterface | UMLNote) => {
    setElementToEdit(element);
    setEditModalOpen(true);
  };

  const handleRelationshipDoubleClick = (relationship: UMLRelationship) => {
    setRelationshipToEdit(relationship);
    setRelationshipModalOpen(true);
  };

  const handleRelationshipSave = (updatedRelationship: UMLRelationship) => {
    updateElement(updatedRelationship.id, updatedRelationship);
  };

  const handleModalSave = (updatedElement: UMLClass | UMLInterface | UMLNote) => {
    updateElement(updatedElement.id, updatedElement);
  };

  useEffect(() => {
    if (diagramState.selectedElements.length > 0 && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${diagramState.selectedElements[0]}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [diagramState.selectedElements]);

  return (
    <EditorContainer>
      <TopToolbar>
        <ToolButton 
          active={showGrid} 
          onClick={() => setShowGrid(!showGrid)}
          title="Mostrar Grilla"
        >
          <Grid3x3 size={18} />
        </ToolButton>
        <ToolButton onClick={handleExportPNG} title="Exportar PNG">
          <Download size={18} />
        </ToolButton>
        <ToolButton 
          onClick={undo} 
          disabled={!canUndo}
          title="Deshacer"
        >
          <RotateCcw size={18} />
        </ToolButton>
        
        <ToolButton 
          onClick={() => {
            if (diagramState.selectedElements.length > 0) {
              diagramState.selectedElements.forEach(elementId => {
                deleteElement(elementId);
              });
            }
          }}
          disabled={diagramState.selectedElements.length === 0}
          title="Eliminar Seleccionados (Delete)"
        >
          <Trash2 size={18} />
        </ToolButton>
        
        <ZoomControls>
          <ToolButton onClick={zoomOut} title="Zoom Out">
            <ZoomOut size={18} />
          </ToolButton>
          <ZoomLevel>{Math.round(diagramState.zoom * 100)}%</ZoomLevel>
          <ToolButton onClick={zoomIn} title="Zoom In">
            <ZoomIn size={18} />
          </ToolButton>
          <ToolButton onClick={resetZoom} title="Resetear Zoom">
            <RotateCcw size={18} />
          </ToolButton>
        </ZoomControls>
      </TopToolbar>

      <CanvasContainer showGrid={showGrid}>
        <CanvasWrapper>
          <Stage
            ref={stageRef}
            width={3000}
            height={3000}
            onWheel={handleWheel}
            onClick={handleStageClick}
            onMouseMove={handleMouseMove}
            scaleX={diagramState.zoom}
            scaleY={diagramState.zoom}
          >
            <Layer>
            {/* Render relationships first (behind elements) */}
            {diagramState.relationships.map((relationship) => (
              <UMLRelationshipComponent
                key={relationship.id}
                relationship={relationship}
                isSelected={diagramState.selectedElements.includes(relationship.id)}
                onSelect={() => handleElementSelect(relationship.id)}
                onDoubleClick={() => handleRelationshipDoubleClick(relationship)}
                elements={[...diagramState.classes, ...diagramState.interfaces, ...diagramState.notes]}
              />
            ))}
            
            {/* Render temporary relationship line while creating */}
            {tempRelationLine && (
              <Line
                points={[tempRelationLine.x1, tempRelationLine.y1, tempRelationLine.x2, tempRelationLine.y2]}
                stroke="#2196F3"
                strokeWidth={2}
                dash={[5, 5]}
                opacity={0.7}
              />
            )}

            {/* Render classes */}
            {diagramState.classes.map((umlClass) => (
              <UMLClassComponent
                key={umlClass.id}
                umlClass={umlClass}
                isSelected={diagramState.selectedElements.includes(umlClass.id)}
                onSelect={() => handleElementSelect(umlClass.id)}
                onDragEnd={(x, y) => handleElementDragEnd(umlClass.id, x, y)}
                onDoubleClick={() => handleElementDoubleClick(umlClass)}
              />
            ))}

            {/* Render interfaces */}
            {diagramState.interfaces.map((umlInterface) => (
              <UMLInterfaceComponent
                key={umlInterface.id}
                umlInterface={umlInterface}
                isSelected={diagramState.selectedElements.includes(umlInterface.id)}
                onSelect={() => handleElementSelect(umlInterface.id)}
                onDragEnd={(x, y) => handleElementDragEnd(umlInterface.id, x, y)}
              />
            ))}

            {/* Render notes */}
            {diagramState.notes.map((note) => (
              <UMLNoteComponent
                key={note.id}
                note={note}
                isSelected={diagramState.selectedElements.includes(note.id)}
                onSelect={() => handleElementSelect(note.id)}
                onDragEnd={(x, y) => handleElementDragEnd(note.id, x, y)}
              />
            ))}

            {/* Transformer for selection */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
        </CanvasWrapper>
      </CanvasContainer>

      <EditModal
        element={elementToEdit}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setElementToEdit(null);
        }}
        onSave={handleModalSave}
      />

      <RelationshipEditModal
        relationship={relationshipToEdit}
        isOpen={relationshipModalOpen}
        onClose={() => {
          setRelationshipModalOpen(false);
          setRelationshipToEdit(null);
        }}
        onSave={handleRelationshipSave}
      />

      {/* Scroll Controls */}
      <ScrollControls
        canvasSize={{ width: 3000, height: 3000 }}
        viewportSize={containerSize}
        scrollPosition={scrollPosition}
        onScrollChange={setScrollPosition}
      />
    </EditorContainer>
  );
});

UMLDiagramEditor.displayName = 'UMLDiagramEditor';

export default UMLDiagramEditor;