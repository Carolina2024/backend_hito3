import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MenuLateral from "../components/MenuLateral";
import { UsuarioContext } from "../context/UsuarioContext";
import axios from "axios"; // para ocupar la bd, se instala como dependencia

// VISTA FRONTEND SE DEBE ENVIAR DATOS FORMULARIO AL BACKEND
const CrearPublicacion = () => {
  const { setActiveMenu } = useContext(UsuarioContext);
  /* const { crearPublicacion } = useContext(UsuarioContext);  */ //se ocupa desde context
  const { usuario } = useContext(UsuarioContext); //para traer usuario de context
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen_url, setImagen_url] = useState("");
  const [precio, setPrecio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar la carga
  /* const [ usuario_id, setUsuario_id ] = useState(""); */

  const handlePublicar = async () => {
    if (!titulo || !descripcion || !imagen_url || !precio) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const token = localStorage.getItem("token"); // Obtener el token desde localStorage
    if (!token) {
      alert("Token no disponible. Por favor, inicia sesión.");
      return;
    }

    // Crear el cuerpo de la publicación, incluyendo el usuario_id obtenido del token
    const nuevaPublicacion = {
      titulo,
      descripcion,
      imagen_url,
      precio,
    };

    try {
      setIsSubmitting(true); // Activar estado de carga

      // Hacer la solicitud POST al backend, enviando el token en los headers
      await axios.post(
        "http://localhost:3000/publicaciones",
        nuevaPublicacion,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token JWT en los headers
          },
        }
      );
      alert("Publicación creada con éxito");

      // Limpiar formulario
      setTitulo("");
      setDescripcion("");
      setImagen_url("");
      setPrecio("");

      setIsSubmitting(false); // Desactivar estado de carga

    } catch (error) {
      alert("Error cuando se crea  la publicación en vista crear");
      setIsSubmitting(false); // Desactivar estado de carga en caso de error
    }
  };

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

        <Col xs={12} md={9} className="d-flex justify-content-center p-4">
          <div className="text-center shadow-sm w-50">
            <h4 className="mb-2" style={{ color: "white" }}>
              Crear Publicación
            </h4>
            {/* para que se muestre el usuario */}
            <p className="text-center" style={{ color: "white" }}>
              {usuario?.nombre}
            </p>

            {/* Formulario */}
            <Form
              className="bg-light rounded shadow-sm p-4"
              style={{
                maxWidth: "300px",
                margin: "auto",
                background: "linear-gradient(to right, #cce7ff, #a0c4ff)",
              }}
            >
              <Form.Group controlId="formImagen" className="mb-2">
                <Form.Label className="fw-bold" style={{ color: "#4a4a4a" }}>
                  Imagen publicación
                </Form.Label>
                <Form.Control
                  type="url"
                  name="imagen"
                  value={imagen_url}
                  onChange={(e) => setImagen_url(e.target.value)}
                  placeholder="Ingresa la URL de la imagen"
                  required
                  style={{
                    borderColor: "#6c757d",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formTitulo" className="mb-2">
                <Form.Label className="fw-bold" style={{ color: "#4a4a4a" }}>
                  Título publicación
                </Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ingresa el título"
                  required
                  style={{
                    borderColor: "#6c757d",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formDescripcion" className="mb-2">
                <Form.Label className="fw-bold" style={{ color: "#4a4a4a" }}>
                  Descripción publicación
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe la descripción"
                  required
                  style={{
                    borderColor: "#6c757d",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formPrecio" className="mb-2">
                <Form.Label className="fw-bold" style={{ color: "#4a4a4a" }}>
                  Precio
                </Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ingresa el precio"
                  required
                  style={{
                    borderColor: "#6c757d",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Form.Group>

              <Button
                onClick={handlePublicar}
                variant="primary"
                type="submit"
                className="w-50"
                style={{
                  backgroundColor: "#000080",
                  borderColor: "#0056b3",
                  transition: "background-color 0.3s ease",
                }}
              >
                Publicar
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <Row className="d-flex justify-content-end"></Row>
    </Container>
  );
};

export default CrearPublicacion;
