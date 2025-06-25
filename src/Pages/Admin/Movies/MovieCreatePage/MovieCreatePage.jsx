// ===== MOVIE CREATE PAGE - INTEGRACIÓN CON ADMIN PANEL =====
// src/Pages/Admin/Movies/MovieCreatePage/MovieCreatePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { MovieCreateForm } from '../../../../components/organism/MovieCreateForm/MovieCreateForm';
import { Button } from '../../../../components/atoms/Button/Button';
import './MovieCreatePage.css';

/**
 * MovieCreatePage - Página de creación de películas para el admin panel
 * 
 * ✅ SISTEMA DE DISEÑO: Usa AdminLayout + MovieCreateForm
 * ✅ PATRÓN: Mismo flujo que CategoryCreatePage/UserCreatePage
 * ✅ NAVEGACIÓN: Integrado con sidebar y breadcrumbs automáticos
 * ✅ UX: Botones de acción consistentes con el admin panel
 */
function MovieCreatePage() {
  const navigate = useNavigate();

  // ===== HANDLERS =====
  const handleBackToList = () => {
    navigate('/admin/movies');
  };

  const handleViewTMDB = () => {
    window.open('https://www.themoviedb.org/', '_blank');
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Agregar Película o Serie"
      subtitle="Busca en TMDB o agrega manualmente el contenido"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTMDB}
            leftIcon="🌐"
          >
            Abrir TMDB
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBackToList}
            leftIcon="←"
          >
            Volver a Lista
          </Button>
        </div>
      }
    >
      {/* El MovieCreateForm ya es completamente funcional */}
      <MovieCreateForm />
    </AdminLayout>
  );
}

export { MovieCreatePage };