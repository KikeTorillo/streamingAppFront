import React from 'react';
import { UploadProgress } from './UploadProgress';

export default {
  title: 'Components/Atoms/UploadProgress',
  component: UploadProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# UploadProgress Atom

Muestra el estado de subida de archivos con barra de progreso y mensajes.

## 🔧 Uso básico
```jsx
import { UploadProgress } from './atoms/UploadProgress';

<UploadProgress progress={40} />
```
        `
      }
    }
  },
  argTypes: {
    progress: {
      name: 'Progreso',
      description: 'Porcentaje de avance',
      control: 'number',
      table: { type: { summary: 'number' } }
    },
    message: {
      name: 'Mensaje',
      description: 'Texto de estado',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    status: {
      name: 'Estado',
      description: 'processing | transcoding | completed | failed',
      control: 'select',
      options: ['processing','transcoding','completed','failed'],
      table: { type: { summary: 'string' }, defaultValue: { summary: 'processing' } }
    },
    showPercentage: {
      name: 'Mostrar porcentaje',
      description: 'Muestra porcentaje numérico',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    size: {
      name: 'Tamaño',
      description: 'sm | md | lg',
      control: 'select',
      options: ['sm','md','lg'],
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } }
    }
  }
};

const Template = (args) => <UploadProgress {...args} />;

export const Default = Template.bind({});
Default.args = {
  progress: 40,
  message: 'Subiendo archivo...',
  status: 'processing'
};
Default.parameters = {
  docs: { description: { story: 'Configuración inicial.' } }
};

export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <UploadProgress size='sm' progress={20} />
    <UploadProgress size='md' progress={50} />
    <UploadProgress size='lg' progress={80} />
  </div>
);
Sizes.parameters = {
  docs: { description: { story: 'Tres tamaños disponibles.' } }
};

export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <UploadProgress status='processing' progress={30} />
    <UploadProgress status='transcoding' progress={60} />
    <UploadProgress status='completed' progress={100} />
    <UploadProgress status='failed' progress={30} />
  </div>
);
Variants.parameters = {
  docs: { description: { story: 'Estados semánticos del componente.' } }
};

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', alignItems: 'center', padding: 'var(--space-md)' }}>
    <UploadProgress progress={0} status='processing' />
    <UploadProgress progress={70} status='processing' />
    <UploadProgress progress={100} status='completed' />
  </div>
);
States.parameters = {
  docs: { description: { story: 'Diferentes niveles de avance.' } }
};

export const Interactive = Template.bind({});
Interactive.args = {
  progress: 75,
  message: 'Transcodificando...',
  status: 'transcoding'
};
Interactive.parameters = {
  docs: { description: { story: 'Controla props en tiempo real.' } }
};

export const Accessibility = Template.bind({});
Accessibility.args = {
  progress: 100,
  message: 'Completado',
  status: 'completed'
};
Accessibility.parameters = {
  docs: { description: { story: 'Iconos y texto accesibles para todos los estados.' } }
};
