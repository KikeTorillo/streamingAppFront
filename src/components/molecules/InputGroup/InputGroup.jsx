// InputGroup.jsx
import React from 'react';
import { TextInput } from '../../atoms/TextInput/TextInput';
// Importar componente atómico de texto
import { TextContent } from '../../atoms/TextContent/TextContent';
import './InputGroup.css'; // Estilos específicos del grupo de entrada

/**
 * Componente compuesto que agrupa un campo de entrada con texto asociado
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.placeholder='Ingrese texto'] - Placeholder del input
 * @param {string} [props.value=''] - Valor controlado del input
 * @param {function} [props.onChange=() => {}] - Handler para cambios en el input
 * @param {function} [props.onBlur=() => {}] - Handler para pérdida de foco
 * @param {string} [props.type='text'] - Tipo de input (text/password/email/etc)
 * @param {string} props.name - Nombre del campo (requerido para formularios)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} props.textStyle - Estilo del texto asociado (hereda de TextContent)
 * @param {string} props.textContent - Contenido textual a mostrar junto al input
 * @param {boolean} [props.error=false] - Estado de error para styling
 */
function InputGroup({
    placeholder = 'Ingrese texto',
    value = '',
    onChange = () => {},
    onBlur = () => {},
    type = 'text',
    name,
    className = '',
    textStyle,
    textContent,
    error
}) {
    return (
        // Contenedor principal con clase 'input-group' para diseño
        <div className='input-group'>
            {/* Campo de entrada estilizado */}
            <TextInput
                type={type} // Tipo de input
                name={name} // Identificador del campo
                placeholder={placeholder} // Texto de ayuda
                className={`${error ? 'input_field-error' : ''} ${className}`} // Clases condicionales
                value={value} // Valor controlado
                onChange={onChange} // Actualización de valor
                onBlur={onBlur} // Evento al perder foco
            />
            
            {/* Texto asociado (ayuda/error) */}
            <TextContent textStyle={textStyle}>
                {textContent} {/* Contenido textual (ej: mensaje de error) */}
            </TextContent>
        </div>
    );
}

// Exportar componente para su uso en otros archivos
export { InputGroup };