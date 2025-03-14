// Button.jsx

// Importar React y el archivo de estilos asociado
import React from 'react';
import './Button.css';

/**
 * Componente reutilizable de botón con opciones de personalización
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto que se muestra en el botón
 * @param {function} props.onClick - Función a ejecutar al hacer clic
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {'sm'|'md'} [props.size='sm'] - Tamaño del botón (por defecto 'sm')
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo de botón HTML
 */
function Button({
    text, 
    onClick, 
    className = '', // Clases adicionales (default: cadena vacía)
    size = 'sm', // Tamaño del botón (sm/md/lg)
    type = 'button' // Tipo de botón HTML (button/submit/reset)
}) {
    return (
        // Elemento botón con clases dinámicas
        <button 
            type={type} // Tipo de botón HTML
            className={`${type} ${size} ${className}`} // Combinación de clases
            onClick={onClick} // Manejador de clic
        >
            {text} {/* Texto del botón */}
        </button>
    );
}

// Exportar componente para su uso en otros archivos
export { Button };