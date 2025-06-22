import { useState } from "react";
import { DynamicForm } from "../../molecules/DynamicForm/DynamicForm";

// Componente de ejemplo actualizado
const UsersForm = () => {
  // Ejemplo 3: Formulario complejo con 3 columnas
  const complexFields = [
    {
      name: "userName",
      label: "userName",
      type: "text",
      required: true,
    },
    { name: "contrasena", label: "contrasena", type: "password", required: true }
  ];
  
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (data) => {
    console.log("Datos del formulario:", data);
    setSubmittedData(data);
  };

  const getCurrentFields = () => {
    return complexFields;
  };

  return (
    <div>
      <DynamicForm
        fields={complexFields}
        onSubmit={handleFormSubmit}
        columnsPerRow={1}
        responsive={true}
        mobileColumns={1}
        tabletColumns={2}
        gap="1.5rem"
      />

      {submittedData && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: "0.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#065f46",
              marginBottom: "0.5rem",
            }}
          >
            Datos Enviados:
          </h3>
          <pre
            style={{
              fontSize: "0.875rem",
              color: "#047857",
              backgroundColor: "#f0fdf4",
              padding: "0.75rem",
              borderRadius: "0.25rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export { UsersForm };
