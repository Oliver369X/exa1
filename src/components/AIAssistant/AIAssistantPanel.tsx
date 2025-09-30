import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Mic, MicOff, Send, Loader, Sparkles, FileCode, Upload, Code } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { aiService } from '../../services/api';

const PanelContainer = styled.div`
  width: 350px;
  min-width: 350px;
  background: white;
  border-left: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 100%;
  
  @media (max-width: 1200px) {
    width: 300px;
    min-width: 300px;
  }
  
  @media (max-width: 900px) {
    width: 280px;
    min-width: 280px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const Message = styled.div<{ isUser?: boolean }>`
  padding: 12px;
  border-radius: 12px;
  background: ${props => props.isUser ? '#667eea' : props.theme.colors.background};
  color: ${props => props.isUser ? 'white' : props.theme.colors.text};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 85%;
  word-wrap: break-word;
  box-shadow: ${props => props.theme.shadows.small};
`;

const QuickActions = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const MicButton = styled.button<{ isListening?: boolean }>`
  padding: 10px;
  background: ${props => props.isListening ? '#f44336' : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  animation: ${props => props.isListening ? 'pulse 1.5s infinite' : 'none'};
  
  &:hover {
    opacity: 0.9;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const SendButton = styled.button`
  padding: 10px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ListeningIndicator = styled.div`
  padding: 8px 12px;
  background: #f44336;
  color: white;
  font-size: 12px;
  border-radius: 6px;
  text-align: center;
  animation: pulse 1.5s infinite;
`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantPanelProps {
  onGenerateDiagram?: (diagramData: string) => void;
  onUploadImage?: (imageData: string) => void;
  onGenerateBackend?: () => void;
  currentDiagramData?: any;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onGenerateDiagram,
  onUploadImage,
  onGenerateBackend,
  currentDiagramData
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente IA. Puedo ayudarte a:\n\n✨ Generar diagramas UML desde cero\n✏️ Editar y modificar diagramas existentes\n📤 Exportar a Mermaid\n🖼️ Analizar imágenes\n💻 Generar código backend\n\n¿Qué te gustaría hacer?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Actualizar input con transcripción de voz
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputText;
    setInputText('');
    resetTranscript();
    setIsProcessing(true);

    try {
      // Llamada real al backend (Expert Orchestrator)
      const response = await aiService.chatWithAI(query);
      
      // Formatear respuesta
      let responseText = response.result || response.response || 'Sin respuesta';
      
      // Agregar sugerencias si existen
      if (response.suggestions && response.suggestions.length > 0) {
        responseText += '\n\n💡 Sugerencias:\n' + response.suggestions.map((s: string) => `• ${s}`).join('\n');
      }

      // Si la acción es "generate", ejecutar generación de diagrama
      if (response.action === 'generate' && onGenerateDiagram) {
        // Preguntar al usuario por más detalles si es necesario
        if (response.needsMoreInfo) {
          // Solo mostrar la respuesta pidiendo más info
        } else {
          // Intentar generar el diagrama directamente
          const diagramResponse = await aiService.generateDiagramFromText(query);
          if (onGenerateDiagram && diagramResponse.diagramData) {
            responseText = 'He generado el diagrama basado en tu descripción. ¡Revisa el canvas!';
            // Llamar al callback para cargar el diagrama en el canvas
            onGenerateDiagram(JSON.stringify(diagramResponse.diagramData));
          }
        }
      }

      // Si la acción es "modify", ejecutar edición de diagrama
      if (response.action === 'modify' && currentDiagramData && onGenerateDiagram) {
        try {
          const editResponse = await aiService.editDiagramWithAI(currentDiagramData, query);
          if (editResponse.success && editResponse.modifiedDiagram) {
            responseText = editResponse.explanation || '¡Diagrama modificado!';
            
            // Mostrar cambios realizados
            if (editResponse.changes) {
              const changes = [];
              if (editResponse.changes.added?.length > 0) {
                changes.push(`✅ Agregados: ${editResponse.changes.added.join(', ')}`);
              }
              if (editResponse.changes.modified?.length > 0) {
                changes.push(`✏️ Modificados: ${editResponse.changes.modified.join(', ')}`);
              }
              if (editResponse.changes.removed?.length > 0) {
                changes.push(`🗑️ Eliminados: ${editResponse.changes.removed.join(', ')}`);
              }
              if (changes.length > 0) {
                responseText += '\n\n' + changes.join('\n');
              }
            }
            
            // Cargar el diagrama modificado
            onGenerateDiagram(JSON.stringify(editResponse.modifiedDiagram));
          }
        } catch (error) {
          console.error('Error al modificar diagrama:', error);
          responseText = '❌ Error al modificar el diagrama. Por favor intenta de nuevo.';
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error al comunicarse con el asistente:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PanelContainer>
      <Header>
        <Title>
          <Sparkles size={20} />
          Asistente IA
        </Title>
      </Header>

      <ChatContainer>
        {messages.map(message => (
          <Message key={message.id} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        {isProcessing && (
          <Message isUser={false}>
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Procesando...
          </Message>
        )}
        <div ref={chatEndRef} />
      </ChatContainer>

      <QuickActions>
        <ActionButton onClick={async () => {
          setInputText('Genera un diagrama de sistema de biblioteca');
        }}>
          <Sparkles size={16} />
          Generar Diagrama
        </ActionButton>
        <ActionButton onClick={async () => {
          if (!currentDiagramData || !currentDiagramData.classes || currentDiagramData.classes.length === 0) {
            const msg: Message = {
              id: Date.now().toString(),
              text: '⚠️ No hay diagrama para editar. Dibuja o genera uno primero.',
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, msg]);
            return;
          }
          setInputText('Agrega una clase Usuario con atributos email, contraseña y métodos login y logout');
        }}>
          <Code size={16} />
          Editar Diagrama con IA
        </ActionButton>
        <ActionButton onClick={async () => {
          if (!currentDiagramData) {
            const msg: Message = {
              id: Date.now().toString(),
              text: '⚠️ No hay diagrama para exportar. Dibuja o genera uno primero.',
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, msg]);
            return;
          }
          
          setIsProcessing(true);
          try {
            const result = await aiService.convertToMermaid(currentDiagramData);
            const msg: Message = {
              id: Date.now().toString(),
              text: `✅ Código Mermaid generado:\n\n\`\`\`mermaid\n${result.mermaidCode}\n\`\`\``,
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, msg]);
          } catch (error) {
            const msg: Message = {
              id: Date.now().toString(),
              text: '❌ Error al exportar a Mermaid',
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, msg]);
          } finally {
            setIsProcessing(false);
          }
        }}>
          <FileCode size={16} />
          Exportar a Mermaid
        </ActionButton>
        <ActionButton onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
              const base64 = event.target?.result as string;
              setIsProcessing(true);
              try {
                // Opción 1: Analizar y mostrar en canvas
                const result = await aiService.analyzeImage(base64, file.type);
                if (result.diagramData && onUploadImage) {
                  onUploadImage(JSON.stringify(result.diagramData));
                }
                const msg: Message = {
                  id: Date.now().toString(),
                  text: `✅ Imagen analizada: ${result.description}\n\n💡 Tip: También puedes generar backend directamente desde la imagen usando el botón "Imagen → Backend"`,
                  isUser: false,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, msg]);
              } catch (error) {
                const msg: Message = {
                  id: Date.now().toString(),
                  text: '❌ Error al analizar imagen',
                  isUser: false,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, msg]);
              } finally {
                setIsProcessing(false);
              }
            };
            reader.readAsDataURL(file);
          };
          input.click();
        }}>
          <Upload size={16} />
          Subir Imagen
        </ActionButton>
        <ActionButton onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
              const base64 = event.target?.result as string;
              setIsProcessing(true);
              try {
                const msg1: Message = {
                  id: Date.now().toString(),
                  text: '🖼️ Analizando imagen y generando proyecto Spring Boot...',
                  isUser: false,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, msg1]);

                const blob = await aiService.generateSpringBootFromImage(base64, file.type);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `springboot-from-image-${Date.now()}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                const msg2: Message = {
                  id: (Date.now() + 1).toString(),
                  text: '✅ ¡Proyecto Spring Boot generado y descargado desde la imagen!',
                  isUser: false,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, msg2]);
              } catch (error: any) {
                const msg: Message = {
                  id: Date.now().toString(),
                  text: `❌ Error al generar backend desde imagen: ${error.response?.data?.error || error.message}`,
                  isUser: false,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, msg]);
              } finally {
                setIsProcessing(false);
              }
            };
            reader.readAsDataURL(file);
          };
          input.click();
        }}>
          <Code size={16} />
          Imagen → Backend
        </ActionButton>
        <ActionButton onClick={onGenerateBackend}>
          <Code size={16} />
          Generar Backend
        </ActionButton>
      </QuickActions>

      {isListening && (
        <ListeningIndicator>
          🎤 Escuchando... Habla ahora
        </ListeningIndicator>
      )}

      <InputContainer>
        <TextInput
          type="text"
          placeholder="Escribe o usa el micrófono..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {browserSupportsSpeechRecognition && (
          <MicButton
            onClick={handleMicClick}
            isListening={isListening}
            title={isListening ? 'Detener grabación' : 'Activar micrófono'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </MicButton>
        )}
        <SendButton
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isProcessing}
        >
          <Send size={20} />
        </SendButton>
      </InputContainer>
    </PanelContainer>
  );
};

export default AIAssistantPanel;
