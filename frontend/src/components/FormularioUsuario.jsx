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
    <Container
      className="justify-content-center align-items-center"
      style={{
        paddingTop: "10px",
      }}
    >
      <div className="w-75" style={{ maxWidth: "300px" }}>
        <Form
          onSubmit={validarDatos}
          style={{
            maxWidth: "600px",
            margin: "auto",
            background: "linear-gradient(to right, #d3d3d3, #a9a9a9, #808080)",
            color: "#343a40",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Form.Group as={Row} className="mb-2" controlId="formPlaintextName">
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
          <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
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
          <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
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
          <Form.Group as={Row} className="mb-2" controlId="formPlaintextConfirmarPassword">
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
          <div className="d-flex justify-content-center gap-4 pt-2">
            <Button type="submit" className="btn btn-primary btn-lg">
              Registrarme
            </Button>
            <Button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={handleGoBack}
              style={{ background: "#00BFFF" }}
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
