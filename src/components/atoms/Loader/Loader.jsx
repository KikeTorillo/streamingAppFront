// Loader.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from "react";
import './Loader.css';

/**
 * Componente visual para mostrar un indicador de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} props.styleLoader - Nombre de la clase CSS que define el estilo del loader
 */
function Loader({ styleLoader }) {
    return (
        // Elemento span que actúa como contenedor del loader
        // La clase recibida por props define su apariencia visual
        <span className={styleLoader}></span>
    );
}

// Exportar componente para su uso en otros archivos
export { Loader };