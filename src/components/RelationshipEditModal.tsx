import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import type { UMLRelationship } from '../types/UMLTypes';

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
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border: 1px solid ${props => props.primary ? '#2196F3' : '#ddd'};
  background: ${props => props.primary ? '#2196F3' : 'white'};
  color: ${props => props.primary ? 'white' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.primary ? '#1976D2' : '#f5f5f5'};
  }
`;

const CardinalityRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

interface RelationshipEditModalProps {
  relationship: UMLRelationship | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (relationship: UMLRelationship) => void;
}

export const RelationshipEditModal: React.FC<RelationshipEditModalProps> = ({
  relationship,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedRelationship, setEditedRelationship] = useState<UMLRelationship | null>(null);

  useEffect(() => {
    if (relationship && isOpen) {
      setEditedRelationship({ ...relationship });
    }
  }, [relationship, isOpen]);

  if (!isOpen || !editedRelationship) return null;

  const handleSave = () => {
    if (editedRelationship) {
      onSave(editedRelationship);
      onClose();
    }
  };

  const relationshipTypes = [
    { value: 'association', label: 'Asociación' },
    { value: 'inheritance', label: 'Herencia' },
    { value: 'composition', label: 'Composición' },
    { value: 'aggregation', label: 'Agregación' },
    { value: 'dependency', label: 'Dependencia' },
    { value: 'realization', label: 'Realización' },
    { value: 'manyToMany', label: 'Muchos a Muchos' }
  ];

  const cardinalityOptions = ['1', '0..1', '1..*', '*', '0..*', 'n', '1..n'];

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Editar Relación</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label>Tipo de Relación</Label>
          <Select
            value={editedRelationship.type}
            onChange={(e) => setEditedRelationship({
              ...editedRelationship,
              type: e.target.value as UMLRelationship['type']
            })}
          >
            {relationshipTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <CardinalityRow>
          <FormGroup>
            <Label>Cardinalidad Origen</Label>
            <Select
              value={editedRelationship.fromMultiplicity || '1'}
              onChange={(e) => setEditedRelationship({
                ...editedRelationship,
                fromMultiplicity: e.target.value
              })}
            >
              {cardinalityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Cardinalidad Destino</Label>
            <Select
              value={editedRelationship.toMultiplicity || '1'}
              onChange={(e) => setEditedRelationship({
                ...editedRelationship,
                toMultiplicity: e.target.value
              })}
            >
              {cardinalityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </FormGroup>
        </CardinalityRow>

        <FormGroup>
          <Label>Etiqueta de la Relación</Label>
          <Input
            type="text"
            value={editedRelationship.label || ''}
            onChange={(e) => setEditedRelationship({
              ...editedRelationship,
              label: e.target.value
            })}
            placeholder="Ej: contiene, pertenece a, hereda de..."
          />
        </FormGroup>

        <ButtonGroup>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button primary onClick={handleSave}>
            Guardar
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RelationshipEditModal;