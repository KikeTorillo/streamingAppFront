// Card.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from 'react';
import './Card.css';

/**
 * Componente contenedor reutilizable con estilo de tarjeta
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido interno de la tarjeta
 */
function Card({ className='', children }) {
    return (
        // Contenedor con clases combinadas: 'card' + clases adicionales
        <div className={`card ${className}`}>
            {children} {/* Renderiza el contenido interno */}
        </div>
    );
}

// Exportar componente para su uso en otros archivos
export { Card };