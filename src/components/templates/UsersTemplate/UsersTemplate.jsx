import React from "react";
import { Table } from "../../atoms/Table/Table";
import { useContext } from "react";
import { UserContext } from "../../../app/context/UserContext";
import { SectionHeader } from "../../organism/SectionHeader/SectionHeader";
import { UsersForm } from "../../organism/UsersForm/UsersForm";

function UsersTemplate() {
  const {
    handleView,
    handleEdit,
    handleDelete,
    data,
    columns,
    title,
    description,
    buttonText,
    view,
    setView,
  } = useContext(UserContext);

  let showView;

  if (view) {
    showView = <UsersForm />;
  } else {
    showView = (
      <Table
        data={data}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <React.Fragment>
      <SectionHeader
        title={title}
        description={description}
        buttonText={buttonText}
        onClick={() => {
          setView(!view);
        }}
      />
      {showView}
    </React.Fragment>
  );
}

export { UsersTemplate };
