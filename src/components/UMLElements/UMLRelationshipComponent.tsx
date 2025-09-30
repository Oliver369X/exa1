import React from 'react';
import { Group, Line, Rect, Circle, Text } from 'react-konva';
import type { UMLRelationship, UMLClass, UMLInterface, UMLNote } from '../../types/UMLTypes';

interface UMLRelationshipComponentProps {
  relationship: UMLRelationship;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
  elements: (UMLClass | UMLInterface | UMLNote)[];
}

export const UMLRelationshipComponent: React.FC<UMLRelationshipComponentProps> = ({
  relationship,
  isSelected,
  onSelect,
  onDoubleClick,
  elements
}) => {
  // Encontrar los elementos conectados por la relación
  const fromElement = elements.find(el => el.id === relationship.from);
  const toElement = elements.find(el => el.id === relationship.to);

  if (!fromElement || !toElement) {
    return null; // No renderizar si no encuentra los elementos
  }



  // Calcular puntos de conexión simples por ahora (centro a centro)
  const startPoint = {
    x: fromElement.x + fromElement.width / 2,
    y: fromElement.y + fromElement.height / 2
  };
  
  const endPoint = {
    x: toElement.x + toElement.width / 2,
    y: toElement.y + toElement.height / 2
  };

  const points = [startPoint.x, startPoint.y, endPoint.x, endPoint.y];

  const getArrowHead = () => {
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const arrowLength = 20; // Más grande
    const arrowAngle = Math.PI / 5; // Más ancha

    const arrow1X = endPoint.x - arrowLength * Math.cos(angle - arrowAngle);
    const arrow1Y = endPoint.y - arrowLength * Math.sin(angle - arrowAngle);
    const arrow2X = endPoint.x - arrowLength * Math.cos(angle + arrowAngle);
    const arrow2Y = endPoint.y - arrowLength * Math.sin(angle + arrowAngle);

    switch (relationship.type) {
      case 'inheritance':
        return (
          <Group>
            <Line
              points={[arrow1X, arrow1Y, endPoint.x, endPoint.y, arrow2X, arrow2Y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
              fill="white"
              closed
            />
          </Group>
        );
      case 'association':
        return (
          <Group>
            <Line
              points={[arrow1X, arrow1Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
            <Line
              points={[arrow2X, arrow2Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
          </Group>
        );
      case 'composition':
        return (
          <Group>
            <Rect
              x={endPoint.x - 8}
              y={endPoint.y - 4}
              width={16}
              height={8}
              fill={isSelected ? "#2196F3" : "#333"}
              rotation={(angle * 180) / Math.PI}
              offsetX={8}
              offsetY={4}
            />
          </Group>
        );
      case 'aggregation':
        return (
          <Group>
            <Circle
              x={endPoint.x}
              y={endPoint.y}
              radius={6}
              fill="white"
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
          </Group>
        );
      case 'manyToMany':
        // Doble flecha bidireccional para Many-to-Many
        return (
          <Group>
            {/* Flecha en el extremo final */}
            <Line
              points={[arrow1X, arrow1Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
            <Line
              points={[arrow2X, arrow2Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
            {/* Flecha en el extremo inicial (bidireccional) */}
            <Line
              points={[
                startPoint.x + arrowLength * Math.cos(angle - arrowAngle),
                startPoint.y + arrowLength * Math.sin(angle - arrowAngle),
                startPoint.x,
                startPoint.y
              ]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
            <Line
              points={[
                startPoint.x + arrowLength * Math.cos(angle + arrowAngle),
                startPoint.y + arrowLength * Math.sin(angle + arrowAngle),
                startPoint.x,
                startPoint.y
              ]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
          </Group>
        );
      case 'dependency':
        // Flecha simple para Dependencia (línea ya es punteada)
        return (
          <Group>
            <Line
              points={[arrow1X, arrow1Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
            <Line
              points={[arrow2X, arrow2Y, endPoint.x, endPoint.y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
            />
          </Group>
        );
      case 'realization':
        // Triángulo vacío para Realización (línea ya es punteada)
        return (
          <Group>
            <Line
              points={[arrow1X, arrow1Y, endPoint.x, endPoint.y, arrow2X, arrow2Y]}
              stroke={isSelected ? "#2196F3" : "#333"}
              strokeWidth={2}
              fill="white"
              closed
            />
          </Group>
        );
      default:
        return null;
    }
  };

  const getLineStyle = () => {
    switch (relationship.type) {
      case 'dependency':
      case 'realization':
        return [5, 5]; // Dashed line
      case 'manyToMany':
        return [10, 5]; // Línea punteada más visible para M:M
      default:
        return undefined; // Solid line
    }
  };

  return (
    <Group onClick={onSelect} onDblClick={onDoubleClick}>
      {/* Main relationship line */}
      <Line
        points={points}
        stroke={isSelected ? "#2196F3" : "#333"}
        strokeWidth={isSelected ? 3 : 2}
        dash={getLineStyle()}
        hitStrokeWidth={8}
      />
      
      {/* Arrow head */}
      {getArrowHead()}
      
      {/* Relationship label */}
      {relationship.label && (
        <Text
          text={relationship.label}
          x={(startPoint.x + endPoint.x) / 2 - 20}
          y={(startPoint.y + endPoint.y) / 2 - 20}
          fontSize={11}
          fill={isSelected ? "#2196F3" : "#666"}
          align="center"
        />
      )}
      
      {/* Cardinalities */}
      {relationship.fromMultiplicity && (
        <Text
          text={relationship.fromMultiplicity}
          x={startPoint.x + 10}
          y={startPoint.y - 15}
          fontSize={10}
          fill={isSelected ? "#2196F3" : "#666"}
        />
      )}
      
      {relationship.toMultiplicity && (
        <Text
          text={relationship.toMultiplicity}
          x={endPoint.x + 10}
          y={endPoint.y - 15}
          fontSize={10}
          fill={isSelected ? "#2196F3" : "#666"}
        />
      )}
    </Group>
  );
};