import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importar el hook useNavigate
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa"; // Íconos para incrementar y decrementar
import { UsuarioContext } from "../context/UsuarioContext";

const Carrito = () => {
  const [boleta, setBoleta] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { usuario, setUsuario } = useContext(UsuarioContext);

  useEffect(() => {
    //para obtener la boleta con sus items
    const fetchBoletaYItems = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Por favor, inicia sesión para ver tu boleta.");
          return;
        }

        const response = await fetch(
          "http://localhost:3000/obtenerBoletaItems",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setBoleta(data.boleta);
          setItems(data.items);
        } else {
          setError(data.message || "No se pudo obtener la boleta.");
        }
      } catch (error) {
        console.error("Error al obtener la boleta:", error);
        setError("Hubo un problema al obtener la boleta.");
      }
    };

    fetchBoletaYItems();
  }, []); // pasar una dependencia vacía para ejecutar solo una vez

  //actualizar cantidad aumetar o dismimuir
  const actualizarCantidad = async (item_id, accion) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/actualizarCantidad/${item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accion }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.item_id === item_id
              ? { ...item, cantidad_item: data.item.cantidad_item }
              : item
          )
        );
      } else {
        alert(data.message || "No se pudo actualizar la cantidad.");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  //elimianr item
  const eliminarItem = async (item_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/eliminarItem/${item_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setItems((prevItems) =>
          prevItems.filter((item) => item.item_id !== item_id)
        );
        alert("Ítem eliminado del carrito.");
      } else {
        alert(data.message || "No se pudo eliminar el ítem.");
      }
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    }
  };

  if (error) {
    return (
      <Container className="p-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!boleta) {
    return (
      <Container className="p-4">
        <h3>Cargando tu boleta...</h3>
      </Container>
    );
  }

  // Calcular el total de la boleta (suma de los total item)
  const totalBoleta = items.reduce(
    (total, item) => total + item.precio * item.cantidad_item,
    0
  );

  return (
    <Container className="p-4">
      <h4 className="mb-2 text-white border-bottom p-2 mt-4">
        Ítems por Boleta
      </h4>
      <p className="text-center text-white">{usuario?.nombre}</p>

      <h3>Boleta #{boleta.id}</h3>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total por item</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.item_id}>
                <td>{index + 1}</td>
                <td>{item.titulo}</td>
                <td>${Math.round(item.precio)}</td>
                <td>{item.cantidad_item}</td>
                <td>${item.precio * item.cantidad_item}</td>
                <td>
                  <Button
                    variant="link"
                    onClick={() =>
                      actualizarCantidad(item.item_id, "disminuir")
                    }
                  >
                    <FaMinus />
                  </Button>
                  <Button
                    variant="link"
                    onClick={() =>
                      actualizarCantidad(item.item_id, "incrementar")
                    }
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => eliminarItem(item.item_id)}
                  >
                    <FaTrashAlt /> {/* Ícono de eliminación */}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center align-items-sm-start gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="w-100 w-sm-auto mb-2 mb-sm-0"
        >
          Volver
        </Button>
        <div className="w-100 w-sm-auto text-center text-sm-start">
          <h4>Total de ítems: ${totalBoleta}</h4>{" "}
          <Button
            variant="primary"
            onClick={() => alert("¡Pagar ahora!")}
            className="w-100 w-sm-auto"
          >
            Pagar
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Carrito;
