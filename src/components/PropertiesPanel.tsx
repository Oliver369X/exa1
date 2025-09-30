import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Settings,
  Palette,
  Eye,
  EyeOff,
  Layers,
  Edit3,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import type { UMLClass } from '../types/UMLTypes';

const PanelContainer = styled.div`
  width: 300px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 14px;
  color: #212121;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${props => props.active ? 'white' : '#f8f9fa'};
  color: ${props => props.active ? '#2196F3' : '#757575'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#2196F3' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? 'white' : '#f0f0f0'};
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const PropertyGroup = styled.div`
  margin-bottom: 24px;
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const ColorPicker = styled.input`
  width: 60px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  background: none;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const LayerItem = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  opacity: ${props => props.visible ? 1 : 0.5};
  
  &:hover {
    background: #f8f9fa;
  }
`;

const PropertiesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'settings'>('properties');
  const [selectedElement] = useState<UMLClass | null>(null);

  const renderPropertiesTab = () => (
    <PanelContent>
      {selectedElement ? (
        <>
          <PropertyGroup>
            <PropertyLabel>Nombre</PropertyLabel>
            <PropertyInput 
              type="text" 
              value={selectedElement.name || ''} 
              placeholder="Nombre del elemento"
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Posición</PropertyLabel>
            <PropertyInput 
              type="number" 
              value={selectedElement.x || 0} 
              placeholder="X"
            />
            <PropertyInput 
              type="number" 
              value={selectedElement.y || 0} 
              placeholder="Y"
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Tamaño</PropertyLabel>
            <PropertyInput 
              type="number" 
              value={selectedElement.width || 0} 
              placeholder="Ancho"
            />
            <PropertyInput 
              type="number" 
              value={selectedElement.height || 0} 
              placeholder="Alto"
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Estilo</PropertyLabel>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Color:</span>
              <ColorPicker type="color" defaultValue="#ffffff" />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '12px' }}>Borde:</span>
              <ColorPicker type="color" defaultValue="#333333" />
            </div>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Visibilidad</PropertyLabel>
            <PropertySelect defaultValue="public">
              <option value="public">+ Público</option>
              <option value="private">- Privado</option>
              <option value="protected"># Protegido</option>
              <option value="package">~ Paquete</option>
            </PropertySelect>
          </PropertyGroup>

          {selectedElement && (
            <>
              <PropertyGroup>
                <PropertyLabel>Atributos</PropertyLabel>
                {selectedElement.attributes?.map((attr: string, index: number) => (
                  <ListItem key={index}>
                    <span style={{ fontSize: '12px' }}>{attr}</span>
                    <ButtonGroup>
                      <IconButton title="Editar">
                        <Edit3 size={14} />
                      </IconButton>
                      <IconButton title="Eliminar">
                        <Trash2 size={14} />
                      </IconButton>
                    </ButtonGroup>
                  </ListItem>
                ))}
              </PropertyGroup>

              <PropertyGroup>
                <PropertyLabel>Métodos</PropertyLabel>
                {selectedElement.methods?.map((method: string, index: number) => (
                  <ListItem key={index}>
                    <span style={{ fontSize: '12px' }}>{method}</span>
                    <ButtonGroup>
                      <IconButton title="Editar">
                        <Edit3 size={14} />
                      </IconButton>
                      <IconButton title="Eliminar">
                        <Trash2 size={14} />
                      </IconButton>
                    </ButtonGroup>
                  </ListItem>
                ))}
              </PropertyGroup>
            </>
          )}

          <PropertyGroup>
            <PropertyLabel>Alineación</PropertyLabel>
            <ButtonGroup>
              <IconButton title="Alinear Izquierda">
                <AlignLeft size={16} />
              </IconButton>
              <IconButton title="Alinear Centro">
                <AlignCenter size={16} />
              </IconButton>
              <IconButton title="Alinear Derecha">
                <AlignRight size={16} />
              </IconButton>
            </ButtonGroup>
          </PropertyGroup>

          <PropertyGroup>
            <ButtonGroup>
              <IconButton title="Duplicar">
                <Copy size={16} />
              </IconButton>
              <IconButton title="Eliminar">
                <Trash2 size={16} />
              </IconButton>
            </ButtonGroup>
          </PropertyGroup>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: '#757575', 
          padding: '40px 20px',
          fontSize: '14px'
        }}>
          Selecciona un elemento para ver sus propiedades
        </div>
      )}
    </PanelContent>
  );

  const renderLayersTab = () => (
    <PanelContent>
      <PropertyGroup>
        <PropertyLabel>Capas del Diagrama</PropertyLabel>
        <LayerItem visible={true}>
          <Eye size={16} />
          <span>Clases</span>
        </LayerItem>
        <LayerItem visible={true}>
          <Eye size={16} />
          <span>Relaciones</span>
        </LayerItem>
        <LayerItem visible={false}>
          <EyeOff size={16} />
          <span>Notas</span>
        </LayerItem>
        <LayerItem visible={true}>
          <Eye size={16} />
          <span>Paquetes</span>
        </LayerItem>
      </PropertyGroup>
    </PanelContent>
  );

  const renderSettingsTab = () => (
    <PanelContent>
      <PropertyGroup>
        <PropertyLabel>Vista</PropertyLabel>
        <CheckboxContainer>
          <Checkbox type="checkbox" defaultChecked />
          <span>Mostrar grilla</span>
        </CheckboxContainer>
        <CheckboxContainer>
          <Checkbox type="checkbox" defaultChecked />
          <span>Ajustar a grilla</span>
        </CheckboxContainer>
        <CheckboxContainer>
          <Checkbox type="checkbox" />
          <span>Mostrar reglas</span>
        </CheckboxContainer>
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Tema</PropertyLabel>
        <PropertySelect defaultValue="light">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
          <option value="auto">Automático</option>
        </PropertySelect>
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Exportación</PropertyLabel>
        <PropertySelect defaultValue="png">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="svg">SVG</option>
          <option value="pdf">PDF</option>
        </PropertySelect>
      </PropertyGroup>

      <PropertyGroup>
        <PropertyLabel>Configuración de Grilla</PropertyLabel>
        <PropertyInput 
          type="number" 
          defaultValue={20} 
          placeholder="Tamaño de grilla (px)"
        />
      </PropertyGroup>
    </PanelContent>
  );

  return (
    <PanelContainer>
      <PanelHeader>
        <Settings size={16} style={{ marginRight: '8px' }} />
        Panel de Propiedades
      </PanelHeader>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'properties'} 
          onClick={() => setActiveTab('properties')}
        >
          <Edit3 size={14} style={{ marginRight: '4px' }} />
          Propiedades
        </Tab>
        <Tab 
          active={activeTab === 'layers'} 
          onClick={() => setActiveTab('layers')}
        >
          <Layers size={14} style={{ marginRight: '4px' }} />
          Capas
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          <Palette size={14} style={{ marginRight: '4px' }} />
          Config
        </Tab>
      </TabContainer>

      {activeTab === 'properties' && renderPropertiesTab()}
      {activeTab === 'layers' && renderLayersTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </PanelContainer>
  );
};

export default PropertiesPanel;