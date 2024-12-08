// HITO 3
// rutas para el backend
const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  verificarCredenciales,
  getUsuarios,
  crearPublicacion,
  obtenerPublicaciones,
  obtenerEmailPorNombre,
  obtenerMisPublicaciones,
  agregarFavorito,
  obtenerMisFavoritos,
  actualizarPerfil,
  buscarPublicaciones,
  ordenarPublicaciones,
  agregarItems,
  obtenerBoletaItems,
  actualizarCantidadItem,
  eliminarItem,
} = require("../controllers/usersControllers"); //para las funciones
const { authMiddleware } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken"); //para el token
const pool = require("../config/config");

// ruta para crear usuarios
// localhost:3000/usuarios, se agrega los datos de las 3 columnas de la tabla en body
//POST FUNCIONA BIEN POR THUNDER Y POR FRONTEND, SE ARGEA BIEN EN LA TABLA USUARIOS
router.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body; // captura los datos
    await registrarUsuario(usuario); // registra el usuario
    res.send("Usuario registrado con éxito"); // respuesta con mensaje
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error al registrar el usuario: " + error.message);
  }
});

// ruta para el login
// POST localhost:3000/login con email y password en body se obtiene el token
// FUNCIONA BIEN EN THUNDER, SE OBTIENE EL TOKEN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // captura el email y contraseña
    await verificarCredenciales(email, password); // verifica las credenciales
    //FIRMA DE TOKEN
    const token = jwt.sign({ email }, "mi_clave", { expiresIn: "10d" }); // genera y firma un token JWT con duracion, con payload del email
    res.json({ token }); // envia el token en un objeto JSON
  } catch (error) {
    console.log(error); // imprime el error en la consola
    res.status(error.code || 500).send(error); // envia el error
  }
});

// ruta para obtener usuarios, para ingresar al perfil
// para obtener datos de usuario con autenticacion
// GET localhost:3000/usuarios  con Authorization de token, se escribe en Headers con Bearer, despues se puede ingresar inicio de sesion por frontend
// FUNCIONA BIEN EN THUNDER, ENTREGA EL NOMBRE EN MENSAJE
router.get("/usuarios", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user; // obtener email del token verificado por el middleware
    console.log("Email del usuario:", email); // Mostrar el email en la consola
    const usuario = await getUsuarios(email);
    res.status(200).json(usuario); // enviar datos del usuario
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ message: error.message || "Error en el servidor" });
  }
});

// ruta para actualizar perfil
// PUT http://localhost:3000/usuarios  pasar el token en autorizacion y en body lo que se cambiará con email
router.put("/usuarios", authMiddleware, actualizarPerfil);

//ruta para crear nuevas publicaciones en la opcion dentro del menu
// http://localhost:3000/publicaciones en POST escribir en body los 4 campos
// FUNCIONA BIEN EN THUNDER CLIENT
router.post("/publicaciones", authMiddleware, async (req, res) => {
  try {
    // Llamamos a la función crearPublicacion que gestiona la lógica de crear una publicación
    await crearPublicacion(req, res); // Delegar la lógica al controlador
  } catch (error) {
    res.status(500).send({ message: "Error al crear la publicación en la ruta", error });
  }
});

// Ruta para obtener las publicaciones, debe ser publica, GET /publicaciones
router.get("/publicaciones", obtenerPublicaciones);

// Ruta para obtener el email del publicador por su nombre  ejemplo GET /usuarios/email/roroo se obtiene el email, publico
router.get('/usuarios/email/:nombrePublicador', obtenerEmailPorNombre);

// Ruta para obtener las publicaciones de un usuario autenticado GET /publicaciones/mis-publicaciones con token
router.get('/publicaciones/mis-publicaciones', authMiddleware, obtenerMisPublicaciones);

// Ruta para agregar favorito POST /favoritos/32  con token
router.post("/favoritos/:publicacion_id", authMiddleware, agregarFavorito);

// Ruta para obtener los favoritos de un usuario  GET /favoritos con token
router.get('/favoritos', authMiddleware, obtenerMisFavoritos);

// Ruta para buscar publicaciones por título, es publico   GET ejemplo localhost:3000/publicaciones/buscar?titulo=kotlin
router.get('/publicaciones/buscar', buscarPublicaciones);

//para ordenar publicaciones, es publico GET   localhost:3000/publicaciones/ordenar?sort=name-asc
router.get("/publicaciones/ordenar", ordenarPublicaciones);

// Ruta para agregar al carrito, ahora usando req.params para obtener publicacion_id   POST localhost:3000/boletas/agregar/29  con token
router.post("/boletas/agregar/:publicacion_id", authMiddleware, agregarItems);

//para obtener detalle de boleta con items GET localhost:3000/obtenerBoletaItems  con token
router.get("/obtenerBoletaItems", authMiddleware, obtenerBoletaItems);

//para aumentar o disminuir la cantidad por item   PUT localhost:3000/actualizarCantidad/7 EN BODY "accion": "incrementar" O "disminuir" con token
router.put("/actualizarCantidad/:item_id",  authMiddleware, actualizarCantidadItem );

//para eliminar item DELETE  localhost:3000/eliminarItem/7 con token
router.delete("/eliminarItem/:item_id", authMiddleware,eliminarItem);


module.exports = router;
