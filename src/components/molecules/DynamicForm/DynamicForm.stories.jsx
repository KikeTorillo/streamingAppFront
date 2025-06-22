// molecules/DynamicForm/DynamicForm.stories.jsx
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
# DynamicForm

Generador automático de formularios basado en configuración JSON. Utiliza los componentes del sistema de diseño (TextInput, TextSelect, Button) manteniendo consistencia visual y funcional.

## 🎯 Características principales

- **Generación automática**: Crea formularios completos desde configuración
- **Tipos de campo**: text, email, password, number, tel, url, date, select, textarea, checkbox, radio
- **Layout responsive**: 1-4 columnas que se adaptan automáticamente
- **Validación**: Por tipo de campo y validación personalizada
- **Integración**: Usa los componentes del sistema de diseño

## 🔧 Configuración básica de campos

\`\`\`jsx
const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'tu@ejemplo.com',
    required: true,
    leftIcon: '📧',
    helperText: 'Te enviaremos confirmaciones aquí'
  },
  {
    name: 'country',
    type: 'select',
    label: 'País',
    leftIcon: '🌍',
    options: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' }
    ]
  }
];
\`\`\`

## 📋 Props del formulario

- \`fields\`: Array de configuración de campos
- \`columnsPerRow\`: Número de columnas (1-4)
- \`fieldSize\`: Tamaño aplicado a todos los campos
- \`onSubmit\`: Función ejecutada al enviar
- \`validateOnChange\`: Validar mientras se escribe
        `
      }
    }
  },
  argTypes: {
    fields: {
      name: 'Campos',
      description: 'Array de configuración de campos',
      control: 'object'
    },
    columnsPerRow: {
      name: 'Columnas',
      description: 'Número de columnas en desktop (1-4)',
      control: { type: 'range', min: 1, max: 4, step: 1 }
    },
    fieldSize: {
      name: 'Tamaño de campos',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    fieldRounded: {
      name: 'Border radius',
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    submitVariant: {
      name: 'Estilo del botón',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'outline', 'ghost']
    },
    validateOnChange: {
      name: 'Validar al escribir',
      control: 'boolean'
    }
  }
};

// ========== EJEMPLOS PRINCIPALES ==========

export const Playground = {
  args: {
    fields: [
      { 
        name: 'name', 
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
        required: true 
      },
      {
        name: 'country',
        type: 'select',
        label: 'País',
        placeholder: 'Selecciona tu país',
        leftIcon: '🌍',
        options: [
          { value: 'mx', label: 'México' },
          { value: 'us', label: 'Estados Unidos' },
          { value: 'ca', label: 'Canadá' }
        ]
      }
    ],
    columnsPerRow: 1,
    fieldSize: 'md',
    fieldRounded: 'md',
    submitVariant: 'primary',
    validateOnChange: false,
    submitText: 'Enviar formulario'
  }
};

// ========== FORMULARIO DE CONTACTO ==========

export const ContactForm = () => {
  const [formData, setFormData] = useState({});

  const contactFields = [
    {
      name: 'name',
      label: 'Nombre completo',
      placeholder: 'Tu nombre',
      leftIcon: '👤',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'correo@ejemplo.com',
      leftIcon: '📧',
      required: true
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Teléfono',
      placeholder: '+52 555 123 4567',
      leftIcon: '📞'
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Asunto',
      placeholder: 'Selecciona un tema',
      leftIcon: '📋',
      required: true,
      options: [
        { value: 'support', label: 'Soporte técnico' },
        { value: 'sales', label: 'Ventas' },
        { value: 'general', label: 'Consulta general' },
        { value: 'feedback', label: 'Comentarios' }
      ]
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridad',
      leftIcon: '⚡',
      options: ['Baja', 'Media', 'Alta', 'Urgente']
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje',
      placeholder: 'Describe tu consulta...',
      helperText: 'Proporciona todos los detalles relevantes',
      maxLength: 500,
      showCharCount: true,
      width: 'full'
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Suscribirse al newsletter',
      helperText: 'Recibe actualizaciones y noticias'
    }
  ];

  return (
    <div style={{ maxWidth: '700px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Formulario de Contacto
      </h3>
      
      <DynamicForm
        fields={contactFields}
        columnsPerRow={2}
        mobileColumns={1}
        fieldSize="md"
        fieldRounded="lg"
        onSubmit={(data) => {
          console.log('Contacto enviado:', data);
          alert('¡Mensaje enviado correctamente!');
        }}
        onChange={setFormData}
        validateOnChange
        submitText="Enviar mensaje"
        submitVariant="primary"
        submitSize="lg"
        submitIcon="📤"
      />
    </div>
  );
};

ContactForm.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de formulario de contacto completo con campos de texto, select, textarea y checkbox.'
    }
  }
};

// ========== FORMULARIO DE REGISTRO ==========

export const RegistrationForm = () => {
  const registrationFields = [
    {
      name: 'firstName',
      label: 'Nombre',
      placeholder: 'Tu nombre',
      leftIcon: '👤',
      required: true
    },
    {
      name: 'lastName',
      label: 'Apellido',
      placeholder: 'Tu apellido',
      leftIcon: '👤',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      leftIcon: '📧',
      helperText: 'Será tu usuario de acceso',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      leftIcon: '🔒',
      helperText: 'Debe contener mayúsculas, minúsculas y números',
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
      name: 'birthdate',
      type: 'date',
      label: 'Fecha de nacimiento',
      leftIcon: '📅',
      required: true
    },
    {
      name: 'country',
      type: 'select',
      label: 'País',
      placeholder: 'Selecciona tu país',
      leftIcon: '🌍',
      required: true,
      options: [
        { value: 'mx', label: 'México' },
        { value: 'us', label: 'Estados Unidos' },
        { value: 'ca', label: 'Canadá' },
        { value: 'es', label: 'España' },
        { value: 'br', label: 'Brasil' }
      ]
    },
    {
      name: 'profession',
      type: 'select',
      label: 'Profesión',
      placeholder: 'Tu área profesional',
      leftIcon: '💼',
      options: [
        { value: 'developer', label: 'Desarrollador' },
        { value: 'designer', label: 'Diseñador' },
        { value: 'manager', label: 'Gerente' },
        { value: 'student', label: 'Estudiante' },
        { value: 'other', label: 'Otro' }
      ]
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Experiencia',
      leftIcon: '📈',
      options: ['Sin experiencia', '1-2 años', '3-5 años', '5+ años']
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografía',
      placeholder: 'Cuéntanos sobre ti...',
      helperText: 'Opcional: una breve descripción personal',
      maxLength: 300,
      showCharCount: true,
      width: 'full'
    },
    {
      name: 'terms',
      type: 'checkbox',
      label: 'Acepto los términos y condiciones',
      required: true
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Quiero recibir el newsletter'
    }
  ];

  return (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Crear Cuenta
      </h3>
      
      <DynamicForm
        fields={registrationFields}
        columnsPerRow={2}
        fieldSize="md"
        fieldRounded="lg"
        onSubmit={(data) => {
          console.log('Registro:', data);
          alert('¡Cuenta creada exitosamente!');
        }}
        validateOnChange
        submitText="Crear cuenta"
        submitVariant="success"
        submitSize="lg"
        submitIcon="🚀"
      />
    </div>
  );
};

RegistrationForm.parameters = {
  docs: {
    description: {
      story: 'Formulario de registro completo con validación personalizada, múltiples tipos de campo y layout de 2 columnas.'
    }
  }
};

// ========== FORMULARIO SIMPLE ==========

export const SimpleForm = () => (
  <div style={{ maxWidth: '400px' }}>
    <DynamicForm
      fields={[
        {
          name: 'search',
          label: 'Buscar',
          placeholder: 'Escribe para buscar...',
          leftIcon: '🔍'
        },
        {
          name: 'category',
          type: 'select',
          label: 'Categoría',
          leftIcon: '📂',
          options: ['Todos', 'Documentos', 'Imágenes', 'Videos']
        }
      ]}
      columnsPerRow={1}
      fieldSize="sm"
      fieldRounded="full"
      submitText="Buscar"
      submitVariant="outline"
      submitSize="sm"
      submitIcon="🔍"
    />
  </div>
);

SimpleForm.parameters = {
  docs: {
    description: {
      story: 'Formulario simple de búsqueda con 2 campos y estilo compacto.'
    }
  }
};

// ========== CONFIGURACIÓN AVANZADA ==========

export const AdvancedConfiguration = () => {
  const [formData, setFormData] = useState({});

  const advancedFields = [
    {
      name: 'projectName',
      label: 'Nombre del proyecto',
      placeholder: 'Mi proyecto increíble',
      leftIcon: '📝',
      rightIcon: '✅',
      helperText: 'Será visible para todo el equipo',
      maxLength: 100,
      showCharCount: true,
      required: true,
      width: 'full'
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridad',
      leftIcon: '⚡',
      helperText: 'Nivel de urgencia del proyecto',
      required: true,
      options: [
        { value: 'low', label: '🟢 Baja' },
        { value: 'medium', label: '🟡 Media' },
        { value: 'high', label: '🟠 Alta' },
        { value: 'critical', label: '🔴 Crítica' }
      ]
    },
    {
      name: 'assignee',
      type: 'select',
      label: 'Asignado a',
      leftIcon: '👥',
      options: [
        { value: 'juan', label: 'Juan Pérez' },
        { value: 'maria', label: 'María García' },
        { value: 'carlos', label: 'Carlos López' }
      ]
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Fecha límite',
      leftIcon: '📅',
      helperText: 'Fecha de entrega esperada'
    },
    {
      name: 'budget',
      type: 'number',
      label: 'Presupuesto',
      placeholder: '10000',
      leftIcon: '💰',
      helperText: 'Presupuesto en pesos mexicanos'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe los objetivos y alcance del proyecto...',
      helperText: 'Detalla los requerimientos y expectativas',
      maxLength: 1000,
      showCharCount: true,
      width: 'full'
    }
  ];

  return (
    <div style={{ maxWidth: '900px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Configuración de Proyecto
      </h3>
      
      <DynamicForm
        fields={advancedFields}
        columnsPerRow={3}
        tabletColumns={2}
        mobileColumns={1}
        fieldSize="lg"
        fieldRounded="xl"
        onSubmit={(data) => {
          console.log('Proyecto configurado:', data);
          alert('¡Proyecto creado exitosamente!');
        }}
        onChange={setFormData}
        validateOnChange
        submitText="Crear proyecto"
        submitVariant="success"
        submitSize="xl"
        submitIcon="🎯"
      />
      
      {Object.keys(formData).length > 0 && (
        <div style={{ 
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Configuración actual:</strong>
          <pre style={{ 
            marginTop: 'var(--space-xs)', 
            color: 'var(--text-secondary)',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

AdvancedConfiguration.parameters = {
  docs: {
    description: {
      story: 'Configuración avanzada con layout de 3 columnas, validación en tiempo real y vista previa de datos.'
    }
  }
};