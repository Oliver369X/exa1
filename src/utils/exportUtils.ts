import type { DiagramState } from '../types/UMLTypes';

export const exportDiagramAsPNG = async (stageRef: any): Promise<void> => {
  if (stageRef.current) {
    const uri = stageRef.current.toDataURL({
      mimeType: 'image/png',
      quality: 1.0,
      pixelRatio: 2 // Higher resolution
    });
    
    const link = document.createElement('a');
    link.download = `uml-diagram-${new Date().toISOString().split('T')[0]}.png`;
    link.href = uri;
    link.click();
  }
};

export const exportDiagramAsSVG = async (stageRef: any): Promise<void> => {
  if (stageRef.current) {
    // Note: Konva doesn't directly support SVG export, but we can create one
    const stage = stageRef.current;
    const width = stage.width();
    const height = stage.height();
    
    // Create SVG content (simplified version)
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <!-- UML elements would be converted to SVG here -->
        <text x="10" y="30" font-family="Arial" font-size="16">UML Diagram (SVG export in development)</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `uml-diagram-${new Date().toISOString().split('T')[0]}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }
};

export const saveProjectAsJSON = (diagramState: DiagramState): void => {
  const projectData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    diagram: diagramState,
    metadata: {
      creator: 'UML Professional Diagrammer',
      title: 'UML Class Diagram'
    }
  };
  
  const jsonString = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `uml-project-${new Date().toISOString().split('T')[0]}.json`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const loadProjectFromJSON = (file: File): Promise<DiagramState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const projectData = JSON.parse(result);
        
        if (projectData.diagram) {
          resolve(projectData.diagram);
        } else {
          reject(new Error('Invalid project file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse project file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read project file'));
    };
    
    reader.readAsText(file);
  });
};

export const exportDiagramAsPDF = async (stageRef: any): Promise<void> => {
  // This would require additional PDF library integration
  // For now, we'll export as high-quality PNG and let user convert
  await exportDiagramAsPNG(stageRef);
  alert('PDF export: High-quality PNG exported. You can convert to PDF using online tools or print-to-PDF.');
};

export const generateMermaidCode = (diagramState: DiagramState): string => {
  let mermaidCode = 'classDiagram\n';
  
  // Add classes
  diagramState.classes.forEach(cls => {
    mermaidCode += `  class ${cls.name} {\n`;
    
    cls.attributes.forEach(attr => {
      mermaidCode += `    ${attr}\n`;
    });
    
    cls.methods.forEach(method => {
      mermaidCode += `    ${method}\n`;
    });
    
    mermaidCode += '  }\n\n';
  });
  
  // Add interfaces
  diagramState.interfaces.forEach(iface => {
    mermaidCode += `  class ${iface.name} {\n`;
    mermaidCode += '    <<interface>>\n';
    
    iface.methods.forEach(method => {
      mermaidCode += `    ${method}\n`;
    });
    
    mermaidCode += '  }\n\n';
  });
  
  // Add relationships
  diagramState.relationships.forEach(rel => {
    const fromClass = diagramState.classes.find(c => c.id === rel.from) || 
                     diagramState.interfaces.find(i => i.id === rel.from);
    const toClass = diagramState.classes.find(c => c.id === rel.to) || 
                   diagramState.interfaces.find(i => i.id === rel.to);
    
    if (fromClass && toClass) {
      let arrow = '-->';
      switch (rel.type) {
        case 'inheritance':
          arrow = '--|>';
          break;
        case 'composition':
          arrow = '--*';
          break;
        case 'aggregation':
          arrow = '--o';
          break;
        case 'dependency':
          arrow = '..>';
          break;
        case 'realization':
          arrow = '..|>';
          break;
      }
      
      mermaidCode += `  ${fromClass.name} ${arrow} ${toClass.name}\n`;
    }
  });
  
  return mermaidCode;
};

export const exportMermaidCode = (diagramState: DiagramState): void => {
  const mermaidCode = generateMermaidCode(diagramState);
  
  const blob = new Blob([mermaidCode], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `uml-diagram-${new Date().toISOString().split('T')[0]}.mmd`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
};