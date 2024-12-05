import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MenuLateral from "../components/MenuLateral";
import CardPublicacion from "../components/CardPublicacion";
import { UsuarioContext } from "../context/UsuarioContext";
import axios from "axios";

const MisPublicaciones = () => {
  const { MisPublicaciones, setMisPublicaciones, setActiveMenu } =
    useContext(UsuarioContext);
  const { usuario } = useContext(UsuarioContext); // Acceder al usuario que incia sesion desde el contexto
  const token = sessionStorage.getItem("token"); // Obtener el token almacenado en sessionStorage

  // Efecto para obtener las publicaciones del usuario autenticado
  useEffect(() => {
    const obtenerPublicaciones = async () => {
      const token = localStorage.getItem("token"); // Obtener el token dentro del efecto
      if (!token) {
        alert("Token no disponible. Por favor, inicia sesión.");
        return;
      }

      try {
        // Configurar encabezados con el token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Llamada a la API para obtener las publicaciones
        const response = await axios.get(
          "http://localhost:3000/publicaciones/mis-publicaciones",
          config
        );
        setMisPublicaciones(response.data); // Actualizar el estado con las publicaciones
      } catch (error) {
        console.error(
          "Error al obtener las publicaciones:",
          error.response || error.message
        );
      }
    };

    obtenerPublicaciones(); // Llamar a la función
  }, [setMisPublicaciones]); // Dependencias del efecto

  return (
    <Container
      style={{
        height: "calc(100vh - 140px)",
      }}
    >
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>

        <Col xs={12} md={9}>
          <Container
            style={{
              maxHeight: "calc(100vh - 220px)", // Ajustar la altura máxima
              overflowY: "auto", // Habilitar desplazamiento vertical
              overflowX: "hidden", // Evitar desplazamiento horizontal
              padding: "15px",
            }}
          >
            <div className="text-center p-2">
              <h4 className="border-bottom p-2">Mis Publicaciones</h4>
            </div>
            <p className="text-center">{usuario?.nombre}</p>

            <Row
              className="justify-content-start align-item-start"
              style={{
                marginTop: "20px",
                marginLeft: "auto", // Centrar horizontalmente
                marginRight: "auto",
                width: "75%", // Ajustar ancho de contenedor
                height: "75%", // Altura proporcional
              }}
            >
              {MisPublicaciones.length > 0 ? (
                MisPublicaciones.map((pub, index) => (
                  <Col xs={12} md={6} lg={6} key={index}>
                    <CardPublicacion
                      imagen={pub.imagen_url}
                      titulo={pub.titulo}
                      descripcion={pub.descripcion}
                      precio={pub.precio}
                      publicador={pub.nombre_usuario}
                      mostrarAgregar={false}
                    />
                  </Col>
                ))
              ) : (
                <p className="text-center">No hay publicaciones disponibles</p>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default MisPublicaciones;
