# 👥 Manual de Usuario - UML Class Diagram Designer

## 🎯 Introducción

UML Class Diagram Designer es una herramienta web moderna para crear diagramas de clases UML de manera intuitiva y colaborativa. Esta guía te ayudará a dominar todas las funcionalidades de la aplicación.

## 🚀 Primeros Pasos

### Acceso a la Aplicación

1. **Desarrollo**: Navega a `http://localhost:5173`
2. **Producción**: Accede a tu dominio configurado

### Interface Principal

La aplicación se organiza en varias áreas principales:

```
┌─────────────────────────────────────────────────┐
│ MenuBar: Archivo, Edición, Vista, Herramientas │
├─────────────────────────────────────────────────┤
│ Toolbar: Herramientas de diseño y elementos    │
├──────────┬──────────────────────────┬───────────┤
│ Paleta   │                          │ Panel de  │
│ de       │      Canvas Principal     │ Propie-   │
│ Elementos│      (Área de Dibujo)    │ dades     │
│          │                          │           │
└──────────┴──────────────────────────┴───────────┘
```

## 🎨 Elementos UML Disponibles

### 1. Clases UML

Las clases son el elemento principal de los diagramas UML.

**Crear una Clase:**
1. Haz click en el botón "Class" en la paleta de elementos
2. Haz click en el canvas donde deseas colocar la clase
3. Se creará una clase básica con el nombre "NewClass"

**Estructura de una Clase:**
```
┌─────────────────────────┐
│      NombreClase        │ ← Encabezado
├─────────────────────────┤
│ - atributo1: tipo       │ ← Sección de Atributos
│ + atributo2: tipo       │
├─────────────────────────┤
│ + método1(): tipo       │ ← Sección de Métodos  
│ - método2(param): void  │
└─────────────────────────┘
```

**Símbolos de Visibilidad:**
- `+` Public (público)
- `-` Private (privado)
- `#` Protected (protegido)
- `~` Package (paquete)

### 2. Interfaces

Las interfaces representan contratos que las clases deben implementar.

**Crear una Interface:**
1. Selecciona "Interface" en la paleta
2. Colócala en el canvas
3. Se mostrará con líneas punteadas y el estereotipo `<<interface>>`

**Características Especiales:**
- Encabezado con estereotipo `<<interface>>`
- Bordes con líneas punteadas
- Solo contiene métodos abstractos

### 3. Notas

Las notas son comentarios explicativos que se pueden agregar al diagrama.

**Crear una Nota:**
1. Selecciona "Note" en la paleta
2. Colócala donde necesites el comentario
3. Aparece como un rectángulo amarillo con esquina doblada

**Usos Comunes:**
- Explicar decisiones de diseño
- Agregar restricciones
- Documentar patrones utilizados

## 🔗 Relaciones entre Elementos

### Tipos de Relaciones

#### 1. Herencia (Inheritance)
- **Símbolo**: Flecha con triángulo blanco
- **Uso**: "Clase A es un tipo de Clase B"
- **Ejemplo**: `Perro` → `Animal`

#### 2. Asociación (Association)  
- **Símbolo**: Línea simple con flecha
- **Uso**: "Clase A usa Clase B"
- **Ejemplo**: `Persona` → `Dirección`

#### 3. Composición (Composition)
- **Símbolo**: Línea con rombo negro
- **Uso**: "Clase A está compuesta de Clase B"
- **Ejemplo**: `Casa` ◆ `Habitación`

#### 4. Agregación (Aggregation)
- **Símbolo**: Línea con rombo blanco
- **Uso**: "Clase A contiene Clase B"
- **Ejemplo**: `Departamento` ◇ `Empleado`

### Crear Relaciones

1. **Seleccionar Herramienta**: Elige el tipo de relación deseado
2. **Elemento Origen**: Haz click en el elemento de origen
3. **Elemento Destino**: Haz click en el elemento de destino
4. **Confirmación**: La relación se dibuja automáticamente

### Editar Relaciones

- **Doble Click**: Abre el modal de edición de relaciones
- **Propiedades Editables**:
  - Etiqueta de la relación
  - Cardinalidad origen (ej: 1, *, 0..1)
  - Cardinalidad destino
  - Tipo de relación

## 🛠️ Herramientas de Edición

### Selección y Manipulación

#### Herramienta Select (Seleccionar)
- **Función**: Seleccionar y mover elementos
- **Uso**:
  - Click simple: Seleccionar elemento
  - Drag: Mover elemento seleccionado
  - Ctrl+Click: Selección múltiple
  - Click y arrastrar en área vacía: Selección por rectángulo

#### Herramienta Move (Mover)
- **Función**: Modo exclusivo para mover elementos
- **Características**:
  - Snap to grid (ajuste a grilla)
  - Guías de alineación
  - Preserva relaciones

### Navegación en el Canvas

#### Zoom
- **Rueda del Mouse**: Zoom in/out
- **Ctrl + Rueda**: Zoom más preciso  
- **Botones +/-**: Controles manuales
- **Fit to Screen**: Ajustar todo el diagrama

#### Pan (Desplazamiento)
- **Middle Click + Drag**: Mover vista
- **Barras de Scroll**: Navegación tradicional
- **Controles de Navegación**: Panel flotante

#### Grilla (Grid)
- **Activar/Desactivar**: Botón de grilla en toolbar
- **Snap to Grid**: Los elementos se ajustan automáticamente
- **Configuración**: Espaciado customizable

## ✏️ Edición de Propiedades

### Editar Clases

**Abrir Editor:**
- Doble click en una clase
- Click derecho → "Editar Propiedades"

**Propiedades Generales:**
- **Nombre**: Identificador de la clase
- **Estereotipo**: `<<abstract>>`, `<<singleton>>`, etc.
- **Es Abstracta**: Checkbox para clases abstractas

**Gestión de Atributos:**
```
┌─────────────────────────────────┐
│ Atributos                       │
├─────────────────────────────────┤
│ + nombre: String                │ [Editar] [X]
│ - edad: Integer                 │ [Editar] [X]  
│ # activo: Boolean               │ [Editar] [X]
├─────────────────────────────────┤
│ [+ Agregar Atributo]           │
└─────────────────────────────────┘
```

**Propiedades de Atributos:**
- **Nombre**: Identificador del atributo
- **Tipo**: String, Integer, Boolean, etc.
- **Visibilidad**: Public, Private, Protected, Package
- **Valor por Defecto**: Valor inicial (opcional)
- **Es Estático**: Checkbox para atributos de clase

**Gestión de Métodos:**
```
┌─────────────────────────────────┐
│ Métodos                         │
├─────────────────────────────────┤
│ + obtenerNombre(): String       │ [Editar] [X]
│ + setEdad(edad: Integer): void  │ [Editar] [X]
│ # calcular(): Double            │ [Editar] [X]
├─────────────────────────────────┤
│ [+ Agregar Método]             │
└─────────────────────────────────┘
```

**Propiedades de Métodos:**
- **Nombre**: Identificador del método
- **Tipo de Retorno**: void, String, Integer, etc.
- **Parámetros**: Lista de parámetros con nombre y tipo
- **Visibilidad**: Public, Private, Protected, Package
- **Es Estático**: Método de clase
- **Es Abstracto**: Método abstracto (solo en clases abstractas)

### Editar Interfaces

Las interfaces tienen propiedades similares a las clases pero:
- **Solo Métodos**: No pueden tener atributos
- **Métodos Abstractos**: Todos los métodos son implícitamente abstractos
- **Estereotipo Fijo**: Siempre muestran `<<interface>>`

### Editar Notas

**Propiedades de Notas:**
- **Contenido**: Texto libre de la nota
- **Posición**: Coordenadas X, Y
- **Tamaño**: Ancho y alto

## 📊 Funciones Avanzadas

### Exportación

#### Formatos Disponibles

1. **PNG** - Imagen de alta calidad
   - Uso: Documentación, presentaciones
   - Características: Fondo transparente opcional

2. **JPG** - Imagen comprimida
   - Uso: Documentos donde el tamaño importa
   - Características: Fondo blanco, menor tamaño

3. **SVG** - Gráfico vectorial
   - Uso: Documentación web, escalabilidad
   - Características: Tamaño infinitamente escalable

4. **PDF** - Documento portátil
   - Uso: Documentación formal
   - Características: Calidad de impresión

#### Proceso de Exportación

1. **Menú Archivo** → **Exportar**
2. **Seleccionar Formato**: PNG, JPG, SVG, PDF
3. **Configurar Opciones**:
   - Calidad (para JPG/PNG)
   - Escala de resolución
   - Incluir/excluir grilla
   - Color de fondo
4. **Descargar**: El archivo se descarga automáticamente

### Gestión de Proyectos

#### Guardar Diagrama

**Formato JSON:**
```json
{
  "version": "1.0",
  "created": "2024-01-01T00:00:00Z",
  "classes": [...],
  "interfaces": [...],
  "relationships": [...],
  "notes": [...],
  "metadata": {
    "zoom": 1.0,
    "pan": {"x": 0, "y": 0}
  }
}
```

#### Cargar Diagrama

1. **Menú Archivo** → **Abrir**
2. **Seleccionar Archivo**: Archivo .json guardado previamente  
3. **Confirmación**: El diagrama se carga reemplazando el actual

#### Nuevo Diagrama

- **Atajo**: Ctrl+N
- **Menú**: Archivo → Nuevo
- **Confirmación**: Pregunta si guardar el diagrama actual

### Colaboración en Tiempo Real

> **Nota**: Esta funcionalidad requiere conexión con el backend

#### Funciones Colaborativas

1. **Cursores en Vivo**: Ver dónde están trabajando otros usuarios
2. **Sincronización Automática**: Los cambios se propagan automáticamente
3. **Indicadores de Presencia**: Lista de usuarios conectados
4. **Resolución de Conflictos**: Sistema inteligente de fusión

#### Controles de Colaboración

```
┌─────────────────────────────────┐
│ 👥 Usuarios Conectados          │
├─────────────────────────────────┤
│ 🟢 Juan Pérez (tú)              │
│ 🟡 María García                 │  
│ 🔵 Carlos López                 │
└─────────────────────────────────┘
```

## ⌨️ Atajos de Teclado

### Navegación
- **Ctrl + N**: Nuevo diagrama
- **Ctrl + O**: Abrir diagrama  
- **Ctrl + S**: Guardar diagrama
- **Ctrl + Z**: Deshacer
- **Ctrl + Y**: Rehacer

### Selección
- **Ctrl + A**: Seleccionar todo
- **Ctrl + Click**: Selección múltiple
- **Escape**: Cancelar herramienta actual
- **Delete**: Eliminar elementos seleccionados

### Vista
- **Ctrl + +**: Zoom in
- **Ctrl + -**: Zoom out
- **Ctrl + 0**: Zoom al 100%
- **Ctrl + F**: Ajustar a ventana

### Edición Rápida
- **F2**: Editar elemento seleccionado
- **Enter**: Confirmar edición
- **Escape**: Cancelar edición

## 🎯 Patrones de Uso Comunes

### Diseño de Sistema Básico

1. **Identificar Entidades**: Crear clases para objetos principales
2. **Definir Atributos**: Agregar propiedades a cada clase
3. **Especificar Métodos**: Definir comportamientos
4. **Establecer Relaciones**: Conectar clases relacionadas
5. **Refinar Diseño**: Ajustar visibilidades y tipos

### Patrón MVC (Model-View-Controller)

```
┌─────────┐    asociación    ┌─────────┐
│  Model  │ ←──────────────→ │  View   │
└─────────┘                  └─────────┘
     ↑                           ↑
     │                           │
     │        ┌─────────────┐    │
     └────────│ Controller  │────┘
              └─────────────┘
```

### Jerarquía de Herencia

```
        ┌─────────┐
        │ Animal  │
        └─────────┘
             ↑
    ┌────────┼────────┐
    │                 │
┌─────────┐      ┌─────────┐
│  Mammal │      │   Bird  │
└─────────┘      └─────────┘
    ↑                 ↑
┌─────────┐      ┌─────────┐
│   Dog   │      │ Penguin │
└─────────┘      └─────────┘
```

## 🔧 Solución de Problemas

### Problemas Comunes

#### Las Relaciones no se Muestran

**Síntomas**: Las líneas de relación no aparecen en el canvas
**Soluciones**:
1. Verificar que ambos elementos existan
2. Actualizar la página (F5)
3. Verificar la consola del navegador por errores

#### Elementos no se Pueden Mover

**Síntomas**: Los elementos no responden al arrastrar
**Soluciones**:
1. Verificar que la herramienta "Select" esté activa
2. Comprobar que el elemento esté seleccionado
3. Intentar hacer click en el elemento primero

#### Pérdida de Datos

**Síntomas**: El diagrama se resetea o pierde elementos
**Prevención**:
1. Guardar frecuentemente (Ctrl+S)
2. Hacer copias de seguridad del archivo JSON
3. Evitar refrescar la página sin guardar

#### Problemas de Rendimiento

**Síntomas**: La aplicación se vuelve lenta con diagramas grandes
**Optimizaciones**:
1. Dividir diagramas grandes en varios más pequeños
2. Usar menos elementos en pantalla simultáneamente
3. Desactivar efectos visuales si es necesario

## 📱 Uso en Dispositivos Móviles

### Limitaciones

- **Pantalla Táctil**: Funcionalidad reducida en dispositivos pequeños
- **Precisión**: Menos precisión para posicionamiento fino
- **Herramientas**: Algunas herramientas pueden ser difíciles de usar

### Recomendaciones

- **Usar en Tablets**: Mejor experiencia en pantallas de 10" o más
- **Zoom**: Usar zoom para trabajar en detalles
- **Orientación**: Preferir modo landscape (horizontal)

## 🔒 Consideraciones de Seguridad

### Datos Locales

- Los diagramas se almacenan localmente en el navegador
- Usar la función "Guardar" para preservar el trabajo
- Los datos no se envían a servidores externos sin configuración

### Colaboración

- La colaboración requiere conexión con backend seguro
- Los datos se transmiten cifrados (WSS)
- Autenticación requerida para acceso a diagramas compartidos

## 🎓 Consejos y Mejores Prácticas

### Diseño de Diagramas

1. **Nombrado Consistente**: Usar convenciones de nombrado claras
2. **Organización Visual**: Agrupar elementos relacionados
3. **Simplicidad**: Evitar diagramas excesivamente complejos
4. **Documentación**: Usar notas para explicar decisiones importantes

### Flujo de Trabajo

1. **Planificación**: Bosquejar el diseño antes de empezar
2. **Iteración**: Desarrollar el diagrama incrementalmente
3. **Revisión**: Validar el diseño con otros desarrolladores
4. **Mantenimiento**: Actualizar diagramas conforme evoluciona el código

### Rendimiento

1. **Elementos Mínimos**: Usar solo los elementos necesarios
2. **Guardado Regular**: Guardar frecuentemente para evitar pérdidas
3. **Organización**: Mantener diagramas organizados y limpios

---

💡 **¿Necesitas más ayuda?** 
- Revisa la [documentación técnica](../README.md)
- Consulta los [ejemplos de API](../api/README.md)  
- Explora la [guía de arquitectura](../architecture/README.md)