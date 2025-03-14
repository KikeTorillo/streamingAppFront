// ResetPass.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { resetPassService } from "../../services/Auth/resetPassService"; // Servicio para resetear contraseña
import { ResetPassCard } from "../../components/organism/ResetPassCard/ResetPassCard"; // Componente de UI
import { useQueryParams } from "../../hooks/useQueryParams"; // Hook para leer parámetros URL
import './ResetPass.css';

function ResetPass() {
  // 1. Obtención de parámetros URL (token de reset)
  const queryParams = useQueryParams();
  
  // 2. Estados del componente
  const [error, setError] = useState(null); // Mensajes de error
  const [formStatus, setFormStatus] = useState({
    values: {
      password: '',
      confirmPassword: '',
    },
    validations: {
      password: '',
      confirmPassword: '',
    },
  });
  const [isReseting, setIsReseting] = useState(false); // Estado de carga

  const navigate = useNavigate(); // Para redirecciones

  // 3. Validación de contraseña
  const validatePassword = (value) => {
    return !value ? 'Contraseña obligatoria' : '';
  };

  // 4. Validación de confirmación de contraseña
  const validateConfirmPassword = (value) => {
    if (!value) return 'Confirma contraseña obligatorio';
    return formStatus.values.password === value 
      ? '' 
      : 'Las contraseñas no coinciden';
  };

  // 5. Validación individual de campos (al perder foco)
  const validateOne = (e) => {
    const { name } = e.target;
    const value = formStatus.values[name];
    let message = '';

    switch (name) {
      case 'password':
        message = validatePassword(value);
        break;
      case 'confirmPassword':
        message = validateConfirmPassword(value);
        break;
      default:
        break;
    }

    setFormStatus(prev => ({
      ...prev,
      validations: {
        ...prev.validations,
        [name]: message
      }
    }));
  };

  // 6. Manejo de cambios en inputs
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

  // 7. Validación completa del formulario
  const validateAll = () => {
    const validations = {
      password: validatePassword(formStatus.values.password),
      confirmPassword: validateConfirmPassword(formStatus.values.confirmPassword)
    };

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

    setIsReseting(true); // Activa el proceso de reset
  };

  // 8. Efecto para ejecutar el reset
  useEffect(() => {
    async function resetPassword() {
      try {
        const data = await resetPassService(
          queryParams.token, // Token obtenido de la URL
          formStatus.values.password
        );
        
        if (data?.message === 'password changed') {
          navigate('/login'); // Redirección exitosa
        } else {
          setError('Error al cambiar la contraseña');
        }
      } catch (error) {
        setError('Ocurrió un error inesperado');
      } finally {
        setIsReseting(false);
      }
    }

    if (isReseting) resetPassword();
  }, [isReseting]);

  return (
    <div className="reset-pass-container">
      <ResetPassCard
        formStatus={formStatus}
        handleChange={handleChange}
        validateOne={validateOne}
        validateAll={validateAll}
        error={error}
      />
    </div>
  );
}

export { ResetPass };