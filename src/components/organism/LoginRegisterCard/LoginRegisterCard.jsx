import { React, useState } from 'react';

import { InputGroup } from "../../molecules/InputGroup/InputGroup";
import { Button } from "../../atoms/Button/Button";
import { TextContent } from "../../atoms/TextContent/TextContent";
import { Card } from "../../atoms/Card/Card";
import { SwitchButton } from "../../atoms/SwitchButton/SwitchButton";

import './LoginRegisterCard.css';

function LoginRegisterCard({
    formStatus,
    setFormStatus,
    handleChange,
    validateOne,
    validateAll,
    sendRecovery,
    error
}) {
    const [cardShowing, setCardShowing] = useState('login');
    const handleChangeCard = (flag) => {
        if (!flag) {
            setCardShowing(cardShowing === 'login' ? 'register' : 'login');
        } else {
            if (flag === 'login') {
                setCardShowing('login');
            } else {
                setCardShowing('register');
            }

        }
        setFormStatus({
            values: {
                password: '',
                confirmPassword: '',
            },
            validations: {
                password: '',
                confirmPassword: '',
            },
        });
    };
    return (
        <div className='login-register-card-container'>
            <div className='switchButton-container'>
                <Button
                    onClick={() => handleChangeCard('login')}
                    type="link"
                    text="Inciar Sesion"
                    size="sm"
                    className={cardShowing === 'login' ? 'link-active' : ''}
                />
                <SwitchButton
                    onChange={() => handleChangeCard(false)}
                    checked={cardShowing === 'register' ? true : false}
                />
                <Button
                    onClick={() => handleChangeCard('register')}
                    type="link"
                    text="Crear cuenta"
                    size="sm"
                    className={cardShowing === 'register' ? 'link-active' : ''}
                />
            </div>
            <div className="flip-card-container">
                <Card className={`card--front--position ${cardShowing === 'login' ? 'card__login--active' : ''}`}>
                    <TextContent textStyle="header-2">Iniciar Sesion</TextContent>
                    <div>
                        <InputGroup
                            name="email"
                            type="email"
                            error={formStatus.validations.email}
                            placeholder="Email"
                            value={formStatus.values.email}
                            onChange={(event) => handleChange(event)}
                            onBlur={(event) => validateOne(event)}
                            textContent={formStatus.validations.email}
                            textStyle="label"
                        />
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
                    </div>
                    <Button
                        onClick={() => validateAll('login')}
                        text="Iniciar Sesion"
                        size="md"
                    />
                    <Button
                        onClick={sendRecovery}
                        type="link"
                        text="Olvide mi contraseña"
                    />
                    {error && <h3>{error}</h3>}
                </Card>
                <Card className={`card--back--position ${cardShowing === 'register' ? 'card__register--active' : ''}`}>
                    <TextContent textStyle="header-2">Crear cuenta</TextContent>
                    <div>
                        <InputGroup
                            name="email"
                            type="email"
                            error={formStatus.validations.email}
                            placeholder="Email"
                            value={formStatus.values.email}
                            onChange={(event) => handleChange(event)}
                            onBlur={(event) => validateOne(event)}
                            textContent={formStatus.validations.email}
                            textStyle="label"
                        />
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
                        onClick={() => validateAll('register')}
                        text="Confirmar"
                        size="md"
                    />
                    {error && <h3>{error}</h3>}
                </Card>
            </div>
        </div>
    );
}

export { LoginRegisterCard };