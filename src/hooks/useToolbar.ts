import { useState, useCallback } from 'react';

export type ToolType = 'select' | 'move' | 'class' | 'interface' | 'abstract' | 'enum' | 'note' | 'package' | 'association' | 'inheritance' | 'composition' | 'aggregation' | 'manyToMany' | 'text';

export const useToolbar = () => {
  const [selectedTool, setSelectedTool] = useState<ToolType>('select');

  const selectTool = useCallback((tool: ToolType) => {
    setSelectedTool(tool);
  }, []);

  return {
    selectedTool,
    selectTool
  };
};