// atoms/ContentImage/ContentImage.stories.jsx
import React, { useState } from 'react';
import { ContentImage } from './ContentImage';
import './ContentImage.css';

export default {
  title: 'Components/Atoms/ContentImage',
  component: ContentImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ContentImage Atom

El átomo **ContentImage** es un componente especializado para mostrar imágenes de contenido multimedia con aspect ratios específicos, fallbacks inteligentes y estados de carga optimizados.

## 🎯 Características principales

- **7 aspect ratios**: 1:1, 4:3, 3:2, 16:9, 2:3, 3:4, auto
- **5 object fit modes**: Cover, Contain, Fill, Scale-down, None
- **5 border radius**: SM, MD, LG, XL, Full
- **Estados completos**: Loading, Loaded, Error con fallbacks automáticos
- **Skeleton loading**: Animación de carga con shimmer effect
- **Error handling**: Fallback SVG automático según tipo de contenido
- **Lazy loading**: Optimizado para performance
- **Accesibilidad completa**: Alt text, reduced motion, high contrast
- **Theming automático**: Variables CSS del sistema, modo oscuro
- **Mobile optimized**: Touch-friendly, responsive design

## 🏗️ Atomic Design

Como **átomo perfecto**:
- ✅ **Componente básico**: No depende de otros componentes
- ✅ **Altamente reutilizable**: Carátulas, avatares, banners, thumbnails
- ✅ **Consistente**: Usa variables del sistema de diseño
- ✅ **Extensible**: Base para ContentCard y otros componentes complejos

## 🔧 Uso básico

\`\`\`jsx
import { ContentImage } from './atoms/ContentImage';

// Imagen básica para carátula
<ContentImage 
  src="https://ejemplo.com/pelicula.jpg"
  alt="Carátula de Avatar"
  aspectRatio="2/3"
  contentType="movie"
/>

// Avatar circular
<ContentImage 
  src="https://ejemplo.com/avatar.jpg"
  alt="Avatar de usuario"
  aspectRatio="1/1"
  rounded="full"
  objectFit="cover"
/>

// Banner con aspect ratio widescreen
<ContentImage 
  src="https://ejemplo.com/banner.jpg"
  alt="Banner promocional"
  aspectRatio="16/9"
  objectFit="cover"
  rounded="lg"
/>

// Con manejo de estados
<ContentImage 
  src="https://ejemplo.com/imagen.jpg"
  alt="Contenido"
  loading="lazy"
  onLoad={handleLoad}
  onError={handleError}
  placeholder="🖼️"
  showFallback={true}
/>
\`\`\`

## 🎨 Casos de uso especializados

### **Carátulas de contenido (2:3)**
- Películas, series, libros, álbumes
- Aspecto vertical típico de portadas

### **Banners y thumbnails (16:9)**
- Videos, promociones, headers
- Aspecto horizontal widescreen

### **Avatares y logos (1:1)**
- Perfiles de usuario, iconos de apps
- Aspecto cuadrado, usualmente con border radius full

### **Fotografías (4:3, 3:2)**
- Galerías, portfolios, contenido editorial
- Aspectos clásicos de fotografía

## ♿ Accesibilidad

- **Alt text requerido**: Descripción obligatoria para screen readers
- **Estados anunciados**: Loading y error states accesibles
- **Reduced motion**: Respeta preferencias de animación
- **High contrast**: Compatible con modo de alto contraste
- **Focus management**: Navegación por teclado cuando es necesario
- **Content visibility**: Optimizado para lazy loading accesible

## 🎭 Variables CSS heredadas

Usa automáticamente las variables del sistema:
\`\`\`css
:root {
  --bg-muted: #f9fafb;
  --bg-secondary: #f3f4f6;
  --text-muted: #6b7280;
  --color-danger: #ef4444;
  --radius-sm: 0.4rem;
  --radius-md: 0.6rem;
  --radius-lg: 0.8rem;
  --radius-xl: 1.2rem;
  --radius-full: 9999px;
  --transition-normal: 0.2s ease-in-out;
  --space-xs: 0.4rem;
  --space-sm: 0.8rem;
  --font-size-xs: 1.2rem;
  --font-weight-medium: 500;
  /* Y todas las demás del sistema... */
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    src: {
      name: 'URL de imagen',
      description: 'URL de la imagen a mostrar',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    alt: {
      name: 'Texto alternativo',
      description: 'Descripción de la imagen para accesibilidad',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    aspectRatio: {
      name: 'Aspect Ratio',
      description: 'Proporción de aspecto de la imagen',
      control: 'select',
      options: ['1/1', '4/3', '3/2', '16/9', '2/3', '3/4', 'auto'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'2/3'" }
      }
    },
    objectFit: {
      name: 'Object Fit',
      description: 'Comportamiento de ajuste de la imagen',
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'cover'" }
      }
    },
    rounded: {
      name: 'Border Radius',
      description: 'Radio de bordes',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    contentType: {
      name: 'Tipo de contenido',
      description: 'Tipo de contenido para fallback apropiado',
      control: 'select',
      options: ['movie', 'series', 'generic'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'generic'" }
      }
    },
    loading: {
      name: 'Loading strategy',
      description: 'Estrategia de carga de la imagen',
      control: 'select',
      options: ['eager', 'lazy'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'lazy'" }
      }
    },
    showFallback: {
      name: 'Mostrar fallback',
      description: 'Si mostrar imagen de fallback en caso de error',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    blur: {
      name: 'Blur effect',
      description: 'Aplicar efecto blur durante carga',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
};

// ========== EJEMPLOS BÁSICOS ==========

export const Default = {
  args: {
    src: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
    alt: "Imagen de ejemplo",
    aspectRatio: "2/3",
    objectFit: "cover",
    rounded: "md",
    contentType: "generic",
    loading: "lazy",
    showFallback: true,
    blur: false
  },
  parameters: {
    docs: {
      description: {
        story: 'ContentImage básico con aspect ratio 2:3, ideal para carátulas de contenido multimedia.'
      }
    }
  }
};

export const MoviePoster = {
  args: {
    src: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
    alt: "Carátula de película",
    aspectRatio: "2/3",
    contentType: "movie",
    rounded: "lg"
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuración específica para carátulas de películas con fallback apropiado.'
      }
    }
  }
};

export const SeriesPoster = {
  args: {
    src: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
    alt: "Carátula de serie",
    aspectRatio: "2/3",
    contentType: "series",
    rounded: "lg"
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuración específica para carátulas de series con fallback apropiado.'
      }
    }
  }
};

// ========== ASPECT RATIOS ==========

export const AspectRatios = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>1:1 (Avatar)</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        alt="Avatar ejemplo"
        aspectRatio="1/1"
        rounded="full"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>4:3 (Clásico)</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Imagen 4:3"
        aspectRatio="4/3"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>16:9 (Banner)</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=480&h=270&fit=crop"
        alt="Banner ejemplo"
        aspectRatio="16/9"
        rounded="lg"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>2:3 (Carátula)</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop"
        alt="Carátula ejemplo"
        aspectRatio="2/3"
        contentType="movie"
      />
    </div>
  </div>
);

AspectRatios.parameters = {
  docs: {
    description: {
      story: 'Diferentes aspect ratios disponibles para diversos tipos de contenido.'
    }
  }
};

// ========== OBJECT FIT ==========

export const ObjectFitModes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>Cover</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
        alt="Object fit cover"
        aspectRatio="3/2"
        objectFit="cover"
      />
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
        Recorta para llenar
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>Contain</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
        alt="Object fit contain"
        aspectRatio="3/2"
        objectFit="contain"
      />
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
        Ajusta sin recortar
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>Fill</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
        alt="Object fit fill"
        aspectRatio="3/2"
        objectFit="fill"
      />
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-xs)' }}>
        Estira para llenar
      </p>
    </div>
  </div>
);

ObjectFitModes.parameters = {
  docs: {
    description: {
      story: 'Diferentes modos de object-fit para controlar cómo se ajusta la imagen dentro del contenedor.'
    }
  }
};

// ========== BORDER RADIUS ==========

export const BorderRadius = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>SM</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        alt="Border radius small"
        aspectRatio="1/1"
        rounded="sm"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>MD</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        alt="Border radius medium"
        aspectRatio="1/1"
        rounded="md"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>LG</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        alt="Border radius large"
        aspectRatio="1/1"
        rounded="lg"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>XL</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        alt="Border radius extra large"
        aspectRatio="1/1"
        rounded="xl"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-sm)', textAlign: 'center' }}>Full</h4>
      <ContentImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        alt="Border radius full"
        aspectRatio="1/1"
        rounded="full"
      />
    </div>
  </div>
);

BorderRadius.parameters = {
  docs: {
    description: {
      story: 'Diferentes opciones de border radius usando las variables del sistema de diseño.'
    }
  }
};

// ========== ESTADOS ==========

export const States = () => {
  const [imageStates, setImageStates] = useState({
    loading: true,
    error: false,
    success: true
  });

  return (
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      alignItems: 'start'
    }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Loading</h4>
        <ContentImage
          src={imageStates.loading ? "" : "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop"}
          alt="Estado de carga"
          aspectRatio="2/3"
          contentType="movie"
        />
        <button 
          onClick={() => setImageStates(prev => ({ ...prev, loading: !prev.loading }))}
          style={{
            marginTop: 'var(--space-sm)',
            padding: 'var(--space-xs) var(--space-sm)',
            fontSize: 'var(--font-size-xs)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Toggle Loading
        </button>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Error</h4>
        <ContentImage
          src="https://url-que-no-existe.jpg"
          alt="Estado de error"
          aspectRatio="2/3"
          contentType="movie"
          showFallback={true}
        />
        <p style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: 'var(--space-sm)'
        }}>
          Fallback automático
        </p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Error sin fallback</h4>
        <ContentImage
          src="https://url-que-no-existe.jpg"
          alt="Error sin fallback"
          aspectRatio="2/3"
          contentType="movie"
          showFallback={false}
        />
        <p style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: 'var(--space-sm)'
        }}>
          Mensaje de error
        </p>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Success</h4>
        <ContentImage
          src="https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop"
          alt="Imagen exitosa"
          aspectRatio="2/3"
          contentType="movie"
        />
        <p style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: 'var(--space-sm)'
        }}>
          Carga exitosa
        </p>
      </div>
    </div>
  );
};

States.parameters = {
  docs: {
    description: {
      story: 'Diferentes estados del componente: loading con skeleton, error con y sin fallback, y carga exitosa.'
    }
  }
};

// ========== CONTENT TYPES ==========

export const ContentTypes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'start'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Movie</h4>
      <ContentImage
        src="https://url-que-no-existe.jpg"
        alt="Fallback película"
        aspectRatio="2/3"
        contentType="movie"
        showFallback={true}
      />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Fallback con icono 🎬
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Series</h4>
      <ContentImage
        src="https://url-que-no-existe.jpg"
        alt="Fallback serie"
        aspectRatio="2/3"
        contentType="series"
        showFallback={true}
      />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Fallback con icono 📺
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Generic</h4>
      <ContentImage
        src="https://url-que-no-existe.jpg"
        alt="Fallback genérico"
        aspectRatio="2/3"
        contentType="generic"
        showFallback={true}
      />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Fallback con icono 🖼️
      </p>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Custom Placeholder</h4>
      <ContentImage
        src="https://url-que-no-existe.jpg"
        alt="Placeholder personalizado"
        aspectRatio="2/3"
        placeholder="🌟"
        showFallback={true}
      />
      <p style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'var(--space-sm)'
      }}>
        Placeholder personalizado
      </p>
    </div>
  </div>
);

ContentTypes.parameters = {
  docs: {
    description: {
      story: 'Diferentes tipos de contenido con fallbacks apropiados y placeholders personalizados.'
    }
  }
};

// ========== INTERACTIVE EXAMPLE ==========

export const InteractiveExample = () => {
  const [currentImage, setCurrentImage] = useState("https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop");
  const [lastEvent, setLastEvent] = useState('');

  const images = [
    { url: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop", name: "Imagen 1" },
    { url: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop", name: "Imagen 2" },
    { url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop", name: "Imagen 3" },
    { url: "https://url-que-no-existe.jpg", name: "Error" }
  ];

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <ContentImage
          src={currentImage}
          alt="Imagen interactiva"
          aspectRatio="2/3"
          contentType="movie"
          onLoad={() => setLastEvent('Imagen cargada exitosamente')}
          onError={() => setLastEvent('Error al cargar la imagen')}
          rounded="lg"
        />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-md)'
      }}>
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(img.url)}
            style={{
              padding: 'var(--space-sm)',
              backgroundColor: currentImage === img.url ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: currentImage === img.url ? 'white' : 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {img.name}
          </button>
        ))}
      </div>
      
      {lastEvent && (
        <div style={{
          padding: 'var(--space-sm)',
          backgroundColor: 'var(--color-success-light)',
          color: 'var(--color-success)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          textAlign: 'center'
        }}>
          {lastEvent}
        </div>
      )}
    </div>
  );
};

InteractiveExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo interactivo mostrando callbacks onLoad y onError. Prueba diferentes imágenes incluida una que falla.'
    }
  }
};

// ========== USE CASES ==========

export const UseCases = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-2xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>Galería de Películas</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        {[
          "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
          "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
          "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
          "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
          "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop"
        ].map((src, index) => (
          <ContentImage
            key={index}
            src={src}
            alt={`Película ${index + 1}`}
            aspectRatio="2/3"
            contentType="movie"
            rounded="md"
          />
        ))}
      </div>
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>Avatares de Usuario</h3>
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        alignItems: 'center'
      }}>
        {[
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1494790108755-2616b612f3f7?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        ].map((src, index) => (
          <ContentImage
            key={index}
            src={src}
            alt={`Usuario ${index + 1}`}
            aspectRatio="1/1"
            rounded="full"
            style={{ width: '60px', height: '60px' }}
          />
        ))}
      </div>
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>Banner Promocional</h3>
      <ContentImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        alt="Banner promocional"
        aspectRatio="16/9"
        rounded="xl"
        style={{ maxWidth: '600px' }}
      />
    </div>
  </div>
);

UseCases.parameters = {
  docs: {
    description: {
      story: 'Casos de uso reales del componente: galería de películas, avatares de usuario y banners promocionales.'
    }
  }
};