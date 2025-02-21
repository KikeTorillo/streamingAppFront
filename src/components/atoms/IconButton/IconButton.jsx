import React from "react";

import "./IconButton.css"

/*
    IconButton component is a simple component that renders a span element with a className that is passed as a prop. 
    It also receives an iconStyle prop that is a string with the icon class that will be rendered. 
    The onClick prop is a function that is called when the span element is clicked.
    className is a prop that allows to add more classes to the span element.

    Props: 
        iconStyle: string options are: 'createTodoButton', 'trashButton', 'checkedButton', 'uncheckButton'
        onClick: function
        className: string
*/

function IconButton({iconStyle, onClick, className}) {
    return (
        <span className={`${iconStyle} ${className}`}
        onClick={onClick}
        >
        </span>
    );
}

export { IconButton };