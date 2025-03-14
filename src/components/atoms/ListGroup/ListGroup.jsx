// ListGroup.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from "react";
import './ListGroup.css';

/**
 * Componente contenedor para grupos de elementos en formato lista
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Elementos hijos que se renderizarán como items de la lista
 */
function ListGroup({ children }) {
    return (
        // Elemento lista con clase CSS para estilos
        <ul className="ListGroup">
            {children} {/* Renderiza los elementos hijos */}
        </ul>
    );
}

// Exportar componente para su uso en otros archivos
export { ListGroup };