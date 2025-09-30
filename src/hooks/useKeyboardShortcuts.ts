import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onSave,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
  canUndo,
  canRedo
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      // Prevent default browser shortcuts that might interfere
      if (isCtrlOrCmd && ['s', 'z', 'y', 'c', 'v', 'a'].includes(key.toLowerCase())) {
        event.preventDefault();
      }

      switch (key.toLowerCase()) {
        case 's':
          if (isCtrlOrCmd) {
            onSave();
          }
          break;
        case 'z':
          if (isCtrlOrCmd) {
            if (shiftKey && canRedo) {
              onRedo();
            } else if (canUndo) {
              onUndo();
            }
          }
          break;
        case 'y':
          if (isCtrlOrCmd && canRedo) {
            onRedo();
          }
          break;
        case 'c':
          if (isCtrlOrCmd) {
            onCopy();
          }
          break;
        case 'v':
          if (isCtrlOrCmd) {
            onPaste();
          }
          break;
        case 'a':
          if (isCtrlOrCmd) {
            onSelectAll();
          }
          break;
        case 'delete':
        case 'backspace':
          onDelete();
          break;
        case 'escape':
          // Cancel any active operations
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo, onSave, onCopy, onPaste, onDelete, onSelectAll, canUndo, canRedo]);
};