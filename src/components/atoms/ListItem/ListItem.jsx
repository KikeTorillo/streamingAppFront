import React from "react";

import './ListItem.css';

function ListItem({ children }) {
    return (
        <li className="ListItem">
            {children}
        </li>
    );
}

export { ListItem }