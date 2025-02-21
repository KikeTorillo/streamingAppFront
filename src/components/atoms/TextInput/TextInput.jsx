import React from "react";

import './TextInput.css';

function TextInput({
    placeholder = "Ingrese texto",
    value = "",
    onChange = () => { },
    onBlur = () => { },
    type = "text",
    name,
    className = "",
}) {
    return (
        <input type={type} name={name} placeholder={placeholder} className={`textInput ${className}`} value={value} onChange={onChange} onBlur={onBlur} />
    );
}

export { TextInput };