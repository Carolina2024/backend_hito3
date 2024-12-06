import { useContext, useState, useEffect } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

const InicioSesion = () => {
  const { setUsuario } = useContext(UsuarioContext);
  const { usuario } = useContext(UsuarioContext);
  const navigate = useNavigate();
  const { loginWithEmailAndPassword } = useContext(UsuarioContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario) {
      navigate("/perfil");
    }
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      // Llama a la función de inicio de sesión del contexto.
      const isLoggedIn = await loginWithEmailAndPassword(email, password);

      if (isLoggedIn) {
        // Si el inicio de sesión es exitoso, redirige al perfil.
        alert("Inicio de sesión exitoso");
        navigate("/perfil");
      } else {
        // Si las credenciales no son válidas, muestra un mensaje de error.
        setError("Credenciales inválidas. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      // Manejo de errores adicionales.
      console.error("Error al intentar iniciar sesión:", error);
      setError(
        "Ocurrió un error al iniciar sesión. Por favor, intenta más tarde."
      );
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Container
      className="py-4 w-50"
      fluid
      style={{ height: "calc(100vh - 140px)" }}
    >
      <h1 className="text-center text-light mb-4">Iniciar Sesión</h1>
      <Form
        onSubmit={handleSubmit}
        className="bg-gradient p-4 rounded shadow-sm"
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email" className="text-light">
            Email
          </Form.Label>
          <Form.Control
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="border-primary rounded"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password" className="text-light">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******"
            className="border-primary rounded"
          />
        </Form.Group>
        <Container className="d-flex flex-column align-items-center">
          <Button
            type="submit"
            className="btn-lg w-50 w-sm-auto btn-primary btn-sm"
          >
            Iniciar Sesión
          </Button>
          <Button
            type="button"
            className="btn-lg w-50 w-sm-auto mt-3 btn-info btn-sm"
            onClick={handleGoBack}
          >
            Volver
          </Button>
        </Container>
      </Form>
    </Container>
  );
};

export default InicioSesion;
