// src/components/atoms/FileInput/FileInput.stories.jsx
import React from 'react';
import { FileInput } from './FileInput';
import './FileInput.css';

export default {
  title: 'Components/Atoms/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# FileInput - Átomo del Sistema de Diseño

Componente **FileInput** completamente alineado con el sistema de diseño, siguiendo los mismos patrones que Button e Input.

## 🎯 Características principales

- **5 tamaños**: XS, SM, MD, LG, XL (responsive con área táctil)
- **4 variantes**: Default, Success, Warning, Danger
- **Estados completos**: Normal, Focus, Hover, Disabled, Has-files
- **Accesibilidad**: ARIA completo, navegación por teclado, live regions
- **Múltiples archivos**: Soporte para \`multiple\`
- **Información rica**: Preview de archivos con nombre y tamaño
- **Theming**: Variables CSS del sistema, modo oscuro automático
- **Mobile-first**: Área táctil de 44px, optimizado para touch

## 🏗️ Consistencia con el sistema

Usa las mismas variables CSS que Button, Input y TextInput:
- Espaciado, tipografía, colores coherentes
- Estados focus/hover/disabled idénticos
- Radio de bordes y transiciones uniformes
- Mensajes de error y ayuda como TextInput

## 📱 Responsive design

- Área táctil mínima de 44px en móviles
- Ajustes automáticos de tamaño de fuente
- Animaciones optimizadas para rendimiento
        `
      }
    }
  },
  argTypes: {
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente (como Button/Input)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual semántica',
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
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
    accept: {
      name: 'Tipos aceptados',
      description: 'Tipos MIME de archivos permitidos',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    text: {
      name: 'Texto del botón',
      description: 'Texto descriptivo del botón de selección',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Seleccionar archivo'" }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Mensaje informativo (como TextInput)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Mensaje de error',
      description: 'Mensaje de error (sobrescribe variant)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    multiple: {
      name: 'Múltiples archivos',
      description: 'Permite seleccionar múltiples archivos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el input',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Marca el campo como obligatorio',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onChange: {
      name: 'onChange',
      description: 'Función que se ejecuta al seleccionar archivo',
      action: 'fileSelected',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// Template base para el playground
const PlaygroundTemplate = (args) => (
  <FileInput 
    {...args} 
    onChange={(e) => {
      console.log('Archivos seleccionados:', e.target.files);
      args.onChange?.(e);
    }}
  />
);

// ===== HISTORIAS PRINCIPALES =====

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  text: 'Seleccionar archivo',
  size: 'md',
  variant: 'default',
  rounded: 'md'
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles para experimentar con todas las opciones del FileInput. Completamente integrado con el sistema de diseño.'
    }
  }
};

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-lg)',
    maxWidth: '500px'
  }}>
    <FileInput size="xs" text="Extra pequeño (XS)" />
    <FileInput size="sm" text="Pequeño (SM)" />
    <FileInput size="md" text="Mediano (MD)" />
    <FileInput size="lg" text="Grande (LG)" />
    <FileInput size="xl" text="Extra grande (XL)" />
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Todos los tamaños disponibles del FileInput, siguiendo el mismo patrón que Button e Input.'
    }
  }
};

// ===== VARIANTES =====

export const Variants = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '800px'
  }}>
    <FileInput variant="default" text="Default" />
    <FileInput variant="success" text="Success" />
    <FileInput variant="warning" text="Warning" />
    <FileInput variant="danger" text="Danger" />
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas del FileInput, consistentes con el sistema de colores.'
    }
  }
};

// ===== ESTADOS =====

export const States = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-lg)',
    maxWidth: '400px'
  }}>
    <FileInput text="Normal" helperText="Estado normal del componente" />
    <FileInput text="Requerido" required helperText="Campo obligatorio" />
    <FileInput text="Deshabilitado" disabled helperText="Input deshabilitado" />
    <FileInput text="Con error" errorText="Este campo es obligatorio" />
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Diferentes estados del FileInput con mensajes de ayuda y error.'
    }
  }
};

// ===== TIPOS DE ARCHIVO =====

export const FileTypes = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '800px'
  }}>
    <FileInput
      accept="image/*"
      text="Solo imágenes"
      helperText="JPG, PNG, GIF, WebP"
    />
    <FileInput
      accept="video/*"
      text="Solo videos"
      helperText="MP4, WebM, AVI, MOV"
    />
    <FileInput
      accept=".pdf,.doc,.docx,.txt"
      text="Documentos"
      helperText="PDF, Word, Texto"
    />
    <FileInput
      accept="audio/*"
      text="Solo audio"
      helperText="MP3, WAV, OGG"
    />
  </div>
);

FileTypes.parameters = {
  docs: {
    description: {
      story: 'FileInput configurado para diferentes tipos de archivos usando el atributo accept.'
    }
  }
};

// ===== MÚLTIPLES ARCHIVOS =====

export const MultipleFiles = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-lg)',
    maxWidth: '400px'
  }}>
    <FileInput
      multiple
      text="Seleccionar múltiples archivos"
      helperText="Puedes seleccionar varios archivos a la vez"
    />
    <FileInput
      multiple
      accept="image/*"
      text="Múltiples imágenes"
      helperText="Selecciona todas las imágenes que necesites"
      variant="success"
    />
  </div>
);

MultipleFiles.parameters = {
  docs: {
    description: {
      story: 'FileInput configurado para seleccionar múltiples archivos simultáneamente.'
    }
  }
};

// ===== RADIO DE BORDES =====

export const BorderRadius = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '800px'
  }}>
    <FileInput rounded="sm" text="Pequeño" />
    <FileInput rounded="md" text="Mediano" />
    <FileInput rounded="lg" text="Grande" />
    <FileInput rounded="xl" text="Extra grande" />
    <FileInput rounded="full" text="Completo" />
  </div>
);

BorderRadius.parameters = {
  docs: {
    description: {
      story: 'Diferentes opciones de radio de bordes, consistentes con el sistema de diseño.'
    }
  }
};

// ===== EJEMPLO COMPLETO CON FUNCIONALIDAD =====

export const CompleteExample = () => {
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [error, setError] = React.useState('');
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setError('');
    
    // Validación de ejemplo
    if (files.length === 0) {
      setError('Debes seleccionar al menos un archivo');
      return;
    }
    
    // Validar tamaño (ejemplo: máximo 5MB por archivo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`Algunos archivos superan los 5MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
  };
  
  return (
    <div style={{ 
      maxWidth: '500px',
      padding: 'var(--space-lg)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-lg) 0', 
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        📎 Subir archivos del proyecto
      </h3>
      
      <FileInput
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        text="Seleccionar archivos"
        helperText="Imágenes, videos o documentos (máx. 5MB cada uno)"
        errorText={error}
        size="lg"
        variant={error ? 'danger' : selectedFiles.length > 0 ? 'success' : 'default'}
        onChange={handleFileChange}
        required
      />
      
      {selectedFiles.length > 0 && (
        <div style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-success-light)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-success)'
        }}>
          <h4 style={{ 
            margin: '0 0 var(--space-sm) 0',
            color: 'var(--color-success-dark)',
            fontSize: 'var(--font-size-base)'
          }}>
            ✅ {selectedFiles.length} archivo{selectedFiles.length !== 1 ? 's' : ''} seleccionado{selectedFiles.length !== 1 ? 's' : ''}
          </h4>
          
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success-dark)' }}>
            <strong>Tamaño total:</strong> {(selectedFiles.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}
    </div>
  );
};

CompleteExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo con validación, múltiples archivos, y feedback visual rico.'
    }
  }
};

// ===== INTEGRACIÓN CON FORMULARIOS =====

export const FormIntegration = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    avatar: null,
    documents: []
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Formulario enviado (revisa la consola)');
  };
  
  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '500px',
      padding: 'var(--space-xl)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)'
    }}>
      <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>
        📋 Formulario con FileInput
      </h3>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)'
        }}>
          Nombre completo
        </label>
        <input 
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)'
          }}
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)'
        }}>
          Foto de perfil
        </label>
        <FileInput
          accept="image/*"
          text="Seleccionar foto"
          helperText="JPG, PNG o GIF (máx. 2MB)"
          onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)'
        }}>
          Documentos adicionales
        </label>
        <FileInput
          multiple
          accept=".pdf,.doc,.docx"
          text="Seleccionar documentos"
          helperText="PDF o Word (opcional)"
          variant="secondary"
          onChange={(e) => setFormData({...formData, documents: Array.from(e.target.files || [])})}
        />
      </div>
      
      <button 
        type="submit"
        style={{
          padding: 'var(--space-sm) var(--space-lg)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-primary)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)'
        }}
      >
        📤 Enviar formulario
      </button>
    </form>
  );
};

FormIntegration.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de integración del FileInput en un formulario completo con otros campos.'
    }
  }
};

// Template base
const Template = (args) => (
  <FileInput 
    {...args} 
    onChange={(e) => {
      console.log('Archivo seleccionado:', e.target.files[0]);
      args.onChange?.(e);
    }}
  />
);

// ===== STORIES =====

export const Default = Template.bind({});
Default.args = {
  text: 'Selecciona un archivo'
};
Default.parameters = {
  docs: {
    description: {
      story: 'FileInput básico que acepta cualquier tipo de archivo.'
    }
  }
};

export const ImagesOnly = Template.bind({});
ImagesOnly.args = {
  accept: 'image/*',
  text: 'Selecciona una imagen'
};
ImagesOnly.parameters = {
  docs: {
    description: {
      story: 'FileInput configurado para aceptar solo archivos de imagen.'
    }
  }
};

export const DocumentsOnly = Template.bind({});
DocumentsOnly.args = {
  accept: '.pdf,.doc,.docx,.txt',
  text: 'Selecciona un documento'
};
DocumentsOnly.parameters = {
  docs: {
    description: {
      story: 'FileInput configurado para documentos específicos.'
    }
  }
};

export const VideoFiles = Template.bind({});
VideoFiles.args = {
  accept: 'video/*',
  text: 'Selecciona un video'
};
VideoFiles.parameters = {
  docs: {
    description: {
      story: 'FileInput configurado para archivos de video.'
    }
  }
};

// Ejemplo interactivo con estado
export const WithFilePreview = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '2rem',
      padding: '2rem' 
    }}>
      <FileInput
        accept="image/*"
        text="Selecciona una imagen"
        onChange={handleFileChange}
      />
      
      {selectedFile && (
        <div style={{
          padding: '1rem',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Archivo seleccionado:
          </h3>
          <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            <strong>Nombre:</strong> {selectedFile.name}
          </p>
          <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            <strong>Tamaño:</strong> {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
          <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            <strong>Tipo:</strong> {selectedFile.type}
          </p>
          
          {selectedFile.type.startsWith('image/') && (
            <div style={{ marginTop: '1rem' }}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

WithFilePreview.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo con preview del archivo seleccionado y información detallada.'
    }
  }
};