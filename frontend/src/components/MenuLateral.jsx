import React, { useContext, useEffect } from "react";
import { Nav, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

const MenuLateral = () => {
  const { activeMenu, setActiveMenu } = useContext(UsuarioContext);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Crear Publicacion",
      onClick: () => navigate("/crear-publicacion"),
    },
    {
      name: "Mis Publicaciones",
      onClick: () => navigate("/mis-publicaciones"),
    },

    {
      name: "Tienda",
      onClick: () => {
        setActiveMenu("Tienda");
        navigate("/tienda");
      },
    },

    {
      name: "Mis Favoritos",
      onClick: () => navigate("/mis-favoritos"),
    },
    {
      name: "Actualizar Perfil",
      onClick: () => navigate("/actualizar-perfil"),
    },
  ];

  return (
    <Row className="gx-0 h-100">
      <Col className="bg-dark text-light d-flex flex-column">
        <Nav className="flex-column rounded">
          {menuItems.map((item, index) => (
            <Nav.Link
              key={index}
              href="#"
              className={`py-3 px-3 border border-2 ${
                activeMenu === item.name ? "fw-bold bg-primary text-white" : ""
              }`}
              onClick={() => {
                setActiveMenu(item.name);
                item.onClick();
              }}
            >
              {item.name}
            </Nav.Link>
          ))}
        </Nav>
      </Col>
    </Row>
  );
};

export default MenuLateral;
