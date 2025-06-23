// ===== DATA TABLE ORGANISM - ACTUALIZADO CON ACTIONS DROPDOWN =====
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
import { ActionsDropdown } from '../../molecules/ActionsDropdown/ActionsDropdown'; // ✅ NUEVO IMPORT

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
 * ✅ ACTUALIZADO: Ahora usa ActionsDropdown independiente con story
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos a mostrar en la tabla
 * @param {Array} props.columns - Configuración de columnas (TanStack format)
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.showActions - Mostrar columna de acciones
 * @param {function} props.onEdit - Callback para editar fila
 * @param {function} props.onDelete - Callback para eliminar fila
 * @param {function} props.onView - Callback para ver fila
 * @param {string} props.searchPlaceholder - Placeholder del campo de búsqueda
 * @param {Array} props.pageSizeOptions - Opciones de tamaño de página
 * @param {number} props.defaultPageSize - Tamaño inicial de página
 * @param {string} props.variant - Variante visual
 * @param {string} props.emptyTitle - Título del estado vacío
 * @param {string} props.emptyDescription - Descripción del estado vacío
 * @param {string} props.emptyIcon - Ícono del estado vacío
 * @param {string} props.className - Clases CSS adicionales
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
  searchPlaceholder = 'Buscar...',
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 25,
  
  // Props de estados vacíos
  emptyTitle = 'No hay datos',
  emptyDescription = 'No se encontraron resultados',
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

  // ===== COLUMNAS CON ACCIONES - ACTUALIZADO =====
  const actionColumn = useMemo(() => {
    if (!showActions) return null;
    
    // ✅ ACTUALIZADO: Usar ActionsDropdown independiente
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ===== MANEJO DE ERRORES =====
  if (error) {
    return (
      <div className={`data-table ${className}`} {...restProps}>
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
      <div className={`data-table ${className}`} {...restProps}>
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
    <div className={`data-table data-table--${variant} ${className}`} {...restProps}>
      {/* ===== CONTROLES SUPERIORES ===== */}
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
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
                          className="data-table__header-button"
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={loading}
                          aria-label={`Ordenar por ${header.column.columnDef.header}`}
                        >
                          <span className="data-table__header-text">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          <span className="data-table__sort-icon">
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted()] ?? '↕️'}
                          </span>
                        </button>
                      ) : (
                        <div className="data-table__header-button" style={{ cursor: 'default' }}>
                          <span className="data-table__header-text">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                        </div>
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
              Array.from({ length: pageSize }).map((_, index) => (
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