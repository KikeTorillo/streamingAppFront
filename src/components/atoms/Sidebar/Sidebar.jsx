import React from "react";
import "./Sidebar.css"; // Archivo de estilos específico para la sidebar

const Sidebar = ({ children }) => {
  return (
    <div className="sidebar-container">
      {children}
    </div>
  );
};

export { Sidebar };
