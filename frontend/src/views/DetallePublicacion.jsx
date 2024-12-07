import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import MenuLateral from "../components/MenuLateral";
import { UsuarioContext } from "../context/UsuarioContext";
import axios from "axios";


const DetallePublicacion = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);
  const { nombrePublicador } = useParams(); // Obtener nombre del publicador desde los parámetros de la URL
  const [emailPublicador, setEmailPublicador] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  // Obtener el email del publicador al cargar la vista
  useEffect(() => {
    // Obtener el email del publicador desde el backend
    const obtenerEmailPublicador = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/usuarios/email/${nombrePublicador}`
        );
        setEmailPublicador(response.data.email); // Guardar el email en el estado
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener el email del publicador", error);
        setCargando(false);
      }
    };

    obtenerEmailPublicador();
  }, [nombrePublicador]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEnviar = () => {
    alert("¡Correo enviado con éxito!");
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>

        <Col xs={12} md={6} className="ms-4">
          <h5 className="text-center mb-3 mt-4">Enviar Correo al Publicador</h5>
          {cargando ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <Card className="p-2 shadow-sm">
              <Card.Body>
                <h5 className="mt-2">Redactar Correo</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Para:</Form.Label>
                    <Form.Control
                      type="text"
                      value={emailPublicador}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Asunto:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escribe el asunto"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mensaje:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Escribe tu mensaje"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary"
                    onClick={handleEnviar}>
                    Enviar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
          <Button variant="secondary" onClick={handleBack} className="mt-4">
            Volver
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetallePublicacion;
