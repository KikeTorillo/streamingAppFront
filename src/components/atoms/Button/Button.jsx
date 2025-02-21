import {React} from 'react';
import './Button.css';

function Button({
    text, 
    onClick, 
    className='',
    size = 'sm',
    type = 'button'
}) {
    return (
        <button type={type} className={`${type} ${size} ${className}`} onClick={onClick}>{text}</button>
    );
}

export {Button}; 