import { React } from 'react';
import './SwitchButton.css';

function SwitchButton({
    onChange,
    checked
}) {
    return (
        <label className="switch">
            <input
                type="checkbox"
                onChange={onChange}
                checked={checked}
            />
            <span className="slider"></span>
        </label>
    );
}

export { SwitchButton };