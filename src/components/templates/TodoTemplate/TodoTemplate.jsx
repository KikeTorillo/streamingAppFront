import React, { useState } from 'react'

import { TextInput } from '../../atoms/TextInput/TextInput'
import { TextContent } from '../../atoms/TextContent/TextContent'
import { Button } from '../../atoms/Button/Button'
import { ListGroup } from '../../atoms/ListGroup/ListGroup'
import { IconButton } from '../../atoms/IconButton/IconButton'
import { TodoListItem } from '../../molecules/TodoListItem/TodoListItem'
import { Loader } from '../../atoms/Loader/Loader'

import { Modal } from '../../../Modals/Modal'
import { TodoForm } from '../../molecules/TodoForm/TodoForm'

import './TodoTemplate.css'


import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';


function TodoTemplate({
  loading,
  error,
  searchedTodos,
  completeTodo,
  deleteTodo,
  openModal,
  setOpenModal,
  searchValue,
  setSearchValue,
  completedTodos,
  totalTodos,
  filterTodo,
  setFilterTodo,
  todos,
  updateTodosOrder
}) {

  function handleDragEnd(event) {
    const { active, over } = event;
    const oldIndex = todos.findIndex(todo => todo.id === active.id);
    const newIndex = todos.findIndex(todo => todo.id === over.id);
    const newOrder = arrayMove(todos, oldIndex, newIndex);
    updateTodosOrder(newOrder);
  }

  const sensors = useSensors(
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 0,
        tolerance: 1
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  return (
    <div className='todoApp-container'>
      <div className='section-headers-container'>
        <TextContent textStyle="header-1">
          Mis Pendientes
        </TextContent>
        <TextContent textStyle="body">
          Has completado {completedTodos.length} de {totalTodos} to-do's
        </TextContent>
        <div className='search-filter-container'>
          <TextInput type="text" placeholder="Buscar To-Do"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
          />
          <div className='todoFilter-container'>
            <Button
              text='En progreso'
              className={filterTodo === 'progress' ? 'selected' : ''}
              onClick={() => setFilterTodo('progress')}
            />
            <Button
              text='Finalizado'
              className={filterTodo === 'end' ? 'selected' + ' overButton' : '' + 'overButton'}
              onClick={() => setFilterTodo('end')}
            />
          </div>
        </div>
      </div>
      {loading && (
        <div>
          <Loader styleLoader='gearLoader' />
        </div>
      )

      }
      {error && (
        <div>
          <p>Hubo un error al cargar To-dos</p>
        </div>
      )}
      {(loading === false && !error) && (
        <div className='todoList-container'>
          <ListGroup>
            {(!error && !loading && totalTodos === 0) && <p>Crea tu primer To-do</p>}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={searchedTodos}
                strategy={verticalListSortingStrategy}
              >
                {
                  searchedTodos.map((toDo) => {
                    return <TodoListItem key={toDo.id} toDo={toDo} completeTodo={() => completeTodo(toDo)} deleteTodo={() => deleteTodo(toDo)} />
                  })
                }
              </SortableContext>
            </DndContext>
          </ListGroup>
          <IconButton
            iconStyle='createTodoButton'
            onClick={() => setOpenModal(!openModal)}
          />
        </div>
      )}
      {openModal && (
        <Modal>
          <TodoForm />
        </Modal>
      )}
    </div>
  );



}

export { TodoTemplate };