// ===== DATA TABLE ORGANISM =====
// src/components/organism/DataTable/DataTable.jsx

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
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Select } from '../../atoms/Select/Select';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import './DataTable.css';

/**
 * DataTable - Organismo para tablas de datos con funcionalidades avanzadas
 * 
 * REFACTORIZADO PARA SER UN ORGANISMO CORRECTO:
 * - ✅ Movido de atoms/ a organism/
 * - ✅ Usa componentes del sistema de diseño (Button, TextInput, Select)
 * - ✅ Variables CSS del sistema
 * - ✅ Estados loading/empty/error
 * - ✅ Accesibilidad completa
 * - ✅ Responsive design
 * - ✅ Elimina dependencia de @headlessui/react
 */
function DataTable({
  // Datos y configuración
  data = [],
  columns = [],
  
  // Handlers de acciones
  onEdit,
  onDelete,
  onView,
  
  // Estados
  loading = false,
  error = null,
  
  // Configuración de la tabla
  searchPlaceholder = "Buscar...",
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  
  // Configuración de acciones
  showActions = true,
  actionsColumnHeader = "Acciones",
  
  // Estados vacío
  emptyTitle = "No hay datos disponibles",
  emptyDescription = "No se encontraron resultados para mostrar",
  emptyIcon = "📋",
  
  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'
  
  // Props adicionales
  ...restProps
}) {
  // ===== ESTADOS =====
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // ===== COLUMNAS CON ACCIONES =====
  const actionColumn = useMemo(() => {
    if (!showActions) return null;
    
    return {
      id: 'actions',
      header: actionsColumnHeader,
      cell: ({ row }) => (
        <ActionsDropdown
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ),
      size: 120,
      enableSorting: false,
      enableGlobalFilter: false,
    };
  }, [showActions, actionsColumnHeader, onEdit, onDelete, onView]);

  const memoColumns = useMemo(() => {
    const cols = [...columns];
    if (actionColumn) {
      cols.push(actionColumn);
    }
    return cols;
  }, [columns, actionColumn]);

  // ===== CONFIGURACIÓN DE REACT TABLE =====
  const table = useReactTable({
    data: data || [],
    columns: memoColumns,
    state: { 
      globalFilter: debouncedGlobalFilter,
      pagination: { pageIndex: 0, pageSize }
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: 0, pageSize });
        setPageSize(newState.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  // ===== CLASES CSS =====
  const tableClasses = [
    'data-table',
    `data-table--${variant}`,
    loading && 'data-table--loading',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER ESTADOS ESPECIALES =====
  
  // Estado de error
  if (error) {
    return (
      <div className={tableClasses} {...restProps}>
        <div className="data-table__error">
          <EmptyState
            icon="❌"
            title="Error al cargar datos"
            description={error}
            action={
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // Estado vacío (sin datos)
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className={tableClasses} {...restProps}>
        <div className="data-table__empty">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className={tableClasses} {...restProps}>
      {/* ===== CONTROLES SUPERIORES ===== */}
      <div className="data-table__controls">
        <div className="data-table__controls-left">
          <TextInput
            type="search"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            leftIcon="🔍"
            size="sm"
            className="data-table__search"
            aria-label="Buscar en la tabla"
          />
        </div>
        
        <div className="data-table__controls-right">
          <Select
            value={pageSize.toString()}
            onChange={(e) => setPageSize(Number(e.target.value))}
            options={pageSizeOptions.map(size => ({
              value: size.toString(),
              label: `${size} por página`
            }))}
            size="sm"
            className="data-table__page-size"
            aria-label="Elementos por página"
          />
        </div>
      </div>

      {/* ===== TABLA ===== */}
      <div className="data-table__wrapper">
        <table className="data-table__table" role="table">
          {/* Header */}
          <thead className="data-table__thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="data-table__header-row">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={[
                      'data-table__th',
                      header.column.getCanSort() && 'data-table__th--sortable'
                    ].filter(Boolean).join(' ')}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {!header.isPlaceholder && (
                      <button
                        className="data-table__header-button"
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                        aria-label={
                          header.column.getCanSort()
                            ? `Ordenar por ${header.column.columnDef.header}`
                            : undefined
                        }
                      >
                        <span className="data-table__header-text">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="data-table__sort-icon">
                            {header.column.getIsSorted() === 'asc' ? '🔼' :
                             header.column.getIsSorted() === 'desc' ? '🔽' : '↕️'}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="data-table__tbody">
            {loading ? (
              // Skeleton rows durante loading
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="data-table__row data-table__row--skeleton">
                  {memoColumns.map((_, colIndex) => (
                    <td key={colIndex} className="data-table__td">
                      <div className="data-table__skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Filas reales
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="data-table__row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="data-table__td">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== INFORMACIÓN Y PAGINACIÓN ===== */}
      <div className="data-table__footer">
        <div className="data-table__info">
          <span className="data-table__results-count">
            {loading ? 'Cargando...' : (
              <>
                Mostrando {table.getRowModel().rows.length} de{' '}
                {table.getFilteredRowModel().rows.length} resultados
                {globalFilter && ` (filtrados de ${data.length} totales)`}
              </>
            )}
          </span>
        </div>

        <div className="data-table__pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
            aria-label="Página anterior"
          >
            ← Anterior
          </Button>
          
          <span className="data-table__page-info">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount() || 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
            aria-label="Página siguiente"
          >
            Siguiente →
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ActionsDropdown - Menú de acciones sin dependencias externas
 */
function ActionsDropdown({ row, onEdit, onDelete, onView }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action, actionFn) => {
    setIsOpen(false);
    if (actionFn) {
      actionFn(row);
    }
  };

  return (
    <div className="data-table__actions">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="data-table__actions-trigger"
        aria-label="Opciones de fila"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        ⋮
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="data-table__actions-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div 
            className="data-table__actions-menu"
            role="menu"
            aria-label="Acciones de fila"
          >
            {onView && (
              <button
                className="data-table__actions-item"
                onClick={() => handleAction('view', onView)}
                role="menuitem"
              >
                <span className="data-table__actions-icon">👁️</span>
                Ver detalle
              </button>
            )}
            
            {onEdit && (
              <button
                className="data-table__actions-item"
                onClick={() => handleAction('edit', onEdit)}
                role="menuitem"
              >
                <span className="data-table__actions-icon">✏️</span>
                Editar
              </button>
            )}
            
            {onDelete && (
              <button
                className="data-table__actions-item data-table__actions-item--danger"
                onClick={() => handleAction('delete', onDelete)}
                role="menuitem"
              >
                <span className="data-table__actions-icon">🗑️</span>
                Eliminar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export { DataTable };