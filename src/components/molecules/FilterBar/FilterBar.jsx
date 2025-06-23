// FilterBar.jsx
import React from 'react';
import { Button } from '../../atoms/Button/Button';
import './FilterBar.css';

/**
 * Componente FilterBar - Molecule
 * 
 * Barra de filtros con categorías y acciones adicionales.
 * Para filtrar contenido en MainPage.
 */
function FilterBar({
  // Categorías
  categories = [],
  selectedCategory = 'all',
  onCategoryChange = () => {},
  
  // Acciones adicionales (botones a la derecha)
  actions = null,
  
  // Estilos
  variant = 'default',
  size = 'md',
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const filterBarClasses = [
    'filter-bar',
    `filter-bar--variant-${variant}`,
    `filter-bar--size-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={filterBarClasses} {...restProps}>
      {/* Categorías */}
      <div className="filter-bar__categories">
        {categories.map(category => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'primary' : 'outline'}
            size={size === 'lg' ? 'md' : 'sm'}
            onClick={() => onCategoryChange(category.value)}
            className="filter-bar__category-button"
          >
            {category.icon && <span className="category-icon">{category.icon}</span>}
            {category.label}
          </Button>
        ))}
      </div>

      {/* Acciones */}
      {actions && (
        <div className="filter-bar__actions">
          {actions}
        </div>
      )}
    </div>
  );
}

export { FilterBar };