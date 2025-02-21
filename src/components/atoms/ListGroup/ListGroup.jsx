import React from "react";
import './ListGroup.css';

function ListGroup({children}) {
    return (
        <ul className="ListGroup">
            {children}
        </ul>
    );
}

export { ListGroup };