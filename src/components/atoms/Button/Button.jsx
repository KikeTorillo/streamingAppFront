// atoms/Button.jsx
import React from 'react';
import './Button.css';

/**
 * Componente reutilizable de botón con opciones de personalización
 * Siguiendo principios de Atomic Design
 * Optimizado para sistema de diseño con html { font-size: 62.5% }
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|React.ReactNode} props.children - Contenido del botón (texto o elementos)
 * @param {string} [props.text] - Texto del botón (alternativa a children)
 * @param {function} props.onClick - Función a ejecutar al hacer clic
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del botón
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'warning'} [props.variant='primary'] - Variante visual
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo de botón HTML
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado
 * @param {boolean} [props.loading=false] - Si muestra estado de carga
 * @param {string|React.ReactNode} [props.icon] - Icono a mostrar (clase CSS, emoji, o componente React)
 * @param {'left'|'right'} [props.iconPosition='left'] - Posición del icono
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {boolean} [props.compact=false] - Padding horizontal reducido
 * @param {boolean} [props.iconOnly=false] - Solo icono, sin texto (aspecto 1:1)
 * @param {string} [props.ariaLabel] - Label para accesibilidad (requerido si iconOnly=true)
 * @param {string} [props.ariaDescribedBy] - ID del elemento que describe el botón
 */
function Button({
    children,
    text,
    onClick,
    className = '',
    size = 'md',
    variant = 'primary',
    type = 'button',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    rounded = 'md',
    compact = false,
    iconOnly = false,
    ariaLabel,
    ariaDescribedBy,
    ...restProps // Props adicionales controladas
}) {
    // Validación: iconOnly requiere ariaLabel
    if (iconOnly && !ariaLabel && !children && !text) {
        console.warn('Button: iconOnly=true requiere ariaLabel para accesibilidad');
    }

    // Construir clases CSS dinámicamente
    const buttonClasses = [
        'btn', // Clase base
        `btn--${variant}`, // Variante de color
        `btn--${size}`, // Tamaño
        rounded !== 'md' && `btn--rounded-${rounded}`, // Radio personalizado
        fullWidth && 'btn--full-width', // Ancho completo
        loading && 'btn--loading', // Estado de carga
        disabled && 'btn--disabled', // Estado deshabilitado
        compact && 'btn--compact', // Padding reducido
        iconOnly && 'btn--icon-only', // Solo icono
        className // Clases adicionales
    ].filter(Boolean).join(' ');

    // Contenido del botón (priorizar children sobre text)
    const buttonContent = children || text;

    // Manejar click (no ejecutar si está disabled o loading)
    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    // Función para renderizar el icono
    const renderIcon = (icon) => {
        // Si es un componente React, renderizarlo directamente
        if (React.isValidElement(icon)) {
            return icon;
        }
        
        // Si es string, verificar si es una clase CSS o texto/emoji
        if (typeof icon === 'string') {
            // Si contiene clases típicas de iconos (fa-, icon-, etc.), usar <i>
            if (icon.includes('fa-') || icon.includes('icon-') || icon.includes('bi-') || icon.includes('material-icons')) {
                return <i className={icon} aria-hidden="true" />;
            }
            // Si no, es texto/emoji, renderizar directamente
            return <span aria-hidden="true">{icon}</span>;
        }
        
        return icon;
    };

    // Determinar aria-label final
    const finalAriaLabel = ariaLabel || (iconOnly ? (typeof buttonContent === 'string' ? buttonContent : undefined) : undefined);

    return (
        <button 
            type={type}
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            aria-label={finalAriaLabel}
            aria-describedby={ariaDescribedBy}
            {...restProps} // Spread controlado al final
        >
            {/* Icono izquierdo */}
            {icon && iconPosition === 'left' && !iconOnly && (
                <span className="btn__icon btn__icon--left">
                    {renderIcon(icon)}
                </span>
            )}
            
            {/* Contenido principal */}
            {!iconOnly && (
                <span className="btn__content">
                    {buttonContent}
                </span>
            )}
            
            {/* Solo icono (para botones icon-only) */}
            {iconOnly && icon && (
                <span className="btn__icon">
                    {renderIcon(icon)}
                </span>
            )}
            
            {/* Icono derecho */}
            {icon && iconPosition === 'right' && !iconOnly && (
                <span className="btn__icon btn__icon--right">
                    {renderIcon(icon)}
                </span>
            )}
            
            {/* Spinner de loading */}
            {loading && (
                <span className="btn__spinner" aria-hidden="true">
                    <svg className="btn__spinner-svg" viewBox="0 0 24 24">
                        <circle 
                            className="btn__spinner-circle" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            strokeWidth="2"
                        />
                    </svg>
                </span>
            )}
        </button>
    );
}

// Exportar componente
export { Button };