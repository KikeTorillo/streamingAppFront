// ListItem.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from "react";
import './ListItem.css';

/**
 * Componente para elementos individuales dentro de una lista
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del elemento de lista
 */
function ListItem({ children }) {
    return (
        // Elemento de lista con clase CSS para estilos
        <li className="ListItem">
            {children} {/* Renderiza el contenido interno */}
        </li>
    );
}

// Exportar componente para su uso en otros archivos
export { ListItem };