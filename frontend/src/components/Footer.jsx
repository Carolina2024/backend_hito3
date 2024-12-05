import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      className=".home-root footer bg-black text-white"
      style={{ height: "70px" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col className="text-center mt-2">
            <div className="d-flex justify-content-center">
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="text-white mx-2 my-1"
              >
                <FaInstagram style={{ fontSize: "1.2rem" }} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                className="text-white mx-2 my-1"
              >
                <FaFacebook style={{ fontSize: "1.2rem" }} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                className="text-white mx-2 my-1
              "
              >
                <FaTwitter style={{ fontSize: "1.2rem" }} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                className="text-white mx-2 my-1"
              >
                <FaYoutube style={{ fontSize: "1.2rem" }} />
              </a>
            </div>
            <span
              className="fs-6"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              &copy; {new Date().getFullYear()} Derechos Reservados
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
