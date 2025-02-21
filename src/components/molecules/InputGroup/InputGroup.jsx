import React from 'react';

import { TextInput } from '../../atoms/TextInput/TextInput';
import { TextContent } from '../../atoms/TextContent/TextContent';

import './InputGroup.css';

function InputGroup({
    placeholder = 'Ingrese texto',
    value = '',
    onChange = () => { },
    onBlur = () => { },
    type = 'text',
    name,
    className = '',
    textStyle,
    textContent,
    error
}) {
    return (
        <div className='input-group'>
            <TextInput type={type} name={name} placeholder={placeholder} className={`${error ? 'input_field-error': ''} ${className}`} value={value} onChange={onChange} onBlur={onBlur} />
            <TextContent textStyle={textStyle}>{textContent}</TextContent>
        </div>
    );
}

export { InputGroup };