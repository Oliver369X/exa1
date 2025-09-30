import React, { useState } from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type { UMLInterface } from '../../types/UMLTypes';

interface UMLInterfaceComponentProps {
  umlInterface: UMLInterface;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const UMLInterfaceComponent: React.FC<UMLInterfaceComponentProps> = ({
  umlInterface,
  isSelected,
  onSelect,
  onDragEnd
}) => {
  const [, setIsDragging] = useState(false);

  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    onDragEnd(e.target.x(), e.target.y());
  };

  const titleHeight = 50;
  const methodHeight = umlInterface.methods.length * 18 + 10;
  const totalHeight = titleHeight + methodHeight + 10;

  return (
    <Group
      id={umlInterface.id}
      x={umlInterface.x}
      y={umlInterface.y}
      draggable
      onClick={onSelect}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      {/* Interface rectangle with dashed border */}
      <Rect
        width={umlInterface.width}
        height={totalHeight}
        fill="white"
        stroke={isSelected ? "#2196F3" : "#333"}
        strokeWidth={isSelected ? 3 : 2}
        dash={[5, 5]}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={6}
        shadowOffset={{ x: 3, y: 3 }}
        cornerRadius={4}
      />
      
      {/* Stereotype */}
      <Text
        text="<<interface>>"
        x={10}
        y={8}
        fontSize={11}
        fontStyle="italic"
        fill="#666"
      />
      
      {/* Interface name */}
      <Text
        text={umlInterface.name}
        x={10}
        y={25}
        fontSize={16}
        fontStyle="bold italic"
        fill="#333"
      />
      
      {/* Separator line */}
      <Line
        points={[5, titleHeight, umlInterface.width - 5, titleHeight]}
        stroke="#333"
        strokeWidth={1}
      />
      
      {/* Methods section */}
      {umlInterface.methods.map((method, index) => (
        <Text
          key={`method-${index}`}
          text={`+ ${method}`}
          x={10}
          y={titleHeight + 8 + index * 18}
          fontSize={12}
          fill="#333"
          fontFamily="'Courier New', monospace"
          fontStyle="italic"
        />
      ))}

      {/* Selection handles */}
      {isSelected && (
        <>
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
            x={umlInterface.width - 4}
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
            x={umlInterface.width - 4}
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