// ===== DATA TABLE ORGANISM - FIXED PROPS =====
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
 * ✅ CORREGIDO: Props filtradas para evitar errores de DOM
 */
function DataTable({
  // Props de datos
  data = [],
  columns = [],
  
  // Props de estado
  loading = false,
  error = null,
  
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
  
  // ✅ PROPS DE ESTADOS VACÍOS - FILTRADAS
  emptyTitle = 'No hay datos',
  emptyDescription = 'No se encontraron resultados',
  emptyIcon = "📋",
  emptyAction = null,
  
  // Props de customización
  className = '',
  variant = 'default', // 'default' | 'striped' | 'bordered' | 'compact'
  
  // ✅ FILTRAR TODAS LAS PROPS PERSONALIZADAS
  ...restProps
}) {
  
  // ✅ FILTRAR PROPS QUE NO DEBEN IR AL DOM
  const {
    // Props de datos
    data: _data,
    columns: _columns,
    
    // Props de estado
    loading: _loading,
    error: _error,
    
    // Props de acciones
    showActions: _showActions,
    onEdit: _onEdit,
    onDelete: _onDelete,
    onView: _onView,
    actionsColumnHeader: _actionsColumnHeader,
    
    // Props de búsqueda y paginación
    searchable: _searchable,
    searchPlaceholder: _searchPlaceholder,
    pageSize: _pageSize,
    pageSizeOptions: _pageSizeOptions,
    defaultPageSize: _defaultPageSize,
    
    // Props de estados vacíos
    emptyTitle: _emptyTitle,
    emptyDescription: _emptyDescription,
    emptyIcon: _emptyIcon,
    emptyAction: _emptyAction,
    
    // Props de customización
    variant: _variant,
    
    ...domProps // ✅ Solo props válidas para el DOM
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
      cell: ({ row }) => {
        // Crear array de acciones dinámicamente
        const actions = [];
        
        if (onView) {
          actions.push({
            label: 'Ver detalle',
            icon: '👁️',
            onClick: onView,
            description: 'Ver información completa'
          });
        }
        
        if (onEdit) {
          actions.push({
            label: 'Editar',
            icon: '✏️', 
            onClick: onEdit,
            description: 'Modificar este elemento'
          });
        }
        
        if (onDelete) {
          actions.push({
            label: 'Eliminar',
            icon: '🗑️',
            variant: 'danger',
            onClick: onDelete,
            description: 'Eliminar permanentemente'
          });
        }

        return (
          <ActionsDropdown
            actions={actions}
            data={row.original}
            size="sm"
            variant="ghost"
            position="bottom-right"
            triggerLabel={`Acciones para fila ${row.index + 1}`}
          />
        );
      },
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
      pagination: { pageIndex: 0, pageSize: currentPageSize }
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: 0, pageSize: currentPageSize });
        setCurrentPageSize(newState.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ===== MANEJO DE ERRORES =====
  if (error) {
    return (
      <div 
        className={`data-table ${className}`} 
        {...domProps} // ✅ Solo props válidas del DOM
      >
        <div className="data-table__error">
          <EmptyState
            icon="❌"
            title="Error al cargar datos"
            description={error}
            action={
              <Button 
                variant="outline" 
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

  // ===== ESTADO VACÍO =====
  if (!loading && (!data || data.length === 0)) {
    return (
      <div 
        className={`data-table ${className}`} 
        {...domProps} // ✅ Solo props válidas del DOM
      >
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
    <div 
      className={`data-table data-table--${variant} ${className}`} 
      {...domProps} // ✅ Solo props válidas del DOM
    >
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
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} filas
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* ===== TABLA ===== */}
      <div className="data-table__container">
        <table className="data-table__table">
          {/* Header */}
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
                        <button
                          className="data-table__sort-button"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={`Ordenar por ${header.column.id}`}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="data-table__sort-indicator">
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? ' ↕️'}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
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

      {/* ===== PAGINACIÓN ===== */}
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

          {/* Controles de paginación */}
          <div className="data-table__pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Página anterior"
            >
              ←
            </Button>
            
            <span className="data-table__page-info">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Página siguiente"
            >
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };