import React, { useState, useEffect } from "react";

import { useNavigate } from 'react-router-dom';

import { resetPassService } from "../../services/Auth/resetPassService";

import { ResetPassCard } from "../../components/organism/ResetPassCard/ResetPassCard";

import { useQueryParams } from "../../hooks/useQueryParams";

import './ResetPass.css'


function ResetPass() {
  const queryParmas = useQueryParams();
  const [error, setError] = useState(null);
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
  const [isReseting, setIsReseting] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value) => {
    if (!value) {
      return 'Contraseña obligatoria';
    }
    return null;
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      return 'Confirma contraseña obligatorio';
    }
    if (formStatus.values.password !== value) {
      return 'Confirmacion de contraseña y contraseña deben ser iguales ';
    }
    return null;
  };

  const validateOne = (e) => {
    const { name } = e.target
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

    const newFormStatus = { ...formStatus };
    newFormStatus.validations[name] = message;
    setFormStatus(newFormStatus)
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormStatus = { ...formStatus };
    newFormStatus.values[name] = value;
    setFormStatus(newFormStatus)
  };

  const validateAll = () => {
    const { password } = formStatus.values;
    const validations = { password: '' };

    validations.password = validatePassword(password)
    validations.confirmPassword = validateConfirmPassword(password)

    const validationMesages = Object.values(validations).filter(
      (validationMessage) => {
        if (validationMessage) {
          return validationMessage.length > 0;
        }
      }
    )

    const isValid = !validationMesages.length;

    if (!isValid) {
      const newFormStatus = { ...formStatus };
      newFormStatus.validations = validations;
      setFormStatus(newFormStatus);
      return;
    }

    if (isValid) {
      setIsReseting(true);
    }

  };

  useEffect(() => {
    async function resetPassword() {
      const data = await resetPassService(queryParmas.token,formStatus.values.password);
      if (data) {
        if (data.message === 'password changed') {
          setError(null);
          setIsReseting(false);
          navigate('/login');
        } else {
          setIsReseting(false);
          setError('No se pudo cambiar la contrasena');
        }
      }
    }
    if (isReseting) {
      resetPassword();
    }
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