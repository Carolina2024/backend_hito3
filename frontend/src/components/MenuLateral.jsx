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
    <Row>
      <Col>
        <Nav
          className="flex-column p-3 rounded"
          style={{
            height: "81.5vh",
            background: "linear-gradient(to bottom, #2c3e50, #34495e)",
            borderWidth: "2px",
            borderColor: "#1abc9c",
            borderStyle: "solid",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {menuItems.map((item, index) => (
            <Nav.Link
              key={index}
              href="#"
              className={`mb-2 py-2 ${
                activeMenu === item.name ? "fw-bold text-white" : "text-light"
              }`}
              style={{
                backgroundColor:
                  activeMenu === item.name ? "#008B8B" : "transparent",
                border: "2px solid #1abc9c",
                borderRadius: "5px",
                transition: "background-color 0.3s, color 0.3s",
              }}
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
