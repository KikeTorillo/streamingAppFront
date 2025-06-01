import React from "react";
import "./Select.css"; // Importa estilos

const Select = ({ options = [], value, onChange, placeholder = "Seleccione una opción" }) => {
  return (
    <div className="Select">
      <select value={value} onChange={(e) => onChange(e)}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export { Select };