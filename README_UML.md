# 🎯 Diagramador UML Profesional - VERSIÓN COMPLETA

Una aplicación web moderna y completamente funcional para crear diagramas UML de clases con **TODAS** las funcionalidades de herramientas profesionales como StarUML, ArchiMate y Draw.io.

## ✨ Características Principales

### 🎨 Interfaz Profesional
- **Barra de menú completa** con acciones de archivo, edición y configuración
- **Toolbar lateral** con herramientas de selección y elementos UML
- **Panel de propiedades** para editar elementos seleccionados
- **Canvas interactivo** con zoom, pan y grilla configurable

### 🏗️ Elementos UML Soportados
- **Clases UML** con atributos, métodos y visibilidad
- **Interfaces** con métodos abstractos
- **Clases abstractas** y enumeraciones
- **Relaciones** (asociación, herencia, composición, agregación)
- **Paquetes** y **notas** explicativas

### 🛠️ Funcionalidades Avanzadas
- **Drag & Drop** para posicionar elementos
- **Zoom y Pan** con rueda del ratón
- **Grilla inteligente** con ajuste automático
- **Exportación múltiple** (PNG, JPG, SVG, PDF)
- **Guardado/Carga** de proyectos en JSON
- **Deshacer/Rehacer** acciones
- **Selección múltiple** y operaciones en lote

## 🚀 Tecnologías Utilizadas

### Frontend Moderno
- **React 18** con TypeScript para máxima seguridad de tipos
- **Vite** para desarrollo rápido y build optimizado
- **Styled Components** para estilos dinámicos y theme
- **Konva.js** para renderizado canvas de alta performance

### Librerías Especializadas
- **React-Konva** - Canvas interactivo y manipulación 2D
- **Fabric.js** - Herramientas avanzadas de canvas
- **D3.js** - Visualización de datos y diagramas
- **Mermaid** - Soporte para diagramas en texto
- **Lucide React** - Iconografía moderna y consistente

### Utilidades Profesionales
- **html2canvas** - Captura de screenshots del canvas
- **jsPDF** - Generación de PDF de alta calidad
- **UUID** - Identificadores únicos para elementos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── UMLDiagramEditor.tsx   # Editor principal del canvas
│   ├── MenuBar.tsx           # Barra de menú superior
│   ├── Toolbar.tsx           # Panel de herramientas lateral
│   └── PropertiesPanel.tsx   # Panel de propiedades
├── types/               # Definiciones TypeScript
│   ├── UMLTypes.ts          # Tipos para elementos UML
│   └── styled.d.ts          # Extensión de styled-components
└── App.tsx              # Componente principal con theming
```

## 🏃‍♂️ Cómo Ejecutar

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone [url-del-repo]
cd exa1

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev       # Servidor de desarrollo (http://localhost:5173)
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Análisis de código
```

## 🎮 Cómo Usar

### 1. Creación de Elementos
- Selecciona una herramienta del toolbar lateral
- Haz clic en el canvas para crear el elemento
- Ajusta propiedades en el panel derecho

### 2. Navegación del Canvas
- **Zoom**: Rueda del ratón o botones de zoom
- **Pan**: Arrastra con herramienta de movimiento
- **Selección**: Clic en elementos o área de selección

### 3. Edición de Propiedades
- Selecciona un elemento
- Edita nombre, posición, tamaño en el panel
- Configura colores, visibilidad y estilos

### 4. Exportación
- **Archivo → Exportar** para PNG, PDF
- **Archivo → Guardar** para proyectos JSON
- **Archivo → Imprimir** para impresión directa

## 🔧 Configuración Avanzada

### Personalización de Tema
```typescript
const customTheme = {
  colors: {
    primary: '#your-color',
    background: '#your-bg',
    // ... más colores
  }
};
```

### Extensión de Tipos UML
```typescript
// En types/UMLTypes.ts
export interface CustomElement extends UMLClass {
  customProperty: string;
  // ... propiedades adicionales
}
```

## 🚀 Características Técnicas

### Performance Optimizada
- **Virtual Canvas** para manejar diagramas grandes
- **Lazy Loading** de componentes pesados
- **Memoización** de cálculos costosos
- **Debouncing** en operaciones de guardado

### Accesibilidad
- **Navegación por teclado** completa
- **Atajos de teclado** para acciones rápidas
- **Tooltips descriptivos** en todas las herramientas
- **Alto contraste** y soporte para lectores de pantalla

### Compatibilidad
- **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- **Responsive design** para tablets
- **Soporte offline** con Service Workers
- **PWA ready** para instalación como app

## 📊 Comparación con Herramientas Profesionales

| Característica | Esta App | StarUML | Draw.io | ArchiMate |
|---------------|----------|---------|---------|-----------|
| Gratis | ✅ | ❌ | ✅ | ❌ |
| Web-based | ✅ | ❌ | ✅ | ❌ |
| Open Source | ✅ | ❌ | ✅ | ❌ |
| Clases UML | ✅ | ✅ | ✅ | ✅ |
| Relaciones | ✅ | ✅ | ✅ | ✅ |
| Export PDF | ✅ | ✅ | ✅ | ✅ |
| Tiempo Real | ✅ | ❌ | ✅ | ❌ |

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🏆 Créditos

Desarrollado como parte del curso de Ingeniería de Software I - UAGRM
Semestre 9 - Examen 1

---

**¡Disfruta creando diagramas UML profesionales! 🎉**

## 🔧 Configuración Técnica Original

Este proyecto fue creado con React + TypeScript + Vite para máximo rendimiento y experiencia de desarrollo.