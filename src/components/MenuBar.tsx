import React from 'react';
import styled from 'styled-components';
import { 
  File, 
  FolderOpen, 
  Save, 
  Printer,
  Settings,
  HelpCircle,
  Undo,
  Redo,
  Copy,
  Scissors,
  Clipboard,
  ZoomIn,
  ZoomOut,
  FileImage,
  FileCode,
  ArrowLeft,
  Code
} from 'lucide-react';
import { saveProjectAsJSON, loadProjectFromJSON, exportMermaidCode } from '../utils/exportUtils';
import { exportDiagram } from '../utils/advancedUtils';
import { aiService } from '../services/api';
import type { DiagramState } from '../types/UMLTypes';

const MenuBarContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0;
  height: 40px;
  overflow-x: auto;
  overflow-y: hidden;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 40px;
  }
`;

const MenuGroup = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: ${props => props.disabled ? props.theme.colors.textSecondary : props.theme.colors.text};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  height: 40px;
  transition: background-color 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};
  white-space: nowrap;

  &:hover {
    background: ${props => props.disabled ? 'transparent' : props.theme.colors.border};
  }

  &:active {
    background: ${props => props.disabled ? 'transparent' : props.theme.colors.primary + '20'};
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: ${props => props.theme.colors.border};
  margin: 8px 4px;
`;

interface MenuBarProps {
  diagramState?: DiagramState;
  onNewDiagram?: () => void;
  onLoadDiagram?: (state: DiagramState) => void;
  onSaveDiagram?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  stageRef?: React.RefObject<import('konva/lib/Stage').Stage>;
  onBackToSalas?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  diagramState,
  onNewDiagram,
  onLoadDiagram,
  onSaveDiagram,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  stageRef,
  onBackToSalas
}) => {
  const handleNew = () => {
    if (onNewDiagram) {
      onNewDiagram();
    }
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onLoadDiagram) {
        try {
          const diagramData = await loadProjectFromJSON(file);
          onLoadDiagram(diagramData);
        } catch (error) {
          console.error('Error al cargar archivo:', error);
          alert('Error al cargar el archivo. Verifique que sea un proyecto UML válido.');
        }
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (diagramState) {
      saveProjectAsJSON(diagramState);
    } else if (onSaveDiagram) {
      onSaveDiagram();
    }
  };

  const handleExportPNG = async () => {
    if (stageRef) {
      try {
        await exportDiagram(stageRef, { format: 'png', quality: 1, scale: 2 });
      } catch (error) {
        console.error('Error exporting PNG:', error);
      }
    }
  };

  const handleExportMermaid = () => {
    if (diagramState) {
      exportMermaidCode(diagramState);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUndoClick = () => {
    if (onUndo) {
      onUndo();
    }
  };

  const handleRedoClick = () => {
    if (onRedo) {
      onRedo();
    }
  };

  const handleCopy = () => {
    console.log('Copiar');
  };

  const handleCut = () => {
    console.log('Cortar');
  };

  const handlePaste = () => {
    console.log('Pegar');
  };

  const handleGenerateSpringBoot = async () => {
    if (!diagramState || diagramState.classes.length === 0) {
      alert('No hay diagrama para generar código. Por favor, crea al menos una clase UML.');
      return;
    }

    console.log('Generando Spring Boot con:', diagramState);

    try {
      const blob = await aiService.generateSpringBoot(diagramState);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'springboot-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert('¡Proyecto Spring Boot generado exitosamente!');
    } catch (error: any) {
      console.error('Error al generar Spring Boot:', error);
      alert(`Error al generar el proyecto Spring Boot: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <MenuBarContainer>
      <MenuGroup>
        {onBackToSalas && (
          <MenuButton onClick={onBackToSalas} title="Volver a Proyectos">
            <ArrowLeft size={16} />
            Proyectos
          </MenuButton>
        )}
      </MenuGroup>

      <Separator />

      <MenuGroup>
        <MenuButton onClick={handleNew} title="Nuevo (Ctrl+N)">
          <File size={16} />
          Nuevo
        </MenuButton>
        <MenuButton onClick={handleOpen} title="Abrir (Ctrl+O)">
          <FolderOpen size={16} />
          Abrir
        </MenuButton>
        <MenuButton onClick={handleSave} title="Guardar (Ctrl+S)">
          <Save size={16} />
          Guardar
        </MenuButton>
      </MenuGroup>

      <Separator />

      <MenuGroup>
        <MenuButton onClick={handleExportPNG} title="Exportar PNG">
          <FileImage size={16} />
          PNG
        </MenuButton>
        <MenuButton onClick={handleExportMermaid} title="Exportar Mermaid">
          <FileCode size={16} />
          Mermaid
        </MenuButton>
        <MenuButton onClick={handleGenerateSpringBoot} title="Generar Spring Boot">
          <Code size={16} />
          Spring Boot
        </MenuButton>
        <MenuButton onClick={handlePrint} title="Imprimir (Ctrl+P)">
          <Printer size={16} />
          Imprimir
        </MenuButton>
      </MenuGroup>

      <Separator />

      <MenuGroup>
        <MenuButton 
          onClick={handleUndoClick} 
          title="Deshacer (Ctrl+Z)"
          disabled={!canUndo}
        >
          <Undo size={16} />
        </MenuButton>
        <MenuButton 
          onClick={handleRedoClick} 
          title="Rehacer (Ctrl+Y)"
          disabled={!canRedo}
        >
          <Redo size={16} />
        </MenuButton>
      </MenuGroup>

      <Separator />

      <MenuGroup>
        <MenuButton onClick={handleCopy} title="Copiar (Ctrl+C)">
          <Copy size={16} />
        </MenuButton>
        <MenuButton onClick={handleCut} title="Cortar (Ctrl+X)">
          <Scissors size={16} />
        </MenuButton>
        <MenuButton onClick={handlePaste} title="Pegar (Ctrl+V)">
          <Clipboard size={16} />
        </MenuButton>
      </MenuGroup>

      <Separator />

      <MenuGroup>
        <MenuButton title="Acercar">
          <ZoomIn size={16} />
        </MenuButton>
        <MenuButton title="Alejar">
          <ZoomOut size={16} />
        </MenuButton>
      </MenuGroup>

      <MenuGroup style={{ marginLeft: 'auto' }}>
        <MenuButton title="Configuración">
          <Settings size={16} />
        </MenuButton>
        <MenuButton title="Ayuda">
          <HelpCircle size={16} />
        </MenuButton>
      </MenuGroup>
    </MenuBarContainer>
  );
};

export default MenuBar;