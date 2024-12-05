import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { BsPlusCircle, BsDashCircle, BsTrash } from "react-icons/bs";

const Carrito = () => {
  const [carrito, setCarrito] = useState([
    {
      id: 1,
      titulo: "Producto 1",
      precio: 100,
      cantidad: 1,
    },
    {
      id: 2,
      titulo: "Producto 2",
      precio: 50,
      cantidad: 2,
    },
  ]);

  const agregarItem = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const disminuirItem = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const eliminarItem = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPagar = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handlePagar = () => {
    if (
      window.confirm(
        "¡Estás a punto de proceder con el pago! ¿Confirmas que deseas pagar?"
      )
    ) {
      alert("¡Gracias por tu pago!");
    }
  };

  return (
    <Container className="p-4" style={{ height: "calc(100vh - 140px)" }}>
      <Container className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total Ítem</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.titulo}</td>
                <td>{item.precio}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio * item.cantidad}</td>
                <td>
                  <Button
                    variant="outline-success"
                    onClick={() => agregarItem(item.id)}
                  >
                    <BsPlusCircle />
                  </Button>
                  <Button
                    variant="outline-warning"
                    onClick={() => disminuirItem(item.id)}
                    className="mx-2"
                  >
                    <BsDashCircle />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => eliminarItem(item.id)}
                  >
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-between">
          <h4>Total Pagar: ${totalPagar}</h4>
          <Button
            variant="primary"
            style={{ background: "#8FBC8F" }}
            onClick={handlePagar}
          >
            Pagar
          </Button>
        </div>
      </Container>
      <div
        style={{
          marginTop: "150px",
        }}
      ></div>
    </Container>
  );
};

export default Carrito;
