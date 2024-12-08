const request = require("supertest");
const server = require("../server/index");
const jwt = require("jsonwebtoken"); // Importar jwt para generar el token
const usersRoutes = require("../routes/usersRoutes");
const pool = require("../config/config");
const { Pool } = require("pg");
const { mockQuery } = require("pg");

// TEST FUNCIONA BIEN OBTENER LAS PUBLICACIONES
describe("Operaciones CRUD de Market 1", () => {
  describe("/publicaciones ", () => {
    describe("GET /publicaciones", () => {
      it("responds with json", async () => {
        const response = await request(server).get("/publicaciones");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
      }, 10000);
    });
  });
});

// TEST FUNCIONA BIEN PARA EL REGISTRO DE USUARIO
describe("Operaciones CRUD de Market 2", () => {
  describe("POST /usuarios", () => {
    it("debería registrar un nuevo usuario correctamente", async () => {
      // Datos de usuario para la prueba
      const nuevoUsuario = {
        nombre: "Test User",
        email: "testuser2@example.com",
        password: "password123",
      };
      // Realizar una solicitud POST a la ruta /usuarios
      const response = await request(server)
        .post("/usuarios")
        .send(nuevoUsuario);
      // Verifica que la respuesta sea exitosa
      expect(response.status).toBe(200);
      expect(response.text).toBe("Usuario registrado con éxito"); // Mensaje de éxito esperado
      // Verifica que el usuario haya sido insertado en la base de datos
      const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [nuevoUsuario.email]
      );
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
});

// TEST FUNCIONA BIEN DETALLE DE PUBLICACION ENTREGA EMAIL DE PUBLICADOR
describe("Operaciones CRUD de Market 3", () => {
  describe("GET /usuarios/email/:nombrePublicador", () => {
    it("debería devolver el email del publicador si existe", async () => {
      const nombrePublicador = "carolll"; // Nombre del publicador existente en la base de datos
      const response = await request(server).get(
        `/usuarios/email/${nombrePublicador}`
      );
      // Verificamos que el status de la respuesta sea 200
      expect(response.status).toBe(200);

      // Verificamos que el email sea correcto
      expect(response.body.email).toBe("carol@gmail.com");
    });
    it("debería devolver 404 si no se encuentra el publicador", async () => {
      const nombrePublicador = "noexiste"; // Nombre de un publicador que no existe
      const response = await request(server).get(
        `/usuarios/email/${nombrePublicador}`
      );
      // Verificamos que el status de la respuesta sea 404
      expect(response.status).toBe(404);
      // Verificamos que el mensaje de error sea el esperado
      expect(response.body.message).toBe(
        "No se encontró el email del publicador"
      );
    });
  });
});

// TEST FUNCIONA BIEN BUSCADOR DE PUBLICACIONES POR TITULO
describe("Operaciones CRUD de Market 4", () => {
  describe("GET /publicaciones/buscar", () => {
    it("debería devolver las publicaciones que coinciden con el título", async () => {
      // Hacemos una consulta con un título que sabemos que existe en la base de datos
      const response = await request(server)
        .get("/publicaciones/buscar")
        .query({ titulo: "Kotlin" });
      // Comprobamos que la respuesta sea exitosa
      expect(response.status).toBe(200);
      // Verificamos que la respuesta contenga la publicación correcta
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            publicacion_id: 29,
            titulo: "Programacion Kotlin",
            descripcion: "Curso de programacion en Kotlin",
            imagen_url:
              "https://www.iamtimcorey.com/assets/images/courses/mc-csh-01_title.png",
            precio: "20000.00",
            nombre_usuario: "carolll",
          }),
        ])
      );
    });
    it("debería devolver un error 404 si no se encuentran publicaciones", async () => {
      // Hacemos una consulta con un título que sabemos que no existe
      const response = await request(server)
        .get("/publicaciones/buscar")
        .query({ titulo: "NoExisteTitulo" });

      // Comprobamos que la respuesta tenga un error 404
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("No se encontraron publicaciones");
    });
  });
});
