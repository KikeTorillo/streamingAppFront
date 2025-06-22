// ResetPassCard.jsx

// Importar React y componentes necesarios
import { React } from 'react';

import { Button } from "../../atoms/Button/Button"; // Botón estilizado
import { TextContent } from "../../atoms/TextContent/TextContent"; // Texto con estilo
import { Card } from "../../atoms/Card/Card"; // Tarjeta contenedora

/**
 * Componente para restablecimiento de contraseña
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formStatus - Estado del formulario (valores y validaciones)
 * @param {Function} props.handleChange - Manejador de cambios en inputs
 * @param {Function} props.validateOne - Validación individual de campos
 * @param {Function} props.validateAll - Validación completa del formulario
 * @param {string} props.error - Mensaje de error global
 */
function ResetPassCard({
    formStatus,
    handleChange,
    validateOne,
    validateAll,
    error
}) {
    return (
        // Tarjeta contenedora principal
        <Card>
            {/* Título del formulario */}
            <TextContent textStyle="header-2">Cambiar contraseña</TextContent>
            
            <div>
                {/* Campo de nueva contraseña */}
                <InputGroup
                    name="password" // Identificador del campo
                    type="password" // Tipo de input
                    error={formStatus.validations.password} // Estado de error
                    placeholder="Contraseña" // Texto de ayuda
                    value={formStatus.values.password} // Valor controlado
                    onChange={handleChange} // Actualización de valor
                    onBlur={validateOne} // Validación al perder foco
                    textContent={formStatus.validations.password} // Mensaje de error
                    textStyle="label" // Estilo del texto de error
                />
                
                {/* Campo de confirmación de contraseña */}
                <InputGroup
                    name="confirmPassword"
                    type="password"
                    error={formStatus.validations.confirmPassword}
                    placeholder="Confirma contraseña"
                    value={formStatus.values.confirmPassword}
                    onChange={handleChange}
                    onBlur={validateOne}
                    textContent={formStatus.validations.confirmPassword}
                    textStyle="label"
                />
            </div>

            {/* Botón de confirmación */}
            <Button
                onClick={validateAll} // Validación completa al hacer clic
                text="Confirmar"
                size="md"
            />

            {/* Mensaje de error global */}
            {error && <h3>{error}</h3>}
        </Card>
    );
}

export { ResetPassCard };