import type { DiagramState } from '../types/UMLTypes';

export const createSampleDiagram = (): DiagramState => {
  return {
    classes: [
      {
        id: 'class-1',
        name: 'Person',
        x: 100,
        y: 100,
        width: 200,
        height: 180,
        attributes: [
          '- name: String',
          '- age: int',
          '- email: String'
        ],
        methods: [
          '+ getName(): String',
          '+ setName(name: String): void',
          '+ getAge(): int',
          '+ setAge(age: int): void'
        ],
        stereotypes: [],
        visibility: 'public'
      },
      {
        id: 'class-2',
        name: 'Student',
        x: 400,
        y: 100,
        width: 200,
        height: 160,
        attributes: [
          '- studentId: String',
          '- gpa: float'
        ],
        methods: [
          '+ getStudentId(): String',
          '+ getGPA(): float',
          '+ enroll(course: Course): void'
        ],
        stereotypes: [],
        visibility: 'public'
      },
      {
        id: 'class-3',
        name: 'Course',
        x: 700,
        y: 100,
        width: 200,
        height: 140,
        attributes: [
          '- courseCode: String',
          '- title: String',
          '- credits: int'
        ],
        methods: [
          '+ getCourseCode(): String',
          '+ getTitle(): String',
          '+ getCredits(): int'
        ],
        stereotypes: [],
        visibility: 'public'
      }
    ],
    interfaces: [
      {
        id: 'interface-1',
        name: 'Enrollable',
        x: 400,
        y: 350,
        width: 200,
        height: 100,
        methods: [
          '+ enroll(): boolean',
          '+ withdraw(): boolean'
        ]
      }
    ],
    relationships: [
      {
        id: 'rel-1',
        type: 'inheritance',
        from: 'class-2',
        to: 'class-1',
        points: [
          { x: 400, y: 150 },
          { x: 300, y: 150 }
        ],
        label: 'extends'
      },
      {
        id: 'rel-2',
        type: 'association',
        from: 'class-2',
        to: 'class-3',
        points: [
          { x: 600, y: 180 },
          { x: 700, y: 180 }
        ],
        label: 'enrolls in',
        fromMultiplicity: '*',
        toMultiplicity: '*'
      },
      {
        id: 'rel-3',
        type: 'realization',
        from: 'class-2',
        to: 'interface-1',
        points: [
          { x: 500, y: 260 },
          { x: 500, y: 350 }
        ],
        label: 'implements'
      }
    ],
    notes: [
      {
        id: 'note-1',
        text: 'Este es un diagrama de ejemplo que muestra una jerarquía de clases para un sistema académico.',
        x: 100,
        y: 350,
        width: 250,
        height: 80
      }
    ],
    packages: [],
    selectedElements: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  };
};