// ===== DATA TABLE ORGANISM - CON COMPONENTES BUTTON =====
// src/components/organism/DataTable/DataTable.jsx

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

// Componentes del sistema de diseño
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Select } from '../../atoms/Select/Select';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { ActionsDropdown } from '../../molecules/ActionsDropdown/ActionsDropdown';

import './DataTable.css';

// Hook personalizado para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * DataTable - Organismo completo para mostrar datos tabulares
 * 
 * ✅ SISTEMA DE DISEÑO: Usa componente Button para todos los botones
 * ✅ CONSISTENCIA: Headers, paginación y acciones con mismo estilo
 * ✅ STORYBOOK: Solo componentes con stories
 */
function DataTable({
  // Props de datos
  data = [],
  columns = [],
  
  // Props de estado
  loading = false,
  error = null,
  deleting = null, // ID del elemento siendo eliminado
  
  // Props de acciones
  showActions = true,
  onEdit,
  onDelete,
  onView,
  actionsColumnHeader = 'Acciones',
  
  // Props de búsqueda y paginación
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 25,
  
  // Props de estados vacíos
  emptyTitle = 'No hay datos',
  emptyDescription = 'No se encontraron resultados',
  emptyIcon = "📋",
  emptyAction = null,
  
  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'
  
  ...restProps
}) {
  
  // Filtrar props que no deben ir al DOM
  const {
    data: _data,
    columns: _columns,
    loading: _loading,
    error: _error,
    deleting: _deleting,
    showActions: _showActions,
    onEdit: _onEdit,
    onDelete: _onDelete,
    onView: _onView,
    actionsColumnHeader: _actionsColumnHeader,
    searchable: _searchable,
    searchPlaceholder: _searchPlaceholder,
    pageSize: _pageSize,
    pageSizeOptions: _pageSizeOptions,
    defaultPageSize: _defaultPageSize,
    emptyTitle: _emptyTitle,
    emptyDescription: _emptyDescription,
    emptyIcon: _emptyIcon,
    emptyAction: _emptyAction,
    variant: _variant,
    ...domProps
  } = restProps;

  // ===== ESTADOS =====
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);
  const [currentPageSize, setCurrentPageSize] = useState(defaultPageSize || pageSize);

  // ===== COLUMNAS CON ACCIONES =====
  const actionColumn = useMemo(() => {
    if (!showActions) return null;
    
    return {
      id: 'actions',
      header: actionsColumnHeader,
      size: 120,
      cell: ({ row }) => {
        const isDeleting = deleting === row.original.id;
        
        // Crear array de acciones dinámicamente
        const actions = [];
        
        if (onView) {
          actions.push({
            label: 'Ver detalle',
            icon: '👁️',
            onClick: onView,
            description: 'Ver información completa',
            disabled: isDeleting
          });
        }
        
        if (onEdit) {
          actions.push({
            label: 'Editar',
            icon: '✏️', 
            onClick: onEdit,
            description: 'Modificar este elemento',
            disabled: isDeleting
          });
        }
        
        if (onDelete) {
          actions.push({
            label: isDeleting ? 'Eliminando...' : 'Eliminar',
            icon: isDeleting ? '⏳' : '🗑️',
            variant: 'danger',
            onClick: onDelete,
            description: 'Eliminar permanentemente',
            disabled: isDeleting
          });
        }

        return (
          <ActionsDropdown
            actions={actions}
            data={row.original}
            size="sm"
            position="bottom-right"
            disabled={loading || isDeleting}
          />
        );
      }
    };
  }, [showActions, onView, onEdit, onDelete, actionsColumnHeader, loading, deleting]);

  // ===== COLUMNAS MEMOIZADAS =====
  const memoColumns = useMemo(() => {
    const baseColumns = columns || [];
    return actionColumn ? [...baseColumns, actionColumn] : baseColumns;
  }, [columns, actionColumn]);

  // ===== CONFIGURACIÓN DE TABLA =====
  const table = useReactTable({
    data: data || [],
    columns: memoColumns,
    state: {
      globalFilter: debouncedGlobalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: currentPageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ===== ACTUALIZAR TAMAÑO DE PÁGINA =====
  React.useEffect(() => {
    table.setPageSize(currentPageSize);
  }, [currentPageSize, table]);

  // ===== RENDER DE ESTADO VACÍO =====
  if (!loading && (!data || data.length === 0) && !debouncedGlobalFilter) {
    return (
      <div className={`data-table data-table--empty data-table--${variant} ${className}`} {...domProps}>
        <div className="data-table__empty">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className={`data-table data-table--${variant} ${className}`} {...domProps}>
      {/* ===== CONTROLES SUPERIORES ===== */}
      {searchable && (
        <div className="data-table__controls">
          {/* Búsqueda */}
          <div className="data-table__search">
            <TextInput
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              leftIcon="🔍"
              size="sm"
              disabled={loading}
            />
          </div>

          {/* Selector de tamaño de página */}
          <div className="data-table__page-size">
            <Select
              value={currentPageSize}
              onChange={(e) => setCurrentPageSize(Number(e.target.value))}
              size="sm"
              disabled={loading}
              options={pageSizeOptions.map(size => ({
                value: size,
                label: `${size} filas`
              }))}
              placeholder="Tamaño"
            />
          </div>
        </div>
      )}

      {/* ===== TABLA ===== */}
      <div className="data-table__container">
        <table className="data-table__table">
          {/* ===== HEADER CON COMPONENTE BUTTON ===== */}
          <thead className="data-table__thead">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="data-table__header-row">
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className={`data-table__th ${
                      header.column.getCanSort() ? 'data-table__th--sortable' : ''
                    }`}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={header.column.getToggleSortingHandler()}
                          className="data-table__sort-button"
                          style={{
                            width: '100%',
                            justifyContent: 'space-between',
                            padding: 'var(--space-sm) var(--space-md)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--text-secondary)',
                            borderRadius: '0'
                          }}
                          rightIcon={
                            {
                              asc: '↑',
                              desc: '↓'
                            }[header.column.getIsSorted()] || '↕️'
                          }
                          ariaLabel={`Ordenar por ${header.column.id}`}
                          disabled={loading}
                        >
                          <span style={{ 
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                        </Button>
                      ) : (
                        <div style={{
                          padding: 'var(--space-sm) var(--space-md)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--text-secondary)',
                          textAlign: 'left'
                        }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ===== BODY ===== */}
          <tbody className="data-table__tbody">
            {loading ? (
              // Skeleton loading
              Array.from({ length: currentPageSize }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="data-table__row data-table__row--skeleton">
                  {memoColumns.map((_, colIndex) => (
                    <td key={`skeleton-cell-${index}-${colIndex}`} className="data-table__td">
                      <div className="data-table__skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Datos reales
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="data-table__row">
                  {row.getVisibleCells().map(cell => (
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

      {/* ===== PAGINACIÓN CON COMPONENTES BUTTON ===== */}
      {!loading && data && data.length > 0 && (
        <div className="data-table__footer">
          {/* Info de resultados */}
          <div className="data-table__info">
            <span className="data-table__info-text">
              Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} resultados
              {table.getFilteredRowModel().rows.length !== data.length && 
                ` (filtrados de ${data.length} totales)`
              }
            </span>
          </div>

          {/* ===== CONTROLES DE PAGINACIÓN CON BUTTON ===== */}
          <div className="data-table__pagination">
            {/* Botón Primera Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              ariaLabel="Primera página"
              icon="⏮️"
            />
            
            {/* Botón Página Anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              ariaLabel="Página anterior"
              icon="←"
            />
            
            {/* Información de página */}
            <span className="data-table__page-info">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            
            {/* Botón Página Siguiente */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              ariaLabel="Página siguiente"
              icon="→"
            />
            
            {/* Botón Última Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              ariaLabel="Última página"
              icon="⏭️"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };