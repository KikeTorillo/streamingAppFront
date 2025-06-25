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
    // Props funcionales
    children,
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    
    // Props de estilo
    variant = 'primary',
    size = 'md',
    rounded = 'md',
    fullWidth = false,
    compact = false,
    
    // Props de iconos
    icon,
    leftIcon, // ← PROP PERSONALIZADA
    rightIcon, // ← PROP PERSONALIZADA
    iconPosition = 'left',
    iconOnly = false,
    
    // Props de accesibilidad
    ariaLabel,
    ariaDescribedBy,
    
    // Props adicionales
    className = '',
    text, // ← PROP PERSONALIZADA
    
    // ✅ SEPARAR TODAS LAS PROPS PERSONALIZADAS
    ...restProps
}) {
    // ✅ FILTRAR PROPS QUE NO DEBEN IR AL DOM
    const {
        leftIcon: _leftIcon,
        rightIcon: _rightIcon,
        text: _text,
        variant: _variant,
        size: _size,
        rounded: _rounded,
        fullWidth: _fullWidth,
        compact: _compact,
        iconPosition: _iconPosition,
        iconOnly: _iconOnly,
        ...domProps // ✅ Solo props válidas para el DOM
    } = restProps;

    // Determinar el contenido del botón
    const buttonContent = text || children;
    
    // Determinar el icono final a usar
    const finalIcon = leftIcon || rightIcon || icon;
    const finalIconPosition = leftIcon ? 'left' : (rightIcon ? 'right' : iconPosition);

    // Clases CSS
    const buttonClasses = [
        'btn',
        `btn--variant-${variant}`,
        `btn--size-${size}`,
        `btn--rounded-${rounded}`,
        fullWidth && 'btn--full-width',
        compact && 'btn--compact',
        loading && 'btn--loading',
        disabled && 'btn--disabled',
        iconOnly && 'btn--icon-only',
        className
    ].filter(Boolean).join(' ');

    // Handler para click
    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    // Función para renderizar iconos
    const renderIcon = (iconValue) => {
        if (!iconValue) return null;
        
        if (React.isValidElement(iconValue)) {
            return iconValue;
        }
        
        if (typeof iconValue === 'string') {
            // Si incluye clases CSS (fa-, icon-, bi-, material-icons), usar <i>
            if (iconValue.includes('fa-') || iconValue.includes('icon-') || iconValue.includes('bi-') || iconValue.includes('material-icons')) {
                return <i className={iconValue} aria-hidden="true" />;
            }
            // Si no, es texto/emoji, renderizar directamente
            return <span aria-hidden="true">{iconValue}</span>;
        }
        
        return iconValue;
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
            {...domProps} // ✅ Solo props válidas del DOM
        >
            {/* Icono izquierdo */}
            {finalIcon && finalIconPosition === 'left' && !iconOnly && (
                <span className="btn__icon btn__icon--left">
                    {renderIcon(finalIcon)}
                </span>
            )}
            
            {/* Contenido principal */}
            {!iconOnly && (
                <span className="btn__content">
                    {buttonContent}
                </span>
            )}
            
            {/* Solo icono (para botones icon-only) */}
            {iconOnly && finalIcon && (
                <span className="btn__icon">
                    {renderIcon(finalIcon)}
                </span>
            )}
            
            {/* Icono derecho */}
            {finalIcon && finalIconPosition === 'right' && !iconOnly && (
                <span className="btn__icon btn__icon--right">
                    {renderIcon(finalIcon)}
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

export { Button };