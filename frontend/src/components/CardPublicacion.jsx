import React, { useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import axios from "axios";

const CardPublicacion = ({
  publicacion_id,
  imagen,
  titulo,
  descripcion,
  precio,
  publicador,
  emailUsuario,
  mostrarAgregar = true, // para mostrar o no el boton agregar (no estará en mis publicaciones)
  esFavorito =false,
}) => {
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);
  const [isFavorito, setIsFavorito] = useState(esFavorito);

  //agregar al carrito
  const handleAgregarAlCarrito = async () => {
    const token = localStorage.getItem("token"); // Recuperar el token del almacenamiento local
    if (!token) {
      // Si no hay token, mostrar un mensaje de alerta
      alert("Debes iniciar sesión para agregar al carrito.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/boletas/agregar/${publicacion_id}`,
        {}, // No es necesario enviar datos en el cuerpo
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Artículo agregado al carrito.");
        navigate("/carrito"); // Navegar al carrito si la operación fue exitosa
      }
    } catch (error) {
      console.error(
        "Error al agregar al carrito:",
        error.response?.data || error
      );
      alert(
        "Ocurrió un error al intentar agregar el artículo. Inténtalo de nuevo."
      );
    }
  };

  // Navegar a la página de detalles de la publicación usando el nombre del publicador para obtener el email de
  const handleverMas = () => {
    navigate(`/detalle-publicacion/${publicador}`);
  };

  //para agregar favoritos
  const handleAgregarFavorito = async (publicacion_id) => {
    console.log("publicacion_id: ", publicacion_id);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Por favor inicia sesión para agregar favoritos.");
      return;
    }

    try {
      const response = await axios.post(
            `http://localhost:3000/favoritos/${publicacion_id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

      if (response.data.message === "Favorito agregado") {
        setIsFavorito(true); //marcado favorito
      }
    } catch (error) {
      console.error("Error al actualizar el favorito:", error);
    }
  };

  return (
    <Card className="card mb-4 shadow-sm w-100 p-2 mx-auto">
      <Card.Img variant="top" src={imagen} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <Card.Text>
          <strong>Precio:</strong> ${Math.floor(precio)}
        </Card.Text>
        <Card.Text>
          <strong>Publicado por:</strong> {publicador}
        </Card.Text>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          {mostrarAgregar && (
            <Button
              variant="dark"
              className="mb-2 mb-md-0"
              onClick={handleAgregarAlCarrito}
            >
              Agregar
            </Button>
          )}
          <Button
            variant="secondary"
            className="mb-2 mb-md-0"
            onClick={handleverMas}
          >
            Ver Más
          </Button>

          <div
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
              marginTop: "-0.5rem",
            }}
            onClick={() => handleAgregarFavorito(publicacion_id)}
          >
            {isFavorito ? (
              <BsStarFill
                style={{
                  fontSize: "1.5rem",
                  color: "#f39c12", // Estrella amarilla cuando está en favoritos
                  cursor: "pointer",
                }}
              />
            ) : (
              <BsStar
                style={{
                  fontSize: "1.5rem",
                  color: "#f39c12",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardPublicacion;
