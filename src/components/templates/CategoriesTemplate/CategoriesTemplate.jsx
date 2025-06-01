import React from "react";
import { Table } from "../../atoms/Table/Table";
import { useContext } from "react";
import { CategoriesContext } from "../../../app/context/CategoriesContext";
import { SectionHeader } from "../../organism/SectionHeader/SectionHeader";

function CategoriesTemplate() {
  const {
    handleView,
    handleEdit,
    handleDelete,
    data,
    columns,
    title,
    description,
    addText,
  } = useContext(CategoriesContext);
  return (
    <React.Fragment>
      <SectionHeader
        title={title}
        description={description}
        addText={addText}
      />
      <Table
        data={data}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </React.Fragment>
  );
}

export { CategoriesTemplate };
