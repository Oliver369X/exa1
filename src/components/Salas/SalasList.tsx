import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { salaService, authService } from '../../services/api';
import { Users, Plus, LogOut, Edit2, Trash2 } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserName = styled.span`
  color: #666;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #d32f2f;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 20px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: white;
  color: #667eea;
  border: 2px dashed #667eea;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
    border-style: solid;
  }
`;

const SalasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SalaCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SalaActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  ${SalaCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.1);
  }

  &.edit {
    background: #e3f2fd;
    color: #1976d2;
    
    &:hover {
      background: #1976d2;
      color: white;
    }
  }

  &.delete {
    background: #ffebee;
    color: #d32f2f;
    
    &:hover {
      background: #d32f2f;
      color: white;
    }
  }
`;

const SalaName = styled.h3`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const SalaDescription = styled.p`
  color: #666;
  margin: 0 0 15px 0;
  font-size: 14px;
`;

const SalaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999;
  font-size: 13px;
`;

const SalaUsers = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin: 0 0 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover {
    background: #5568d3;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e0e0e0;
  color: #333;

  &:hover {
    background: #d0d0d0;
  }
`;

const EmptyState = styled.div`
  background: white;
  padding: 60px 20px;
  border-radius: 12px;
  text-align: center;
  color: #999;
`;

interface SalasListProps {
  onSelectSala: (salaId: string) => void;
}

export default function SalasList({ onSelectSala }: SalasListProps) {
  const [salas, setSalas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      const data = await salaService.getSalas();
      setSalas(data);
    } catch (error) {
      console.error('Error al cargar salas:', error);
    }
  };

  const handleCreateSala = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await salaService.createSala(nombre, descripcion, currentUser.id);
      setShowModal(false);
      setNombre('');
      setDescripcion('');
      loadSalas();
    } catch (error) {
      console.error('Error al crear sala:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSala = (sala: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra la sala
    setSelectedSala(sala);
    setNombre(sala.nombre);
    setDescripcion(sala.descripcion || '');
    setShowEditModal(true);
  };

  const handleUpdateSala = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSala) return;
    
    setLoading(true);
    try {
      await salaService.updateSalaInfo(selectedSala.id, nombre, descripcion);
      setShowEditModal(false);
      setNombre('');
      setDescripcion('');
      setSelectedSala(null);
      loadSalas();
    } catch (error) {
      console.error('Error al actualizar sala:', error);
      alert('Error al actualizar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (sala: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra la sala
    setSelectedSala(sala);
    setShowDeleteModal(true);
  };

  const handleDeleteSala = async () => {
    if (!selectedSala) return;

    setLoading(true);
    try {
      await salaService.deleteSala(selectedSala.id, currentUser.id);
      setShowDeleteModal(false);
      setSelectedSala(null);
      loadSalas();
    } catch (error: any) {
      console.error('Error al eliminar sala:', error);
      alert(error.response?.data?.message || 'Error al eliminar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <Container>
      <Header>
        <Title>Mis Proyectos</Title>
        <UserInfo>
          <UserName>{currentUser?.nombre}</UserName>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Cerrar sesión
          </LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <CreateButton onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Crear nuevo proyecto
        </CreateButton>

        {salas.length > 0 ? (
          <SalasGrid>
            {salas.map((sala) => (
              <SalaCard key={sala.id} onClick={() => onSelectSala(sala.id)}>
                {sala.idHost === currentUser?.id && (
                  <SalaActions>
                    <ActionButton 
                      className="edit" 
                      onClick={(e) => handleEditSala(sala, e)}
                      title="Editar proyecto"
                    >
                      <Edit2 size={16} />
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={(e) => handleDeleteClick(sala, e)}
                      title="Eliminar proyecto"
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </SalaActions>
                )}
                <SalaName>{sala.nombre}</SalaName>
                <SalaDescription>{sala.descripcion || 'Sin descripción'}</SalaDescription>
                <SalaInfo>
                  <SalaUsers>
                    <Users size={14} />
                    {sala.usuarios?.length || 0} participantes
                  </SalaUsers>
                  {sala.idHost === currentUser?.id && (
                    <span style={{ color: '#667eea', fontWeight: 600 }}>Host</span>
                  )}
                </SalaInfo>
              </SalaCard>
            ))}
          </SalasGrid>
        ) : (
          <EmptyState>
            <h3>No tienes proyectos aún</h3>
            <p>Crea tu primer proyecto para comenzar a diseñar diagramas UML</p>
          </EmptyState>
        )}
      </Content>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Crear nuevo proyecto</ModalTitle>
            <Form onSubmit={handleCreateSala}>
              <InputGroup>
                <Label>Nombre del proyecto</Label>
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Mi proyecto UML"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Descripción</Label>
                <TextArea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe brevemente tu proyecto..."
                />
              </InputGroup>
              <ButtonGroup>
                <SecondaryButton type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear proyecto'}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showEditModal && (
        <Modal onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Editar proyecto</ModalTitle>
            <Form onSubmit={handleUpdateSala}>
              <InputGroup>
                <Label>Nombre del proyecto</Label>
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Mi proyecto UML"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Descripción</Label>
                <TextArea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe brevemente tu proyecto..."
                />
              </InputGroup>
              <ButtonGroup>
                <SecondaryButton type="button" onClick={() => {
                  setShowEditModal(false);
                  setNombre('');
                  setDescripcion('');
                  setSelectedSala(null);
                }}>
                  Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>¿Eliminar proyecto?</ModalTitle>
            <p style={{ margin: '20px 0', color: '#666' }}>
              ¿Estás seguro que deseas eliminar el proyecto <strong>"{selectedSala?.nombre}"</strong>?
              <br /><br />
              Esta acción no se puede deshacer y se perderán todos los diagramas y datos asociados.
            </p>
            <ButtonGroup>
              <SecondaryButton 
                type="button" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSala(null);
                }}
              >
                Cancelar
              </SecondaryButton>
              <Button
                onClick={handleDeleteSala}
                disabled={loading}
                style={{ background: '#f44336', color: 'white' }}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
