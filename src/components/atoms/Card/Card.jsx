import { React } from 'react';
import './Card.css';
function Card({className, children}) {
return(
    <div className={`card ${className}`}>
        {children}
    </div>
);
}

export { Card };