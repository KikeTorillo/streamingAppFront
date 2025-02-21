import React from "react";

import './TextContent.css';

function TextContent({
    textStyle = 'body',
    children
}) {
    return (
        <span className={textStyle} >{children}</span>
    );
}

export { TextContent };