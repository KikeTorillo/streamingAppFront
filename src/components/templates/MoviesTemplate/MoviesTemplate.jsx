import React from "react";
import { Table } from "../../atoms/Table/Table";
import { useContext } from "react";
import { MoviesContext } from "../../../app/context/MoviesContext";
import { SectionHeader } from "../../organism/SectionHeader/SectionHeader";

function MoviesTemplate() {
  const {
    handleView,
    handleEdit,
    handleDelete,
    data,
    columns,
    title,
    description,
    addText,
  } = useContext(MoviesContext);
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

export { MoviesTemplate };