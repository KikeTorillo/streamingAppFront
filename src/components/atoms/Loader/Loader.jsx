import React from "react";
import './Loader.css';

function Loader({styleLoader}) {
    return (
        <span className={styleLoader}></span>
    );
}

export { Loader };