import React, { useState } from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type { UMLClass } from '../../types/UMLTypes';

interface UMLClassComponentProps {
  umlClass: UMLClass;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onDoubleClick?: () => void;
}

export const UMLClassComponent: React.FC<UMLClassComponentProps> = ({
  umlClass,
  isSelected,
  onSelect,
  onDragEnd,
  onDoubleClick
}) => {
  const [, setIsDragging] = useState(false);

  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    onDragEnd(e.target.x(), e.target.y());
  };

  const getVisibilitySymbol = (visibility?: string) => {
    switch (visibility) {
      case 'public': return '+';
      case 'private': return '-';
      case 'protected': return '#';
      case 'package': return '~';
      default: return '';
    }
  };

  const titleHeight = 35;
  const attributeHeight = umlClass.attributes.length * 18 + 10;
  const methodHeight = umlClass.methods.length * 18 + 10;
  const totalHeight = titleHeight + attributeHeight + methodHeight + 10;

  return (
    <Group
      id={umlClass.id}
      x={umlClass.x}
      y={umlClass.y}
      draggable
      onClick={onSelect}
      onDblClick={onDoubleClick}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      {/* Main class rectangle */}
      <Rect
        width={umlClass.width}
        height={totalHeight}
        fill="white"
        stroke={isSelected ? "#2196F3" : "#333"}
        strokeWidth={isSelected ? 3 : 2}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={6}
        shadowOffset={{ x: 3, y: 3 }}
        cornerRadius={4}
      />
      
      {/* Stereotypes */}
      {umlClass.stereotypes && umlClass.stereotypes.length > 0 && (
        <Text
          text={`<<${umlClass.stereotypes.join(', ')}>>`}
          x={10}
          y={5}
          fontSize={11}
          fontStyle="italic"
          fill="#666"
        />
      )}
      
      {/* Class name */}
      <Text
        text={umlClass.name}
        x={10}
        y={umlClass.stereotypes && umlClass.stereotypes.length > 0 ? 20 : 12}
        fontSize={16}
        fontStyle="bold"
        fill="#333"
      />
      
      {/* Separator line 1 */}
      <Line
        points={[5, titleHeight, umlClass.width - 5, titleHeight]}
        stroke="#333"
        strokeWidth={1}
      />
      
      {/* Attributes section */}
      {umlClass.attributes.map((attr, index) => (
        <Text
          key={`attr-${index}`}
          text={`${getVisibilitySymbol(umlClass.visibility)} ${attr}`}
          x={10}
          y={titleHeight + 8 + index * 18}
          fontSize={12}
          fill="#333"
          fontFamily="'Courier New', monospace"
        />
      ))}
      
      {/* Separator line 2 */}
      <Line
        points={[5, titleHeight + attributeHeight, umlClass.width - 5, titleHeight + attributeHeight]}
        stroke="#333"
        strokeWidth={1}
      />
      
      {/* Methods section */}
      {umlClass.methods.map((method, index) => (
        <Text
          key={`method-${index}`}
          text={`${getVisibilitySymbol(umlClass.visibility)} ${method}`}
          x={10}
          y={titleHeight + attributeHeight + 8 + index * 18}
          fontSize={12}
          fill="#333"
          fontFamily="'Courier New', monospace"
        />
      ))}

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <Rect
            x={-4}
            y={-4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
          <Rect
            x={umlClass.width - 4}
            y={-4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
          <Rect
            x={-4}
            y={totalHeight - 4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
          <Rect
            x={umlClass.width - 4}
            y={totalHeight - 4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
        </>
      )}
    </Group>
  );
};