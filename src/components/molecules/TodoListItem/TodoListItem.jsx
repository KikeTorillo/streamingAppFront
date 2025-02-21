import React from "react";

import { IconButton } from "../../atoms/IconButton/IconButton";

import './TodoListItem.css';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function TodoListItem({ toDo, completeTodo, deleteTodo }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: toDo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef} style={style}
      className="ListItem" handle="true" {...attributes}

    >
      <IconButton
        iconStyle={toDo.done ? 'checkedButton' : 'uncheckButton'}
        onClick={completeTodo}
      />
      <p>{toDo.toDo}</p>
      <IconButton

        iconStyle="trashButton"
        onClick={deleteTodo}
      />
      <span
        className="dragButton"
        ref={setActivatorNodeRef}
        {...listeners}
      ></span>
    </li>
  );
}

export { TodoListItem }