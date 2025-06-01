import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/atoms/Sidebar/Sidebar";
import "./AdminPanel.css";
import { MainHeader } from "../../components/organism/MainHeader/MainHeader";
import { ListGroup } from "../../components/atoms/ListGroup/ListGroup";
import { ListItem } from "../../components/atoms/ListItem/ListItem";
import { CreateMovies } from "../../components/organism/CreateMovies/CreateMovies";
import { CreateSeries } from "../../components/organism/CreateSeries/CreateSeries";
import { UploadEpisode } from "../../components/organism/UploadEpisode/UploadEpisode";
import { UserProvider } from "../../app/context/UserContext";
import { UsersTemplate } from "../../components/templates/UsersTemplate/UsersTemplate";
import { CategoriesProvider } from "../../app/context/CategoriesContext";
import { CategoriesTemplate } from "../../components/templates/CategoriesTemplate/CategoriesTemplate";
import { MoviesProvider } from "../../app/context/MoviesContext";
import { MoviesTemplate } from "../../components/templates/MoviesTemplate/MoviesTemplate";
import { SearchForm } from "../SearchForm/SearchForm";

import {
  FaTv,
  FaClipboardList,
  FaFilm,
  FaPlus,
  FaEdit,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminPanel = () => {
  const menuItems = [
    { icon: <FaUserPlus />, label: "Usuarios" },
    { icon: <FaFilm />, label: "Peliculas" },
    { icon: <FaTv />, label: "Series" },
    { icon: <FaClipboardList />, label: "Episodios" },
    { icon: <FaPlus />, label: "Categorías" },
  ];

  // Estados
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es vista móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Cerrar sidebar en desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para cerrar sidebar al seleccionar item (solo en móvil)
  const handleItemClick = (label) => {
    setActiveSection(label);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Función para renderizar la sección según el estado
  const renderSection = () => {
    switch (activeSection) {
      case "Peliculas":
        return (
          <MoviesProvider>
            <SearchForm />
            {/* <MoviesTemplate /> */}
            {/* <SearchForm /> */}
          </MoviesProvider>
        );
      case "Series":
        return <CreateSeries />;
      case "Episodios":
        return <UploadEpisode />;
      case "Usuarios":
        return (
          <UserProvider>
            <UsersTemplate />
          </UserProvider>
        );
      case "Categorías":
        return (
          <CategoriesProvider>
            <CategoriesTemplate />
          </CategoriesProvider>
        );
      default:
        return "";
    }
  };

  return (
    <div className="parent">
      <div className="div1">
        <MainHeader />
        {/* Botón hamburguesa para móvil */}
        {isMobile && (
          <button 
            className="mobile-menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Overlay para cerrar sidebar en móvil */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`div2 ${isMobile ? 'mobile-sidebar' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar>
          <ListGroup>
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => handleItemClick(item.label)}
              >
                <ListItem className={`sidebar-item ${activeSection === item.label ? 'active' : ''}`}>
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </ListItem>
              </div>
            ))}
          </ListGroup>
        </Sidebar>
      </div>

      <div className={`div3 ${isMobile && isSidebarOpen ? 'content-shifted' : ''}`}>
        {renderSection()}
      </div>
    </div>
  );
};

export { AdminPanel };
