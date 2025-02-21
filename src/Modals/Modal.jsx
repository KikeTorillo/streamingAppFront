import React from "react";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { TodoContext } from "../app/context/TodoContext";
import './Modal.css'

function Modal({ children }) {
    const { openModal, setOpenModal } = useContext(TodoContext);
    return createPortal(
        <div className="modal" onClick={(event) => {
            if (event.target.className === 'modal') {
                setOpenModal(!openModal)
            }
        }
        }>
            {children}
        </div>,
        document.getElementById('modal')
    );
}

export { Modal };