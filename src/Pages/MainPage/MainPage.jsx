// MainPage.jsx - Página principal tipo Netflix
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle } from '../../components/atoms/Card/Card';
import { Button } from '../../components/atoms/Button/Button';
import { TextInput } from '../../components/molecules/TextInput/TextInput';
import './MainPage.css';

// Datos de ejemplo para películas y series (en un proyecto real vendrían del backend)
const SAMPLE_MOVIES = [
    {
        id: 1,
        title: "Avatar: El Camino del Agua",
        category: "Acción",
        year: 2022,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
        rating: 8.5,
        duration: "192 min"
    },
    {
        id: 2,
        title: "Top Gun: Maverick",
        category: "Acción",
        year: 2022,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
        rating: 9.1,
        duration: "130 min"
    },
    {
        id: 3,
        title: "Black Panther",
        category: "Superhéroes",
        year: 2021,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
        rating: 8.8,
        duration: "145 min"
    },
    {
        id: 4,
        title: "Dune",
        category: "Ciencia Ficción",
        year: 2021,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
        rating: 8.7,
        duration: "155 min"
    },
    {
        id: 5,
        title: "The Batman",
        category: "Superhéroes",
        year: 2022,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
        rating: 8.9,
        duration: "176 min"
    },
    {
        id: 6,
        title: "Spider-Man: No Way Home",
        category: "Superhéroes",
        year: 2021,
        type: "movie",
        cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
        rating: 9.2,
        duration: "148 min"
    }
];

const SAMPLE_SERIES = [
    {
        id: 11,
        title: "Stranger Things",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop",
        rating: 9.0,
        seasons: 4,
        episodes: 42
    },
    {
        id: 12,
        title: "The Crown",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=300&h=450&fit=crop",
        rating: 8.8,
        seasons: 6,
        episodes: 60
    },
    {
        id: 13,
        title: "House of Dragons",
        category: "Fantasía",
        year: 2022,
        type: "series",
        cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
        rating: 8.9,
        seasons: 2,
        episodes: 20
    },
    {
        id: 14,
        title: "Wednesday",
        category: "Comedia",
        year: 2022,
        type: "series",
        cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
        rating: 8.6,
        seasons: 1,
        episodes: 8
    },
    {
        id: 15,
        title: "The Bear",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
        rating: 9.3,
        seasons: 3,
        episodes: 28
    },
    {
        id: 16,
        title: "Succession",
        category: "Drama",
        year: 2023,
        type: "series",
        cover: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
        rating: 9.5,
        seasons: 4,
        episodes: 39
    }
];

function MainPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);
    const [movies, setMovies] = useState(SAMPLE_MOVIES);
    const [series, setSeries] = useState(SAMPLE_SERIES);

    // Verificar si el usuario está logueado
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('sessionUser');
        if (!sessionUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(sessionUser);
            setUser(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    // Obtener categorías únicas
    const categories = ['all', ...new Set([...movies, ...series].map(item => item.category))];

    // Filtrar contenido
    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredSeries = series.filter(serie => {
        const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || serie.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Handlers
    const handleLogout = () => {
        sessionStorage.removeItem('sessionUser');
        navigate('/login');
    };

    const handlePlayContent = (content) => {
        navigate(`/video-player/${content.id}`);
    };

    const handleAddContent = () => {
        // Aquí podrías navegar a una página de administración o modal
        alert('Funcionalidad de agregar contenido - por implementar');
    };

    // Componente para carátula de contenido
    const ContentCard = ({ content }) => (
        <Card
            variant="elevated"
            shadow="md"
            rounded="lg"
            hoverable
            clickable
            onClick={() => handlePlayContent(content)}
            className="content-card"
        >
            <div className="content-card__image-container">
                <img
                    src={content.cover}
                    alt={content.title}
                    className="content-card__image"
                    loading="lazy"
                />
                <div className="content-card__overlay">
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon="▶️"
                        className="content-card__play-button"
                    >
                        Reproducir
                    </Button>
                </div>
            </div>

            <CardBody className="content-card__info">
                <CardTitle className="content-card__title">{content.title}</CardTitle>
                <CardSubtitle className="content-card__subtitle">
                    {content.category} • {content.year}
                </CardSubtitle>

                <div className="content-card__details">
                    <span className="content-card__rating">
                        ⭐ {content.rating}
                    </span>
                    <span className="content-card__meta">
                        {content.type === 'movie'
                            ? content.duration
                            : `${content.seasons} temporadas`
                        }
                    </span>
                </div>
            </CardBody>
        </Card>
    );

    // Componente para sección de contenido
    const ContentSection = ({ title, items, emptyMessage }) => (
        <section className="content-section">
            <h2 className="content-section__title">{title}</h2>

            {items.length > 0 ? (
                <div className="content-grid">
                    {items.map(item => (
                        <ContentCard key={item.id} content={item} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state__icon">
                        {title.includes('Películas') ? '🎬' : '📺'}
                    </div>
                    <p className="empty-state__message">{emptyMessage}</p>
                </div>
            )}
        </section>
    );

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="main-page">
            {/* Header */}
            <header className="main-page__header">
                <div className="header__brand">
                    <h1 className="header__title">🎬 StreamApp</h1>
                </div>

                <div className="header__search">
                    <TextInput
                        placeholder="Buscar películas y series..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon="🔍"
                        size="md"
                        rounded="lg"
                        className="search-input"
                    />
                </div>

                <div className="header__user">
                    <span className="header__welcome">
                        Hola, {user.username || user.sub || 'Usuario'}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        leftIcon="🚪"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </header>

            {/* Filters */}
            <div className="main-page__filters">
                <div className="filters__categories">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="category-button"
                        >
                            {category === 'all' ? 'Todas' : category}
                        </Button>
                    ))}
                </div>

                <div className="filters__actions">
                    <Button
                        variant="success"
                        size="md"
                        leftIcon="➕"
                        onClick={handleAddContent}
                    >
                        Agregar Contenido
                    </Button>
                </div>
            </div>

            {/* Content */}
            <main className="main-page__content">
                <ContentSection
                    title="🎬 Películas"
                    items={filteredMovies}
                    emptyMessage="No se encontraron películas con los filtros actuales."
                />

                <ContentSection
                    title="📺 Series"
                    items={filteredSeries}
                    emptyMessage="No se encontraron series con los filtros actuales."
                />
            </main>
        </div>
    );
}

export { MainPage };