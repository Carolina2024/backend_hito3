import React, { useContext, useState } from "react";
import { Nav, Navbar, Container, Col } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { UsuarioContext } from "../context/UsuarioContext";
import CerrarSesionButton from "./CerrarSesionButton";

const shouldHideAuthLinks = (pathname) => {
  // para que se oculte registro y login en estas vistas
  const hiddenRoutes = [
    "/perfil",
    "/crear-publicacion",
    "/mis-publicaciones",
    "/detalle-publicacion",
    "/login",
    "/registro",
    "/tienda",
    "/carrito",
    "/mis-favoritos",
    "/actualizar-perfil",
  ];
  return hiddenRoutes.some((route) => pathname.startsWith(route));
};

const shouldHideCartLinks = (pathname) => {
  // para que se oculte solo el carrito en estas vistas
  const hiddenRoutesForCart = [
    "/login",
    "/registro",
    "/carrito",
    "/actualizar-perfil",
  ];
  return hiddenRoutesForCart.some((route) => pathname.startsWith(route));
};

function NavbarMarket() {
  const location = useLocation();
  const { setActiveMenu} = useContext(UsuarioContext);

  const handleLogoClick = () => {
    setActiveMenu(""); //resetea el activeMenu al estado inicial
  };

  const setActiveClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <div className="d-flex">
      <Col
        xs={12}
        md={3}
        className="menu-lateral-container"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "0",
          zIndex: 999,
        }}
      ></Col>
      {/* Contenido principal */}
      <div className="flex-grow-1">
        <Navbar
          bg="black"
          variant="dark"
          expand="lg"
          fixed="top" // Navbar fijo
          className="shadow"
        >
          <Container fluid>
            <Navbar.Brand>
              <Nav.Link
                as={NavLink}
                to="/"
                onClick={handleLogoClick}
                className="d-inline-block p-2"
              >
                <img
                  src="../Logo.jpeg"
                  alt="Icono"
                  style={{ width: "170px", height: "auto" }}
                />
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic_avbar_nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav className="mr-auto">
                {/* se oculta registro y login */}
                {!shouldHideAuthLinks(location.pathname) && (
                  <>
                    <Nav.Link
                      as={NavLink}
                      to="/registro"
                      className={setActiveClass}
                    >
                      <span className="fs-6">Regístrate</span>
                    </Nav.Link>
                    <Nav.Link
                      as={NavLink}
                      to="/login"
                      className={setActiveClass}
                    >
                      <span className="fs-6">Iniciar Sesión</span>
                    </Nav.Link>
                  </>
                )}
                {/* se oculta carrito */}
                {!shouldHideCartLinks(location.pathname) && (
                  <Nav.Link
                    as={NavLink}
                    to="/carrito"
                    className={setActiveClass}
                  >
                    <FaShoppingCart style={{ fontSize: "1.4rem" }} />
                  </Nav.Link>
                )}
                <Nav.Link as={NavLink}>
                  <CerrarSesionButton />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div style={{ marginTop: "70px" }}></div>
      </div>
    </div>
  );
}

export default NavbarMarket;
