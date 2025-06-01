// LoginRegisterCard.jsx

// Importar dependencias y componentes necesarios
import { React, useState } from "react";
import { InputGroup } from "../../molecules/InputGroup/InputGroup"; // Campo de entrada compuesto
import { Button } from "../../atoms/Button/Button"; // Botón estilizado
import { TextContent } from "../../atoms/TextContent/TextContent"; // Texto con estilo
import { Card } from "../../atoms/Card/Card"; // Tarjeta contenedora
import { SwitchButton } from "../../atoms/SwitchButton/SwitchButton"; // Interruptor de toggle
import "./LoginRegisterCard.css"; // Estilos específicos

/**
 * Componente de autenticación con modo registro e inicio de sesión
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formStatus - Estado del formulario (valores y validaciones)
 * @param {Function} props.setFormStatus - Actualizador del estado del formulario
 * @param {Function} props.handleChange - Manejador de cambios en inputs
 * @param {Function} props.validateOne - Validación individual de campos
 * @param {Function} props.validateAll - Validación completa del formulario
 * @param {Function} props.sendRecovery - Función para recuperar contraseña
 * @param {string} props.error - Mensaje de error global
 */
function LoginRegisterCard({
  formStatus,
  setFormStatus,
  handleChange,
  validateOne,
  validateAll,
  sendRecovery,
  error,
}) {

  return (
    <div className="login-register-card-container">
      {/* Tarjeta de inicio de sesión */}
      <Card>
        <TextContent textStyle="header-2">Iniciar Sesión</TextContent>

        {/* Campo de email */}
        <InputGroup
          name="email"
          type="email"
          error={formStatus.validations.email}
          placeholder="Email"
          value={formStatus.values.email}
          onChange={handleChange}
          onBlur={validateOne}
          textContent={formStatus.validations.email}
          textStyle="label"
        />

        {/* Campo de contraseña */}
        <InputGroup
          name="password"
          type="password"
          error={formStatus.validations.password}
          placeholder="Contraseña"
          value={formStatus.values.password}
          onChange={handleChange}
          onBlur={validateOne}
          textContent={formStatus.validations.password}
          textStyle="label"
        />

        {/* Botón de envío */}
        <Button
          onClick={() => validateAll("login")}
          text="Iniciar Sesión"
          size="md"
        />

        {/* Enlace para recuperar contraseña */}
        <Button
          onClick={sendRecovery}
          type="link"
          text="Olvidé mi contraseña"
        />

        {/* Mensaje de error global */}
        {error && <h3>{error}</h3>}
      </Card>
    </div>
  );
}

export { LoginRegisterCard };
