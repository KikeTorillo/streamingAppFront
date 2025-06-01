import React from "react";
import "./Header.css"; // Opcional, para tus estilos

function Header({ children, className }) {
  return <header className={`header ${className}`}>{children}</header>;
}

export { Header };
