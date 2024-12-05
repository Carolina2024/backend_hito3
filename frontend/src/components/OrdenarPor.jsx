import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { UsuarioContext } from "../context/UsuarioContext";

const OrdenarPor = () => {
  const { setSortOption, fetchPublicaciones } = useContext(UsuarioContext);

  const handleSortChange = async (e) => {
    const sort = e.target.value;
    setSortOption(sort);
    await fetchPublicaciones(); // Refrescar publicaciones al cambiar el criterio
  };

  return (
    <select
      onChange={handleSortChange}
      style={{ width: "100%", height: "35px" }}
    >
      <option value="">Ordenar por</option>
      <option value="name-asc">Titulo (A-Z)</option>
      <option value="name-desc">Titulo (Z-A)</option>
      <option value="price-asc">Precio (Menor a Mayor)</option>
      <option value="price-desc">Precio (Mayor a Menor)</option>
    </select>
  );
};

export default OrdenarPor;
