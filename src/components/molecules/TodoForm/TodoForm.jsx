import React, { useState } from "react";

import { useContext } from "react";
import { TodoContext } from "../../../app/context/TodoContext";

import { Card } from "../../atoms/Card/Card";
import { TextContent } from "../../atoms/TextContent/TextContent";
import { Button } from "../../atoms/Button/Button";

import './TodoForm.css'
function TodoForm() {
    const { openModal, setOpenModal, createTodo } = useContext(TodoContext);
    const [textValue, setTextValue] = useState('');
    return (
        <Card className='create-todo-modal'>
            <TextContent> Escribe tu nuevo To-do </TextContent>
            <textarea
                value={textValue}
                onChange={(event) => {
                    setTextValue(event.target.value);
                }} />
            <div className="buttons-container">
                <Button
                    text='Cancelar'
                    onClick={() => setOpenModal(!openModal)}
                />
                <Button
                    text='Agregar'
                    className="addButton"
                    onClick={() => createTodo(textValue)}
                />
            </div>
        </Card>
    );
}

export { TodoForm }