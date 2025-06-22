import React from "react";
//import { Header } from "../../atoms/Header/Header";
//import { TextContent } from "../../atoms/TextContent/TextContent";
import { FaPlus } from "react-icons/fa";
import { Button } from "../../atoms/Button/Button";
import "./SectionHeader.css";

function SectionHeader({ title, description, buttonText, onClick }) {
  return (
    <Header className="header-section">
      <div className="section">
        <TextContent textStyle="header-1">{title}</TextContent>
        <TextContent>{description}</TextContent>
      </div>
      <Button
      onClick={onClick}
      text={buttonText}
      />
    </Header>
  );
}

export { SectionHeader };
