// components/organism/MovieCreateForm/MovieCreateForm.stories.jsx
import React from 'react';
import { MovieCreateForm } from './MovieCreateForm';
import './MovieCreateForm.css';

export default {
  title: 'Components/Organism/MovieCreateForm',
  component: MovieCreateForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# MovieCreateForm - Refactorizado con Sistema de Diseño

Formulario completo para agregar películas y series que usa **solo componentes con stories de Storybook** siguiendo el patrón establecido en el proyecto.

## 🔧 Componentes integrados
- **DynamicForm**: Formulario con 8 campos validados
- **Button**: Navegación y acciones
- **Card**: Contenedores estructurados  
- **ContentImage**: Posters con fallbacks
- **Variables CSS**: Sistema completo de app.css

## 📱 Funcionalidades
- Búsqueda en API de TMDB
- Formulario dinámico con validaciones
- Vista previa de posters
- Estados de loading/error/success
- Responsive design completo

## 🎨 Patrón de diseño
Sigue exactamente el mismo patrón que CategoryCreatePage y UserCreatePage del admin panel.
        `
      }
    }
  }
};

// ===== STORY PRINCIPAL =====
export const Default = () => <MovieCreateForm />;

Default.parameters = {
  docs: {
    description: {
      story: 'Componente completo con búsqueda TMDB y formulario dinámico. Usa DynamicForm, Button, Card y ContentImage del sistema de diseño.'
    }
  }
};