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
      className="registroUsuario"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <h1 className="p-2">Iniciar Sesión</h1>
      <Form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          background: "linear-gradient(to bottom, #e6e9ef, #d4dae3)",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label
            htmlFor="email"
            style={{ fontWeight: "bold", color: "#343a40" }}
          >
            Email
          </Form.Label>
          <Form.Control
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            style={{
              borderColor: "#a0c4ff",
              borderRadius: "5px",
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label
            htmlFor="password"
            style={{ fontWeight: "bold", color: "#343a40" }}
          >
            Password
          </Form.Label>
          <Form.Control
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******"
            style={{
              borderColor: "#a0c4ff",
              borderRadius: "5px",
            }}
          />
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-primary btn-lg boton m-3"
          style={{ background: "#00CED1" }}
        >
          Iniciar Sesión
        </Button>
        <Button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={handleGoBack}
          style={{ background: "#00BFFF" }}
        >
          Volver
        </Button>
      </Form>
    </Container>
  );
};

export default InicioSesion;
