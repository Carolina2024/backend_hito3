import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { UsuarioContext } from "../context/UsuarioContext";

const CerrarSesionButton = () => {
  const navigate = useNavigate();
  const { logout, activeMenu } = useContext(UsuarioContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Ocultar botón cerrar sesion en la vista DetallePublicacion
  if (location.pathname.startsWith("detalle-publicacion/:nombrePublicador")) {
    return null;
  }
  // Ocultar el botón en la vista de login
  if (window.location.pathname === "/login") {
    return null;
  }
  // Ocultar el botón en la vista de home
  if (window.location.pathname === "/") {
    return null;
  }
  // Ocultar el botón en la vista de carrito
  if (window.location.pathname === "/carrito") {
    return null;
  }

  // para que se muestre cerrar sesion en perfil con sus opciones
  if (
    activeMenu !== "Perfil" &&
    activeMenu !== "Crear Publicacion" &&
    activeMenu !== "Mis Publicaciones" &&
    activeMenu !== "Tienda" &&
    activeMenu !== "Mis Favoritos" &&
    activeMenu !== "Actualizar Perfil"
  ) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: "15px",
        paddingRight: "5px",
        marginTop: "-45px",
      }}
    >
      <Button className="mt-5 btn-sm" variant="danger" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default CerrarSesionButton;
