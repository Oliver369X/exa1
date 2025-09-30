export interface UMLClass {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attributes: string[];
  methods: string[];
  stereotypes: string[];
  visibility?: 'public' | 'private' | 'protected';
}

export interface UMLRelationship {
  id: string;
  type: 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency' | 'realization' | 'manyToMany';
  from: string;
  to: string;
  fromMultiplicity?: string;
  toMultiplicity?: string;
  label?: string;
  points: { x: number; y: number }[];
}

export interface UMLInterface {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  methods: string[];
}

export interface UMLPackage {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  classes: string[];
}

export interface UMLNote {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiagramState {
  classes: UMLClass[];
  relationships: UMLRelationship[];
  interfaces: UMLInterface[];
  packages: UMLPackage[];
  notes: UMLNote[];
  selectedElements: string[];
  zoom: number;
  pan: { x: number; y: number };
}

export type UMLElement = UMLClass | UMLInterface | UMLPackage | UMLNote;

export interface DiagramSettings {
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  theme: 'light' | 'dark';
  autoLayout: boolean;
}