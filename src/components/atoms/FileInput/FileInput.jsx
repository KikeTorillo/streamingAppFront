import React, { useState } from "react";
import "./FileInput.css";
import { FcOk } from "react-icons/fc";

/**
 * Componente FileInput
 *
 * Este componente renderiza un input de archivo personalizado. Se oculta el input real y se utiliza
 * un label asociado para permitir al usuario interactuar y seleccionar un archivo. Se muestra un ícono
 * indicando que se ha seleccionado un archivo.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.id - Identificador único para el input, usado para asociarlo al label.
 * @param {string} props.accept - Cadena con los tipos MIME permitidos (por ejemplo, "image/*").
 * @param {function} [props.onChange=() => {}] - Función callback que se ejecuta al cambiar el valor del input.
 * @returns {JSX.Element} Elemento JSX que representa el input de archivo personalizado.
 */
function FileInput({accept, onChange = () => {}, text='selecciona un archivo'}) {
  // Estado interno para controlar si se ha seleccionado un archivo.
  const [fileSelected, setFileSelected] = useState(false);

  /**
   * Manejador del evento de cambio (onChange) del input.
   *
   * Actualiza el estado interno para indicar si se ha seleccionado un archivo y llama al callback
   * pasado como prop para permitir acciones adicionales en el componente padre.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const handleChange = (event) => {
    // Verificar si se han seleccionado archivos y actualizar el estado
    if (event.target.files && event.target.files.length > 0) {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
    // Invocar el callback onChange recibido por props
    onChange(event);
  };

  return (
    <div className="FileInput">
      <div className="folder">
        <div className="top"></div>
        <div className="container-icon">
          {/* Mostrar un ícono si se ha seleccionado un archivo */}
          {fileSelected ? <FcOk size={24} /> : ""}
        </div>
        <div className="bottom"></div>
      </div>
      <label className="custom-file-upload">
        <input
          className="title"
          type="file"
          accept={accept}
          onChange={handleChange}
        />
        {text}
      </label>
    </div>

    // <div className="FileInput">
    //   {/* Input de tipo file que se oculta, permitiendo la personalización a través del label */}
    //   <input
    //     type="file"
    //     id={id}
    //     accept={accept}
    //     onChange={handleChange}
    //     style={{ display: "none" }}
    //   />
    //   {/* Label asociado al input; al hacer clic se abre el selector de archivos */}
    //   <label htmlFor={id}>
    //     <div className="folder">
    //       <div className="top"></div>
    //       <div className="container-icon">
    //         {/* Mostrar un ícono si se ha seleccionado un archivo */}
    //         {fileSelected ? <FcOk size={24} /> : ""}
    //       </div>
    //       <div className="bottom"></div>
    //     </div>
    //   </label>
    // </div>
  );
}

export { FileInput };
