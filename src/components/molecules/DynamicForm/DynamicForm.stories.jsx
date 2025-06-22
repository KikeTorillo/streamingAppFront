import React, { useState } from 'react';
import { DynamicForm } from './DynamicForm';
import './DynamicForm.css';

export default {
  title: 'Components/Molecules/DynamicForm',
  component: DynamicForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# DynamicForm Molecule - Sistema de Diseño Integrado

La molécula **DynamicForm** es un generador automático de formularios **completamente integrado** con nuestro sistema de diseño. 
Utiliza **TextInput** y **Button** del sistema, manteniendo total consistencia visual y funcional.

## 🎯 Características principales

- **Integración completa**: Usa TextInput y Button del sistema de diseño
- **Generación automática**: Crea formularios basados en configuración JSON
- **Tipos de campo**: Text, Email, Password, Number, Tel, URL, Textarea, Select, Checkbox, Radio
- **Validación avanzada**: Validación por tipo, personalizada y en tiempo real
- **Layout responsive**: 1-4 columnas adaptativas según dispositivo
- **Estados completos**: Loading, disabled, error, success con animaciones
- **Accesibilidad completa**: ARIA, navegación por teclado, screen readers
- **Theming automático**: Variables CSS del sistema, modo oscuro nativo

## 🏗️ Arquitectura Atomic Design Mejorada

Como **molécula integrada**:
- ✅ **Reutiliza TextInput**: Para text, email, password, number, tel, url, search, date, time
- ✅ **Reutiliza Button**: Para envío con todas las variantes y opciones
- ✅ **Componentes nativos**: Select, textarea, checkbox, radio homologados
- ✅ **Lógica compleja**: Estado, validación, layout responsive
- ✅ **Herencia de props**: fieldSize, fieldRounded, submitVariant, etc.

## 📱 Sistema de diseño heredado

Hereda automáticamente del sistema:
- **Variables CSS**: Espaciado, tipografía, colores, transiciones
- **Responsive**: Breakpoints estándar (768px, 1024px) 
- **Modo oscuro**: Automático con clase \`.dark\`
- **Área táctil**: Mínimo 44px en móviles
- **Validación**: Estados visuales consistentes

## 🔧 Uso básico mejorado

\`\`\`jsx
import { DynamicForm } from './molecules/DynamicForm';

// Formulario usando TextInput del sistema
const modernFields = [
  { 
    name: 'email', 
    type: 'email', 
    label: 'Correo electrónico',
    leftIcon: '📧',
    rightIcon: '✅',
    helperText: 'Te contactaremos a este email',
    required: true,
    showCharCount: true,
    maxLength: 50
  },
  { 
    name: 'password', 
    type: 'password',
    label: 'Contraseña',
    leftIcon: '🔒',
    helperText: 'Mínimo 8 caracteres',
    required: true,
    validation: (value) => value.length >= 8 || 'Muy corta'
  }
];

<DynamicForm 
  fields={modernFields}
  columnsPerRow={2}
  fieldSize="lg"              // Heredado de TextInput
  fieldRounded="xl"           // Heredado de TextInput  
  submitVariant="success"     // Heredado de Button
  submitSize="lg"             // Heredado de Button
  submitRounded="xl"          // Heredado de Button
  submitIcon="🚀"             // Heredado de Button
  validateOnChange
  onSubmit={handleSubmit}
/>
\`\`\`

## 📋 Configuración de campos mejorada

\`\`\`jsx
const fieldConfig = {
  // Básico
  name: 'fieldName',           // Requerido: nombre único
  type: 'text',                // Tipo de campo
  label: 'Mi Campo',           // Label visible
  placeholder: 'Placeholder',  // Texto de ayuda
  required: false,             // Si es obligatorio
  disabled: false,             // Si está deshabilitado
  defaultValue: '',            // Valor inicial
  width: 'auto',               // Ancho: auto, full, half, third, two-thirds
  
  // Para TextInput (text, email, password, etc.)
  leftIcon: '🔍',              // Icono izquierdo (emoji, clase CSS, componente)
  rightIcon: '✅',             // Icono derecho
  helperText: 'Texto de ayuda',// Mensaje informativo
  maxLength: 100,              // Longitud máxima
  showCharCount: true,         // Mostrar contador
  
  // Para select/radio
  options: ['opt1', 'opt2'],   // Opciones disponibles
  
  // Validación personalizada
  validation: (value) => {
    if (value.length < 3) return 'Mínimo 3 caracteres';
    return true; // O string con error
  }
};
\`\`\`

## 🎨 Props heredadas del sistema

El DynamicForm extiende las capacidades del sistema:

### **Props de campos (aplican a TextInput):**
- \`fieldSize\`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- \`fieldRounded\`: 'sm' | 'md' | 'lg' | 'xl' | 'full'

### **Props de botón (aplican a Button):**
- \`submitVariant\`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'warning'
- \`submitSize\`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- \`submitRounded\`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- \`submitIcon\`: Icono del botón (igual que Button)

## ♿ Accesibilidad heredada

- **TextInput**: ARIA completo, live regions, validación HTML5
- **Button**: Estados, focus management, área táctil
- **Formulario**: Navegación por teclado, screen readers
- **Móvil**: Área táctil 44px, sin zoom iOS

## 🎭 Integración perfecta

**TextInput se usa para:**
- text, email, password, number, tel, url, search, date, time, datetime-local
- ✅ Todos sus props están disponibles: leftIcon, rightIcon, helperText, maxLength, showCharCount, etc.

**Componentes nativos homologados:**
- select, textarea, checkbox, radio
- ✅ Estilos consistentes con las variables del sistema
- ✅ Estados de hover, focus, disabled idénticos
        `
      }
    }
  },
  argTypes: {
    fields: {
      name: 'Campos',
      description: 'Array de configuración de campos con soporte completo para TextInput',
      control: 'object',
      table: {
        type: { summary: 'Array<FieldConfig>' }
      }
    },
    columnsPerRow: {
      name: 'Columnas por fila',
      description: 'Número de columnas en desktop',
      control: { type: 'range', min: 1, max: 4, step: 1 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' }
      }
    },
    fieldSize: {
      name: 'Tamaño de campos',
      description: 'Tamaño heredado para todos los TextInput',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    fieldRounded: {
      name: 'Border radius de campos',
      description: 'Border radius heredado para todos los TextInput',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    submitVariant: {
      name: 'Variante del botón',
      description: 'Variante visual del botón de envío (heredado de Button)',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost', 'warning'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'primary'" }
      }
    },
    submitSize: {
      name: 'Tamaño del botón',
      description: 'Tamaño del botón de envío (heredado de Button)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'lg'" }
      }
    },
    submitRounded: {
      name: 'Border radius del botón',
      description: 'Border radius del botón de envío (heredado de Button)',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'lg'" }
      }
    },
    submitIcon: {
      name: 'Icono del botón',
      description: 'Icono del botón de envío (heredado de Button)',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    responsive: {
      name: 'Responsive',
      description: 'Activar comportamiento responsive automático',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    validateOnChange: {
      name: 'Validar en tiempo real',
      description: 'Validar campos mientras el usuario escribe',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Estado de carga del formulario',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilitar todo el formulario',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Versión compacta con espaciado reducido',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onSubmit: {
      name: 'Función onSubmit',
      description: 'Función ejecutada al enviar el formulario',
      action: 'submitted',
      table: {
        type: { summary: 'function' }
      }
    },
    onChange: {
      name: 'Función onChange',
      description: 'Función ejecutada cuando cambian los datos',
      action: 'changed',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = {
  args: {
    fields: [
      { 
        name: 'nombre', 
        label: 'Nombre completo', 
        placeholder: 'Tu nombre...',
        leftIcon: '👤',
        required: true 
      },
      { 
        name: 'email', 
        type: 'email', 
        label: 'Email', 
        placeholder: 'tu@ejemplo.com',
        leftIcon: '📧',
        rightIcon: '✅',
        helperText: 'Te enviaremos confirmaciones aquí',
        required: true 
      }
    ],
    columnsPerRow: 1,
    fieldSize: 'md',
    fieldRounded: 'md',
    submitVariant: 'primary',
    submitSize: 'lg',
    submitRounded: 'lg',
    responsive: true,
    validateOnChange: false,
    submitText: 'Enviar formulario'
  },
  parameters: {
    docs: {
      description: {
        story: 'Experimenta con todas las opciones del DynamicForm integrado. Los campos usan TextInput y el botón usa Button del sistema.'
      }
    }
  }
};

// ========== INTEGRACIÓN CON TEXTINPUT ==========

export const TextInputIntegration = () => {
  const [formData, setFormData] = useState({});

  const textInputFields = [
    { 
      name: 'username', 
      label: 'Nombre de usuario',
      placeholder: 'usuario123',
      leftIcon: '👤',
      rightIcon: '✅',
      helperText: 'Será visible para otros usuarios',
      maxLength: 20,
      showCharCount: true,
      required: true,
      validation: (value) => {
        if (value.length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y _';
        return true;
      }
    },
    { 
      name: 'email', 
      type: 'email',
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      leftIcon: '📧',
      helperText: 'Mantendremos tu email privado',
      required: true
    },
    { 
      name: 'password', 
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      leftIcon: '🔒',
      helperText: 'Usa una contraseña segura',
      maxLength: 50,
      showCharCount: true,
      required: true,
      validation: (value) => {
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/(?=.*[a-z])/.test(value)) return 'Necesita una minúscula';
        if (!/(?=.*[A-Z])/.test(value)) return 'Necesita una mayúscula';
        if (!/(?=.*\d)/.test(value)) return 'Necesita un número';
        return true;
      }
    },
    { 
      name: 'phone', 
      type: 'tel',
      label: 'Teléfono',
      placeholder: '+52 555 123 4567',
      leftIcon: '📞',
      helperText: 'Opcional, para notificaciones importantes'
    },
    { 
      name: 'website', 
      type: 'url',
      label: 'Sitio web',
      placeholder: 'https://tuportfolio.com',
      leftIcon: '🌐',
      helperText: 'Tu portfolio o sitio personal',
      validation: (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return 'URL inválida';
        }
      }
    }
  ];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)', 
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        Integración con TextInput
      </h3>
      <p style={{ 
        marginBottom: 'var(--space-xl)', 
        color: 'var(--text-muted)',
        fontSize: 'var(--font-size-sm)'
      }}>
        Estos campos usan el componente TextInput del sistema con todas sus funcionalidades: iconos, validación, contador de caracteres, etc.
      </p>
      <DynamicForm
        fields={textInputFields}
        columnsPerRow={1}
        fieldSize="lg"
        fieldRounded="lg"
        validateOnChange
        onSubmit={(data) => {
          console.log('Datos con TextInput:', data);
          alert('¡Formulario enviado! Revisa la consola.');
        }}
        onChange={setFormData}
        submitText="Crear cuenta"
        submitVariant="success"
        submitSize="lg"
        submitRounded="lg"
        submitIcon="🚀"
      />
    </div>
  );
};
TextInputIntegration.parameters = {
  docs: {
    description: {
      story: 'Demostración completa de la integración con TextInput. Todos los campos text/email/password/tel/url usan TextInput con iconos, validación y funcionalidades avanzadas.'
    }
  }
};

// ========== HERENCIA DE PROPS DEL SISTEMA ==========

export const SystemPropsInheritance = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Campos Pequeños + Botón Outline
      </h4>
      <DynamicForm
        fields={[
          { name: 'busqueda', label: 'Buscar', leftIcon: '🔍', placeholder: 'Buscar...' },
          { name: 'filtro', type: 'select', label: 'Filtro', options: ['Todos', 'Activos'] }
        ]}
        columnsPerRow={2}
        fieldSize="sm"
        fieldRounded="full"
        submitVariant="outline"
        submitSize="sm"
        submitRounded="full"
        submitText="Buscar"
        submitIcon="🔍"
        showSubmitButton={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Campos Grandes + Botón Success
      </h4>
      <DynamicForm
        fields={[
          { 
            name: 'title', 
            label: 'Título del proyecto',
            leftIcon: '📝',
            rightIcon: '✅',
            helperText: 'Será visible para todo el equipo',
            maxLength: 100,
            showCharCount: true
          },
          { 
            name: 'description', 
            type: 'textarea', 
            label: 'Descripción',
            helperText: 'Describe brevemente el proyecto',
            width: 'full'
          }
        ]}
        columnsPerRow={1}
        fieldSize="xl"
        fieldRounded="xl"
        submitVariant="success"
        submitSize="xl"
        submitRounded="xl"
        submitText="Crear proyecto"
        submitIcon="🎯"
        showSubmitButton={true}
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estilo Danger + Border Radius Completo
      </h4>
      <DynamicForm
        fields={[
          { 
            name: 'confirm_delete', 
            label: 'Confirmar eliminación',
            placeholder: 'Escribe "ELIMINAR" para confirmar',
            leftIcon: '⚠️',
            required: true,
            validation: (value) => value === 'ELIMINAR' || 'Debes escribir exactamente "ELIMINAR"'
          }
        ]}
        columnsPerRow={1}
        fieldSize="md"
        fieldRounded="full"
        submitVariant="danger"
        submitSize="lg"
        submitRounded="full"
        submitText="Eliminar permanentemente"
        submitIcon="🗑️"
        showSubmitButton={true}
      />
    </div>
  </div>
);
SystemPropsInheritance.parameters = {
  docs: {
    description: {
      story: 'Demostración de herencia de props del sistema. Los campos heredan fieldSize/fieldRounded y el botón hereda submitVariant/submitSize/submitRounded.'
    }
  }
};

// ========== TODOS LOS TIPOS DE CAMPO ==========

export const AllFieldTypes = () => {
  const [formData, setFormData] = useState({});

  const allFieldsConfig = [
    // Campos que usan TextInput
    { 
      name: 'texto', 
      type: 'text', 
      label: 'Campo de texto',
      placeholder: 'Escribe aquí...',
      leftIcon: '📝',
      helperText: 'Texto libre',
      required: true 
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      leftIcon: '📧',
      rightIcon: '✅',
      helperText: 'Verificaremos que sea válido',
      required: true 
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      leftIcon: '🔒',
      helperText: 'Debe ser segura',
      maxLength: 20,
      showCharCount: true,
      required: true 
    },
    { 
      name: 'numero', 
      type: 'number', 
      label: 'Edad',
      placeholder: '25',
      leftIcon: '🔢',
      helperText: 'Tu edad actual'
    },
    { 
      name: 'telefono', 
      type: 'tel', 
      label: 'Teléfono',
      placeholder: '+52 555 123 4567',
      leftIcon: '📞',
      helperText: 'Con código de país'
    },
    { 
      name: 'url', 
      type: 'url', 
      label: 'Sitio web',
      placeholder: 'https://ejemplo.com',
      leftIcon: '🌐',
      helperText: 'Tu página personal'
    },
    { 
      name: 'fecha', 
      type: 'date', 
      label: 'Fecha de nacimiento',
      leftIcon: '📅',
      helperText: 'Para calcular tu edad'
    },
    
    // Campos nativos homologados
    { 
      name: 'descripcion', 
      type: 'textarea', 
      label: 'Descripción',
      placeholder: 'Cuéntanos más sobre ti...',
      helperText: 'Máximo 500 caracteres',
      maxLength: 500,
      showCharCount: true,
      width: 'full'
    },
    { 
      name: 'pais', 
      type: 'select', 
      label: 'País de residencia',
      placeholder: 'Selecciona tu país',
      options: ['México', 'España', 'Argentina', 'Colombia', 'Chile', 'Perú'],
      helperText: 'Donde vives actualmente',
      width: 'half'
    },
    { 
      name: 'newsletter', 
      type: 'checkbox', 
      label: 'Suscribirse al newsletter semanal',
      helperText: 'Recibirás noticias y actualizaciones',
      width: 'full'
    },
    { 
      name: 'genero', 
      type: 'radio', 
      label: 'Género',
      options: [
        { value: 'masculino', label: 'Masculino' },
        { value: 'femenino', label: 'Femenino' },
        { value: 'otro', label: 'Otro' },
        { value: 'prefiero-no-decir', label: 'Prefiero no decirlo' }
      ],
      helperText: 'Esta información es opcional',
      width: 'full'
    }
  ];

  const handleSubmit = (data) => {
    console.log('Todos los tipos de campo:', data);
    alert('¡Formulario enviado! Revisa la consola para ver todos los datos.');
  };

  return (
    <DynamicForm
      fields={allFieldsConfig}
      columnsPerRow={2}
      fieldSize="md"
      fieldRounded="lg"
      onSubmit={handleSubmit}
      onChange={setFormData}
      validateOnChange
      submitText="Enviar todos los campos"
      submitVariant="primary"
      submitSize="lg"
      submitIcon="📤"
    />
  );
};
AllFieldTypes.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo mostrando todos los tipos de campo: TextInput integrado (text, email, password, number, tel, url, date) y componentes nativos homologados (textarea, select, checkbox, radio).'
    }
  }
};

// ========== LAYOUTS RESPONSIVE MEJORADOS ==========

export const ResponsiveLayouts = () => {
  const sampleFields = [
    { 
      name: 'nombre', 
      label: 'Nombre',
      leftIcon: '👤',
      required: true 
    },
    { 
      name: 'apellido', 
      label: 'Apellido',
      leftIcon: '👤',
      required: true 
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email',
      leftIcon: '📧',
      required: true 
    },
    { 
      name: 'telefono', 
      type: 'tel', 
      label: 'Teléfono',
      leftIcon: '📞'
    },
    { 
      name: 'direccion', 
      label: 'Dirección',
      leftIcon: '🏠',
      width: 'full' 
    },
    { 
      name: 'ciudad', 
      label: 'Ciudad',
      leftIcon: '🏙️',
      width: 'half' 
    },
    { 
      name: 'codigo_postal', 
      label: 'Código Postal',
      leftIcon: '📮',
      width: 'half' 
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          1 Columna (Móvil)
        </h3>
        <DynamicForm
          fields={sampleFields}
          columnsPerRow={1}
          fieldSize="md"
          fieldRounded="md"
          responsive={false}
          showSubmitButton={false}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          2 Columnas (Tablet)
        </h3>
        <DynamicForm
          fields={sampleFields}
          columnsPerRow={2}
          fieldSize="md"
          fieldRounded="lg"
          responsive={false}
          showSubmitButton={false}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          3 Columnas (Desktop)
        </h3>
        <DynamicForm
          fields={sampleFields}
          columnsPerRow={3}
          fieldSize="sm"
          fieldRounded="md"
          responsive={false}
          showSubmitButton={false}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
          Responsive Automático
        </h3>
        <p style={{ 
          marginBottom: 'var(--space-md)', 
          color: 'var(--text-muted)', 
          fontSize: 'var(--font-size-sm)' 
        }}>
          Redimensiona la ventana para ver el comportamiento adaptativo
        </p>
        <DynamicForm
          fields={sampleFields}
          columnsPerRow={3}
          mobileColumns={1}
          tabletColumns={2}
          fieldSize="md"
          fieldRounded="lg"
          responsive={true}
          showSubmitButton={false}
        />
      </div>
    </div>
  );
};
ResponsiveLayouts.parameters = {
  docs: {
    description: {
      story: 'Diferentes layouts responsive: 1, 2, 3 columnas fijas y layout automático que se adapta según el tamaño de pantalla. Todos usan TextInput integrado.'
    }
  }
};

// ========== VALIDACIÓN AVANZADA ==========

export const AdvancedValidation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationFields = [
    { 
      name: 'username', 
      label: 'Nombre de usuario',
      placeholder: 'mínimo 3 caracteres',
      leftIcon: '👤',
      rightIcon: '✅',
      helperText: 'Solo letras, números y guiones bajos',
      maxLength: 20,
      showCharCount: true,
      required: true,
      validation: (value) => {
        if (value.length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y _';
        return true;
      }
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Correo electrónico',
      leftIcon: '📧',
      helperText: 'No se permiten emails temporales',
      required: true,
      validation: (value) => {
        if (!value.includes('@')) return 'Formato de email inválido';
        if (value.endsWith('@tempmail.com')) return 'No se permiten emails temporales';
        return true;
      }
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Contraseña',
      leftIcon: '🔒',
      helperText: 'Mínimo 8 caracteres con mayúscula, minúscula y número',
      maxLength: 50,
      showCharCount: true,
      required: true,
      validation: (value) => {
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/(?=.*[a-z])/.test(value)) return 'Debe contener al menos una minúscula';
        if (!/(?=.*[A-Z])/.test(value)) return 'Debe contener al menos una mayúscula';
        if (!/(?=.*\d)/.test(value)) return 'Debe contener al menos un número';
        return true;
      }
    },
    { 
      name: 'age', 
      type: 'number', 
      label: 'Edad',
      leftIcon: '🎂',
      helperText: 'Debes ser mayor de edad',
      required: true,
      validation: (value) => {
        const age = parseInt(value);
        if (age < 18) return 'Debes ser mayor de edad';
        if (age > 120) return 'Por favor, ingresa una edad válida';
        return true;
      }
    },
    { 
      name: 'website', 
      type: 'url', 
      label: 'Sitio web personal',
      leftIcon: '🌐',
      helperText: 'Opcional - tu portfolio o sitio personal',
      validation: (value) => {
        if (!value) return true; // Campo opcional
        try {
          const url = new URL(value);
          if (!['http:', 'https:'].includes(url.protocol)) {
            return 'La URL debe usar HTTP o HTTPS';
          }
          return true;
        } catch {
          return 'URL inválida';
        }
      }
    },
    { 
      name: 'terms', 
      type: 'checkbox', 
      label: 'Acepto los términos y condiciones de uso',
      helperText: 'Es obligatorio aceptar los términos para continuar',
      required: true,
      width: 'full'
    }
  ];

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simular envío a servidor
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Datos validados y enviados:', data);
    alert('¡Formulario enviado exitosamente!');
    setIsSubmitting(false);
  };

  return (
    <DynamicForm
      fields={validationFields}
      columnsPerRow={2}
      fieldSize="md"
      fieldRounded="lg"
      validateOnChange={true}
      loading={isSubmitting}
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      submitVariant="success"
      submitSize="lg"
      submitRounded="lg"
      submitIcon="🚀"
    />
  );
};
AdvancedValidation.parameters = {
  docs: {
    description: {
      story: 'Sistema de validación avanzada con reglas personalizadas, validación en tiempo real usando TextInput y feedback visual inmediato.'
    }
  }
};

// ========== CASOS DE USO REALES ==========

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginFields = [
    { 
      name: 'email', 
      type: 'email', 
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      leftIcon: '📧',
      rightIcon: '✅',
      helperText: 'Tu email registrado',
      required: true 
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Contraseña',
      placeholder: 'Tu contraseña',
      leftIcon: '🔒',
      helperText: 'La contraseña de tu cuenta',
      required: true 
    },
    { 
      name: 'remember', 
      type: 'checkbox', 
      label: 'Recordarme en este dispositivo',
      helperText: 'No recomendado para dispositivos públicos',
      width: 'full'
    }
  ];

  const handleLogin = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Login:', data);
    alert(`¡Bienvenido! Email: ${data.email}`);
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: 'var(--space-xl)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Iniciar Sesión
      </h2>
      <DynamicForm
        fields={loginFields}
        columnsPerRow={1}
        fieldSize="lg"
        fieldRounded="lg"
        responsive={false}
        loading={isLoading}
        onSubmit={handleLogin}
        submitText="Iniciar sesión"
        submitSize="lg"
        submitRounded="lg"
        submitVariant="primary"
        submitIcon="🔑"
      />
    </div>
  );
};
LoginForm.parameters = {
  docs: {
    description: {
      story: 'Formulario de login real usando TextInput para email/password con iconos, validación y estado de loading con Button integrado.'
    }
  }
};

export const ContactForm = () => {
  const contactFields = [
    { 
      name: 'nombre', 
      label: 'Nombre completo',
      leftIcon: '👤',
      helperText: 'Como te gustaría que te llamemos',
      required: true 
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email',
      leftIcon: '📧',
      helperText: 'Para responderte',
      required: true 
    },
    { 
      name: 'empresa', 
      label: 'Empresa',
      leftIcon: '🏢',
      helperText: 'Opcional'
    },
    { 
      name: 'telefono', 
      type: 'tel', 
      label: 'Teléfono',
      leftIcon: '📞',
      helperText: 'Opcional, para contacto directo'
    },
    { 
      name: 'motivo', 
      type: 'select', 
      label: 'Motivo del contacto',
      options: [
        'Consulta general',
        'Soporte técnico', 
        'Ventas',
        'Colaboración',
        'Otro'
      ],
      helperText: 'Nos ayuda a dirigir tu mensaje',
      required: true,
      width: 'full'
    },
    { 
      name: 'mensaje', 
      type: 'textarea', 
      label: 'Mensaje',
      placeholder: 'Cuéntanos en qué podemos ayudarte...',
      helperText: 'Sé específico para darte una mejor respuesta',
      maxLength: 1000,
      showCharCount: true,
      required: true,
      width: 'full'
    },
    { 
      name: 'newsletter', 
      type: 'checkbox', 
      label: 'Quiero recibir noticias y actualizaciones por email',
      helperText: 'Máximo 1 email por semana, puedes cancelar en cualquier momento',
      width: 'full'
    }
  ];

  return (
    <DynamicForm
      fields={contactFields}
      columnsPerRow={2}
      fieldSize="md"
      fieldRounded="lg"
      onSubmit={(data) => {
        console.log('Contacto:', data);
        alert('¡Mensaje enviado! Te contactaremos pronto.');
      }}
      submitText="Enviar mensaje"
      submitVariant="primary"
      submitSize="lg"
      submitRounded="lg"
      submitIcon="📤"
    />
  );
};
ContactForm.parameters = {
  docs: {
    description: {
      story: 'Formulario de contacto completo con layout de 2 columnas usando TextInput para campos de texto y componentes nativos homologados.'
    }
  }
};

// ========== ESTADOS DEL FORMULARIO ==========

export const FormStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Normal
      </h3>
      <DynamicForm
        fields={[
          { 
            name: 'nombre', 
            label: 'Nombre',
            leftIcon: '👤',
            helperText: 'Tu nombre completo',
            required: true 
          },
          { 
            name: 'email', 
            type: 'email', 
            label: 'Email',
            leftIcon: '📧',
            helperText: 'Email válido',
            required: true 
          }
        ]}
        columnsPerRow={2}
        fieldSize="md"
        fieldRounded="md"
        showSubmitButton={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado de Carga
      </h3>
      <DynamicForm
        fields={[
          { 
            name: 'nombre', 
            label: 'Nombre',
            leftIcon: '👤',
            defaultValue: 'Juan Pérez',
            required: true 
          },
          { 
            name: 'email', 
            type: 'email', 
            label: 'Email',
            leftIcon: '📧',
            defaultValue: 'juan@ejemplo.com',
            required: true 
          }
        ]}
        columnsPerRow={2}
        fieldSize="md"
        fieldRounded="md"
        loading={true}
        submitText="Enviando..."
        submitVariant="primary"
        submitIcon="⏳"
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Deshabilitado
      </h3>
      <DynamicForm
        fields={[
          { 
            name: 'nombre', 
            label: 'Nombre',
            leftIcon: '👤',
            defaultValue: 'Campo deshabilitado',
            required: true 
          },
          { 
            name: 'email', 
            type: 'email', 
            label: 'Email',
            leftIcon: '📧',
            defaultValue: 'deshabilitado@ejemplo.com',
            required: true 
          }
        ]}
        columnsPerRow={2}
        fieldSize="md"
        fieldRounded="md"
        disabled={true}
        submitText="No disponible"
        submitVariant="secondary"
        submitIcon="🚫"
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Versión Compacta
      </h3>
      <DynamicForm
        fields={[
          { 
            name: 'busqueda', 
            type: 'search', 
            label: 'Búsqueda rápida',
            leftIcon: '🔍',
            placeholder: 'Buscar...'
          },
          { 
            name: 'filtro', 
            type: 'select', 
            label: 'Filtro',
            options: ['Todos', 'Activos', 'Inactivos']
          }
        ]}
        columnsPerRow={2}
        fieldSize="sm"
        fieldRounded="md"
        compact={true}
        submitText="Buscar"
        submitSize="sm"
        submitVariant="outline"
        submitIcon="🔍"
      />
    </div>
  </div>
);
FormStates.parameters = {
  docs: {
    description: {
      story: 'Diferentes estados del formulario: normal, loading, disabled y compacto. Cada estado afecta tanto a TextInput como al Button integrado.'
    }
  }
};

// ========== MODO OSCURO ==========

export const DarkModeExample = () => (
  <div className="dark" style={{
    padding: 'var(--space-xl)',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)'
  }}>
    <h3 style={{ 
      marginBottom: 'var(--space-lg)', 
      color: 'var(--text-primary)',
      textAlign: 'center',
      fontSize: 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-semibold)'
    }}>
      DynamicForm en Modo Oscuro
    </h3>
    <DynamicForm
      fields={[
        { 
          name: 'usuario', 
          label: 'Usuario',
          leftIcon: '👤',
          rightIcon: '✅',
          helperText: 'Tu nombre de usuario único',
          maxLength: 20,
          showCharCount: true,
          required: true 
        },
        { 
          name: 'email', 
          type: 'email', 
          label: 'Email',
          leftIcon: '📧',
          helperText: 'Email para notificaciones',
          required: true 
        },
        { 
          name: 'pais', 
          type: 'select', 
          label: 'País',
          options: ['México', 'España', 'Argentina'],
          helperText: 'Tu ubicación actual'
        },
        { 
          name: 'biografia', 
          type: 'textarea', 
          label: 'Biografía',
          placeholder: 'Cuéntanos sobre ti...',
          helperText: 'Descripción pública de tu perfil',
          maxLength: 500,
          showCharCount: true,
          width: 'full'
        },
        { 
          name: 'publico', 
          type: 'checkbox', 
          label: 'Hacer perfil público',
          helperText: 'Otros usuarios podrán ver tu información',
          width: 'full'
        }
      ]}
      columnsPerRow={2}
      fieldSize="md"
      fieldRounded="lg"
      validateOnChange
      submitText="Guardar perfil"
      submitVariant="success"
      submitSize="lg"
      submitRounded="lg"
      submitIcon="💾"
      onSubmit={(data) => console.log('Modo oscuro:', data)}
    />
  </div>
);
DarkModeExample.parameters = {
  docs: {
    description: {
      story: 'DynamicForm en modo oscuro. TextInput, Button y todos los componentes nativos se adaptan automáticamente usando las variables CSS del sistema.'
    }
  }
};