import React, { useState } from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // para ocupar con el backend

const FormularioUsuario = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleGoBack = () => {
    navigate("/login");//para boton volver
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };
  // se agrega async para el backen
  const validarDatos = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmar) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmar) {
      alert("Los password no coinciden");
      return;
    }

  try {
      // enviar registro al backend en tabla usuarios
      const response = await axios.post("http://localhost:3000/usuarios", {
        nombre,
        email,
        password,
      });

    if (response.status === 200) {
      alert("Usuario registrado con éxito");
        // limpiar campos
        setNombre("");
        setEmail("");
        setPassword("");
        setConfirmar("");
        navigate("/login"); // redirigir a login despues del registro
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    alert("Hubo un error al registrar el usuario. Intenta nuevamente.");
    }
  };


  return (
    <Container className="d-flex justify-content-center align-items-center py-4">
      <div className="w-50">
        <Form
          onSubmit={validarDatos}
          className="bg-gradient p-4 rounded shadow"
        >
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
            <Form.Label column sm="12" className="text-start">
              Nombre
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={handleChange(setNombre)}
                value={nombre}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="12" className="text-start">
              Email
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                onChange={handleChange(setEmail)}
                value={email}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="12" className="text-start">
              Password
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="password"
                placeholder="*******"
                onChange={handleChange(setPassword)}
                value={password}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextConfirmarPassword"
          >
            <Form.Label column sm="12" className="text-start">
              Confirmar Password
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="password"
                placeholder="*******"
                onChange={handleChange(setConfirmar)}
                value={confirmar}
              />
            </Col>
          </Form.Group>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-4 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 w-sm-auto text-center text-truncate fs-6 fs-sm-4"
            >
              Registrarme
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleGoBack}
              className="w-100 w-sm-auto fs-6 fs-sm-4"
            >
              Volver
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default FormularioUsuario;
