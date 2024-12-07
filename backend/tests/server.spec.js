const request = require("supertest");
const server = require("../server/index");
const jwt = require("jsonwebtoken"); // Importar jwt para generar el token
const usersRoutes = require("../routes/usersRoutes");
const pool = require("../config/config");
const { Pool } = require("pg");
const { mockQuery } = require("pg");

// TEST FUNCIONA BIEN OBTENER LAS PUBLICACIONES
describe("/publicaciones ", () => {
  describe("GET /publicaciones", () => {
    it("responds with json", async () => {
      const response = await request(server).get("/publicaciones");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    }, 10000);
  });
});

// TEST FUNCIONA BIEN PARA EL REGISTRO DE USUARIO
describe("POST /usuarios", () => {
  it("debería registrar un nuevo usuario correctamente", async () => {
    // Datos de usuario para la prueba
    const nuevoUsuario = {
      nombre: "Test User",
      email: "testuser2@example.com",
      password: "password123",
    };
    // Realizar una solicitud POST a la ruta /usuarios
    const response = await request(server).post("/usuarios").send(nuevoUsuario);
    // Verifica que la respuesta sea exitosa
    expect(response.status).toBe(200);
    expect(response.text).toBe("Usuario registrado con éxito"); // Mensaje de éxito esperado
    // Verifica que el usuario haya sido insertado en la base de datos
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      nuevoUsuario.email,
    ]);
    // Asegúr de que el usuario exista en la base de datos
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].email).toBe(nuevoUsuario.email);
    // verificar también si la contraseña está encriptada
    expect(result.rows[0].password).not.toBe(nuevoUsuario.password);
    // Limpiar la base de datos después de la prueba (opcional)
    await pool.query("DELETE FROM usuarios WHERE email = $1", [
      nuevoUsuario.email,
    ]);
  });
});

// TEST FUNCIONA BIEN DETALLE DE PUBLICACION ENTREGA EMAIL DE PUBLICADOR
jest.mock("../config/config", () => ({
  query: jest.fn(),
}));
describe("GET /usuarios/email/:nombrePublicador", () => {
  it("debería devolver el email del publicador si existe", async () => {
    // simular que la base de datos devuelve un resultado
    const mockEmail = "carlos@gmail.com";
    pool.query.mockResolvedValueOnce({ rows: [{ email: mockEmail }] });
    const nombrePublicador = "carlos";
    const response = await request(server).get(
      `/usuarios/email/${nombrePublicador}`
    );
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(mockEmail);
  });
  it("debería devolver 404 si no se encuentra el publicador", async () => {
    // simular que no se encontró el publicador
    pool.query.mockResolvedValueOnce({ rows: [] });
    const nombrePublicador = "carlos";
    const response = await request(server).get(
      `/usuarios/email/${nombrePublicador}`
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "No se encontró el email del publicador"
    );
  });
});

// TEST FUNCIONA BIEN BUSCADOR DE PUBLICACIONES POR TITULO
jest.mock("pg", () => {
  const mockQuery = jest.fn(); // Definir un mock para el método query
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
      end: jest.fn(),
    })),
    mockQuery, // Exportar el mock para usarlo en las pruebas
  };
});

describe("GET /publicaciones/buscar", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar las implementaciones de los mocks antes de cada prueba
  });
  it("debería devolver todas las publicaciones cuando no se envía título", async () => {
    // Configurar la respuesta del mock
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          titulo: "Programacion Kotlin",
          descripcion: "Aprende Kotlin desde cero",
          imagen_url: "https://example.com/kotlin.png",
          nombre: "usuario1",
          precio: "10.00",
        },
        {
          id: 2,
          titulo: "Programacion Java",
          descripcion: "Domina Java en 30 días",
          imagen_url: "https://example.com/java.png",
          nombre: "usuario2",
          precio: "15.00",
        },
      ],
    });
    const response = await request(server).get("/publicaciones/buscar"); // Llamada al endpoint
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Al menos una publicación
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          publicacion_id: expect.any(Number),
          titulo: expect.any(String),
          descripcion: expect.any(String),
          imagen_url: expect.any(String),
          nombre_usuario: expect.any(String),
          precio: expect.any(String),
        }),
      ])
    );
  });
  it("debería devolver un error 500 si hay un fallo en el servidor", async () => {
    // Simular un error en el método query
    mockQuery.mockRejectedValueOnce(new Error("Simulated server error"));

    const response = await request(server).get("/publicaciones/buscar");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error al obtener las publicaciones");
  });
});
