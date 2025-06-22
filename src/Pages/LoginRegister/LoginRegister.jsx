// LoginRegister.jsx

import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Servicios de autenticación
import { loginService } from "../../services/Auth/loginService";
import { registrationService } from "../../services/Auth/registrationService";
import { recoveryService } from "../../services/Auth/recoveryService";

// Componente de presentación
import { LoginRegisterCard } from "../../components/organism/LoginRegisterCard/LoginRegisterCard";
import './LoginRegister.css';

function LoginRegister() {
  // Estados de la UI y formulario
  const [error, setError] = useState(null); // Mensajes de error
  const [isLogin, setIsLogin] = useState(false); // Estado de carga para login
  const [isRecovering, setIsRecovering] = useState(false); // Estado para recuperación
  const [isRegistering, setIsRegistering] = useState(false); // Estado para registro

  // Estado compuesto para valores y validaciones del formulario
  const [formStatus, setFormStatus] = useState({
    values: {
      userName: '',
      password: '',
      confirmPassword: '',
    },
    validations: {
      userName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate(); // Para navegación programática

  // Validación de userName
  const validateUserName = (value) => {
  if (!value) return 'userName obligatorio';
  const userNameRegex = /^[a-zA-Z0-9._-]+$/; // Nueva regex para username sin espacios
  return userNameRegex.test(value) ? '' : 'userName inválido';
};
  // Validación de contraseña
  const validatePassword = (value) => {
    return !value ? 'Contraseña obligatoria' : '';
  };

  // Validación de confirmación de contraseña
  const validateConfirmPassword = (value) => {
    if (!value) return 'Confirma contraseña obligatorio';
    return formStatus.values.password === value 
      ? '' 
      : 'Las contraseñas no coinciden';
  };

  /**
   * Validación individual de campos al perder foco
   * @param {Event} e - Evento de blur
   */
  const validateOne = (e) => {
    const { name } = e.target;
    const value = formStatus.values[name];
    let message = '';

    // Validación según el campo
    switch (name) {
      case 'userName':
        message = validateUserName(value);
        break;
      case 'password':
        message = validatePassword(value);
        break;
      case 'confirmPassword':
        message = validateConfirmPassword(value);
        break;
      default:
        break;
    }

    // Actualiza el estado de validaciones
    setFormStatus(prev => ({
      ...prev,
      validations: {
        ...prev.validations,
        [name]: message
      }
    }));
  };

  /**
   * Maneja cambios en los inputs
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormStatus(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value
      }
    }));
  };

  /**
   * Validación completa del formulario
   * @param {'login'|'register'} action - Acción a realizar
   */
  const validateAll = (action) => {
    const { userName, password } = formStatus.values;
    const validations = { userName: '', password: '' };

    // Validaciones básicas
    validations.userName = validateUserName(userName);
    validations.password = validatePassword(password);

    // Validación adicional para registro
    if (action !== 'login') {
      validations.confirmPassword = validateConfirmPassword(password);
    }

    // Verifica si hay errores
    const validationMessages = Object.values(validations).filter(msg => msg);
    const isValid = validationMessages.length === 0;

    if (!isValid) {
      setFormStatus(prev => ({
        ...prev,
        validations: {
          ...prev.validations,
          ...validations
        }
      }));
      return;
    }

    // Acciones según el formulario
    if (isValid && action === 'login') {
      setIsLogin(true);
    } else if (isValid) {
      setIsRegistering(true);
    }
  };

  /**
   * Maneja el envío de recuperación de contraseña
   */
  const sendRecovery = () => {
    const validations = { userName: validateUserName(formStatus.values.userName) };
    const isValid = !validations.userName;

    if (isValid) {
      setIsRecovering(true);
    } else {
      setFormStatus(prev => ({
        ...prev,
        validations: {
          ...prev.validations,
          ...validations
        }
      }));
    }
  };

  // Efecto para login
  useEffect(() => {
    const loginUser = async () => {
      const data = await loginService(
        formStatus.values.userName,
        formStatus.values.password
      );
      
      if (data?.sub) {
        sessionStorage.setItem('sessionUser', JSON.stringify(data));
        setError(null);
        navigate('/main-page');
      } else {
        setError('Credenciales incorrectas');
      }
      setIsLogin(false);
    };

    if (isLogin) loginUser();
  }, [isLogin]);

  // Efecto para recuperación
  useEffect(() => {
    const recoveryUser = async () => {
      await recoveryService(formStatus.values.userName);
      setIsRecovering(false);
    };
    if (isRecovering) recoveryUser();
  }, [isRecovering]);

  // Efecto para registro
  useEffect(() => {
    const registerUser = async () => {
      const data = await registrationService(
        formStatus.values.userName,
        formStatus.values.password
      );
      
      if (data?.message === 'user created') {
        setError('Usuario creado. Inicia sesión');
        setIsRegistering(false);
        setIsLogin(true);
      } else {
        setError('Error en el registro');
        setIsRegistering(false);
      }
    };
    
    if (isRegistering) registerUser();
  }, [isRegistering]);

  // Renderizado condicional durante login
  if (isLogin) {
    return <div><h1>Iniciando Sesión...</h1></div>;
  }

  return (
    <div className="login-register-Container">
      <LoginRegisterCard
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        handleChange={handleChange}
        validateOne={validateOne}
        validateAll={validateAll}
        sendRecovery={sendRecovery}
        error={error}
      />
    </div>
  );
}

export { LoginRegister };