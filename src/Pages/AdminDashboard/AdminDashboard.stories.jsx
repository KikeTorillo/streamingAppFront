// ===== ADMIN DASHBOARD STORIES =====
// src/Pages/Admin/AdminDashboard/AdminDashboard.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import './AdminDashboard.css';

// ===== WRAPPER CON ROUTER Y MOCK USER =====
const RouterWrapper = ({ children }) => {
  // Mock user para Storybook
  React.useEffect(() => {
    if (!sessionStorage.getItem('sessionUser')) {
      sessionStorage.setItem('sessionUser', JSON.stringify({
        id: 1,
        email: 'admin@streamapp.com',
        roleId: 1,
        role: 'admin'
      }));
    }
    
    return () => {
      sessionStorage.removeItem('sessionUser');
    };
  }, []);

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default {
  title: 'Pages/AdminDashboard',
  component: AdminDashboard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RouterWrapper>
        <Story />
      </RouterWrapper>
    )
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# AdminDashboard Page

Página principal del panel de administración que combina todos los componentes creados.

## Componentes integrados
- **AdminLayout**: Template base
- **StatsCard**: Métricas principales  
- **DataTable**: Actividad reciente
- **Button**: Acciones rápidas

## Funcionalidades
- ✅ Estadísticas en tiempo real
- ✅ Navegación a páginas específicas
- ✅ Tabla de actividad reciente
- ✅ Acciones rápidas
- ✅ Responsive design
        `
      }
    }
  }
};

// ========== DASHBOARD PRINCIPAL ==========
export const Default = () => <AdminDashboard />;

Default.parameters = {
  docs: {
    description: {
      story: 'Dashboard principal con todas las funcionalidades integradas. Las estadísticas se cargan desde los servicios reales.'
    }
  }
};