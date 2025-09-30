import { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../../services/api';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const RegisterCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  margin: 20px;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    margin: 10px;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-size: 28px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.register(nombre, correo, contrasena);
      setSuccess('¡Registro exitoso! Redirigiendo...');
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Crear cuenta</Title>
        <Subtitle>Únete a UML Designer</Subtitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nombre completo</Label>
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </InputGroup>
          <InputGroup>
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Form>
        <LinkButton onClick={onSwitchToLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </LinkButton>
      </RegisterCard>
    </RegisterContainer>
  );
}
