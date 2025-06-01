import React, { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import './Table.css';

function Table({ data, columns, onEdit, onDelete, onView }) {
  // Estado para el filtro global y su versión debounce
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);

  // Memoización de datos y columnas (incluyendo columna de acciones)
  const memoData = useMemo(() => data, [data]);
  const actionColumn = useMemo(
    () => ({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <ActionsMenu
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ),
    }),
    [onEdit, onDelete, onView]
  );
  const memoColumns = useMemo(() => [...columns, actionColumn], [columns, actionColumn]);

  // Configuración de la tabla con React Table
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { globalFilter: debouncedGlobalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="table">
      {/* Controles de filtro y tamaño de página */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="filter-input"
          aria-label="Buscar en la tabla"
        />
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="page-size-select"
          aria-label="Seleccionar tamaño de página"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <table className="simple-table__table">
        <thead className="simple-table__thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="simple-table__th"
                >
                  {!header.isPlaceholder && (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'sortable'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                        'aria-label': header.column.getCanSort()
                          ? `Ordenar por ${header.column.columnDef.header}`
                          : undefined,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="simple-table__tbody">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="simple-table__td">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination-controls">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          ← Anterior
        </button>
        <span className="pagination-info">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

// Componente de menú de acciones por fila
function ActionsMenu({ row, onEdit, onDelete, onView }) {
  return (
    <Menu as="div" className="actions-menu">
      <MenuButton className="menu-button">⋮</MenuButton>
      <MenuItems className="menu-items">
        <MenuItem>
          {({ focus }) => (
            <button
              className={`menu-item${focus ? ' active' : ''}`}
              onClick={() => onView && onView(row)}
            >
              Ver detalle
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={`menu-item${focus ? ' active' : ''}`}
              onClick={() => onEdit && onEdit(row)}
            >
              Editar
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={`menu-item menu-item--delete${focus ? ' active' : ''}`}
              onClick={() => onDelete && onDelete(row)}
            >
              Eliminar
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export { Table };