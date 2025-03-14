// SwitchButton.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from 'react';
import './SwitchButton.css';

/**
 * Componente de interruptor/toggle estilizado
 * @param {Object} props - Propiedades del componente
 * @param {function} props.onChange - Función a ejecutar cuando cambia el estado
 * @param {boolean} props.checked - Estado actual del interruptor (activo/inactivo)
 */
function SwitchButton({ onChange, checked }) {
    return (
        // Contenedor principal con clase "switch" para estilos
        <label className="switch">
            {/* Input checkbox oculto que maneja el estado */}
            <input
                type="checkbox" // Tipo de input para toggle
                onChange={onChange} // Evento cuando cambia el estado
                checked={checked} // Estado controlado desde el padre
            />
            {/* Elemento visible que actúa como slider */}
            <span className="slider"></span>
        </label>
    );
}

// Exportar componente para su uso en otros archivos
export { SwitchButton };