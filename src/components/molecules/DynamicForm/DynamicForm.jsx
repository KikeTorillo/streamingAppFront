// molecules/DynamicForm.jsx
import { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button/Button';
import { TextInput } from '../TextInput/TextInput';
import './DynamicForm.css';

/**
 * Formulario dinámico integrado con el sistema de diseño
 * Molécula que genera campos automáticamente usando TextInput y Button del sistema
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.fields=[]] - Array de configuración de campos
 * @param {function} [props.onSubmit] - Función a ejecutar al enviar
 * @param {function} [props.onChange] - Función a ejecutar cuando cambian los datos
 * @param {number} [props.columnsPerRow=1] - Columnas en desktop
 * @param {boolean} [props.responsive=true] - Si es responsive
 * @param {number} [props.mobileColumns=1] - Columnas en móvil
 * @param {number} [props.tabletColumns=2] - Columnas en tablet
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {boolean} [props.showSubmitButton=true] - Mostrar botón enviar
 * @param {string} [props.submitText='Enviar'] - Texto del botón
 * @param {'primary'|'secondary'|'success'|'danger'|'outline'|'ghost'|'warning'} [props.submitVariant='primary'] - Variante del botón
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.submitSize='lg'] - Tamaño del botón
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.submitRounded='lg'] - Border radius del botón
 * @param {string|React.ReactNode} [props.submitIcon] - Icono del botón de envío
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Deshabilitar todo el formulario
 * @param {Object} [props.initialData={}] - Datos iniciales del formulario
 * @param {boolean} [props.validateOnChange=false] - Validar en tiempo real
 * @param {boolean} [props.compact=false] - Versión compacta
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.fieldSize='md'] - Tamaño de campos
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.fieldRounded='md'] - Border radius de campos
 */
const DynamicForm = ({ 
  fields = [], 
  onSubmit = () => {},
  onChange = () => {},
  columnsPerRow = 1,
  responsive = true,
  mobileColumns = 1,
  tabletColumns = 2,
  className = '',
  showSubmitButton = true,
  submitText = 'Enviar',
  submitVariant = 'primary',
  submitSize = 'lg',
  submitRounded = 'lg',
  submitIcon,
  loading = false,
  disabled = false,
  initialData = {},
  validateOnChange = false,
  compact = false,
  fieldSize = 'md',
  fieldRounded = 'md'
}) => {
  // Estado para almacenar los valores de todos los campos
  const [formData, setFormData] = useState(() => {
    const initialFormData = { ...initialData };
    
    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
      const defaultValue = typeof field === 'string' ? '' : (field.defaultValue || '');
      
      // Solo usar defaultValue si no hay dato inicial
      if (!(fieldName in initialFormData)) {
        switch (fieldType) {
          case 'checkbox':
            initialFormData[fieldName] = defaultValue || false;
            break;
          default:
            initialFormData[fieldName] = defaultValue;
        }
      }
    });
    
    return initialFormData;
  });

  // Estados para validación
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Detectar tamaño de pantalla usando breakpoints del sistema
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile breakpoint del sistema
        setScreenSize('mobile');
      } else if (width < 1024) { // Tablet breakpoint del sistema
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efecto para notificar cambios en los datos
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

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

  // Función para validar un campo
  const validateField = (field, value) => {
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldValidation = typeof field === 'string' ? null : field.validation;
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    
    if (fieldRequired && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido';
    }
    
    // Validaciones por tipo usando las mismas que TextInput
    if (value && value.toString().trim() !== '') {
      switch (fieldType) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Ingresa un email válido';
          }
          break;
        case 'tel':
          if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
            return 'Ingresa un número de teléfono válido';
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            return 'Ingresa una URL válida';
          }
          break;
      }
    }
    
    // Validación personalizada
    if (fieldValidation && typeof fieldValidation === 'function') {
      const result = fieldValidation(value);
      if (result !== true) return result;
    }
    
    return null;
  };

  // Función para manejar cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validación en tiempo real si está habilitada
    if (validateOnChange || touched[fieldName]) {
      const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
      const error = validateField(field, value);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName] = error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    }
  };

  // Función para manejar blur de campos
  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
    const value = formData[fieldName];
    const error = validateField(field, value);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (loading || disabled) return;

    // Validar todos los campos
    const newErrors = {};
    const allTouched = {};
    
    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const value = formData[fieldName];
      const error = validateField(field, value);
      
      allTouched[fieldName] = true;
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setTouched(allTouched);

    // Si no hay errores, enviar
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Función para obtener clases de grid column
  const getFieldGridClasses = (field) => {
    const fieldWidth = typeof field === 'string' ? 'auto' : (field.width || 'auto');
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    
    const classes = ['dynamic-form__field'];
    
    // Agregar clase de tipo
    classes.push(`dynamic-form__field--${fieldType}`);
    
    // Agregar clase de ancho
    if (fieldWidth !== 'auto') {
      classes.push(`dynamic-form__field--${fieldWidth}`);
    }
    
    return classes;
  };

  // Función para renderizar cada campo
  const renderField = (field, index) => {
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldLabel = typeof field === 'string' ? field : (field.label || field.name);
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    const fieldPlaceholder = typeof field === 'string' ? '' : (field.placeholder || '');
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldOptions = typeof field === 'string' ? [] : (field.options || []);
    const fieldDisabled = typeof field === 'string' ? false : (field.disabled || disabled);
    const fieldHelperText = typeof field === 'string' ? null : field.helperText;
    const fieldLeftIcon = typeof field === 'string' ? null : field.leftIcon;
    const fieldRightIcon = typeof field === 'string' ? null : field.rightIcon;
    const fieldMaxLength = typeof field === 'string' ? null : field.maxLength;
    const fieldShowCharCount = typeof field === 'string' ? false : field.showCharCount;

    const fieldError = errors[fieldName];
    const fieldTouched = touched[fieldName];
    const hasError = fieldError && fieldTouched;

    const fieldClasses = getFieldGridClasses(field);

    // Para campos que TextInput puede manejar directamente
    if (['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'].includes(fieldType)) {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <TextInput
            type={fieldType}
            name={fieldName}
            label={fieldLabel}
            placeholder={fieldPlaceholder}
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
            errorText={hasError ? fieldError : ''}
            helperText={!hasError ? fieldHelperText : ''}
            leftIcon={fieldLeftIcon}
            rightIcon={fieldRightIcon}
            maxLength={fieldMaxLength}
            showCharCount={fieldShowCharCount}
            size={fieldSize}
            rounded={fieldRounded}
            compact={compact}
            fullWidth
            variant={hasError ? 'error' : 'default'}
            autoComplete={fieldType === 'email' ? 'email' : fieldType === 'tel' ? 'tel' : undefined}
          />
        </div>
      );
    }

    // Para campos checkbox
    if (fieldType === 'checkbox') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <div className="dynamic-form__checkbox-container">
            <input
              id={fieldName}
              type="checkbox"
              className="dynamic-form__checkbox"
              checked={formData[fieldName] || false}
              onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
              onBlur={() => handleFieldBlur(fieldName)}
              required={fieldRequired}
              disabled={fieldDisabled}
            />
            <label 
              htmlFor={fieldName} 
              className="dynamic-form__checkbox-label"
            >
              {fieldLabel}
              {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
            </label>
          </div>
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Para campos radio
    if (fieldType === 'radio') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <div className="dynamic-form__radio-container">
            {fieldOptions.map((option, optIndex) => (
              <div key={optIndex} className="dynamic-form__radio-item">
                <input
                  id={`${fieldName}_${optIndex}`}
                  type="radio"
                  name={fieldName}
                  className="dynamic-form__radio"
                  value={typeof option === 'string' ? option : option.value}
                  checked={formData[fieldName] === (typeof option === 'string' ? option : option.value)}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  onBlur={() => handleFieldBlur(fieldName)}
                  required={fieldRequired}
                  disabled={fieldDisabled}
                />
                <label 
                  htmlFor={`${fieldName}_${optIndex}`} 
                  className="dynamic-form__radio-label"
                >
                  {typeof option === 'string' ? option : option.label}
                </label>
              </div>
            ))}
          </div>
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Para campos select
    if (fieldType === 'select') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label htmlFor={fieldName} className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <select
            id={fieldName}
            className="dynamic-form__select"
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
          >
            <option value="">{fieldPlaceholder || 'Selecciona una opción'}</option>
            {fieldOptions.map((option, optIndex) => (
              <option 
                key={optIndex} 
                value={typeof option === 'string' ? option : option.value}
              >
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </select>
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Para campos textarea - usar TextInput si es compatible o crear uno custom
    if (fieldType === 'textarea') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label htmlFor={fieldName} className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <textarea
            id={fieldName}
            className="dynamic-form__textarea"
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            placeholder={fieldPlaceholder}
            required={fieldRequired}
            disabled={fieldDisabled}
            rows={4}
            maxLength={fieldMaxLength}
          />
          {fieldMaxLength && fieldShowCharCount && (
            <div className="dynamic-form__char-count">
              {(formData[fieldName] || '').length}/{fieldMaxLength}
            </div>
          )}
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Fallback para tipos no reconocidos
    return null;
  };

  const currentColumns = getResponsiveColumns();
  const formClasses = [
    'dynamic-form',
    loading && 'dynamic-form--loading',
    compact && 'dynamic-form--compact',
    className
  ].filter(Boolean).join(' ');

  const gridClasses = [
    'dynamic-form__grid',
    `dynamic-form__grid--${currentColumns}-cols`
  ].join(' ');

  return (
    <div className={formClasses}>      
      {fields.length === 0 ? (
        <p className="dynamic-form__empty-message">
          No hay campos para mostrar
        </p>
      ) : (
        <>
          <div 
            className={gridClasses}
            style={{
              gridTemplateColumns: `repeat(${currentColumns}, 1fr)`
            }}
          >
            {fields.map((field, index) => renderField(field, index))}
          </div>
          
          {showSubmitButton && (
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              disabled={disabled || Object.keys(errors).length > 0}
              fullWidth
              variant={submitVariant}
              size={submitSize}
              rounded={submitRounded}
              icon={submitIcon}
            >
              {submitText}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export { DynamicForm };