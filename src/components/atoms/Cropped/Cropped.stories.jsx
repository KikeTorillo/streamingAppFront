import React, { useState } from 'react';
import { Cropped } from './Cropped';

export default {
  title: 'Components/Atoms/Cropped',
  component: Cropped,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Cropped Atom

El átomo **Cropped** permite recortar imágenes de forma sencilla y accesible.
Utiliza variables del sistema y sigue nuestro diseño minimalista.

## 🔧 Uso básico
```jsx
import { Cropped } from './atoms/Cropped';

<Cropped imageSrc="imagen.jpg" onComplete={handleCrop} />
```
        `
      }
    }
  },
  argTypes: {
    imageSrc: {
      name: 'Imagen',
      description: 'URL de la imagen a recortar',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    aspect: {
      name: 'Relación de aspecto',
      description: 'Relación ancho/alto del recorte',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: '16/9' } }
    },
    onComplete: {
      name: 'onComplete',
      description: 'Callback al confirmar el recorte',
      action: 'completed',
      table: { type: { summary: 'function' } }
    }
  }
};

const Template = (args) => <Cropped {...args} />;

export const Default = Template.bind({});
Default.args = {
  imageSrc: 'https://via.placeholder.com/800x600',
  aspect: 16 / 9
};
Default.parameters = {
  docs: { description: { story: 'Configuración por defecto.' } }
};

export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    {['xs','sm','md','lg','xl'].map((s, i) => (
      <div key={s} style={{ height: 120 + i * 40 }}>
        <Cropped imageSrc="https://via.placeholder.com/800x600" aspect={1} />
      </div>
    ))}
  </div>
);
Sizes.parameters = {
  docs: { description: { story: 'Ejemplo con alturas variables.' } }
};

export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    {[1, 4/3, 16/9, 21/9].map((a) => (
      <Cropped key={a} imageSrc="https://via.placeholder.com/800x600" aspect={a} />
    ))}
  </div>
);
Variants.parameters = {
  docs: { description: { story: 'Varias relaciones de aspecto.' } }
};

export const States = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <Cropped imageSrc="https://via.placeholder.com/800x600" aspect={16/9} />
  </div>
);
States.parameters = {
  docs: { description: { story: 'Estado inicial del componente.' } }
};

export const Interactive = () => {
  const [lastBlob, setBlob] = useState(null);
  const handleComplete = (blob) => {
    setBlob(blob);
    alert('Imagen recortada');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', alignItems: 'center', padding: 'var(--space-md)' }}>
      <Cropped imageSrc="https://via.placeholder.com/800x600" aspect={16/9} onComplete={handleComplete} />
      {lastBlob && <p style={{ color: 'var(--text-success)' }}>Recorte listo</p>}
    </div>
  );
};
Interactive.parameters = {
  docs: { description: { story: 'Interactúa y confirma el recorte.' } }
};

export const Accessibility = Template.bind({});
Accessibility.args = {
  imageSrc: 'https://via.placeholder.com/800x600',
  aspect: 1
};
Accessibility.parameters = {
  docs: { description: { story: 'Asegura foco y roles accesibles.' } }
};
