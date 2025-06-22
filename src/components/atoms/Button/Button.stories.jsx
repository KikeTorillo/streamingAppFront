import React from 'react';
import { Button } from './Button';
import './Button.css';

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          `# Botón Componente
Botón reutilizable y altamente personalizable que sigue principios de **Atomic Design**. 
Diseñado para ser consistente, accesible y fácil de usar en cualquier contexto.

## 🎯 Características principales
- **7 variantes visuales**: Primary, Secondary, Outline, Ghost, Danger, Success, Warning
- **5 tamaños**: XS, SM, MD, LG, XL (responsive)
- **Estados**: Normal, Loading, Disabled
- **Iconos flexibles**: Emojis, clases CSS, componentes React
- **Accesibilidad**: ARIA attributes, focus management, keyboard navigation
- **Theming**: Variables CSS personalizables, modo oscuro
- **Micro-interacciones**: Hover effects, animaciones suaves

## 📱 Sistema de diseño
Optimizado para sistemas con \`html { font-size: 62.5% }\` donde \`1rem = 10px\`
Usa variables CSS del sistema de diseño para consistencia total.

## 🔧 Uso básico
\`\`\`jsx
import { Button } from './atoms/Button';

// Uso simple
<Button onClick={handleClick}>
  Guardar cambios
</Button>

// Con todas las opciones
<Button 
  variant="primary"
  size="lg"
  icon="🚀"
  loading={isSubmitting}
  fullWidth
  rounded="lg"
  onClick={handleSubmit}
>
  Enviar datos
</Button>

// Botón solo icono
<Button 
  iconOnly
  icon="❤️"
  ariaLabel="Me gusta"
  variant="ghost"
  size="sm"
/>
\`\`\`

## 🎨 Iconos soportados
- **Emojis**: \`"🚀"\`, \`"💾"\`, \`"📤"\`
- **Font Awesome**: \`"fas fa-home"\`, \`"fa-solid fa-user"\`
- **Material Icons**: \`"material-icons"\`
- **Bootstrap Icons**: \`"bi-house"\`
- **Componentes React**: \`<IconComponent />\`

## 🎭 Variables CSS del sistema
El componente usa automáticamente las variables del sistema de diseño:
\`\`\`css
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --font-family-base: 'Itim', sans-serif;
  --space-sm: 0.8rem;
  --transition-normal: 0.2s ease-in-out;
  --shadow-md: 0 0.4rem 0.6rem -0.1rem rgba(0, 0, 0, 0.1);
  /* Y muchas más... */
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    children: {
      name: 'Contenido',
      description: 'Contenido del botón (texto o elementos React)',
      control: 'text',
      defaultValue: 'Botón'
    },
    text: {
      name: 'Texto alternativo',
      description: 'Alternativa a children para contenido simple',
      control: 'text',
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual del botón',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'],
      defaultValue: 'primary',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del botón (responsive en móviles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Curvatura de las esquinas del botón',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'md',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' }
      }
    },
    icon: {
      name: 'Icono',
      description: `Icono a mostrar. Acepta múltiples formatos:
• **Emojis**: "🚀", "💾", "📤"
• **Font Awesome**: "fas fa-home", "fa-solid fa-user"  
• **Material Icons**: "material-icons"
• **Bootstrap Icons**: "bi-house"
• **Componentes React**: <IconComponent />`,
      control: 'text',
    },
    iconPosition: {
      name: 'Posición del icono',
      description: 'Ubicación del icono respecto al texto',
      control: 'select',
      options: ['left', 'right'],
      defaultValue: 'left'
    },
    iconOnly: {
      name: 'Solo icono',
      description: 'Muestra únicamente el icono sin texto (aspecto 1:1)',
      control: 'boolean',
      defaultValue: false
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra spinner y deshabilita el botón',
      control: 'boolean',
      defaultValue: false
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el botón e impide interacciones',
      control: 'boolean',
      defaultValue: false
    },
    fullWidth: {
      name: 'Ancho completo',
      description: 'El botón ocupa todo el ancho del contenedor',
      control: 'boolean',
      defaultValue: false
    },
    compact: {
      name: 'Compacto',
      description: 'Reduce el padding horizontal para espacios reducidos',
      control: 'boolean',
      defaultValue: false
    },
    type: {
      name: 'Tipo HTML',
      description: 'Tipo de botón para formularios',
      control: 'select',
      options: ['button', 'submit', 'reset'],
      defaultValue: 'button'
    },
    ariaLabel: {
      name: 'ARIA Label',
      description: 'Label para accesibilidad (requerido para iconOnly)',
      control: 'text',
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función a ejecutar al hacer clic',
      action: 'clicked'
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales para personalización',
      control: 'text',
    }
  }
};

// Template base
const Template = (args) => <Button {...args} />;

// ========== HISTORIAS PRINCIPALES ==========
export const Playground = Template.bind({});
Playground.args = {
  children: 'Personalízame',
  variant: 'primary',
  size: 'md',
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles de abajo para experimentar con todas las opciones del botón.'
    }
  }
};

// ========== VARIANTES VISUALES ==========

export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '1.6rem', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="success">Success</Button>
    <Button variant="warning">Warning</Button>
  </div>
);
AllVariants.parameters = {
  docs: {
    description: {
      story: 'Todas las variantes visuales disponibles. Cada una tiene micro-animaciones en hover y estados activos.'
    }
  }
};

export const Primary = Template.bind({});
Primary.args = {
  children: 'Botón Primario',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Botón Secundario',
  variant: 'secondary',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline',
  variant: 'outline',
};

export const Ghost = Template.bind({});
Ghost.args = {
  children: 'Ghost',
  variant: 'ghost',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Eliminar',
  variant: 'danger',
};

export const Success = Template.bind({});
Success.args = {
  children: 'Completado',
  variant: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Advertencia',
  variant: 'warning',
};

// ========== TAMAÑOS ==========

export const AllSizes = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Button size="xs">Extra Small</Button>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra Large</Button>
  </div>
);
AllSizes.parameters = {
  docs: {
    description: {
      story: 'Todos los tamaños disponibles. En móviles, `lg` y `xl` se reducen automáticamente para mejor usabilidad táctil (mínimo 44px de altura).'
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
    <Button rounded="sm">Pequeño</Button>
    <Button rounded="md">Mediano</Button>
    <Button rounded="lg">Grande</Button>
    <Button rounded="xl">Extra Grande</Button>
    <Button rounded="full">Completo</Button>
  </div>
);
BorderRadius.parameters = {
  docs: {
    description: {
      story: 'Diferentes opciones de curvatura para las esquinas del botón.'
    }
  }
};

// ========== ESTADOS ==========

export const States = () => (
  <div style={{
    display: 'grid',
    gap: '1.6rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    maxWidth: '500px'
  }}>
    <Button>Normal</Button>
    <Button loading>Loading</Button>
    <Button disabled>Disabled</Button>
  </div>
);
States.parameters = {
  docs: {
    description: {
      story: 'Estados principales del botón. El estado `loading` muestra un spinner animado y deshabilita la interacción.'
    }
  }
};

export const Loading = Template.bind({});
Loading.args = {
  children: 'Cargando...',
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Deshabilitado',
  disabled: true,
};

// ========== ICONOS ==========

export const IconExamples = () => (
  <div style={{
    display: 'grid',
    gap: '1.6rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
  }}>
    <Button icon="🚀" iconPosition="left">Con Emoji</Button>
    <Button icon="📤" iconPosition="right">Emoji Derecha</Button>
    <Button icon="fas fa-home" variant="secondary">Font Awesome</Button>
    <Button icon="material-icons" variant="outline">Material Icons</Button>
    <Button
      icon={<span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>★</span>}
      variant="ghost"
    >
      React Component
    </Button>
  </div>
);
IconExamples.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de diferentes tipos de iconos soportados: emojis, clases CSS y componentes React.'
    }
  }
};

export const WithIconLeft = Template.bind({});
WithIconLeft.args = {
  children: 'Lanzar',
  icon: '🚀',
  iconPosition: 'left',
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
  children: 'Enviar',
  icon: '📤',
  iconPosition: 'right',
};

// ========== BOTONES SOLO ICONO ==========

export const IconOnlyButtons = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Button iconOnly icon="❤️" ariaLabel="Me gusta" variant="ghost" size="sm" />
    <Button iconOnly icon="🔗" ariaLabel="Compartir" variant="outline" size="md" />
    <Button iconOnly icon="🗑️" ariaLabel="Eliminar" variant="danger" size="md" />
    <Button iconOnly icon="⚙️" ariaLabel="Configuración" variant="secondary" size="lg" />
    <Button iconOnly icon="✏️" ariaLabel="Editar" variant="primary" size="sm" rounded="full" />
  </div>
);
IconOnlyButtons.parameters = {
  docs: {
    description: {
      story: 'Botones que muestran únicamente iconos. Requieren `ariaLabel` para accesibilidad. Ideales para barras de herramientas y acciones rápidas.'
    }
  }
};

// ========== CASOS DE USO COMUNES ==========

export const FormButtons = () => (
  <div style={{
    display: 'flex',
    gap: '1.2rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
    <Button type="submit" variant="primary" icon="💾">
      Guardar
    </Button>
    <Button type="button" variant="secondary">
      Cancelar
    </Button>
    <Button type="reset" variant="outline">
      Limpiar
    </Button>
  </div>
);
FormButtons.parameters = {
  docs: {
    description: {
      story: 'Configuración típica para formularios con diferentes tipos de botón HTML.'
    }
  }
};

export const ActionButtons = () => (
  <div style={{
    display: 'flex',
    gap: '1.2rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
    <Button variant="success" icon="➕" size="sm">
      Crear
    </Button>
    <Button variant="primary" icon="✏️" size="sm">
      Editar
    </Button>
    <Button variant="danger" icon="🗑️" size="sm">
      Eliminar
    </Button>
    <Button variant="ghost" icon="👁️" size="sm">
      Ver
    </Button>
  </div>
);
ActionButtons.parameters = {
  docs: {
    description: {
      story: 'Botones de acción típicos para listas, tablas y tarjetas con variantes semánticas.'
    }
  }
};

export const ToolbarActions = () => (
  <div style={{
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    padding: '0.8rem',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    flexWrap: 'wrap'
  }}>
    <Button iconOnly icon="📄" ariaLabel="Nuevo documento" variant="ghost" size="sm" />
    <Button iconOnly icon="📁" ariaLabel="Abrir archivo" variant="ghost" size="sm" />
    <Button iconOnly icon="💾" ariaLabel="Guardar" variant="ghost" size="sm" />
    <div style={{ width: '1px', height: '2.4rem', backgroundColor: 'var(--border-primary)' }} />
    <Button iconOnly icon="↩️" ariaLabel="Deshacer" variant="ghost" size="sm" />
    <Button iconOnly icon="↪️" ariaLabel="Rehacer" variant="ghost" size="sm" />
    <div style={{ width: '1px', height: '2.4rem', backgroundColor: 'var(--border-primary)' }} />
    <Button iconOnly icon="🎨" ariaLabel="Formato" variant="ghost" size="sm" />
    <Button iconOnly icon="🖼️" ariaLabel="Insertar imagen" variant="ghost" size="sm" />
  </div>
);
ToolbarActions.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de barra de herramientas con botones solo icono y separadores.'
    }
  }
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Ancho completo',
  fullWidth: true,
  variant: 'primary',
};
FullWidth.parameters = {
  docs: {
    description: {
      story: 'Botón que ocupa todo el ancho disponible. Útil para formularios y CTAs principales.'
    }
  }
};

// ========== PERSONALIZACIÓN ==========

export const CustomStyling = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
    <Button
      className="custom-shadow"
      style={{
        '--custom-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'var(--custom-gradient)',
        border: 'none',
        color: 'white'
      }}
    >
      Gradiente Custom
    </Button>
    <Button
      variant="outline"
      style={{
        borderWidth: '2px',
        borderStyle: 'dashed',
        '--hover-bg': 'var(--color-primary-light)'
      }}
      rounded="xl"
    >
      Borde Punteado
    </Button>
    <Button
      variant="ghost"
      compact
      size="sm"
      style={{
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: '600'
      }}
    >
      Tipografía
    </Button>
  </div>
);
CustomStyling.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de personalización usando `className`, `style` props y variables CSS custom.'
    }
  }
};

// ========== MODIFICADORES ==========

export const Modifiers = () => (
  <div style={{
    display: 'grid',
    gap: '1.6rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
  }}>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem' }}>Normal</h4>
      <Button size="md">Botón Normal</Button>
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem' }}>Compacto</h4>
      <Button size="md" compact>Botón Compacto</Button>
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem' }}>Solo Icono</h4>
      <Button iconOnly icon="⚙️" ariaLabel="Configuración" size="md" />
    </div>
    <div>
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.4rem' }}>Ancho Completo</h4>
      <Button fullWidth size="md">Ancho Completo</Button>
    </div>
  </div>
);
Modifiers.parameters = {
  docs: {
    description: {
      story: 'Diferentes modificadores que afectan el comportamiento y apariencia del botón.'
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
      <Button size="lg">Large en Desktop</Button>
      <Button size="xl">XL en Desktop</Button>
    </div>
    <p style={{
      fontSize: '1.2rem',
      color: 'var(--text-muted)',
      margin: 0,
      fontStyle: 'italic'
    }}>
      En móviles (&lt;768px), estos botones se reducen y mantienen un área táctil mínima de 44px
    </p>
  </div>
);

ResponsiveExample.parameters = {
  docs: {
    description: {
      story: 'Los tamaños `lg` y `xl` se ajustan automáticamente en pantallas móviles para mejor usabilidad táctil siguiendo las guías de accesibilidad.'
    }
  }
};

// ========== MODO OSCURO ==========

export const DarkModeExample = () => (
  <div className="dark" style={{
    padding: '2.4rem',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-primary)'
  }}>
    <div style={{
      display: 'grid',
      gap: '1.6rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
    }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
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

// ========== ACCESIBILIDAD ==========

export const AccessibilityExamples = () => (
  <div style={{
    display: 'flex',
    gap: '1.6rem',
    flexDirection: 'column'
  }}>
    <div style={{
      display: 'flex',
      gap: '1.2rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <Button 
        iconOnly 
        icon="❤️" 
        ariaLabel="Agregar a favoritos" 
        variant="ghost"
        ariaDescribedBy="heart-description"
      />
      <Button 
        loading 
        variant="primary"
        ariaLabel="Guardando documento"
      >
        Guardando...
      </Button>
      <Button 
        disabled 
        variant="secondary"
        ariaLabel="Función no disponible"
      >
        No disponible
      </Button>
    </div>
    <div id="heart-description" style={{
      fontSize: '1.2rem',
      color: 'var(--text-muted)',
      fontStyle: 'italic'
    }}>
      Haz clic para agregar este elemento a tu lista de favoritos
    </div>
  </div>
);
AccessibilityExamples.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de uso correcto de ARIA labels y descripciones para mejor accesibilidad.'
    }
  }
};