import React, { useState } from 'react';
import { Avatar } from './Avatar';
import './Avatar.css';

export default {
  title: 'Components/Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Avatar Atom

El átomo **Avatar** es un componente fundamental para mostrar imágenes de perfil, iniciales de usuario y estados de actividad. 
Sigue perfectamente el sistema de diseño con variables CSS, responsive design y accesibilidad completa.

## 🎯 Características principales

- **6 tamaños**: XS, SM, MD, LG, XL, 2XL (responsive con área táctil)
- **3 variantes de forma**: Circle, Rounded, Square
- **5 esquemas de color**: Primary, Secondary, Success, Warning, Danger
- **Estados de actividad**: Online, Offline, Away, Busy
- **Badges/contadores**: Notificaciones y números
- **Estados completos**: Normal, Hover, Loading, Clickable
- **Accesibilidad completa**: ARIA, navegación por teclado, tooltips
- **Theming automático**: Variables CSS del sistema, modo oscuro
- **Mobile-first**: Área táctil de 44px, optimización iOS

## 🏗️ Atomic Design

Como **átomo perfecto**:
- ✅ **Componente básico**: No depende de otros componentes
- ✅ **Altamente reutilizable**: Headers, listas, comentarios, chat
- ✅ **Consistente**: Usa las mismas variables que Button/Input
- ✅ **Extensible**: Base para AvatarGroup y componentes complejos

## 📱 Sistema de diseño

Usa automáticamente todas las variables CSS del sistema:
- Espaciado, tipografía, colores coherentes con Button/Input/TextInput
- Responsive con breakpoints estándar (768px)
- Modo oscuro automático con clase \`.dark\`
- Transiciones y animaciones del sistema

## 🔧 Uso básico

\`\`\`jsx
import { Avatar } from './atoms/Avatar';

// Avatar con imagen
<Avatar 
  src="https://ejemplo.com/foto.jpg"
  name="Juan Pérez"
  size="lg"
/>

// Avatar con iniciales
<Avatar 
  name="María González"
  size="md"
  colorScheme="success"
/>

// Avatar con estado y badge
<Avatar 
  src="perfil.jpg"
  name="Carlos López"
  status="online"
  badge={3}
  onClick={handleClick}
  showTooltip
/>

// Avatar clickeable con loading
<Avatar 
  name="Ana Silva"
  size="xl"
  variant="rounded"
  loading={isUploading}
  onClick={handleUpload}
/>
\`\`\`

## 🎨 Casos de uso

**Headers y navegación:**
\`\`\`jsx
<Avatar 
  src={user.avatar}
  name={user.name}
  size="sm"
  onClick={openUserMenu}
  showTooltip
/>
\`\`\`

**Listas de usuarios:**
\`\`\`jsx
<Avatar 
  name={member.name}
  status={member.status}
  size="md"
  variant="circle"
/>
\`\`\`

**Chat y comentarios:**
\`\`\`jsx
<Avatar 
  src={message.author.avatar}
  name={message.author.name}
  size="sm"
  variant="rounded"
/>
\`\`\`

## ♿ Accesibilidad

- **ARIA completo**: \`aria-label\`, \`role\`, \`title\`
- **Navegación por teclado**: Tab, Enter, Space
- **Screen readers**: Descripciones contextuales
- **Área táctil**: Mínimo 44px en móviles para versiones clickeable
- **Tooltips**: Información adicional en hover
- **Estados anunciados**: Loading, status changes

## 🎭 Variables CSS heredadas

Usa automáticamente las variables del sistema:
\`\`\`css
:root {
  --space-xs: 0.4rem;
  --font-weight-semibold: 600;
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --border-default: #d1d5db;
  --border-focus: #3b82f6;
  --transition-normal: 0.2s ease-in-out;
  --shadow-md: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
  /* Y todas las demás del sistema... */
}
\`\`\`

## 🚀 Características avanzadas

- **Fallback inteligente**: Imagen → Iniciales → Icono
- **Loading states**: Spinner animado durante carga
- **Error handling**: Manejo automático de imágenes rotas
- **Performance**: Lazy loading, optimizaciones CSS
- **Tooltips opcionales**: Información en hover
- **Badges animados**: Pulse effect para notificaciones
        `
      }
    }
  },
  argTypes: {
    src: {
      name: 'Imagen (src)',
      description: 'URL de la imagen del avatar',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    name: {
      name: 'Nombre',
      description: 'Nombre del usuario (genera iniciales si no hay imagen)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del avatar (responsive en móviles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Forma del avatar',
      control: 'select',
      options: ['circle', 'rounded', 'square'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'circle'" }
      }
    },
    colorScheme: {
      name: 'Esquema de color',
      description: 'Color de fondo para iniciales (cuando no hay imagen)',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'primary'" }
      }
    },
    status: {
      name: 'Estado',
      description: 'Indicador de estado de actividad',
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
      table: {
        type: { summary: 'string' }
      }
    },
    badge: {
      name: 'Badge',
      description: 'Número o texto para mostrar como badge',
      control: 'text',
      table: {
        type: { summary: 'string | number' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra spinner de carga',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    showTooltip: {
      name: 'Mostrar tooltip',
      description: 'Muestra tooltip con el nombre en hover',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    fallbackIcon: {
      name: 'Icono fallback',
      description: 'Icono a mostrar cuando no hay imagen ni nombre',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'👤'" }
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función a ejecutar al hacer clic (hace el avatar clickeable)',
      action: 'clicked',
      table: {
        type: { summary: 'function' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales para personalización',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// Template base
const Template = (args) => <Avatar {...args} />;

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  name: 'Juan Pérez',
  size: 'md',
  variant: 'circle',
  colorScheme: 'primary'
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles de abajo para experimentar con todas las opciones del Avatar. Cambia el tamaño, forma, colores y funcionalidades.'
    }
  }
};

// ========== TAMAÑOS ==========

export const AllSizes = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="xs" name="XS" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        XS (24px)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="sm" name="SM" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        SM (32px)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="md" name="MD" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        MD (40px)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="lg" name="LG" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        LG (48px)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="xl" name="XL" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        XL (64px)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar size="2xl" name="2XL" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        2XL (80px)
      </p>
    </div>
  </div>
);
AllSizes.parameters = {
  docs: {
    description: {
      story: 'Todos los tamaños disponibles. En móviles, los tamaños XS y SM mantienen un área táctil mínima de 44px cuando son clickeables.'
    }
  }
};

// ========== VARIANTES DE FORMA ==========

export const ShapeVariants = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-xl)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        variant="circle" 
        name="María González" 
        size="lg"
        colorScheme="primary"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Circle (default)
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        variant="rounded" 
        name="Carlos López" 
        size="lg"
        colorScheme="success"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Rounded
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        variant="square" 
        name="Ana Silva" 
        size="lg"
        colorScheme="warning"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Square
      </p>
    </div>
  </div>
);
ShapeVariants.parameters = {
  docs: {
    description: {
      story: 'Tres variantes de forma: circle (circular), rounded (esquinas redondeadas) y square (esquinas cuadradas).'
    }
  }
};

// ========== ESQUEMAS DE COLOR ==========

export const ColorSchemes = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Primary" colorScheme="primary" size="lg" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        Primary
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Secondary" colorScheme="secondary" size="lg" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        Secondary
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Success" colorScheme="success" size="lg" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        Success
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Warning" colorScheme="warning" size="lg" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        Warning
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar name="Danger" colorScheme="danger" size="lg" />
      <p style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)', color: 'var(--text-muted)' }}>
        Danger
      </p>
    </div>
  </div>
);
ColorSchemes.parameters = {
  docs: {
    description: {
      story: 'Cinco esquemas de color usando las variables del sistema. Se aplican cuando se muestran iniciales (sin imagen).'
    }
  }
};

// ========== CON IMÁGENES ==========

export const WithImages = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <Avatar 
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      name="John Doe"
      size="lg"
    />
    <Avatar 
      src="https://images.unsplash.com/photo-1494790108755-2616b612f3f7?w=150&h=150&fit=crop&crop=face"
      name="Jane Smith"
      size="lg"
      variant="rounded"
    />
    <Avatar 
      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      name="Mike Johnson"
      size="lg"
      variant="square"
    />
    <Avatar 
      src="imagen-rota.jpg"
      name="Fallback Test"
      size="lg"
      colorScheme="success"
    />
  </div>
);
WithImages.parameters = {
  docs: {
    description: {
      story: 'Avatares con imágenes reales. El último ejemplo muestra el fallback automático a iniciales cuando la imagen falla.'
    }
  }
};

// ========== ESTADOS DE ACTIVIDAD ==========

export const ActivityStatus = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-xl)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="Online User" 
        status="online" 
        size="lg"
        colorScheme="primary"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Online
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="Away User" 
        status="away" 
        size="lg"
        colorScheme="secondary"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Away
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="Busy User" 
        status="busy" 
        size="lg"
        colorScheme="warning"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Busy
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="Offline User" 
        status="offline" 
        size="lg"
        colorScheme="danger"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Offline
      </p>
    </div>
  </div>
);
ActivityStatus.parameters = {
  docs: {
    description: {
      story: 'Indicadores de estado de actividad: online (verde), away (amarillo), busy (rojo), offline (gris).'
    }
  }
};

// ========== CON BADGES ==========

export const WithBadges = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-xl)',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="User 1" 
        badge="3" 
        size="lg"
        colorScheme="primary"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        3 notificaciones
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="User 2" 
        badge="99+" 
        size="lg"
        colorScheme="success"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        99+ mensajes
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        name="User 3" 
        badge="1" 
        status="online"
        size="lg"
        colorScheme="warning"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Badge + Status
      </p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        name="John Doe"
        badge="5"
        status="away"
        size="lg"
      />
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
        Imagen + Badge + Status
      </p>
    </div>
  </div>
);
WithBadges.parameters = {
  docs: {
    description: {
      story: 'Badges para mostrar contadores de notificaciones. Pueden combinarse con estados de actividad e imágenes.'
    }
  }
};

// ========== ESTADOS INTERACTIVOS ==========

export const InteractiveStates = () => {
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    alert(`Avatar clickeado ${clickCount + 1} veces`);
  };

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-xl)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar 
          name="Normal" 
          size="lg"
          colorScheme="primary"
        />
        <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          Normal
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Avatar 
          name="Clickeable" 
          size="lg"
          colorScheme="success"
          onClick={handleClick}
          showTooltip
        />
        <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          Clickeable
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Avatar 
          name="Loading" 
          size="lg"
          colorScheme="warning"
          loading={loading}
          onClick={handleLoadingClick}
        />
        <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          Loading State
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Avatar 
          name="With Tooltip" 
          size="lg"
          colorScheme="danger"
          showTooltip
        />
        <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          Con Tooltip
        </p>
      </div>
    </div>
  );
};
InteractiveStates.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos: normal, clickeable (con hover), loading (con spinner) y tooltip. Prueba hacer clic en los avatares.'
    }
  }
};

// ========== CASOS DE USO REALES ==========

export const HeaderExample = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)',
    maxWidth: '500px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)'
    }}>
      <h3 style={{ 
        margin: 0, 
        fontSize: 'var(--font-size-lg)', 
        color: 'var(--text-primary)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Mi Dashboard
      </h3>
    </div>
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)'
    }}>
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        name="Juan Pérez"
        size="md"
        badge="3"
        status="online"
        onClick={() => alert('Abrir menú de usuario')}
        showTooltip
      />
    </div>
  </div>
);
HeaderExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de uso en header de aplicación con avatar clickeable, badge de notificaciones y estado online.'
    }
  }
};

export const UserListExample = () => {
  const users = [
    { 
      id: 1, 
      name: 'María González', 
      email: 'maria@ejemplo.com', 
      status: 'online',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612f3f7?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 2, 
      name: 'Carlos López', 
      email: 'carlos@ejemplo.com', 
      status: 'away',
      avatar: null
    },
    { 
      id: 3, 
      name: 'Ana Silva', 
      email: 'ana@ejemplo.com', 
      status: 'busy',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 4, 
      name: 'Roberto Martín', 
      email: 'roberto@ejemplo.com', 
      status: 'offline',
      avatar: null
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      maxWidth: '400px'
    }}>
      <h3 style={{ 
        margin: 0, 
        fontSize: 'var(--font-size-lg)', 
        color: 'var(--text-primary)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Miembros del equipo
      </h3>
      
      {users.map(user => (
        <div key={user.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-md)',
          transition: 'background-color var(--transition-normal)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <Avatar 
            src={user.avatar}
            name={user.name}
            status={user.status}
            size="md"
            colorScheme="primary"
          />
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-base)', 
              color: 'var(--text-primary)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {user.name}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--text-muted)'
            }}>
              {user.email}
            </p>
          </div>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: user.status === 'online' ? 'var(--color-success)' : 
                   user.status === 'away' ? 'var(--color-warning)' :
                   user.status === 'busy' ? 'var(--color-danger)' : 'var(--text-muted)',
            fontWeight: 'var(--font-weight-medium)',
            textTransform: 'capitalize'
          }}>
            {user.status}
          </span>
        </div>
      ))}
    </div>
  );
};
UserListExample.parameters = {
  docs: {
    description: {
      story: 'Lista de usuarios típica con avatares, estados de actividad y información adicional. Hover effects incluidos.'
    }
  }
};

export const ChatExample = () => {
  const messages = [
    {
      id: 1,
      author: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612f3f7?w=150&h=150&fit=crop&crop=face',
      message: '¡Hola equipo! ¿Cómo van los avances del proyecto?',
      time: '10:30'
    },
    {
      id: 2,
      author: 'Carlos López',
      avatar: null,
      message: 'Todo va muy bien, ya casi termino mi parte.',
      time: '10:32'
    },
    {
      id: 3,
      author: 'Ana Silva',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      message: 'Perfecto, yo también estoy al día. ¿Revisamos juntos mañana?',
      time: '10:35'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      maxWidth: '500px',
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: 0, 
        fontSize: 'var(--font-size-lg)', 
        color: 'var(--text-primary)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Chat del proyecto
      </h3>
      
      {messages.map(message => (
        <div key={message.id} style={{
          display: 'flex',
          gap: 'var(--space-md)',
          alignItems: 'flex-start'
        }}>
          <Avatar 
            src={message.avatar}
            name={message.author}
            size="sm"
            variant="rounded"
            colorScheme="primary"
          />
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-xs)'
            }}>
              <span style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                {message.author}
              </span>
              <span style={{ 
                fontSize: 'var(--font-size-xs)', 
                color: 'var(--text-muted)'
              }}>
                {message.time}
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-base)', 
              color: 'var(--text-primary)',
              lineHeight: 'var(--line-height-normal)'
            }}>
              {message.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
ChatExample.parameters = {
  docs: {
    description: {
      story: 'Interfaz de chat con avatares pequeños, variante rounded y fallback a iniciales cuando no hay imagen.'
    }
  }
};

// ========== RESPONSIVE ==========

export const ResponsiveExample = () => (
  <div style={{
    display: 'flex',
    gap: 'var(--space-lg)',
    flexDirection: 'column'
  }}>
    <p style={{
      fontSize: 'var(--font-size-base)',
      color: 'var(--text-muted)',
      margin: 0
    }}>
      Redimensiona la ventana para ver el comportamiento responsive:
    </p>
    
    <div style={{
      display: 'flex',
      gap: 'var(--space-md)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <Avatar 
        size="xs" 
        name="XS Clickeable"
        onClick={() => alert('XS clickeado')}
        colorScheme="primary"
      />
      <Avatar 
        size="sm" 
        name="SM Clickeable"
        onClick={() => alert('SM clickeado')}
        colorScheme="success"
      />
      <Avatar 
        size="md" 
        name="MD Normal"
        colorScheme="warning"
      />
    </div>
    
    <p style={{
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-muted)',
      margin: 0,
      fontStyle: 'italic'
    }}>
      En móviles (&lt;768px), los avatares XS y SM clickeables mantienen un área táctil mínima de 44px
    </p>
  </div>
);

ResponsiveExample.parameters = {
  docs: {
    description: {
      story: 'Comportamiento responsive. Los avatares pequeños clickeables aumentan su área táctil en móviles para cumplir con las guías de accesibilidad.'
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
    <div style={{
      display: 'flex',
      gap: 'var(--space-lg)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <Avatar 
        name="Primary Dark" 
        size="lg"
        colorScheme="primary"
      />
      <Avatar 
        name="Success Dark" 
        size="lg"
        colorScheme="success"
        status="online"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        name="John Doe"
        size="lg"
        badge="5"
        status="away"
      />
      <Avatar 
        name="Clickeable Dark" 
        size="lg"
        colorScheme="warning"
        onClick={() => alert('Avatar en modo oscuro')}
        showTooltip
      />
    </div>
  </div>
);
DarkModeExample.parameters = {
  docs: {
    description: {
      story: 'Avatar en modo oscuro. Todos los elementos se adaptan automáticamente usando las variables CSS del sistema.'
    }
  }
};