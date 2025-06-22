// MainPage.jsx - Actualizado para usar ContentCard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import { TextInput } from '../../components/molecules/TextInput/TextInput';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { getMoviesService } from '../../services/Movies/getMoviesService';
import './MainPage.css';

// Datos de ejemplo para series (hasta conectar con backend)
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
    }
];

function MainPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState(SAMPLE_SERIES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Cargar películas del backend
    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const moviesData = await getMoviesService();

                // Transformar datos del backend al formato esperado por ContentCard
                const transformedMovies = moviesData.map(movie => ({
                    id: movie.id,
                    title: movie.name || movie.title,
                    category: movie.category,
                    year: movie.releaseYear || new Date(movie.createdAt).getFullYear(),
                    type: "movie",
                    cover: movie.coverImageUrl || `https://images.unsplash.com/photo-1489599485995-d918135f0b1f?w=300&h=450&fit=crop`,
                    rating: movie.rating || 8.0,
                    duration: movie.duration || "120 min"
                }));

                setMovies(transformedMovies);
            } catch (error) {
                console.error('Error loading movies:', error);
                setError('Error al cargar las películas. Inténtalo de nuevo.');
                // Usar datos de ejemplo en caso de error
                setMovies([
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
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadMovies();
        }
    }, [user]);

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
        // Navegar a SearchForm o mostrar modal
        navigate('/search-form'); // Si tienes esta ruta
        // O: alert('Funcionalidad de agregar contenido - por implementar');
    };

    const handleFavoriteContent = (content) => {
        console.log('Added to favorites:', content.title);
        // Aquí implementarías la lógica de favoritos
        alert(`${content.title} agregado a favoritos`);
    };

    // Componente para sección de contenido
    const ContentSection = ({ title, items, emptyMessage }) => (
        <section className="content-section">
            <h2 className="content-section__title">{title}</h2>

            {loading ? (
                <div className="content-grid">
                    {[...Array(6)].map((_, index) => (
                        <ContentCard
                            key={`loading-${index}`}
                            content={{
                                id: index,
                                title: "Cargando...",
                                category: "Cargando",
                                year: 2023,
                                type: title.includes('Películas') ? 'movie' : 'series',
                                cover: "",
                                rating: 0
                            }}
                            loading={true}
                            size="md"
                        />
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div className="content-grid">
                    {items.map(item => (
                        <ContentCard
                            key={item.id}
                            content={item}
                            onClick={handlePlayContent}
                            onPlay={handlePlayContent}
                            onFavorite={handleFavoriteContent}
                            showRating={true}
                            showMeta={true}
                            showCategory={true}
                            size="md"
                            variant="elevated"
                            rounded="lg"
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state__icon">
                        {title.includes('Películas') ? '🎬' : '📺'}
                    </div>
                    <p className="empty-state__message">{emptyMessage}</p>
                    <Button
                        variant="outline"
                        onClick={() => setSelectedCategory('all')}
                        className="empty-state__action"
                    >
                        Ver todo el contenido
                    </Button>
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

            {/* Mensaje de error si existe */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setError(null)}
                        leftIcon="✕"
                    >
                        Cerrar
                    </Button>
                </div>
            )}

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