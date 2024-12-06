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

    //para mostrar las cards favoritas
    const fetchFavoritos = async () => {
      const token = localStorage.getItem("token"); // Obtener el token dentro del efecto
      if (!token) {
        alert("Token no disponible. Por favor, inicia sesión.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/favoritos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>

        <Col xs={12} md={6} className="ms-4">
          <Container>
            <div className="text-center p-2">
              <h5 className="border-bottom p-2">Mis Favoritos</h5>
            </div>
            <p className="text-center">{usuario?.nombre}</p>

            <Row className="justify-content-start align-item-start">
              {misFavoritos.length > 0 ? (
                misFavoritos.map((pub, index) => (
                  <Col xs={12} md={6} key={pub.publicacion_id} className="mb-3">
                    <CardPublicacion
                      publicacion_id={pub.publicacion_id}
                      imagen={pub.imagen_url}
                      titulo={pub.titulo}
                      descripcion={pub.descripcion}
                      precio={pub.precio}
                      publicador={pub.nombre_usuario}
                      mostrarAgregar={true} //que se muestre boton agregar
                      esFavorito={true} //ya está en favoritos
                    />
                  </Col>
                ))
              ) : (
                <p>No hay publicaciones favoritos disponibles</p>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default MisFavoritos;
