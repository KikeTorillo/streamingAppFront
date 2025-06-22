import React from "react";
//import { Header } from "../../atoms/Header/Header";
import { FaGooglePlay, FaRegSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MainHeader.css";

function MainHeader() {
  const navigate = useNavigate();
  return (
    <div></div>
    // <Header className='main-header'>
    //   <FaGooglePlay size={24} />
    //   <FaRegSun size={24} onClick={() => navigate("/admin-panel")} />
    // </Header>
  );
}

export { MainHeader };
