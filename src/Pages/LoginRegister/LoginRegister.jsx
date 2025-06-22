// LoginRegister.jsx - REFACTORIZADO PARA USAR LOGINCARD

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Servicios de autenticación
import { loginService } from "../../services/Auth/loginService";
import { recoveryService } from "../../services/Auth/recoveryService";

// Componente LoginCard del sistema de diseño
import { LoginCard } from "../../components/organism/LoginCard/LoginCard";
import './LoginRegister.css';

function LoginRegister() {
  // Estados de la UI
  const [error, setError] = useState(null); // Mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Estado de carga unificado
  
  const navigate = useNavigate(); // Para navegación programática

  /**
   * Maneja el envío del formulario de login
   * @param {Object} formData - Datos del formulario { username, password }
   */
  const handleLoginSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loginService(formData.username, formData.password);
      
      if (data?.sub) {
        // Login exitoso
        sessionStorage.setItem('sessionUser', JSON.stringify(data));
        navigate('/main-page');
      } else {
        // Credenciales incorrectas
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
    } catch (err) {
      // Error de conexión o servidor
      setError('Error de conexión. Inténtalo de nuevo.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la recuperación de contraseña
   * @param {string} username - Usuario para recuperación
   */
  const handleForgotPassword = async (username) => {
    if (!username || username.trim() === '') {
      setError('Ingresa tu usuario para recuperar la contraseña.');
      return;
    }

    // Validación básica del username
    const userNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!userNameRegex.test(username)) {
      setError('Usuario inválido. Solo letras, números, puntos, guiones y guiones bajos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await recoveryService(username);
      setError('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      // En este caso "error" se usa para mostrar un mensaje informativo
      // Podrías crear un estado separado para mensajes de éxito si prefieres
    } catch (err) {
      setError('Error al enviar email de recuperación.');
      console.error('Recovery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el click en "Crear cuenta"
   * Redirige a una página de registro (por implementar)
   */
  const handleRegisterClick = () => {
    // Opción 1: Navegar a página de registro separada
    // navigate('/register');
    
    // Opción 2: Mostrar modal de registro
    // setShowRegisterModal(true);
    
    // Opción 3: Placeholder por ahora
    alert('Función de registro por implementar');
  };

  return (
    <div className="login-register-container">
      <div className="login-register-content">
        {/* Header opcional con título de la app */}
        <div className="login-register-header">
          <h1 className="app-title">Mi Aplicación</h1>
          <p className="app-subtitle">Inicia sesión para continuar</p>
        </div>

        {/* LoginCard del sistema de diseño */}
        <LoginCard
          onSubmit={handleLoginSubmit}
          onForgotPassword={handleForgotPassword}
          onRegisterClick={handleRegisterClick}
          loading={isLoading}
          error={error}
          showRegisterLink={true}
          size="lg"
          rounded="lg"
        />
      </div>
    </div>
  );
}

export { LoginRegister };