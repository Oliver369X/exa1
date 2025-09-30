import { useState, useCallback, useRef } from 'react';
import type { UMLClass, UMLRelationship, DiagramState, UMLInterface, UMLNote } from '../types/UMLTypes';

// Diagrama vacío por defecto
const createEmptyDiagram = (): DiagramState => ({
  classes: [],
  relationships: [],
  interfaces: [],
  packages: [],
  notes: [],
  selectedElements: [],
  zoom: 1,
  pan: { x: 0, y: 0 }
});

export const useDiagramState = (initialData?: DiagramState) => {
  const [diagramState, setDiagramState] = useState<DiagramState>(
    initialData || createEmptyDiagram()
  );

  const historyRef = useRef<DiagramState[]>([diagramState]);
  const historyIndexRef = useRef(0);

  const saveToHistory = useCallback((newState: DiagramState) => {
    const history = historyRef.current;
    const currentIndex = historyIndexRef.current;
    
    // Remove any future history if we're in the middle
    history.splice(currentIndex + 1);
    
    // Add new state
    history.push(newState);
    
    // Limit history size
    if (history.length > 50) {
      history.shift();
    } else {
      historyIndexRef.current++;
    }
  }, []);

  const addClass = useCallback((umlClass: UMLClass) => {
    setDiagramState(prevState => {
      const newState = {
        ...prevState,
        classes: [...prevState.classes, umlClass]
      };
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const addInterface = useCallback((umlInterface: UMLInterface) => {
    setDiagramState(prevState => {
      const newState = {
        ...prevState,
        interfaces: [...prevState.interfaces, umlInterface]
      };
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const addNote = useCallback((note: UMLNote) => {
    setDiagramState(prevState => {
      const newState = {
        ...prevState,
        notes: [...prevState.notes, note]
      };
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const addRelationship = useCallback((relationship: UMLRelationship) => {
    setDiagramState(prevState => {
      const newState = {
        ...prevState,
        relationships: [...prevState.relationships, relationship]
      };
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<UMLClass | UMLInterface | UMLNote>) => {
    setDiagramState(prevState => {
      const newState = { ...prevState };
      
      // Update class
      const classIndex = newState.classes.findIndex(c => c.id === id);
      if (classIndex !== -1) {
        newState.classes = [...newState.classes];
        newState.classes[classIndex] = { ...newState.classes[classIndex], ...updates };
      }
      
      // Update interface
      const interfaceIndex = newState.interfaces.findIndex(i => i.id === id);
      if (interfaceIndex !== -1) {
        newState.interfaces = [...newState.interfaces];
        newState.interfaces[interfaceIndex] = { ...newState.interfaces[interfaceIndex], ...updates };
      }

      // Update note
      const noteIndex = newState.notes.findIndex(n => n.id === id);
      if (noteIndex !== -1) {
        newState.notes = [...newState.notes];
        newState.notes[noteIndex] = { ...newState.notes[noteIndex], ...updates };
      }
      
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    setDiagramState(prevState => {
      const newState = {
        ...prevState,
        classes: prevState.classes.filter(c => c.id !== id),
        interfaces: prevState.interfaces.filter(i => i.id !== id),
        notes: prevState.notes.filter(n => n.id !== id),
        relationships: prevState.relationships.filter(r => r.from !== id && r.to !== id),
        selectedElements: prevState.selectedElements.filter(e => e !== id)
      };
      saveToHistory(newState);
      return newState;
    });
  }, [saveToHistory]);

  const setSelectedElements = useCallback((elementIds: string[]) => {
    setDiagramState(prevState => ({
      ...prevState,
      selectedElements: elementIds
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setDiagramState(prevState => ({
      ...prevState,
      zoom
    }));
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    setDiagramState(prevState => ({
      ...prevState,
      pan
    }));
  }, []);

  const undo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    if (currentIndex > 0) {
      historyIndexRef.current = currentIndex - 1;
      setDiagramState(historyRef.current[currentIndex - 1]);
    }
  }, []);

  const redo = useCallback(() => {
    const currentIndex = historyIndexRef.current;
    const history = historyRef.current;
    if (currentIndex < history.length - 1) {
      historyIndexRef.current = currentIndex + 1;
      setDiagramState(history[currentIndex + 1]);
    }
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const clearDiagram = useCallback(() => {
    const newState: DiagramState = {
      classes: [],
      relationships: [],
      interfaces: [],
      packages: [],
      notes: [],
      selectedElements: [],
      zoom: 1,
      pan: { x: 0, y: 0 }
    };
    setDiagramState(newState);
    saveToHistory(newState);
  }, [saveToHistory]);

  const loadDiagram = useCallback((state: DiagramState) => {
    setDiagramState(state);
    saveToHistory(state);
  }, [saveToHistory]);

  return {
    diagramState,
    addClass,
    addInterface,
    addNote,
    addRelationship,
    updateElement,
    deleteElement,
    setSelectedElements,
    setZoom,
    setPan,
    undo,
    redo,
    canUndo,
    canRedo,
    clearDiagram,
    loadDiagram
  };
};