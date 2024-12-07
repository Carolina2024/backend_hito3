// para el perfil
import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import { UsuarioContext } from "../context/UsuarioContext";// para acceder al usuario actual
import axios from "axios"; // para el backen

const Perfil = () => {
  const { setActiveMenu, setUsuario, logout } =
    useContext(UsuarioContext);
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext); // Acceder al contexto para obtener el usuario de context

  useEffect(() => {
    setActiveMenu("Perfil");
    obtenerDatosUsuario();    // Llama a la función para obtener datos al montar el componente
  }, [setActiveMenu]);

  // Función para obtener los datos del usuario autenticado backend
  const obtenerDatosUsuario = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      logout();
      navigate("/"); // Redirige al inicio si no está autenticado
      return;
    }

    //se ingresa al perfil despues del inicio de sesion con credenciales y autorizacion con token para backend
    try {
      //solicitud  get a usuarios, la variable data contiene el arreglo con los datos de los usuarios
      const { data } = await axios.get("http://localhost:3000/usuarios", {
        // autorizacion con token
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      setUsuario(data[0]);  // Almacena los datos del usuario obtenido de la bd, se guarda primer elemento que es el nombre

    } catch (error) {
      console.error(error.response?.data?.message || "Error al obtener datos");
      sessionStorage.removeItem("token");
      logout();
      navigate("/"); // Redirige al inicio si hay un error
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>

        <Col xs={12} md={9} className="p-4">
          <div className="text-center border rounded shadow-sm bg-white mt-4">
            <h2 style={{ color: "black" }}>Mi Perfil</h2>
          </div>
          <h1 className="mt-4 text-center">
            {/* muestra el nombre del usuario que ingresó al perfil desde el inicio de sesion */}
            Bienvenido <span className="fw-bold">{usuario?.nombre}</span>
          </h1>
        </Col>
      </Row>
    </Container>
  );
};


export default Perfil;
