import React from 'react';
import styled from 'styled-components';
import { 
  Square, 
  Circle, 
  Hexagon,
  ArrowRight,
  MousePointer,
  Move,
  Type,
  StickyNote,
  Package,
  Triangle
} from 'lucide-react';

const ToolbarContainer = styled.div`
  width: 80px;
  min-width: 80px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  
  /* Estilos de scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  @media (max-width: 768px) {
    width: 60px;
    min-width: 60px;
    padding: 12px 4px;
  }
`;

const ToolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 16px 0 8px 0;
  text-align: center;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary + '20' : 'white'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex-direction: column;
  gap: 4px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ToolLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
`;

import type { ToolType } from '../hooks/useToolbar';

interface ToolbarProps {
  selectedTool?: ToolType;
  onToolSelect?: (tool: ToolType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool = 'select', onToolSelect }) => {
  const handleToolClick = (tool: ToolType) => {
    if (onToolSelect) {
      onToolSelect(tool);
    } else {
      console.log(`Tool selected: ${tool}`);
    }
  };

  return (
    <ToolbarContainer>
      <SectionTitle>Selección</SectionTitle>
      <ToolSection>
        <ToolButton 
          active={selectedTool === 'select'} 
          onClick={() => handleToolClick('select')}
          title="Herramienta de selección"
        >
          <MousePointer />
          <ToolLabel>Select</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'move'} 
          onClick={() => handleToolClick('move')}
          title="Herramienta de movimiento"
        >
          <Move />
          <ToolLabel>Move</ToolLabel>
        </ToolButton>
      </ToolSection>

      <SectionTitle>Elementos</SectionTitle>
      <ToolSection>
        <ToolButton 
          active={selectedTool === 'class'} 
          onClick={() => handleToolClick('class')}
          title="Crear clase UML"
        >
          <Square />
          <ToolLabel>Class</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'interface'} 
          onClick={() => handleToolClick('interface')}
          title="Crear interfaz UML"
        >
          <Circle />
          <ToolLabel>Interface</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'abstract'} 
          onClick={() => handleToolClick('abstract')}
          title="Crear clase abstracta"
        >
          <Hexagon />
          <ToolLabel>Abstract</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'enum'} 
          onClick={() => handleToolClick('enum')}
          title="Crear enumeración"
        >
          <Triangle />
          <ToolLabel>Enum</ToolLabel>
        </ToolButton>
      </ToolSection>

      <SectionTitle>Relaciones</SectionTitle>
      <ToolSection>
        <ToolButton 
          active={selectedTool === 'association'} 
          onClick={() => handleToolClick('association')}
          title="Asociación"
        >
          <ArrowRight />
          <ToolLabel>Assoc</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'inheritance'} 
          onClick={() => handleToolClick('inheritance')}
          title="Herencia"
        >
          <Triangle />
          <ToolLabel>Inherit</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'composition'} 
          onClick={() => handleToolClick('composition')}
          title="Composición"
        >
          <Square />
          <ToolLabel>Comp</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'aggregation'} 
          onClick={() => handleToolClick('aggregation')}
          title="Agregación"
        >
          <Circle />
          <ToolLabel>Aggr</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'manyToMany'} 
          onClick={() => handleToolClick('manyToMany')}
          title="Muchos a Muchos"
        >
          <ArrowRight />
          <ToolLabel>M:M</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'dependency'} 
          onClick={() => handleToolClick('dependency')}
          title="Dependencia (línea punteada)"
        >
          <ArrowRight />
          <ToolLabel>Depend</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'realization'} 
          onClick={() => handleToolClick('realization')}
          title="Realización (implementación de interfaz)"
        >
          <Triangle />
          <ToolLabel>Realiz</ToolLabel>
        </ToolButton>
      </ToolSection>

      <SectionTitle>Otros</SectionTitle>
      <ToolSection>
        <ToolButton 
          active={selectedTool === 'note'} 
          onClick={() => handleToolClick('note')}
          title="Nota/Comentario"
        >
          <StickyNote />
          <ToolLabel>Note</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'package'} 
          onClick={() => handleToolClick('package')}
          title="Paquete"
        >
          <Package />
          <ToolLabel>Package</ToolLabel>
        </ToolButton>
        <ToolButton 
          active={selectedTool === 'text'} 
          onClick={() => handleToolClick('text')}
          title="Texto libre"
        >
          <Type />
          <ToolLabel>Text</ToolLabel>
        </ToolButton>
      </ToolSection>
    </ToolbarContainer>
  );
};

export default Toolbar;