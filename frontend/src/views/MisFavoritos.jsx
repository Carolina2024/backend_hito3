import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CardPublicacion from "../components/CardPublicacion";
import { UsuarioContext } from "../context/UsuarioContext";
import MenuLateral from "../components/MenuLateral";
import axios from "axios";

const MisFavoritos = () => {
  const { setActiveMenu } = useContext(UsuarioContext);
  const { usuario } = useContext(UsuarioContext);
  const [misFavoritos, setMisFavoritos] = useState([]);

  useEffect(() => {
    setActiveMenu("Mis Favoritos");
  }, [setActiveMenu]);

  useEffect(() => {
    setActiveMenu("Mis Favoritos");

    const fetchFavoritos = async () => {
      const token = localStorage.getItem("token"); // Obtener el token dentro del efecto
      if (!token) {
        alert("Token no disponible. Por favor, inicia sesión.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/favoritos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMisFavoritos(response.data);
      } catch (error) {
        console.error("Error fetching favorites", error);
      }
    };

    if (usuario) {
      fetchFavoritos();
    }
  }, [setActiveMenu, usuario]);

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
          <div className="text-center p-2">
            <h4 className="border-bottom p-2">Mis Favoritos</h4>
          </div>
          <p className="text-center">{usuario?.nombre}</p>
          <Row>
            {misFavoritos.length > 0 ? (
              misFavoritos.map((pub, index) => (
                <Col xs={12} md={6} key={index}>
                  <CardPublicacion
                    imagen={pub.imagen_url}
                    titulo={pub.titulo}
                    descripcion={pub.descripcion}
                    precio={pub.precio}
                    publicador={pub.nombre_usuario}
                    mostrarAgregar={true}
                    esFavorito={true}
                  />
                </Col>
              ))
            ) : (
              <p>No hay publicaciones favoritos disponibles</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MisFavoritos;
