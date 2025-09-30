import type { DiagramState } from '../types/UMLTypes';

/**
 * Convierte el formato del diagrama del frontend al formato que espera el backend
 */
export const adaptDiagramForBackend = (diagramState: DiagramState) => {
  return {
    classes: diagramState.classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      x: cls.x,
      y: cls.y,
      width: cls.width,
      height: cls.height,
      attributes: parseAttributes(cls.attributes),
      methods: parseMethods(cls.methods),
      stereotypes: cls.stereotypes || [],
      visibility: cls.visibility || 'public'
    })),
    interfaces: diagramState.interfaces.map(iface => ({
      id: iface.id,
      name: iface.name,
      x: iface.x,
      y: iface.y,
      width: iface.width,
      height: iface.height,
      methods: parseMethods(iface.methods)
    })),
    relationships: diagramState.relationships.map(rel => ({
      id: rel.id,
      type: rel.type,
      sourceClassId: rel.from, // El backend espera 'sourceClassId' no 'from'
      targetClassId: rel.to,   // El backend espera 'targetClassId' no 'to'
      fromMultiplicity: rel.fromMultiplicity,
      toMultiplicity: rel.toMultiplicity,
      label: rel.label,
      points: rel.points
    })),
    notes: diagramState.notes || [],
    packages: diagramState.packages || []
  };
};

/**
 * Parsea atributos del formato string al formato objeto
 * Ejemplo: "- name: String" -> { name: "name", type: "String", visibility: "private" }
 */
const parseAttributes = (attributes: string[]) => {
  return attributes.map(attr => {
    // Formato: [+|-|#|~] nombre: tipo
    const match = attr.match(/^\s*([+\-#~])\s+(\w+):\s*(\w+)/);
    
    if (!match) {
      console.warn(`Atributo con formato inválido: ${attr}`);
      return {
        name: 'unknown',
        type: 'String',
        visibility: 'private',
        isRequired: false
      };
    }

    const [, visibilitySymbol, name, type] = match;
    
    return {
      name,
      type: mapJavaType(type),
      visibility: parseVisibility(visibilitySymbol),
      isRequired: false,
      defaultValue: undefined
    };
  });
};

/**
 * Parsea métodos del formato string al formato objeto
 * Ejemplo: "+ getName(): String" -> { name: "getName", returnType: "String", visibility: "public", parameters: [] }
 */
const parseMethods = (methods: string[]) => {
  return methods.map(method => {
    // Formato: [+|-|#|~] nombre(params): tipo
    const match = method.match(/^\s*([+\-#~])\s+(\w+)\s*\(([^)]*)\)\s*:\s*(\w+)/);
    
    if (!match) {
      console.warn(`Método con formato inválido: ${method}`);
      return {
        name: 'unknown',
        returnType: 'void',
        visibility: 'public',
        parameters: []
      };
    }

    const [, visibilitySymbol, name, paramsStr, returnType] = match;
    
    return {
      name,
      returnType: mapJavaType(returnType),
      visibility: parseVisibility(visibilitySymbol),
      parameters: parseParameters(paramsStr)
    };
  });
};

/**
 * Parsea los parámetros de un método
 * Ejemplo: "name: String, age: int" -> [{ name: "name", type: "String" }, { name: "age", type: "int" }]
 */
const parseParameters = (paramsStr: string) => {
  if (!paramsStr || paramsStr.trim() === '') {
    return [];
  }

  return paramsStr.split(',').map(param => {
    const trimmed = param.trim();
    const match = trimmed.match(/(\w+):\s*(\w+)/);
    
    if (!match) {
      return { name: 'param', type: 'Object' };
    }

    const [, name, type] = match;
    return {
      name,
      type: mapJavaType(type)
    };
  });
};

/**
 * Convierte símbolos de visibilidad a palabras
 */
const parseVisibility = (symbol: string): string => {
  const visibilityMap: { [key: string]: string } = {
    '+': 'public',
    '-': 'private',
    '#': 'protected',
    '~': 'package'
  };
  return visibilityMap[symbol] || 'public';
};

/**
 * Mapea tipos comunes a tipos de Java
 */
const mapJavaType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'String': 'String',
    'string': 'String',
    'int': 'Integer',
    'Integer': 'Integer',
    'long': 'Long',
    'Long': 'Long',
    'float': 'Float',
    'Float': 'Float',
    'double': 'Double',
    'Double': 'Double',
    'boolean': 'Boolean',
    'Boolean': 'Boolean',
    'bool': 'Boolean',
    'Date': 'Date',
    'date': 'Date',
    'void': 'void',
    'List': 'List',
    'Set': 'Set',
    'Map': 'Map'
  };
  
  return typeMap[type] || type;
};
