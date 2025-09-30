import { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import UMLDiagramEditor from './components/UMLDiagramEditor';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import MenuBar from './components/MenuBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SalasList from './components/Salas/SalasList';
import AIAssistantPanel from './components/AIAssistant/AIAssistantPanel';
import { useToolbar } from './hooks/useToolbar';
import { authService } from './services/api';
import type { DiagramState } from './types/UMLTypes';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    overflow: hidden;
  }
`;

const theme = {
  colors: {
    primary: '#2196F3',
    secondary: '#FFC107',
    background: '#ffffff',
    surface: '#f8f9fa',
    border: '#e0e0e0',
    text: '#212121',
    textSecondary: '#757575',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
    large: '0 8px 16px rgba(0,0,0,0.2)'
  }
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

type AppView = 'login' | 'register' | 'salas' | 'editor';

function App() {
  const { selectedTool, selectTool } = useToolbar();
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedSala, setSelectedSala] = useState<string | null>(null);
  const [diagramState, setDiagramState] = useState<DiagramState | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    if (authService.isAuthenticated()) {
      setCurrentView('salas');
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('salas');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('salas');
  };

  const handleSelectSala = (salaId: string) => {
    setSelectedSala(salaId);
    setDiagramState(null); // Limpiar el diagrama anterior
    setCurrentView('editor');
  };

  const handleBackToSalas = () => {
    setSelectedSala(null);
    setDiagramState(null); // Limpiar el diagrama al salir
    setCurrentView('salas');
  };

  // Renderizar vistas según el estado
  if (currentView === 'login') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      </ThemeProvider>
    );
  }

  if (currentView === 'register') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      </ThemeProvider>
    );
  }

  if (currentView === 'salas') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SalasList onSelectSala={handleSelectSala} />
      </ThemeProvider>
    );
  }

  // Vista del editor
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <MenuBar 
          onBackToSalas={handleBackToSalas} 
          diagramState={diagramState}
        />
        <MainContent>
          <Toolbar selectedTool={selectedTool} onToolSelect={selectTool} />
          <EditorArea>
            <UMLDiagramEditor 
              key={selectedSala}
              selectedTool={selectedTool} 
              salaId={selectedSala!}
              onDiagramChange={setDiagramState}
              ref={editorRef}
            />
          </EditorArea>
          <AIAssistantPanel 
            currentDiagramData={diagramState}
            onGenerateDiagram={(diagramData) => {
              // Cargar el diagrama generado en el editor
              try {
                const diagram = JSON.parse(diagramData);
                if (editorRef.current && editorRef.current.loadDiagram) {
                  editorRef.current.loadDiagram(diagram);
                }
              } catch (error) {
                console.error('Error al cargar diagrama generado:', error);
              }
            }}
            onUploadImage={(diagramData) => {
              // Cargar el diagrama desde imagen analizada
              try {
                const diagram = JSON.parse(diagramData);
                if (editorRef.current && editorRef.current.loadDiagram) {
                  editorRef.current.loadDiagram(diagram);
                }
              } catch (error) {
                console.error('Error al cargar diagrama desde imagen:', error);
              }
            }}
            onGenerateBackend={() => {
              // Generar backend desde el MenuBar
              console.log('Generate backend from AI Panel');
            }}
          />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App
