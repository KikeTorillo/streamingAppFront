// TextInput.jsx

// Importar React (necesario para JSX) y los estilos asociados
import React from "react";
import './TextInput.css';

/**
 * Componente de entrada de texto reutilizable y estilizado
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.placeholder='Ingrese texto'] - Texto de ayuda del input
 * @param {string} [props.value=''] - Valor controlado del input
 * @param {function} [props.onChange=() => {}] - Handler para cambios de valor
 * @param {function} [props.onBlur=() => {}] - Handler para pérdida de foco
 * @param {'text'|'password'|'email'} [props.type='text'] - Tipo de input HTML
 * @param {string} props.name - Nombre del campo (necesario para formularios)
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
function TextInput({
    placeholder = "Ingrese texto",
    value = "",
    onChange = () => {},
    onBlur = () => {},
    type = "text",
    name,
    className = "",
}) {
    return (
        // Elemento input con todas las props aplicadas
        <input
            type={type} // Tipo de input (text/password/email/etc)
            name={name} // Nombre del campo (requerido para formularios)
            placeholder={placeholder} // Texto de ayuda
            className={`textInput ${className}`} // Combinación de clases
            value={value} // Valor controlado
            onChange={onChange} // Actualización de valor
            onBlur={onBlur} // Evento al perder foco
        />
    );
}

// Exportar componente para su uso en otros archivos
export { TextInput };