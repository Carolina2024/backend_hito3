import React, { useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import axios from "axios";

const CardPublicacion = ({ publicacion_id,
  imagen,
  titulo,
  descripcion,
  precio,
  publicador,
  emailUsuario,
  mostrarAgregar = true, // para mostrar o no el boton agregar (no estará en mis publicaciones)
  esFavorito = false,
}) => {
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);
  const [isFavorito, setIsFavorito] = useState(esFavorito);
  console.log("publicacion_id: ", publicacion_id);
  console.log("titulo: ", titulo);
  //agregar al carrito
  const handleAgregarAlCarrito = () => {
    navigate("/carrito");
  };

  // Navegar a la página de detalles de la publicación usando el nombre del publicador para obtener el email de
  const handleverMas = () => {
    navigate(`/detalle-publicacion/${publicador}`);
  };

  //para agregar favoritos
  const handleAgregarFavorito = async (publicacion_id) => {
    console.log("publicacion_id: ", publicacion_id);
    // Convertir publicacion_id a número si es un string
   /*  const publicacionIdNumerico = Number(publicacion_id);
    if (!publicacionIdNumerico) {
      alert("ID de publicación no válido.");
      return;
    } */

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Por favor inicia sesión para agregar favoritos.");
      return;
    }

    try {
      console.log("token: " ,token)
      const response = await axios.post(
        `http://localhost:3000/favoritos/${publicacion_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Cambiar el estado según la respuesta del servidor
      if (response.data.message === "Favorito agregado") {
        setIsFavorito(true);
      } else if (response.data.message === "Favorito eliminado") {
        setIsFavorito(false);
      }
    } catch (error) {
      console.error("Error al actualizar el favorito:", error);
    }
  };

  return (
    <Card className="card mb-4 shadow-sm w-75 p-3 mx-auto">
      <Card.Img variant="top" src={imagen} />
      <Card.Body>
        <Card.Title>{titulo}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <Card.Text>
          <strong>Precio:</strong> ${precio}
        </Card.Text>
        <Card.Text>
          <strong>Publicado por:</strong> {publicador}
        </Card.Text>
        <div className="d-flex justify-content-between">
          {mostrarAgregar && (
            <Button
              variant="dark"
              style={{
                backgroundColor: "#000",
                border: "4px solid #34495e",
                color: "#fff",
              }}
              onClick={handleAgregarAlCarrito}
            >
              Agregar
            </Button>
          )}
          <Button
            variant="secondary"
            style={{ border: "4px solid #34495e" }}
            onClick={handleverMas}
          >
            Ver Más
          </Button>

          <div
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={() => handleAgregarFavorito( publicacion_id )}
          >
            {isFavorito ? (
              <BsStarFill
                style={{
                  fontSize: "1.5rem",
                  color: "#f39c12",
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
