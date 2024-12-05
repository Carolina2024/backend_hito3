const request = require("supertest");
const server = require("../server/index.js");

describe("Operaciones CRUD de Market", () => {
  describe("Ruta POST usuario", () => {
    it("Un nuevo usuario y devuelve un código 200", async () => {
      const nuevoUsuario = {
        nombre: "Nuevo Usuario",
        password: "bfdshkfskj",
        email: "nuevo@usuario",
      };
      const response = await request(server)
        .post("/usuarios")
        .send(nuevoUsuario);
      expect(response.body).toContainEqual(nuevoUsuario);
      expect(response.status).toBe(200);
    });
  });
  describe("Ruta GET usuario", () => {
    it("usuarios y devuelve un código 200", async () => {
      const jwt = "token";
      const email = "nuevo@usuario";
      const response = await request(server)
        .get("/usuarios")
        .set("Authorization", jwt)
        .send();
      expect(response.body).toContainEqual(nuevoUsuario);
      expect(response.status).toBe(200);
    });
  });
});

describe("/publicaciones ", () => {
  describe("GET ", () => {
    it("responds with json", async () => {
      const response = await request(server).get("/publicaciones");

      expect(response.statusCode).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
    });
  });
  describe("POST", () => {
    it("responds with json", async () => {
      const jwt = "token";
      const nuevaPublicacion = {
        titulo: "Nuevo curso",
        descripcion: "Descripcion nuevo curso",
        imagen_url: "urlimagennuevo curso.jpg",
        precio: 50000,
        usuario_id: 8,
      };
      const response = await request(server)
        .post("/publicaciones")
        .set("Authorization", jwt)
        .send(nuevaPublicacion);
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
    });
  });
});
