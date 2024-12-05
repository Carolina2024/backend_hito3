import React, { useContext, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { UsuarioContext } from "../context/UsuarioContext";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const Buscador = () => {
  const { setPublicaciones } = useContext(UsuarioContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle the search when the icon is clicked
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/publicaciones/buscar",
        {
          params: { titulo: searchTerm }, // Use the stored search term
        }
      );
      setPublicaciones(response.data); // Update the publications state with the filtered results
    } catch (error) {
      console.error("Error al buscar las publicaciones:", error);
    }
  };

  return (
    <InputGroup className="mb-3">
      <Form.Control
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
        placeholder="Busca tu curso por título"
      />
      <InputGroup.Text
        onClick={handleSearchClick}
        style={{ cursor: "pointer" }}
      >
        <FaSearch />
      </InputGroup.Text>
    </InputGroup>
  );
};

export default Buscador;
