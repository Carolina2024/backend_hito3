import React from "react";
import FormularioUsuario from "../components/FormularioUsuario";
import { Container } from "react-bootstrap";

const RegistroUsuario = () => {
  return (
    <Container  style={{ height: "calc(100vh - 140px)" }}>
      <h2 className="text-center mt-4">Registrarse</h2>
      <section>
        <FormularioUsuario />
      </section>
    </Container>
  );
};

export default RegistroUsuario;
