import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { UsuarioContext } from "../context/UsuarioContext";

const OrdenarPor = () => {
  const { setSortOption } = useContext(UsuarioContext);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <Form.Select
      aria-label="Default select example"
      onChange={handleSortChange}
    >
      <option>Ordenar por</option>
      <option value="name-asc">Titulo (A-Z)</option>
      <option value="name-desc">Titulo (Z-A)</option>
      <option value="price-asc">Precio (Menor a Mayor)</option>
      <option value="price-desc">Precio (Mayor a Menor)</option>
    </Form.Select>
  );
};

export default OrdenarPor;
