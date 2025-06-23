// ===== ADMIN ACCESS BUTTON =====
// src/components/molecules/AdminAccessButton/AdminAccessButton.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';
import './AdminAccessButton.css';

/**
 * AdminAccessButton - Botón flotante para acceder al panel de administración
 * 
 * Solo se muestra si el usuario tiene permisos de administrador
 */
function AdminAccessButton() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es administrador
    const user = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
    const hasAdminRole = user?.roleId === 1 || user?.role === 'admin';
    
    setIsAdmin(hasAdminRole);
    
    // Mostrar después de un pequeño delay para mejor UX
    if (hasAdminRole) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = () => {
    navigate('/admin');
  };

  // No renderizar si no es admin
  if (!isAdmin) return null;

  return (
    <div className={`admin-access-button ${isVisible ? 'admin-access-button--visible' : ''}`}>
      <Button
        variant="primary"
        size="md"
        onClick={handleClick}
        icon="⚙️"
        className="admin-access-button__btn"
        title="Acceder al Panel de Administración"
      >
        Admin Panel
      </Button>
    </div>
  );
}

export { AdminAccessButton };