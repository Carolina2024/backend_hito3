import React from "react";
import FormularioUsuario from "../components/FormularioUsuario";

const RegistroUsuario = () => {
  return (
    <main className="registroUsuario" style={{ height: "calc(100vh - 140px)" }}>
      <h2>Registrarse</h2>
      <section className="formulario">
        <FormularioUsuario />
      </section>
    </main>
  );
};

export default RegistroUsuario;
