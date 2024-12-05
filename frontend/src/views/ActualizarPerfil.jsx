import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MenuLateral from "../components/MenuLateral";
import { UsuarioContext } from "../context/UsuarioContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActualizarPerfil = () => {
  const { usuario,setUsuario } = useContext(UsuarioContext);
  const { setActiveMenu } = useContext(UsuarioContext);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (nuevoPassword !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("token"); // Obtener el token desde localStorage
    if (!token) {
      alert("Token no disponible. Por favor, inicia sesión.");
      return;
    }

    setNombre("");
    setEmail("");
    setPassword("");
    setNuevoPassword("");
    setConfirmar("");

    // Prepara el objeto de datos solo con los campos que tienen valores
    const updatedUserData = {
      nombre: nombre || usuario.nombre, // Si no se cambia el nombre, mantener el actual
      email: email || usuario.email, // Si no se cambia el email, mantener el actual
      password: password || usuario.password, // Si no se cambia la contraseña, mantener la actual
      nuevoPassword: nuevoPassword || "", // Solo enviar nuevoPassword si se cambió
    };

    try {
      // Enviar la solicitud PUT para actualizar los datos del usuario
      const response = await axios.put(
        "http://localhost:3000/usuarios", // Actualiza la URL si es necesario
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token JWT en los headers
          },
          withCredentials: true, // Permitir el envío de cookies (si es necesario)
        }
      );
      console.log(response);
      if (response.status === 200) {
        alert("Perfil actualizado con éxito");
        // Actualizar el contexto si los datos del usuario cambiaron
        setUsuario((prevUsuario) => {
          if (prevUsuario.nombre !== nombre || prevUsuario.email !== email) {
            return { ...prevUsuario, nombre, email }; // Solo actualizar si hay cambios
          }
          return prevUsuario; // No actualizar si no hay cambios
        });
        navigate("/perfil"); // Redirigir a la vista del perfil
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    setActiveMenu("Actualizar Perfil");
  }, [setActiveMenu]);

  //para cambios en los inputs
  const handleChange = (setter) => (event) => setter(event.target.value);

    /* if (nuevoPassword !== confirmar) {
      alert("Los password no coinciden");
      return;
    } */

  const handleGoBack = () => {
    navigate("/perfil");
  };

  return (
    <Container style={{ height: "calc(100vh - 140px)" }}>
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>
        <Col
          xs={12}
          md={9}
          className="d-flex justify-content-center align-items-center"
        >
          <Container
            className="d-flex justify-content-center align-items-center"
            style={{ paddingTop: "20px" }}
          >
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{ maxWidth: "370px" }}
            >
              <Form
                onSubmit={handleSubmit}
                style={{
                  maxWidth: "500px",
                  margin: "auto",
                  background: "linear-gradient(to right, #cce7ff, #a0c4ff)",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formPlaintextName"
                >
                  <Form.Label
                    column
                    sm="12"
                    className="text-start"
                    style={{ fontWeight: "600", color: "#4a4a4a" }}
                  >
                    Nombre
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      onChange={handleChange(setNombre)}
                      value={nombre}
                      style={{
                        borderColor: "#b0c4de",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "none",
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                  <Form.Label
                    column
                    sm="12"
                    className="text-start"
                    style={{ fontWeight: "600", color: "#4a4a4a" }}
                  >
                    Email
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      onChange={handleChange(setEmail)}
                      value={email}
                      style={{
                        borderColor: "#b0c4de",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "none",
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextPassword">
                  <Form.Label
                    column
                    sm="12"
                    className="text-start"
                    style={{ fontWeight: "600", color: "#4a4a4a" }}
                  >
                    Password Actual
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="password"
                      placeholder="*******"
                      onChange={handleChange(setPassword)}
                      value={password}
                      style={{
                        borderColor: "#b0c4de",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "none",
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextNewPassword">
                  <Form.Label
                    column
                    sm="12"
                    className="text-start"
                    style={{ fontWeight: "600", color: "#4a4a4a" }}
                  >
                    Nuevo Password
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="password"
                      placeholder="*******"
                      onChange={handleChange(setNuevoPassword)}
                      value={nuevoPassword}
                      style={{
                        borderColor: "#b0c4de",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "none",
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextConfirmPassword">
                  <Form.Label
                    column
                    sm="12"
                    className="text-start"
                    style={{ fontWeight: "600", color: "#4a4a4a" }}
                  >
                    Confirmar nueva Password
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="password"
                      placeholder="*******"
                      onChange={handleChange(setConfirmar)}
                      value={confirmar}
                      style={{
                        borderColor: "#b0c4de",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "none",
                      }}
                    />
                  </Col>
                </Form.Group>
                <div className="d-flex justify-content-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ background: "#4682B4" }}
                  >
                    Actualizar
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
        </Col>
      </Row>
      <Row className="d-flex justify-content-end"></Row>
    </Container>
  );
};

export default ActualizarPerfil;
