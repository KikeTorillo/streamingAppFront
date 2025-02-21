import { React } from 'react';

import { InputGroup } from "../../molecules/InputGroup/InputGroup";
import { Button } from "../../atoms/Button/Button";
import { TextContent } from "../../atoms/TextContent/TextContent";
import { Card } from "../../atoms/Card/Card";

function ResetPassCard({
    formStatus,
    handleChange,
    validateOne,
    validateAll,
    error
}) {

    return (
        <Card>
            <TextContent textStyle="header-2">Cambiar contraseña</TextContent>
            <div>
                <InputGroup
                    name="password"
                    type="password"
                    error={formStatus.validations.password}
                    placeholder="Contraseña"
                    value={formStatus.values.password}
                    onChange={(event) => { handleChange(event); }}
                    onBlur={(event) => validateOne(event)}
                    textContent={formStatus.validations.password}
                    textStyle="label"
                />
                <InputGroup
                    name="confirmPassword"
                    type="password"
                    error={formStatus.validations.confirmPassword}
                    placeholder="Confirma contraseña"
                    value={formStatus.values.confirmPassword}
                    onChange={(event) => { handleChange(event); }}
                    onBlur={(event) => validateOne(event)}
                    textContent={formStatus.validations.confirmPassword}
                    textStyle="label"
                />
            </div>
            <Button
                onClick={() => validateAll()}
                text="Confirmar"
                size="md"
            />
            {error && <h3>{error}</h3>}
        </Card>
    );

}

export { ResetPassCard };