import { useState } from 'react';

// Estilos CSS como objeto para el componente
const styles = {
  container: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    // Responsivo: padding menor en móviles
    '@media (max-width: 768px)': {
      padding: '1rem',
      margin: '0 1rem'
    }
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1.25rem',
      marginBottom: '1rem'
    }
  },
  fieldsGrid: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '1.5rem',
    // Los media queries se aplicarán dinámicamente
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'end'
  },
  label: {
    display: 'block',
    fontSize: '1.6rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem'
    }
  },
  required: {
    color: '#ef4444',
    marginLeft: '0.25rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1.4rem',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    outline: 'none',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0.625rem'
    }
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1.4rem',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    outline: 'none',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0.625rem'
    }
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1.4rem',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0.625rem',
      minHeight: '80px'
    }
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  checkbox: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '1.6rem',
    color: '#374151',
    cursor: 'pointer',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem'
    }
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  radioItem: {
    display: 'flex',
    alignItems: 'center'
  },
  radio: {
    width: '1.6rem',
    height: '1.6rem',
    marginRight: '0.5rem',
    cursor: 'pointer',
    // Responsivo: más pequeño en móviles
    '@media (max-width: 768px)': {
      width: '1.25rem',
      height: '1.25rem'
    }
  },
  radioLabel: {
    fontSize: '1.6rem',
    color: '#374151',
    cursor: 'pointer',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem'
    }
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1.6rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    // Responsivo: texto más pequeño en móviles
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      padding: '0.625rem 0.75rem'
    }
  },
  buttonHover: {
    backgroundColor: '#2563eb'
  },
  buttonFocus: {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic'
  }
};

// Hook personalizado para detectar el tamaño de pantalla
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useState(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

// Componente principal del formulario dinámico
const DynamicForm = ({ 
  fields = [], 
  onSubmit = () => {},
  columnsPerRow = 1,
  gap = '1rem',
  responsive = true,
  mobileColumns = 1,
  tabletColumns = 2,
  tabletBreakpoint = '768px',
  mobileBreakpoint = '480px'
}) => {
  // Estado para almacenar los valores de todos los campos
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
      
      // Inicializar con valores apropiados según el tipo
      switch (fieldType) {
        case 'checkbox':
          initialData[fieldName] = false;
          break;
        default:
          initialData[fieldName] = '';
      }
    });
    return initialData;
  });

  // Estados para manejar focus en los inputs
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);

  // Detectar tamaño de pantalla
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < parseInt(mobileBreakpoint)) return 'mobile';
      if (width < parseInt(tabletBreakpoint)) return 'tablet';
      return 'desktop';
    }
    return 'desktop';
  });

  // Efecto para actualizar el tamaño de pantalla
  useState(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < parseInt(mobileBreakpoint)) {
        setScreenSize('mobile');
      } else if (width < parseInt(tabletBreakpoint)) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar inmediatamente

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint, tabletBreakpoint]);

  // Función para obtener el número de columnas según el tamaño de pantalla
  const getResponsiveColumns = () => {
    if (!responsive) return columnsPerRow;
    
    switch (screenSize) {
      case 'mobile':
        return mobileColumns;
      case 'tablet':
        return tabletColumns;
      default:
        return columnsPerRow;
    }
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Función para obtener el grid template columns
  const getGridTemplateColumns = (columns) => {
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      width: '100%'
    };
  };

  // Función para obtener el grid column span de un campo
  const getFieldGridColumn = (field, totalColumns) => {
    const fieldWidth = typeof field === 'string' ? 'auto' : (field.width || 'auto');
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    
    // En móviles, forzar ciertos campos a ancho completo
    if (screenSize === 'mobile') {
      const mobileFullWidthTypes = ['textarea', 'checkbox', 'radio', 'select'];
      if (mobileFullWidthTypes.includes(fieldType) || fieldWidth === 'full') {
        return { gridColumn: '1 / -1' };
      }
      // En móvil, permitir que los campos normales ocupen 1 columna
      return { gridColumn: 'span 1' };
    }
    
    // Campos que ocupan ancho completo por defecto
    const fullWidthTypes = ['textarea', 'checkbox', 'radio'];
    
    if (fieldWidth === 'full' || fullWidthTypes.includes(fieldType)) {
      return { gridColumn: '1 / -1' };
    } else if (fieldWidth === 'half') {
      // En un grid de 2+ columnas, ocupa la mitad de las columnas disponibles
      const spanColumns = Math.max(1, Math.floor(totalColumns / 2));
      return totalColumns >= 2 ? { gridColumn: `span ${spanColumns}` } : { gridColumn: '1 / -1' };
    } else if (fieldWidth === 'third') {
      // En un grid de 3+ columnas, ocupa 1 columna
      const spanColumns = Math.max(1, Math.floor(totalColumns / 3));
      return totalColumns >= 3 ? { gridColumn: `span ${spanColumns}` } : { gridColumn: '1 / -1' };
    } else if (fieldWidth === 'two-thirds') {
      // En un grid de 3+ columnas, ocupa 2/3 de las columnas
      const spanColumns = Math.max(1, Math.floor((totalColumns * 2) / 3));
      return totalColumns >= 3 ? { gridColumn: `span ${spanColumns}` } : { gridColumn: '1 / -1' };
    }
    
    // Auto: ocupa 1 columna
    return { gridColumn: 'span 1' };
  };

  // Función para obtener estilos dinámicos
  const getInputStyles = (fieldName) => ({
    ...styles.input,
    ...(focusedField === fieldName ? styles.inputFocus : {}),
    // Aplicar estilos responsivos manualmente
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem',
      padding: '0.625rem'
    } : {})
  });

  const getSelectStyles = (fieldName) => ({
    ...styles.select,
    ...(focusedField === fieldName ? styles.inputFocus : {}),
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem',
      padding: '0.625rem'
    } : {})
  });

  const getTextareaStyles = (fieldName) => ({
    ...styles.textarea,
    ...(focusedField === fieldName ? styles.inputFocus : {}),
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem',
      padding: '0.625rem',
      minHeight: '80px'
    } : {})
  });

  const getButtonStyles = () => ({
    ...styles.button,
    ...(hoveredButton ? styles.buttonHover : {}),
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem',
      padding: '0.625rem 0.75rem'
    } : {})
  });

  const getLabelStyles = () => ({
    ...styles.label,
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem'
    } : {})
  });

  const getCheckboxLabelStyles = () => ({
    ...styles.checkboxLabel,
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem'
    } : {})
  });

  const getRadioLabelStyles = () => ({
    ...styles.radioLabel,
    ...(screenSize === 'mobile' ? {
      fontSize: '1rem'
    } : {})
  });

  const getRadioStyles = () => ({
    ...styles.radio,
    ...(screenSize === 'mobile' ? {
      width: '1.25rem',
      height: '1.25rem'
    } : {})
  });

  // Función para renderizar cada campo
  const renderField = (field, index) => {
    // Permite tanto strings simples como objetos con más configuración
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldLabel = typeof field === 'string' ? field : (field.label || field.name);
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    const fieldPlaceholder = typeof field === 'string' ? '' : (field.placeholder || '');
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldOptions = typeof field === 'string' ? [] : (field.options || []);

    const currentColumns = getResponsiveColumns();

    const renderInput = () => {
      switch (fieldType) {
        case 'select':
          return (
            <select
              id={fieldName}
              value={formData[fieldName] || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onFocus={() => setFocusedField(fieldName)}
              onBlur={() => setFocusedField(null)}
              required={fieldRequired}
              style={getSelectStyles(fieldName)}
            >
              <option value="">{fieldPlaceholder || 'Selecciona una opción'}</option>
              {fieldOptions.map((option, optIndex) => (
                <option key={optIndex} value={typeof option === 'string' ? option : option.value}>
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </select>
          );
        
        case 'textarea':
          return (
            <textarea
              id={fieldName}
              value={formData[fieldName] || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onFocus={() => setFocusedField(fieldName)}
              onBlur={() => setFocusedField(null)}
              placeholder={fieldPlaceholder}
              required={fieldRequired}
              rows={screenSize === 'mobile' ? 3 : 4}
              style={getTextareaStyles(fieldName)}
            />
          );
        
        case 'checkbox':
          return (
            <div style={styles.checkboxContainer}>
              <input
                id={fieldName}
                type="checkbox"
                checked={formData[fieldName] || false}
                onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                required={fieldRequired}
                style={styles.checkbox}
              />
              <label htmlFor={fieldName} style={getCheckboxLabelStyles()}>
                {fieldPlaceholder || 'Marcar si aplica'}
              </label>
            </div>
          );
        
        case 'radio':
          return (
            <div style={styles.radioContainer}>
              {fieldOptions.map((option, optIndex) => (
                <div key={optIndex} style={styles.radioItem}>
                  <input
                    id={`${fieldName}_${optIndex}`}
                    type="radio"
                    name={fieldName}
                    value={typeof option === 'string' ? option : option.value}
                    checked={formData[fieldName] === (typeof option === 'string' ? option : option.value)}
                    onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    required={fieldRequired}
                    style={getRadioStyles()}
                  />
                  <label htmlFor={`${fieldName}_${optIndex}`} style={getRadioLabelStyles()}>
                    {typeof option === 'string' ? option : option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        
        default:
          return (
            <input
              id={fieldName}
              type={fieldType}
              value={formData[fieldName] || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onFocus={() => setFocusedField(fieldName)}
              onBlur={() => setFocusedField(null)}
              placeholder={fieldPlaceholder}
              required={fieldRequired}
              style={getInputStyles(fieldName)}
            />
          );
      }
    };

    return (
      <div 
        key={index} 
        style={{
          ...styles.fieldContainer,
          ...getFieldGridColumn(field, currentColumns)
        }}
      >
        {fieldType !== 'checkbox' && (
          <label htmlFor={fieldName} style={getLabelStyles()}>
            {fieldLabel}
            {fieldRequired && <span style={styles.required}>*</span>}
          </label>
        )}
        {renderInput()}
      </div>
    );
  };

  const currentColumns = getResponsiveColumns();
  const responsiveGap = screenSize === 'mobile' ? '0.75rem' : gap;

  return (
    <div style={{
      ...styles.container,
      ...(screenSize === 'mobile' ? {
        padding: '1rem',
        margin: '0 1rem'
      } : {})
    }}>      
      {fields.length === 0 ? (
        <p style={styles.emptyMessage}>No hay campos para mostrar</p>
      ) : (
        <>
          <div 
            style={{
              ...styles.fieldsGrid,
              ...getGridTemplateColumns(currentColumns),
              gap: responsiveGap
            }}
          >
            {fields.map((field, index) => renderField(field, index))}
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            onFocus={() => setHoveredButton(true)}
            onBlur={() => setHoveredButton(false)}
            style={getButtonStyles()}
          >
            Enviar Formulario
          </button>
        </>
      )}
      
      {/* Indicador de pantalla actual (solo para desarrollo) */}
      {/* <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#3b82f6',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        {screenSize} ({currentColumns} cols)
      </div> */}
    </div>
  );
};

export {DynamicForm};