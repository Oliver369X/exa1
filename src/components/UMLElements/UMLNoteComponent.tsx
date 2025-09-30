import React, { useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { UMLNote } from '../../types/UMLTypes';

interface UMLNoteComponentProps {
  note: UMLNote;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const UMLNoteComponent: React.FC<UMLNoteComponentProps> = ({
  note,
  isSelected,
  onSelect,
  onDragEnd
}) => {
  const [, setIsDragging] = useState(false);

  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    onDragEnd(e.target.x(), e.target.y());
  };

  return (
    <Group
      id={note.id}
      x={note.x}
      y={note.y}
      draggable
      onClick={onSelect}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      {/* Note rectangle with yellow background */}
      <Rect
        width={note.width}
        height={note.height}
        fill="#FFF9C4"
        stroke={isSelected ? "#2196F3" : "#FFB300"}
        strokeWidth={isSelected ? 3 : 2}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        cornerRadius={4}
      />
      
      {/* Folded corner effect */}
      <Rect
        x={note.width - 15}
        y={0}
        width={15}
        height={15}
        fill="#FFE082"
        stroke="#FFB300"
        strokeWidth={1}
      />
      
      {/* Note text */}
      <Text
        text={note.text}
        x={10}
        y={10}
        width={note.width - 25}
        height={note.height - 20}
        fontSize={12}
        fill="#333"
        wrap="word"
        align="left"
        verticalAlign="top"
      />

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
            x={note.width - 4}
            y={-4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
          <Rect
            x={-4}
            y={note.height - 4}
            width={8}
            height={8}
            fill="#2196F3"
            stroke="white"
            strokeWidth={1}
          />
          <Rect
            x={note.width - 4}
            y={note.height - 4}
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