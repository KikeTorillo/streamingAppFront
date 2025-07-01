// ===== EPISODES LIST PAGE STORIES =====
// src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.stories.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EpisodesListPage } from './EpisodesListPage';
import './EpisodesListPage.css';

// ===== WRAPPER CON ROUTER Y MOCK USER =====
const RouterWrapper = ({ children }) => {
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
  title: 'Pages/Admin/EpisodesListPage',
  component: EpisodesListPage,
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
# EpisodesListPage

Página de gestión de episodios con operaciones CRUD completas, homologada con SeriesListPage, CategoriesListPage y MoviesListPage.

## Componentes integrados
- **AdminLayout**: Layout base con breadcrumbs
- **DataTable**: Tabla con búsqueda, paginación y acciones
- **Button**: Crear episodio y acciones

## Funcionalidades
- ✅ Lista de episodios desde servicios reales
- ✅ Operaciones: Ver, Editar, Eliminar
- ✅ Búsqueda y filtrado por título
- ✅ Estadísticas de episodios
- ✅ Estados loading/error/empty
- ✅ Confirmaciones de eliminación
- ✅ Navegación a crear/editar episodios

## Integración con backend
- ✅ Usa \`getEpisodesService\` existente
- ✅ Endpoint: \`GET /api/v1/episodes\`
- ✅ Manejo de sesión expirada
- ✅ Normalización de campos del backend

## Campos mostrados
- **ID**: Identificador único del episodio
- **Título**: Nombre del episodio con badge
- **Serie**: Serie a la que pertenece el episodio
- **T/E**: Temporada y número de episodio (formato T1E3)
- **Duración**: Duración del episodio en formato mm:ss
- **Fecha de Creación**: Cuando se agregó al sistema

## Estadísticas mostradas
- Total de episodios
- Episodios nuevos (últimos 7 días)  
- Episodios con serie asignada
- Episodios sin serie asignada
- Estados de carga y error

## Patrón de diseño
- ✅ Sigue exactamente el patrón de SeriesListPage
- ✅ Mismos estilos y componentes
- ✅ Misma estructura de datos y estados
- ✅ Accesibilidad y responsive design
- ✅ Convenciones de exportación correctas

## Operaciones CRUD
- **Ver**: Modal/página de detalle (pendiente implementar)
- **Editar**: Navegación a \`/admin/episodes/edit/:id\`
- **Eliminar**: Confirmación + \`deleteEpisodeService\`
- **Crear**: Navegación a \`/admin/episodes/create\`

## Manejo de errores
- Sesión expirada (401)
- Episodios no encontrados (404)  
- Errores de red y servidor
- Validaciones de eliminación

## Características específicas de episodios
- **Formateo de temporada/episodio**: Muestra T1E3, T2E5, etc.
- **Duración**: Formato mm:ss para facilitar lectura
- **Relación con series**: Muestra la serie padre
- **Badge distintivo**: Identifica claramente como episodio

## Responsive Design
- Optimizado para desktop, tablet y móvil
- Tabla responsive con scroll horizontal
- Textos truncados en pantallas pequeñas
- Interacciones táctiles optimizadas

## Accesibilidad
- Estados de focus claramente definidos
- Textos alternativos para iconos
- Contraste adecuado de colores
- Compatible con lectores de pantalla
- Respeta preferencias de movimiento reducido
        `
      }
    }
  }
};

// ========== PÁGINA PRINCIPAL ==========
export const Default = () => <EpisodesListPage />;

Default.parameters = {
  docs: {
    description: {
      story: 'Página completa de gestión de episodios con datos reales desde servicios. Incluye operaciones CRUD, estadísticas específicas de episodios y navegación integrada.'
    }
  }
};