// atoms/Avatar.jsx
import React from 'react';
import './Avatar.css';

/**
 * Componente Avatar siguiendo el sistema de diseño
 * Átomo para mostrar imágenes de perfil, iniciales y estados de usuario
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.src] - URL de la imagen del avatar
 * @param {string} [props.name] - Nombre del usuario (para generar iniciales)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] - Tamaño del avatar
 * @param {'circle'|'rounded'|'square'} [props.variant='circle'] - Forma del avatar
 * @param {'online'|'offline'|'away'|'busy'} [props.status] - Estado de actividad
 * @param {string|number} [props.badge] - Insignia/contador a mostrar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} [props.alt] - Texto alternativo personalizado
 * @param {string} [props.fallbackIcon='👤'] - Icono cuando no hay imagen ni nombre
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'} [props.colorScheme='primary'] - Esquema de colores para iniciales
 * @param {boolean} [props.showTooltip=false] - Mostrar tooltip con el nombre
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 */
const Avatar = ({
  src,
  name,
  size = 'md',
  variant = 'circle',
  status,
  badge,
  className = '',
  onClick,
  loading = false,
  alt,
  fallbackIcon = '👤',
  colorScheme = 'primary',
  showTooltip = false,
  ariaLabel,
  ...restProps
}) => {
  // Generar iniciales del nombre
  const getInitials = (fullName) => {
    if (!fullName) return '';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return names
      .slice(0, 2) // Solo primeros dos nombres
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  // Construir clases CSS dinámicamente
  const avatarClasses = [
    'avatar',
    `avatar--${size}`,
    `avatar--${variant}`,
    `avatar--${colorScheme}`,
    onClick && 'avatar--clickable',
    loading && 'avatar--loading',
    status && 'avatar--has-status',
    badge && 'avatar--has-badge',
    showTooltip && 'avatar--tooltip',
    className
  ].filter(Boolean).join(' ');

  // Determinar qué mostrar
  const initials = getInitials(name);
  const finalAlt = alt || name || 'Avatar';
  const finalAriaLabel = ariaLabel || (name ? `Avatar de ${name}` : 'Avatar');

  // Manejar click
  const handleClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div 
      className={avatarClasses}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={finalAriaLabel}
      title={showTooltip ? name : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      } : undefined}
      {...restProps}
    >
      {/* Contenedor principal del avatar */}
      <div className="avatar__container">
        {/* Imagen del avatar */}
        {src && (
          <img
            src={src}
            alt={finalAlt}
            className="avatar__image"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Fallback: iniciales o icono */}
        <div 
          className="avatar__fallback"
          style={{ display: src ? 'none' : 'flex' }}
        >
          {initials || fallbackIcon}
        </div>
        
        {/* Spinner de loading */}
        {loading && (
          <div className="avatar__spinner" aria-hidden="true">
            <svg className="avatar__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="avatar__spinner-circle" 
                cx="12" 
                cy="12" 
                r="10" 
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Indicador de estado */}
      {status && (
        <span 
          className={`avatar__status avatar__status--${status}`}
          aria-label={`Estado: ${status}`}
          title={`Estado: ${status}`}
        />
      )}
      
      {/* Badge/contador */}
      {badge && (
        <span 
          className="avatar__badge"
          aria-label={`${badge} notificaciones`}
          title={`${badge} notificaciones`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export { Avatar };