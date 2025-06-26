// src/components/atoms/FileInput/FileInput.jsx
import React, { useState } from "react";
import "./FileInput.css";

/**
 * FileInput - ÁTOMO ACTUALIZADO PARA SISTEMA DE DISEÑO
 * 
 * ✅ SISTEMA DE DISEÑO: Usa variables CSS del sistema como Button/Input
 * ✅ ATOMIC DESIGN: Átomo independiente y reutilizable
 * ✅ VARIANTES: Success, danger, warning siguiendo el patrón
 * ✅ TAMAÑOS: xs, sm, md, lg, xl como otros componentes
 * ✅ ACCESIBILIDAD: ARIA labels, focus management, keyboard support
 * ✅ ESTADOS: Normal, hover, focus, disabled, loading
 * ✅ RESPONSIVE: Mobile-first, área táctil adecuada
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.id] - ID único para el input
 * @param {string} [props.name] - Nombre del campo para formularios
 * @param {string} [props.accept] - Tipos MIME permitidos (ej: "image/*")
 * @param {boolean} [props.multiple=false] - Permite seleccionar múltiples archivos
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del componente
 * @param {'default'|'success'|'warning'|'danger'} [props.variant='default'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {string} [props.text='Seleccionar archivo'] - Texto del botón
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.errorText] - Mensaje de error
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onChange] - Handler cuando se selecciona archivo
 * @param {function} [props.onFocus] - Handler cuando obtiene foco
 * @param {function} [props.onBlur] - Handler cuando pierde foco
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.ariaDescribedBy] - ID del elemento descriptivo
 */
function FileInput({
  id,
  name,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  rounded = 'md',
  text = 'Seleccionar archivo',
  helperText,
  errorText,
  className = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ariaLabel,
  ariaDescribedBy,
  ...rest
}) {
  // Estado interno para controlar archivos seleccionados
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [focused, setFocused] = useState(false);

  // Determinar el estado actual
  const hasError = Boolean(errorText);
  const currentVariant = hasError ? 'danger' : variant;
  const hasFiles = selectedFiles.length > 0;

  // Generar IDs únicos si no se proporcionan
  const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  /**
   * Manejador del evento onChange
   */
  const handleChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    onChange(event);
  };

  /**
   * Manejador del evento onFocus
   */
  const handleFocus = (event) => {
    setFocused(true);
    onFocus(event);
  };

  /**
   * Manejador del evento onBlur
   */
  const handleBlur = (event) => {
    setFocused(false);
    onBlur(event);
  };

  // Construir clases CSS
  const fileInputClasses = [
    'file-input',
    `file-input--${size}`,
    `file-input--${currentVariant}`,
    `file-input--rounded-${rounded}`,
    focused && 'file-input--focused',
    disabled && 'file-input--disabled',
    hasFiles && 'file-input--has-files',
    className
  ].filter(Boolean).join(' ');

  const buttonClasses = [
    'file-input__button',
    `file-input__button--${size}`,
    `file-input__button--${currentVariant}`,
    `file-input__button--rounded-${rounded}`,
    disabled && 'file-input__button--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className="file-input-wrapper">
      {/* Contenedor principal */}
      <div className={fileInputClasses}>
        
        {/* Input file oculto */}
        <input
          type="file"
          id={inputId}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="file-input__input"
          aria-label={ariaLabel || text}
          aria-describedby={describedBy}
          {...rest}
        />

        {/* Label que actúa como botón */}
        <label htmlFor={inputId} className={buttonClasses}>
          
          {/* Icono del archivo */}
          <div className="file-input__icon">
            {hasFiles ? (
              <span className="file-input__icon-success">✅</span>
            ) : (
              <div className="file-input__icon-folder">
                <div className="file-input__folder-top"></div>
                <div className="file-input__folder-bottom"></div>
              </div>
            )}
          </div>

          {/* Texto del botón */}
          <span className="file-input__text">
            {hasFiles ? 
              `${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''} seleccionado${selectedFiles.length !== 1 ? 's' : ''}` : 
              text
            }
          </span>

          {/* Indicador de requerido */}
          {required && (
            <span className="file-input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {/* Información de archivos seleccionados */}
      {hasFiles && (
        <div className="file-input__files-info">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-input__file-item">
              <span className="file-input__file-name">{file.name}</span>
              <span className="file-input__file-size">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && !hasError && (
        <div id={helperId} className="file-input__helper-text">
          {helperText}
        </div>
      )}

      {/* Mensaje de error */}
      {errorText && (
        <div id={errorId} className="file-input__error-text" role="alert">
          {errorText}
        </div>
      )}
    </div>
  );
}

export { FileInput };