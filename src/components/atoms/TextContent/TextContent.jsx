// TextContent.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from "react";
import './TextContent.css';

/**
 * Componente para aplicar estilos de texto consistentes
 * @param {Object} props - Propiedades del componente
 * @param {'body'|'title'|'subtitle'|string} [props.textStyle='body'] - Tipo de estilo de texto
 * @param {React.ReactNode} props.children - Contenido textual o elementos hijos
 */
function TextContent({
    textStyle = 'body', // Estilo por defecto: 'body'
    children // Contenido obligatorio
}) {
    return (
        // Elemento span con clase dinámica para estilos
        <span className={textStyle}>
            {children} {/* Renderiza el contenido interno */}
        </span>
    );
}

// Exportar componente para su uso en otros archivos
export { TextContent };