import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MenuLateral from "../components/MenuLateral";
import { UsuarioContext } from "../context/UsuarioContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActualizarPerfil = () => {
  const { usuario, setUsuario } = useContext(UsuarioContext);
  const { setActiveMenu } = useContext(UsuarioContext);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas nuevas coincidan
    if (nuevoPassword !== confirmar) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    // Validar que se haya ingresado la contraseña actual
    if (!password) {
      alert("Debes ingresar tu contraseña actual para realizar cambios");
      return;
    }

    const token = localStorage.getItem("token"); // Obtener el token desde localStorage
    if (!token) {
      alert("Token no disponible. Por favor, inicia sesión.");
      return;
    }

    // Prepara el objeto de datos solo con los campos que tienen valores
    const updatedUserData = {
      nombre: nombre || usuario.nombre, // Mantener el nombre actual si no se cambia
      email: email || usuario.email, // Mantener el email actual si no se cambia
      password, // Siempre enviar la contraseña actual para validarla en el backend
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

        // Redirigir a la vista del perfil
        navigate("/perfil");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    } finally {
      // Limpiar los campos
      setNombre("");
      setEmail("");
      setPassword("");
      setNuevoPassword("");
      setConfirmar("");
    }
  };

  useEffect(() => {
    setActiveMenu("Actualizar Perfil");
  }, [setActiveMenu]);

  //para cambios en los inputs
  const handleChange = (setter) => (event) => setter(event.target.value);

  const handleGoBack = () => {
    navigate("/perfil");
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12} md={3}>
          <MenuLateral />
        </Col>
        <Col xs={12} md={9} className="d-flex justify-content-center p-4">
          <div className="text-center shadow-sm w-100 w-md-50">
            <h4 className="mb-2 text-white border-bottom p-2">
              Actualizar Registro
            </h4>
            {/* para que se muestre el usuario */}
            <p className="text-center text-white">{usuario?.nombre}</p>

            <Form
              onSubmit={handleSubmit}
              className="border p-4 rounded shadow-sm bg-primary text-white"
            >
              <Form.Group className="mb-3" controlId="formPlaintextName">
                <Form.Label className="fw-bold text-white">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={handleChange(setNombre)}
                  value={nombre}
                  className="bg-light text-dark"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPlaintextEmail">
                <Form.Label className="fw-bold text-white ">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChange(setEmail)}
                  value={email}
                  className="bg-light text-dark"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPlaintextNewPassword">
                <Form.Label className="fw-bold text-white">
                  Nuevo Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="*******"
                  onChange={handleChange(setNuevoPassword)}
                  value={nuevoPassword}
                  className="bg-light text-dark"
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="formPlaintextConfirmPassword"
              >
                <Form.Label className="fw-bold text-white">
                  Confirmar nueva Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="*******"
                  onChange={handleChange(setConfirmar)}
                  value={confirmar}
                  className="bg-light text-dark"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPlaintextPassword">
                <Form.Label className="fw-bold text-white">
                  Password Actual
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="*******"
                  onChange={handleChange(setPassword)}
                  value={password}
                  className="bg-light text-dark"
                />
              </Form.Group>
              <div className="d-flex justify-content-center gap-2">
                <Button type="submit" className="btn btn-success">
                  Actualizar
                </Button>
                <Button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleGoBack}
                >
                  Volver
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ActualizarPerfil;
