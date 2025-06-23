// ===== ACTIONS DROPDOWN COMPONENT =====
// src/components/molecules/ActionsDropdown/ActionsDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../atoms/Button/Button';
import './ActionsDropdown.css';

/**
 * ActionsDropdown - Menú desplegable de acciones para filas de tablas
 * 
 * Molécula que combina:
 * - Button (átomo) como trigger
 * - Menu nativo como dropdown
 * - Backdrop para cerrar
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.actions - Array de acciones [{label, icon, onClick, variant}]
 * @param {Object} props.data - Datos de la fila (se pasan a onClick de cada acción)
 * @param {string} props.size - Tamaño del trigger button ['xs', 'sm', 'md', 'lg']
 * @param {string} props.variant - Variante del trigger ['ghost', 'outline']
 * @param {string} props.position - Posición del menu ['bottom-right', 'bottom-left', 'top-right', 'top-left']
 * @param {boolean} props.disabled - Si el dropdown está deshabilitado
 * @param {string} props.triggerIcon - Ícono del trigger button
 * @param {string} props.triggerLabel - Label del trigger button (para accesibilidad)
 * @param {function} props.onOpen - Callback cuando se abre el menu
 * @param {function} props.onClose - Callback cuando se cierra el menu
 */
function ActionsDropdown({ 
  actions = [],
  data = {},
  size = 'sm',
  variant = 'ghost',
  position = 'bottom-right',
  disabled = false,
  triggerIcon = '⋮',
  triggerLabel = 'Opciones',
  onOpen,
  onClose
}) {
  // ===== ESTADOS =====
  const [isOpen, setIsOpen] = useState(false);
  
  // ===== REFS =====
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // ===== EFECTOS =====
  
  /**
   * Manejo de clicks fuera del componente
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Manejo de teclas (Escape, Enter, flechas)
   */
  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleClose();
          triggerRef.current?.focus();
          break;
        
        case 'ArrowDown':
          event.preventDefault();
          focusNextItem();
          break;
        
        case 'ArrowUp':
          event.preventDefault();
          focusPrevItem();
          break;
        
        case 'Home':
          event.preventDefault();
          focusFirstItem();
          break;
        
        case 'End':
          event.preventDefault();
          focusLastItem();
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // ===== FUNCIONES =====

  /**
   * Abrir el menú
   */
  const handleOpen = () => {
    if (disabled) return;
    
    setIsOpen(true);
    onOpen?.(data);
    
    // Focus en el primer item después de abrir
    setTimeout(() => {
      focusFirstItem();
    }, 0);
  };

  /**
   * Cerrar el menú
   */
  const handleClose = () => {
    setIsOpen(false);
    onClose?.(data);
  };

  /**
   * Toggle del menú
   */
  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  /**
   * Manejar acción clickeada
   */
  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick(data);
    }
    handleClose();
  };

  /**
   * Funciones de navegación por teclado
   */
  const getMenuItems = () => {
    return menuRef.current?.querySelectorAll('.actions-dropdown__item:not([disabled])') || [];
  };

  const focusFirstItem = () => {
    const items = getMenuItems();
    if (items.length > 0) {
      items[0].focus();
    }
  };

  const focusLastItem = () => {
    const items = getMenuItems();
    if (items.length > 0) {
      items[items.length - 1].focus();
    }
  };

  const focusNextItem = () => {
    const items = getMenuItems();
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    const nextIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1;
    items[nextIndex]?.focus();
  };

  const focusPrevItem = () => {
    const items = getMenuItems();
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    const prevIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
    items[prevIndex]?.focus();
  };

  // ===== VALIDACIONES =====
  if (!actions || actions.length === 0) {
    return null;
  }

  // ===== RENDER =====
  return (
    <div 
      className="actions-dropdown" 
      ref={dropdownRef}
      role="group" 
      aria-label={triggerLabel}
    >
      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        variant={variant}
        size={size}
        onClick={handleToggle}
        disabled={disabled}
        className="actions-dropdown__trigger"
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        id={`actions-dropdown-trigger-${data.id || 'default'}`}
      >
        {triggerIcon}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="actions-dropdown__backdrop"
            onClick={handleClose}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div 
            ref={menuRef}
            className={`actions-dropdown__menu actions-dropdown__menu--${position}`}
            role="menu"
            aria-labelledby={`actions-dropdown-trigger-${data.id || 'default'}`}
          >
            {actions.map((action, index) => (
              <button
                key={action.key || index}
                className={`actions-dropdown__item ${
                  action.variant === 'danger' ? 'actions-dropdown__item--danger' : ''
                } ${action.disabled ? 'actions-dropdown__item--disabled' : ''}`}
                onClick={() => !action.disabled && handleAction(action)}
                disabled={action.disabled}
                role="menuitem"
                tabIndex={-1}
                title={action.description || action.label}
              >
                {action.icon && (
                  <span className="actions-dropdown__icon" aria-hidden="true">
                    {action.icon}
                  </span>
                )}
                <span className="actions-dropdown__label">
                  {action.label}
                </span>
                {action.shortcut && (
                  <span className="actions-dropdown__shortcut" aria-hidden="true">
                    {action.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { ActionsDropdown };