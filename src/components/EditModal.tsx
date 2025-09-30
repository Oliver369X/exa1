import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Plus, Trash2 } from 'lucide-react';
import type { UMLClass, UMLInterface, UMLNote } from '../types/UMLTypes';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const ListContainer = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ListInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: 'Courier New', monospace;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  margin-left: 8px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
    }
  ` : `
    background: #f5f5f5;
    color: #333;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

interface EditModalProps {
  element: UMLClass | UMLInterface | UMLNote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: UMLClass | UMLInterface | UMLNote) => void;
}

const EditModal: React.FC<EditModalProps> = ({ element, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (element) {
      setFormData({ ...element });
    }
  }, [element]);

  if (!isOpen || !element) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addAttribute = () => {
    if ('attributes' in formData) {
      setFormData({
        ...formData,
        attributes: [...formData.attributes, '- newAttribute: String']
      });
    }
  };

  const removeAttribute = (index: number) => {
    if ('attributes' in formData) {
      const newAttributes = formData.attributes.filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, attributes: newAttributes });
    }
  };

  const updateAttribute = (index: number, value: string) => {
    if ('attributes' in formData) {
      const newAttributes = [...formData.attributes];
      newAttributes[index] = value;
      setFormData({ ...formData, attributes: newAttributes });
    }
  };

  const addMethod = () => {
    const key = 'methods' in formData ? 'methods' : 'methods';
    if (key in formData) {
      setFormData({
        ...formData,
        [key]: [...formData[key], '+ newMethod(): void']
      });
    }
  };

  const removeMethod = (index: number) => {
    const key = 'methods' in formData ? 'methods' : 'methods';
    if (key in formData) {
      const newMethods = formData[key].filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, [key]: newMethods });
    }
  };

  const updateMethod = (index: number, value: string) => {
    const key = 'methods' in formData ? 'methods' : 'methods';
    if (key in formData) {
      const newMethods = [...formData[key]];
      newMethods[index] = value;
      setFormData({ ...formData, [key]: newMethods });
    }
  };

  const renderClassFields = () => (
    <>
      <FormGroup>
        <Label>Visibilidad</Label>
        <Select
          value={formData.visibility || 'public'}
          onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
        >
          <option value="public">+ Público</option>
          <option value="private">- Privado</option>
          <option value="protected"># Protegido</option>
          <option value="package">~ Paquete</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>
          Atributos
          <IconButton onClick={addAttribute} title="Agregar atributo">
            <Plus size={16} />
          </IconButton>
        </Label>
        <ListContainer>
          {formData.attributes?.map((attr: string, index: number) => (
            <ListItem key={index}>
              <ListInput
                value={attr}
                onChange={(e) => updateAttribute(index, e.target.value)}
                placeholder="- atributo: Tipo"
              />
              <IconButton onClick={() => removeAttribute(index)} title="Eliminar">
                <Trash2 size={14} />
              </IconButton>
            </ListItem>
          ))}
        </ListContainer>
      </FormGroup>

      <FormGroup>
        <Label>
          Métodos
          <IconButton onClick={addMethod} title="Agregar método">
            <Plus size={16} />
          </IconButton>
        </Label>
        <ListContainer>
          {formData.methods?.map((method: string, index: number) => (
            <ListItem key={index}>
              <ListInput
                value={method}
                onChange={(e) => updateMethod(index, e.target.value)}
                placeholder="+ método(): TipoRetorno"
              />
              <IconButton onClick={() => removeMethod(index)} title="Eliminar">
                <Trash2 size={14} />
              </IconButton>
            </ListItem>
          ))}
        </ListContainer>
      </FormGroup>
    </>
  );

  const renderInterfaceFields = () => (
    <FormGroup>
      <Label>
        Métodos
        <IconButton onClick={addMethod} title="Agregar método">
          <Plus size={16} />
        </IconButton>
      </Label>
      <ListContainer>
        {formData.methods?.map((method: string, index: number) => (
          <ListItem key={index}>
            <ListInput
              value={method}
              onChange={(e) => updateMethod(index, e.target.value)}
              placeholder="+ método(): TipoRetorno"
            />
            <IconButton onClick={() => removeMethod(index)} title="Eliminar">
              <Trash2 size={14} />
            </IconButton>
          </ListItem>
        ))}
      </ListContainer>
    </FormGroup>
  );

  const renderNoteFields = () => (
    <FormGroup>
      <Label>Texto</Label>
      <TextArea
        value={formData.text || ''}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        placeholder="Escribe el texto de la nota aquí..."
      />
    </FormGroup>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            Editar {
              'text' in formData ? 'Nota' :
              'attributes' in formData ? 'Clase' : 'Interfaz'
            }
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del elemento"
            />
          </FormGroup>

          <FormGroup>
            <Label>Posición X</Label>
            <Input
              type="number"
              value={formData.x || 0}
              onChange={(e) => setFormData({ ...formData, x: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Posición Y</Label>
            <Input
              type="number"
              value={formData.y || 0}
              onChange={(e) => setFormData({ ...formData, y: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Ancho</Label>
            <Input
              type="number"
              value={formData.width || 0}
              onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Alto</Label>
            <Input
              type="number"
              value={formData.height || 0}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>

          {'text' in formData && renderNoteFields()}
          {'attributes' in formData && renderClassFields()}
          {'methods' in formData && !('attributes' in formData) && renderInterfaceFields()}
        </ModalBody>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditModal;