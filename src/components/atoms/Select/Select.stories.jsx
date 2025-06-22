// atoms/Select/Select.stories.jsx
import React, { useState } from 'react';
import { Select } from './Select';
import './Select.css';

export default {
  title: 'Components/Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Select Atom

El átomo **Select** es el componente base para campos de selección en nuestro sistema de diseño. 
Mantiene total consistencia con el átomo Input y proporciona una experiencia de selección accesible.

## 🎯 Características principales

- **5 tamaños responsive**: XS, SM, MD, LG, XL (área táctil mínima de 44px en móviles)
- **4 variantes semánticas**: Default, Error, Success, Warning
- **5 opciones de border radius**: SM, MD, LG, XL, Full  
- **Estados completos**: Normal, Focus, Hover, Disabled
- **Flecha personalizada**: SVG con animaciones y estados reactivos
- **Opciones flexibles**: Strings simples o objetos {value, label, disabled}
- **Accesibilidad completa**: ARIA attributes, navegación por teclado
- **Consistencia con Input**: Estilos y comportamientos idénticos

## 🔧 Uso básico

\`\`\`jsx
import { Select } from './atoms/Select';

// Opciones simples
const options = ['Opción 1', 'Opción 2', 'Opción 3'];

// Opciones detalladas
const detailedOptions = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá', disabled: true }
];

// Uso básico
<Select 
  options={options}
  placeholder="Selecciona una opción"
  onChange={handleChange}
/>

// Con todas las opciones
<Select 
  options={detailedOptions}
  size="lg"
  variant="success"
  rounded="lg"
  placeholder="Selecciona tu país"
  required
  ariaLabel="País de residencia"
/>
\`\`\`

## ♿ Accesibilidad

- **ARIA attributes**: \`aria-label\`, \`aria-describedby\`, \`aria-errormessage\`
- **Estados semánticos**: \`aria-invalid\` automático en errores
- **Navegación por teclado**: Flechas, Enter, Escape, búsqueda por letra
- **Opciones deshabilitadas**: Excluidas de navegación
        `
      }
    }
  },
  argTypes: {
    options: {
      name: 'Opciones',
      description: 'Array de opciones - strings simples o objetos {value, label, disabled}',
      control: 'object',
      table: {
        type: { summary: 'Array<string | {value: string, label: string, disabled?: boolean}>' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del select',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual del select',
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Texto mostrado como primera opción',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el select está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Si el select es requerido',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Padding horizontal reducido',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
};

// ===== DATOS DE EJEMPLO =====
const basicOptions = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const countryOptions = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'es', label: 'España' },
  { value: 'de', label: 'Alemania', disabled: true }
];

const categoryOptions = [
  { value: 'tech', label: '💻 Tecnología' },
  { value: 'design', label: '🎨 Diseño' },
  { value: 'business', label: '💼 Negocios' },
  { value: 'health', label: '🏥 Salud', disabled: true }
];

// ===== HISTORIA DEFAULT =====
export const Default = {
  args: {
    options: basicOptions,
    placeholder: 'Selecciona una estación',
    size: 'md',
    variant: 'default',
    rounded: 'md'
  }
};

// ===== TAMAÑOS =====
export const Sizes = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
        XS (28px) → SM (32px) → MD (40px) → LG (48px) → XL (56px)
      </h4>
    </div>
    
    <Select options={basicOptions} placeholder="XS - Extra Small" size="xs" />
    <Select options={basicOptions} placeholder="SM - Small" size="sm" />
    <Select options={basicOptions} placeholder="MD - Medium (Default)" size="md" />
    <Select options={basicOptions} placeholder="LG - Large" size="lg" />
    <Select options={basicOptions} placeholder="XL - Extra Large" size="xl" />
  </div>
);
Sizes.parameters = {
  docs: {
    description: {
      story: 'Cinco tamaños con alturas responsive. En móviles, XS y SM se ajustan a 44px mínimo para táctil.'
    }
  }
};

// ===== VARIANTES SEMÁNTICAS =====
export const SemanticVariants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Default</h4>
      <Select 
        options={countryOptions}
        placeholder="Selecciona tu país"
        variant="default"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-success)' }}>Success</h4>
      <Select 
        options={countryOptions}
        placeholder="País válido"
        variant="success"
        defaultValue="mx"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-warning)' }}>Warning</h4>
      <Select 
        options={countryOptions}
        placeholder="Atención requerida"
        variant="warning"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-danger)' }}>Error</h4>
      <Select 
        options={countryOptions}
        placeholder="Campo requerido"
        variant="error"
        required
      />
    </div>
  </div>
);
SemanticVariants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas idénticas al átomo Input. Los colores se heredan del sistema de diseño.'
    }
  }
};

// ===== TIPOS DE OPCIONES =====
export const OptionTypes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Strings simples</h4>
      <Select 
        options={['JavaScript', 'Python', 'Java', 'C++', 'Go']}
        placeholder="Lenguaje de programación"
        size="md"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
        Array simple de strings
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Objetos detallados</h4>
      <Select 
        options={countryOptions}
        placeholder="País de residencia"
        size="md"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
        Objetos {`{value, label, disabled?}`}
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Con emojis y disabled</h4>
      <Select 
        options={categoryOptions}
        placeholder="Categoría de interés"
        size="md"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
        Labels con emojis, "Salud" está deshabilitada
      </p>
    </div>
  </div>
);
OptionTypes.parameters = {
  docs: {
    description: {
      story: 'Flexibilidad en tipos de opciones: strings simples, objetos detallados, o combinaciones.'
    }
  }
};

// ===== ESTADOS INTERACTIVOS =====
export const InteractiveStates = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Normal</h4>
      <Select 
        options={countryOptions}
        placeholder="Estado normal"
        size="lg"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Con valor</h4>
      <Select 
        options={countryOptions}
        placeholder="Selecciona país"
        defaultValue="mx"
        size="lg"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-disabled)' }}>Deshabilitado</h4>
      <Select 
        options={countryOptions}
        placeholder="No disponible"
        disabled
        size="lg"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Compacto</h4>
      <Select 
        options={countryOptions}
        placeholder="Padding reducido"
        compact
        size="lg"
      />
    </div>
  </div>
);
InteractiveStates.parameters = {
  docs: {
    description: {
      story: 'Estados del select: normal, con valor, disabled y compacto. Prueba hover y navegación por teclado.'
    }
  }
};

// ===== ACCESIBILIDAD =====
export const Accessibility = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    padding: 'var(--space-md)',
    maxWidth: '600px'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>Con ARIA Label</h4>
      <Select 
        options={countryOptions}
        placeholder="Selecciona tu país"
        ariaLabel="País de residencia para configuración regional"
        size="md"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-danger)' }}>Con Error Message</h4>
      <Select 
        options={countryOptions}
        placeholder="Campo con error"
        variant="error"
        required
        ariaErrorMessage="country-error"
        size="md"
      />
      <div 
        id="country-error" 
        role="alert"
        style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-danger)', 
          marginTop: 'var(--space-xs)' 
        }}
      >
        ⚠️ Este campo es obligatorio
      </div>
    </div>
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }}>
      <h5 style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
        🔍 Navegación por teclado:
      </h5>
      <ul style={{ margin: '0', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <li><strong>Tab</strong> - Navegar entre selects</li>
        <li><strong>Enter/Space</strong> - Abrir dropdown</li>
        <li><strong>↑/↓</strong> - Navegar opciones</li>
        <li><strong>Enter</strong> - Seleccionar opción</li>
        <li><strong>Escape</strong> - Cerrar dropdown</li>
        <li><strong>Letra</strong> - Saltar a opción que inicie con esa letra</li>
      </ul>
    </div>
  </div>
);
Accessibility.parameters = {
  docs: {
    description: {
      story: 'Implementación completa de accesibilidad con ARIA y navegación por teclado nativa del HTML select.'
    }
  }
};

// ===== COMPONENTE CONTROLADO =====
export const ControlledComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-lg)',
      padding: 'var(--space-md)',
      maxWidth: '400px'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          Select Controlado
        </h4>
        <Select 
          options={countryOptions}
          placeholder="Selecciona tu país"
          value={selectedCountry}
          onChange={handleCountryChange}
          size="lg"
          variant={selectedCountry ? 'success' : 'default'}
        />
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--text-muted)', 
          marginTop: 'var(--space-xs)' 
        }}>
          Valor actual: <strong>{selectedCountry || 'Ninguno'}</strong>
        </p>
      </div>
      
      <div style={{ 
        padding: 'var(--space-md)', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)'
      }}>
        <pre style={{ 
          margin: '0', 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--text-muted)'
        }}>
{`value: "${selectedCountry}"`}
        </pre>
      </div>
    </div>
  );
};
ControlledComponent.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de uso como componente controlado con React state. La variante cambia dinámicamente.'
    }
  }
};