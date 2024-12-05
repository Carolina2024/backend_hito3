import { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import OrdenarPor from "../components/OrdenarPor";
import Buscador from "../components/Buscador";
import CardPublicacion from "../components/CardPublicacion";
import { UsuarioContext } from "../context/UsuarioContext";
import Tienda from "../components/Tienda";
import { MdLaptop } from "react-icons/md";
import { FaMouse } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//HITO 2, DE ACUERDO A INSTRUCCIONES DE PROFESORES NO ES NECESARIO QUE TODO TENGA FUNCIONALIDAD O SE MUESTRE EL USUARIO
// YA QUE SE VERÁ EN BACKEND CON LA BASE DE DATOS

const Home = () => {
  const { activeMenu } = useContext(UsuarioContext);

  // Función para desplazar hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const imageUrl =
    "https://funix.edu.vn/wp-content/uploads/2022/08/funix-Hoc-ngon-ngu-lap-trinh-1-768x441.jpg";

  return (
    <Container
      className="home-root container d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      <h3 className="text-center p-4 mt-4 fw-bold fst-italic">
        Bienvenidos al MarketPlace cursos online de programación
      </h3>
      <div className="iconos text-center mb-4">
        <MdLaptop style={{ fontSize: "1.5rem", marginRight: "10px" }} />
        <FaMouse style={{ fontSize: "1.5rem" }} />
      </div>

      <div className="text-center mb-4">
        <img
          src={imageUrl}
          alt="Imagen descriptiva"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

      <Row>
        <Col sm="6">
          <OrdenarPor />
        </Col>
        <Col sm="6">
          <Buscador />
        </Col>
      </Row>

      <section
        className="mt-4 p-4"
        style={{
          backgroundColor: "#121212",
          borderRadius: "10px",
          border: "1px solid #34495E",
        }}
      >
        <Tienda />
      </section>
      {/* Ícono de React al final de la página para subir */}
      <div
        className="react-icon-scroll"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#61dafb",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
        }}
        onClick={scrollToTop}
      >
        <FaArrowUp style={{ fontSize: "2rem", color: "#121212" }} />
      </div>
    </Container>
  );
};

export default Home;
