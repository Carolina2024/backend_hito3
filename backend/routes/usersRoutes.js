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
  agregarEliminarFavorito,
  obtenerMisFavoritos,
  actualizarPerfil,
  buscarPublicaciones,
  ordenarPublicaciones,
  /* obtenerDetallePublicacion, */
} = require("../controllers/usersControllers"); //para las funciones
const { authMiddleware } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken"); //para el token


// ruta para crear usuarios
// localhost:3000/usuarios, se agrega los datos de las 3 columnas de la tabla en body
//POST FUNCIONA BIEN POR THUNDER Y POR FRONTEND, SE ARGEA BIEN EN LA TABLA USUARIOS
router.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body; // captura los datos
    await registrarUsuario(usuario); // registra el usuario
    res.send("Usuario registrado con éxito"); // respuesta con mensaje
  } catch (error) {
    res.status(500).send(error); // envia un error
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

// ruta para obtener usuarios
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
// PUT http://localhost:3000/usuarios/id  pasar el token en autorizacion y en body los 6 campos con el id
router.put("/usuarios", authMiddleware, async (req, res) => {
  try {
    const { nombre, email, password, nuevoPassword, confirmar } = req.body;
    const { email: emailToken } = req.user; // Email from the session (logged-in user)

    // Validate if the user exists
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [emailToken]
    );

    if (!usuario.rows.length) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Validate that the new passwords match
    if (nuevoPassword && nuevoPassword !== confirmar) {
      return res.status(400).send("Las contraseñas no coinciden");
    }

    // Hash the new password if it's provided, else keep the existing password
    const hashedPassword = nuevoPassword
      ? await bcrypt.hash(nuevoPassword, 10)
      : password
      ? await bcrypt.hash(password, 10)
      : usuario.rows[0].password;

    // Update user data in the database
    await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2, password = $3 WHERE email = $4",
      [nombre, email, hashedPassword, emailToken]
    );

    res.send("Perfil actualizado con éxito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el perfil");
  }
});

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

//ruta get para obtener las publicaciones
/* router.get("/publicaciones", authMiddleware, async (req, res) => {
  try {
    // Obtener el email del usuario autenticado
    const { email } = req.user;

    const publicaciones = await obtenerPublicaciones(email);
    res.status(200).json(publicaciones); // Enviar las publicaciones obtenidas
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ message: error.message || "Error en el servidor" });
  }
});
 */

// Ruta para obtener las publicaciones, debe ser publica
router.get("/publicaciones", obtenerPublicaciones);

//ruta para mostrar las publicaciones
/* router.get("/publicaciones", async (req, res) => {
  try {
    const publicaciones = await getPublicaciones();
    res.status(200).json(publicaciones);
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ message: error.message || "Error en el servidor" });
  }
}); */


// Ruta para obtener el email del publicador por su nombre
router.get('/usuarios/email/:nombrePublicador', obtenerEmailPorNombre);

// Ruta para obtener las publicaciones de un usuario autenticado
router.get('/publicaciones/mis-publicaciones', authMiddleware, obtenerMisPublicaciones);


// Ruta para agregar o eliminar un favorito
router.put('/favoritos/:publicacion_id', authMiddleware, agregarEliminarFavorito);

// Ruta para obtener los favoritos de un usuario
router.get('/favoritos', authMiddleware, obtenerMisFavoritos);

// Ruta para actualizar el perfil de usuario
router.put('/perfil', authMiddleware, actualizarPerfil);

// Ruta para buscar publicaciones por título, es publico
router.get('/publicaciones/buscar', buscarPublicaciones);

//para ordenar publicaciones, es publico
router.get("/publicaciones/ordenar", ordenarPublicaciones);


module.exports = router;
