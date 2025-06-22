import React, { useState } from 'react';
import { Input } from './Input';

export default {
  title: 'Components/Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Input Atom

El átomo **Input** es el componente base para campos de entrada de texto en nuestro sistema de diseño. 
Proporciona estilos consistentes, estados semánticos y excelente accesibilidad, siguiendo nuestras 
variables de diseño y principios de Atomic Design.

## 🎯 Características principales

- **5 tamaños**: XS, SM, MD, LG, XL (responsive con área táctil mínima)
- **4 variantes semánticas**: Default, Error, Success, Warning
- **Estados completos**: Normal, Focus, Hover, Disabled, Read-only
- **Tipos soportados**: Text, Email, Password, Number, Tel, URL, Search, Date, Time
- **Accesibilidad**: ARIA completo, validación HTML5, navegación por teclado
- **Theming**: Variables CSS del sistema, modo oscuro automático
- **Mobile-first**: Área táctil de 44px, sin zoom en iOS

## 📱 Sistema de diseño

Optimizado para sistemas con \`html { font-size: 62.5% }\` donde \`1rem = 10px\`
Usa automáticamente todas las variables CSS del sistema de diseño.

## 🔧 Uso básico

\`\`\`jsx
import { Input } from './atoms/Input';

// Uso simple
<Input 
  placeholder="Escribe aquí..."
  onChange={handleChange}
/>

// Con variante semántica
<Input 
  variant="error"
  placeholder="Campo requerido"
  ariaErrorMessage="error-msg"
/>

// Con todas las opciones
<Input 
  type="email"
  size="lg"
  variant="success"
  rounded="lg"
  placeholder="correo@ejemplo.com"
  required
  autoComplete="email"
  ariaLabel="Correo electrónico"
/>
\`\`\`

## ♿ Accesibilidad

El componente incluye soporte completo para:
- **ARIA attributes**: \`aria-label\`, \`aria-describedby\`, \`aria-errormessage\`
- **Validación HTML5**: \`required\`, \`pattern\`, \`maxLength\`, \`minLength\`
- **Estados semánticos**: \`aria-invalid\` automático en errores
- **Autocompletado**: \`autoComplete\` para mejor UX

## 🎨 Variables CSS del sistema

Usa automáticamente las variables del sistema:
\`\`\`css
:root {
  --text-primary: #111827;
  --text-placeholder: #9ca3af;
  --bg-primary: #ffffff;
  --border-default: #d1d5db;
  --border-focus: #3b82f6;
  --color-danger: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  /* Y muchas más del sistema... */
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    type: {
      name: 'Tipo',
      description: 'Tipo de input HTML',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'text'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del input (responsive en móviles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante semántica del input',
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas del input',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'md',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Texto de ayuda mostrado cuando el campo está vacío',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    value: {
      name: 'Valor',
      description: 'Valor controlado del input',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el input e impide interacciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    readOnly: {
      name: 'Solo lectura',
      description: 'El input es de solo lectura',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Campo requerido para validación HTML5',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Reduce el padding horizontal',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    autoComplete: {
      name: 'Auto Complete',
      description: 'Valor para autocompletado del navegador',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    ariaLabel: {
      name: 'ARIA Label',
      description: 'Label para accesibilidad',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales para personalización',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    onChange: { 
      name: 'Función onChange',
      description: 'Función a ejecutar cuando cambia el valor',
      action: 'changed',
      table: {
        type: { summary: 'function' }
      }
    },
    onFocus: { 
      name: 'Función onFocus',
      description: 'Función a ejecutar al obtener foco',
      action: 'focused',
      table: {
        type: { summary: 'function' }
      }
    },
    onBlur: { 
      name: 'Función onBlur',
      description: 'Función a ejecutar al perder foco',
      action: 'blurred',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// Template base
const Template = (args) => <Input {...args} />;

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  placeholder: 'Personalízame en los controles...',
  size: 'md',
  type: 'text',
  variant: 'default'
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles de abajo para experimentar con todas las opciones del Input. Cambia el tamaño, tipo, variante y otros parámetros para ver los cambios en tiempo real.'
    }
  }
};

// ========== TAMAÑOS ==========

export const AllSizes = () => {
  const [values, setValues] = useState({
    xs: '',
    sm: '',
    md: '',
    lg: '',
    xl: ''
  });

  const handleChange = (size) => (e) => {
    setValues(prev => ({
      ...prev,
      [size]: e.target.value
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: '1fr'
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Extra Small (xs) - 2.4rem altura mínima (4.4rem en móvil)
        </label>
        <Input 
          size="xs" 
          placeholder="Extra Small input" 
          value={values.xs}
          onChange={handleChange('xs')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Small (sm) - 3.2rem altura mínima (4.4rem en móvil)
        </label>
        <Input 
          size="sm" 
          placeholder="Small input" 
          value={values.sm}
          onChange={handleChange('sm')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Medium (md) - 4.0rem altura mínima
        </label>
        <Input 
          size="md" 
          placeholder="Medium input (default)" 
          value={values.md}
          onChange={handleChange('md')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Large (lg) - 4.8rem altura mínima
        </label>
        <Input 
          size="lg" 
          placeholder="Large input" 
          value={values.lg}
          onChange={handleChange('lg')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Extra Large (xl) - 5.6rem altura mínima
        </label>
        <Input 
          size="xl" 
          placeholder="Extra Large input" 
          value={values.xl}
          onChange={handleChange('xl')}
        />
      </div>
    </div>
  );
};
AllSizes.parameters = {
  docs: {
    description: {
      story: 'Todos los tamaños disponibles. En móviles, los tamaños xs y sm mantienen un área táctil mínima de 44px para mejor usabilidad.'
    }
  }
};

// ========== VARIANTES SEMÁNTICAS ==========

export const SemanticVariants = () => {
  const [values, setValues] = useState({
    default: '',
    error: 'valor@incorrecto',
    success: 'correo@valido.com',
    warning: 'usuario'
  });

  const handleChange = (variant) => (e) => {
    setValues(prev => ({
      ...prev,
      [variant]: e.target.value
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: '1fr'
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Default - Estado normal
        </label>
        <Input 
          variant="default"
          placeholder="Estado normal del input" 
          value={values.default}
          onChange={handleChange('default')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Error - Campo con error de validación
        </label>
        <Input 
          variant="error"
          placeholder="Campo con error" 
          value={values.error}
          onChange={handleChange('error')}
          ariaErrorMessage="error-message"
        />
        <p id="error-message" style={{ 
          marginTop: '0.4rem', 
          fontSize: '1.2rem', 
          color: 'var(--color-danger)', 
          margin: '0.4rem 0 0 0' 
        }}>
          El formato del correo no es válido
        </p>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Success - Campo validado correctamente
        </label>
        <Input 
          variant="success"
          placeholder="Campo válido" 
          value={values.success}
          onChange={handleChange('success')}
        />
        <p style={{ 
          marginTop: '0.4rem', 
          fontSize: '1.2rem', 
          color: 'var(--color-success)', 
          margin: '0.4rem 0 0 0' 
        }}>
          ✓ Correo válido
        </p>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Warning - Campo con advertencia
        </label>
        <Input 
          variant="warning"
          placeholder="Campo con advertencia" 
          value={values.warning}
          onChange={handleChange('warning')}
        />
        <p style={{ 
          marginTop: '0.4rem', 
          fontSize: '1.2rem', 
          color: 'var(--color-warning)', 
          margin: '0.4rem 0 0 0' 
        }}>
          ⚠️ Recomendamos usar un nombre de usuario más largo
        </p>
      </div>
    </div>
  );
};
SemanticVariants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas que comunican diferentes estados del input. Cada variante tiene colores y estilos específicos para transmitir su significado.'
    }
  }
};

// ========== RADIO DE BORDES ==========

export const BorderRadius = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Input rounded="sm" placeholder="Pequeño" />
    <Input rounded="md" placeholder="Mediano (default)" />
    <Input rounded="lg" placeholder="Grande" />
    <Input rounded="xl" placeholder="Extra Grande" />
    <Input rounded="full" placeholder="Completo" />
  </div>
);
BorderRadius.parameters = {
  docs: {
    description: {
      story: 'Diferentes opciones de curvatura para las esquinas del input.'
    }
  }
};

// ========== TIPOS DE INPUT ==========

export const InputTypes = () => {
  const [values, setValues] = useState({
    text: '',
    email: '',
    password: '',
    number: '',
    tel: '',
    url: '',
    search: '',
    date: '',
    time: ''
  });

  const handleChange = (type) => (e) => {
    setValues(prev => ({
      ...prev,
      [type]: e.target.value
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Text
        </label>
        <Input 
          type="text" 
          placeholder="Texto general" 
          value={values.text}
          onChange={handleChange('text')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Email
        </label>
        <Input 
          type="email" 
          placeholder="correo@ejemplo.com" 
          value={values.email}
          onChange={handleChange('email')}
          autoComplete="email"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Password
        </label>
        <Input 
          type="password" 
          placeholder="Contraseña segura" 
          value={values.password}
          onChange={handleChange('password')}
          autoComplete="current-password"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Number
        </label>
        <Input 
          type="number" 
          placeholder="123456" 
          value={values.number}
          onChange={handleChange('number')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Tel
        </label>
        <Input 
          type="tel" 
          placeholder="+52 555 123 4567" 
          value={values.tel}
          onChange={handleChange('tel')}
          autoComplete="tel"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          URL
        </label>
        <Input 
          type="url" 
          placeholder="https://ejemplo.com" 
          value={values.url}
          onChange={handleChange('url')}
          autoComplete="url"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Search
        </label>
        <Input 
          type="search" 
          placeholder="Buscar..." 
          value={values.search}
          onChange={handleChange('search')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Date
        </label>
        <Input 
          type="date" 
          value={values.date}
          onChange={handleChange('date')}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Time
        </label>
        <Input 
          type="time" 
          value={values.time}
          onChange={handleChange('time')}
        />
      </div>
    </div>
  );
};
InputTypes.parameters = {
  docs: {
    description: {
      story: 'Diferentes tipos de input soportados por el componente. Cada tipo proporciona diferente comportamiento del teclado y validación nativa del navegador.'
    }
  }
};

// ========== ESTADOS ==========

export const States = () => {
  const [controlledValue, setControlledValue] = useState('Texto controlado');

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: '1fr'
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Estado normal
        </label>
        <Input placeholder="Escribe algo aquí..." />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Con valor controlado
        </label>
        <Input 
          placeholder="Valor controlado" 
          value={controlledValue}
          onChange={(e) => setControlledValue(e.target.value)}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Estado deshabilitado
        </label>
        <Input 
          placeholder="Este input está deshabilitado" 
          disabled 
          value="No se puede editar"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Solo lectura
        </label>
        <Input 
          placeholder="Solo lectura" 
          readOnly 
          value="Este texto es de solo lectura"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Campo requerido
        </label>
        <Input 
          placeholder="Campo obligatorio" 
          required 
          ariaLabel="Campo requerido"
        />
      </div>
    </div>
  );
};
States.parameters = {
  docs: {
    description: {
      story: 'Diferentes estados del input: normal, controlado, deshabilitado, solo lectura y requerido. Observa los estilos y comportamientos diferentes.'
    }
  }
};

// ========== MODIFICADORES ==========

export const Modifiers = () => (
  <div style={{
    display: 'grid',
    gap: '1.6rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
  }}>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Normal</h4>
      <Input size="md" placeholder="Input normal" />
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Compacto</h4>
      <Input size="md" compact placeholder="Input compacto" />
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>Border Radius Full</h4>
      <Input size="md" rounded="full" placeholder="Input redondeado" />
    </div>
  </div>
);
Modifiers.parameters = {
  docs: {
    description: {
      story: 'Diferentes modificadores que afectan el comportamiento y apariencia del input.'
    }
  }
};

// ========== VALIDACIÓN HTML5 ==========

export const HTML5Validation = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <form style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: '1fr',
      maxWidth: '400px'
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Usuario (3-20 caracteres)
        </label>
        <Input 
          type="text"
          placeholder="usuario123" 
          value={formData.username}
          onChange={handleChange('username')}
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9]+"
          ariaLabel="Nombre de usuario"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Email válido
        </label>
        <Input 
          type="email"
          placeholder="correo@ejemplo.com" 
          value={formData.email}
          onChange={handleChange('email')}
          required
          autoComplete="email"
          ariaLabel="Correo electrónico"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Contraseña (mín. 8 caracteres)
        </label>
        <Input 
          type="password"
          placeholder="Contraseña segura" 
          value={formData.password}
          onChange={handleChange('password')}
          required
          minLength={8}
          autoComplete="new-password"
          ariaLabel="Contraseña"
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
          Edad (18-100 años)
        </label>
        <Input 
          type="number"
          placeholder="25" 
          value={formData.age}
          onChange={handleChange('age')}
          required
          min={18}
          max={100}
          ariaLabel="Edad"
        />
      </div>
      
      <button 
        type="submit" 
        style={{
          padding: '1.2rem 2rem',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '1.6rem',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '0.8rem'
        }}
        onClick={(e) => e.preventDefault()}
      >
        Validar Formulario
      </button>
    </form>
  );
};
HTML5Validation.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de validación HTML5 nativa con diferentes restricciones: required, minLength, maxLength, pattern, min, max. Intenta enviar el formulario para ver las validaciones.'
    }
  }
};

// ========== CASOS DE USO COMUNES ==========

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: '1fr',
      maxWidth: '320px',
      padding: '2.4rem',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <h3 style={{ 
        margin: '0 0 0.8rem 0', 
        fontSize: '1.8rem',
        fontWeight: '600',
        color: 'var(--text-primary)'
      }}>
        Iniciar sesión
      </h3>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Correo electrónico
        </label>
        <Input 
          type="email" 
          placeholder="tu@correo.com" 
          size="md"
          value={formData.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Contraseña
        </label>
        <Input 
          type="password" 
          placeholder="Tu contraseña segura" 
          size="md"
          value={formData.password}
          onChange={handleChange('password')}
          autoComplete="current-password"
          required
        />
      </div>
      
      <button style={{
        padding: '1.2rem 2rem',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontSize: '1.6rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '0.8rem'
      }}>
        Entrar
      </button>
    </div>
  );
};
LoginForm.parameters = {
  docs: {
    description: {
      story: 'Ejemplo del input usado en un contexto real de formulario de login con labels, autocompletado y validación.'
    }
  }
};

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div style={{ 
      display: 'flex',
      maxWidth: '500px',
      gap: '1rem',
      alignItems: 'center'
    }}>
      <Input 
        type="search" 
        placeholder="Buscar productos, marcas, categorías..." 
        size="lg"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ flex: 1 }}
        rounded="lg"
      />
      <button style={{
        padding: '1.4rem 2rem',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: '1.6rem',
        fontWeight: '500',
        cursor: 'pointer',
        height: '4.8rem'
      }}>
        🔍
      </button>
    </div>
  );
};
SearchBar.parameters = {
  docs: {
    description: {
      story: 'Ejemplo del input usado como barra de búsqueda con botón de acción y border radius coordinado.'
    }
  }
};

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: '1.6rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      maxWidth: '800px'
    }}>
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Nombre completo *
        </label>
        <Input 
          type="text" 
          placeholder="Juan Pérez" 
          value={formData.name}
          onChange={handleChange('name')}
          required
          autoComplete="name"
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Email *
        </label>
        <Input 
          type="email" 
          placeholder="juan@empresa.com" 
          value={formData.email}
          onChange={handleChange('email')}
          required
          autoComplete="email"
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Teléfono
        </label>
        <Input 
          type="tel" 
          placeholder="+52 555 123 4567" 
          value={formData.phone}
          onChange={handleChange('phone')}
          autoComplete="tel"
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.8rem', 
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Sitio web
        </label>
        <Input 
          type="url" 
          placeholder="https://miempresa.com" 
          value={formData.website}
          onChange={handleChange('website')}
          autoComplete="url"
        />
      </div>
    </div>
  );
};
ContactForm.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de formulario de contacto usando diferentes tipos de input en un layout responsive.'
    }
  }
};

// ========== MODO OSCURO ==========

export const DarkModeExample = () => (
  <div className="dark" style={{
    padding: '2.4rem',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)'
  }}>
    <div style={{
      display: 'grid',
      gap: '1.6rem',
      gridTemplateColumns: '1fr'
    }}>
      <Input placeholder="Input normal en modo oscuro" size="md" />
      <Input placeholder="Input con error" variant="error" size="md" />
      <Input placeholder="Input exitoso" variant="success" size="md" />
      <Input placeholder="Input con advertencia" variant="warning" size="md" />
      <Input placeholder="Input deshabilitado" disabled size="md" />
      <Input placeholder="Input de solo lectura" readOnly value="Solo lectura" size="md" />
    </div>
  </div>
);
DarkModeExample.parameters = {
  docs: {
    description: {
      story: 'Todas las variantes funcionan automáticamente en modo oscuro usando la clase `.dark` y las variables CSS del sistema.'
    }
  }
};

// ========== RESPONSIVE ==========

export const ResponsiveExample = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    flexDirection: 'column'
  }}>
    <p style={{
      fontSize: '1.4rem',
      color: 'var(--text-muted)',
      margin: 0,
      fontFamily: 'var(--font-family-base)'
    }}>
      Redimensiona la ventana para ver el comportamiento responsive:
    </p>
    <div style={{
      display: 'flex',
      gap: '1.6rem',
      flexWrap: 'wrap'
    }}>
      <Input size="xs" placeholder="XS - Se ajusta en móvil" />
      <Input size="sm" placeholder="SM - Se ajusta en móvil" />
      <Input size="lg" placeholder="LG - Se reduce en móvil" />
      <Input size="xl" placeholder="XL - Se reduce en móvil" />
    </div>
    <p style={{
      fontSize: '1.2rem',
      color: 'var(--text-muted)',
      margin: 0,
      fontStyle: 'italic'
    }}>
      En móviles (&lt;768px), todos los inputs mantienen un área táctil mínima de 44px y evitan el zoom en iOS
    </p>
  </div>
);

ResponsiveExample.parameters = {
  docs: {
    description: {
      story: 'Los inputs se ajustan automáticamente en pantallas móviles para mejor usabilidad táctil siguiendo las guías de accesibilidad.'
    }
  }
};