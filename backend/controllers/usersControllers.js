// las funciones HITO 3
const pool = require("../config/config");
const bcrypt = require("bcryptjs"); /// se agrega para encriptado de contraseñas
const jwt = require("jsonwebtoken");

//conectar formulario de frontend a la API de backend
// registrar usuario en la base de datos del backend
const registrarUsuario = async (usuario) => {
  let { nombre, password, email } = usuario;
  // Encriptar la contraseña
  const passwordEncriptada = bcrypt.hashSync(password); // para encriptar las contraseñas
  password = passwordEncriptada;
  const values = [nombre, passwordEncriptada, email];
  const consulta =
    "INSERT INTO usuarios (nombre,password, email) VALUES ($1, $2, $3)"; // se inserta los datos en la tabla usuarios
  await pool.query(consulta, values);
};

// para verificar credenciales, se valida el email y contraseña para el backend
const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada); // compara la constraseña encriptada con bcrypt para autenticacion
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
  return usuario;
};

// para obtener usuarios con el email decodificado para el backend
const getUsuarios = async (email) => {
  const { rows } = await pool.query(
    "SELECT nombre FROM usuarios WHERE email = $1",
    [email]
  );
  if (!rows.length) throw { code: 404, message: "Usuario no encontrado" };
  return [rows[0]]; // retornar como un array con un unico objeto, esto para que  el frontend pueda acceder
};

//para crear publicacion
// el token contiene el email, se decodifica el token y extrae el email del usuario, consulta la bd para obtner el id (usuario_id) asociado al email
const crearPublicacion = async (req, res) => {
  const { titulo, descripcion, imagen_url, precio } = req.body;
  const { email } = req.user; // El email del usuario autenticado
  try {
    // Buscar el usuario_id del usuario autenticado usando su email
    const userQuery = `SELECT id, nombre, email FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    const nombre_usuario = userResult.rows[0].nombre;
    const email_usuario = userResult.rows[0].email; // Obtener el email del publicador
    // Insertar la nueva publicación
    const query = `
      INSERT INTO publicaciones (titulo, descripcion, imagen_url, precio, usuario_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [titulo, descripcion, imagen_url, precio, usuario_id];
    const { rows } = await pool.query(query, values);
    // Solo enviar el nombre del usuario para la vista tienda, pero incluir el email para uso posterior
    const respuesta = {
      id: rows[0].id,
      titulo: rows[0].titulo,
      descripcion: rows[0].descripcion,
      imagen_url: rows[0].imagen_url,
      precio: rows[0].precio,
      nombre_usuario: nombre_usuario, // Solo el nombre para la tienda
      email_usuario: email_usuario, // El email del publicador (solo para uso interno o para detalles)
    };
    res.status(201).json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la publicación" });
  }
};

// para mostrar todas las publicaciones en Tienda
const obtenerPublicaciones = async (req, res) => {
  try {
    // Obtener todas las publicaciones con el nombre del publicador
    const query = `
      SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id;
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay publicaciones disponibles" });
    }
    // Retornar solo el nombre del publicador (sin email)
    const publicaciones = rows.map((row) => ({
      //se renombra el id a publicacion_id para ocupar en frontend
      publicacion_id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen_url: row.imagen_url,
      precio: row.precio,
      nombre_usuario: row.nombre, // nombre del publicador
    }));
    console.log("publicaciones: ", publicaciones);
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

//funcion obtener el email del publicador
const obtenerEmailPorNombre = async (req, res) => {
  try {
    const { nombrePublicador } = req.params; // Obtener el nombre del publicador desde la URL
    const query = `
      SELECT email
      FROM usuarios
      WHERE nombre = $1;
    `;
    const { rows } = await pool.query(query, [nombrePublicador]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el email del publicador" });
    }
    res.status(200).json({ email: rows[0].email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el email del publicador" });
  }
};

//funcion obtener publicaciones por usuario autenticado
const obtenerMisPublicaciones = async (req, res) => {
  const { email } = req.user; // por usuario autenticado
  try {
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    // publicaciones de usuario autenticado
    const query = `
      SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.usuario_id = $1;
    `;
    const { rows } = await pool.query(query, [usuario_id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay publicaciones disponibles" });
    }
    const publicaciones = rows.map((row) => ({
      publicacion_id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen_url: row.imagen_url,
      precio: row.precio,
      nombre_usuario: row.nombre,
    }));
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

// Agregar una publicación en los favoritos de un usuario autenticado
const agregarFavorito = async (req, res) => {
  let { publicacion_id } = req.params;
  const { email } = req.user;
  publicacion_id = parseInt(publicacion_id, 10);

  if (isNaN(publicacion_id)) {
    return res.status(400).json({ message: "ID de publicación no válido." });
  }
  try {
    const userResult = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    const result = await pool.query(
      "SELECT * FROM favoritos WHERE usuario_id = $1 AND publicacion_id = $2",
      [usuario_id, publicacion_id]
    );
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Ya está en favoritos" });
    }
    await pool.query(
      "INSERT INTO favoritos (usuario_id, publicacion_id) VALUES ($1, $2)",
      [usuario_id, publicacion_id]
    );
    return res.status(201).json({ message: "Favorito agregado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
};

// Obtener las publicaciones favoritas de un usuario autenticado
const obtenerMisFavoritos = async (req, res) => {
  const { email } = req.user; // Obtener el email desde req.user (usuario autenticado)
  try {
    // Obtener el id del usuario a partir del email
    const userResult = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id; // Obtener el ID del usuario
    // Obtener los favoritos del usuario
    const result = await pool.query(
      `SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre AS nombre_usuario
       FROM publicaciones p
       JOIN favoritos f ON p.id = f.publicacion_id
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE f.usuario_id = $1`,
      [usuario_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No tienes favoritos" });
    }
    res.status(200).json(result.rows); // Devolver los favoritos del usuario
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    res.status(500).json({ error: "Error al obtener los favoritos" });
  }
};

//para actualizar el perfil
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, password, nuevoPassword, confirmar } = req.body;
    const { email } = req.user; // El email del usuario autenticado
    // Validar si el usuario existe
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (!usuario.rows.length) {
      return res.status(404).send("Usuario no encontrado");
    }
    // Validar que las contraseñas coincidan si se están modificando
    if (nuevoPassword && nuevoPassword !== confirmar) {
      return res.status(400).send("Las contraseñas no coinciden");
    }
    // Si no se pasa nueva contraseña, se mantiene la actual
    const hashedPassword = nuevoPassword
      ? await bcrypt.hash(nuevoPassword, 10)
      : password
      ? await bcrypt.hash(password, 10)
      : usuario.rows[0].password;

    // Si no se pasa un nuevo nombre, se mantiene el actual
    const updatedName = nombre || usuario.rows[0].nombre;

    // Update user data in the database
    await pool.query(
      "UPDATE usuarios SET nombre = $1, email = $2, password = $3 WHERE email = $4",
      [updatedName, email, hashedPassword, email]
    );
    res.send("Perfil actualizado con éxito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el perfil");
  }
};

const buscarPublicaciones = async (req, res) => {
  const { titulo } = req.query;
  try {
    let query = `
      SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
    `;
    let queryParams = [];
    if (titulo) {
      query += ` WHERE p.titulo ILIKE $1`;
      queryParams.push(`%${titulo}%`);
    }
    const { rows } = await pool.query(query, queryParams);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay publicaciones disponibles" });
    }
    // se devuelve publicaciones filtradas
    const publicaciones = rows.map((row) => ({
      publicacion_id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen_url: row.imagen_url,
      precio: row.precio,
      nombre_usuario: row.nombre,
    }));
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

//para ordenar publicaciones
const ordenarPublicaciones = async (req, res) => {
  try {
    // Obtener el criterio de ordenación desde la consulta
    const { sort } = req.query;

    // Definir la columna y el orden por defecto
    let orderBy = "p.titulo"; // Título por defecto
    let orderDirection = "ASC"; // Ascendente por defecto

    // Configurar las columnas y direcciones según el valor de sort
    switch (sort) {
      case "name-asc":
        orderBy = "p.titulo";
        orderDirection = "ASC";
        break;
      case "name-desc":
        orderBy = "p.titulo";
        orderDirection = "DESC";
        break;
      case "price-asc":
        orderBy = "p.precio";
        orderDirection = "ASC";
        break;
      case "price-desc":
        orderBy = "p.precio";
        orderDirection = "DESC";
        break;
      default:
        break; // Mantener los valores por defecto si no se especifica sort
    }

    // Consultar las publicaciones con orden dinámico
    const query = `
      SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY ${orderBy} ${orderDirection};
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay publicaciones disponibles" });
    }

    // Retornar las publicaciones en el formato esperado
    const publicaciones = rows.map((row) => ({
      publicacion_id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen_url: row.imagen_url,
      precio: row.precio,
      nombre_usuario: row.nombre, // nombre del publicador
    }));

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};

// Función para agregar al carrito desde boton agregar de la card
const agregarItems = async (req, res) => {
  const { publicacion_id } = req.params; // ID de la publicación a agregar
  const { email } = req.user; // Email del usuario autenticado (desde el token)
  try {
    // Buscar el usuario autenticado usando su email
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    // Buscar los datos de la publicación
    const publicacionQuery = `SELECT titulo, precio FROM publicaciones WHERE id = $1`;
    const publicacionResult = await pool.query(publicacionQuery, [
      publicacion_id,
    ]);
    if (publicacionResult.rows.length === 0) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
    // Crear una boleta para el usuario
    const boletaQuery = `INSERT INTO boletas (usuario_id) VALUES ($1) RETURNING *`;
    const boletaResult = await pool.query(boletaQuery, [usuario_id]);
    const boleta_id = boletaResult.rows[0].id;
    // Insertar el item en la tabla items_boleta
    const itemsBoletaQuery = `
      INSERT INTO items_boleta (boleta_id, publicacion_id, cantidad_item)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const itemsBoletaResult = await pool.query(itemsBoletaQuery, [
      boleta_id,
      publicacion_id,
      1, // Cantidad inicial del item
    ]);
    // Responder con la información de la boleta y el item
    res.status(201).json({
      message: "Boleta creada y producto agregado a la boleta",
      boleta: boletaResult.rows[0],
      item: itemsBoletaResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear boleta y agregar producto" });
  }
};

//para mostrar lo agregado al carrito
const obtenerBoletaItems = async (req, res) => {
  const { email } = req.user; // Obtener el email del usuario autenticado (desde el token)
  try {
    // Buscar el usuario autenticado usando su email
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    // Obtener la última boleta asociada con el usuario
    const boletaQuery = `SELECT * FROM boletas WHERE usuario_id = $1 ORDER BY id DESC LIMIT 1`;
    const boletaResult = await pool.query(boletaQuery, [usuario_id]);
    if (boletaResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró boleta para el usuario" });
    }
    const boleta_id = boletaResult.rows[0].id;
    // Obtener los productos dentro de la boleta
    const itemsBoletaQuery = `
      SELECT ib.id AS item_id, p.titulo, p.precio, ib.cantidad_item
      FROM items_boleta ib
      JOIN publicaciones p ON ib.publicacion_id = p.id
      WHERE ib.boleta_id = $1
    `;
    const itemsBoletaResult = await pool.query(itemsBoletaQuery, [boleta_id]);
    // Responder con la boleta y los items
    res.status(200).json({
      boleta: boletaResult.rows[0],
      items: itemsBoletaResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener boleta y productos" });
  }
};

const actualizarCantidadItem = async (req, res) => {
  const { item_id } = req.params; // ID del item en la boleta
  const { accion } = req.body; // Acción: "incrementar" o "disminuir"
  try {
    // Obtener la cantidad actual del item
    const itemQuery = `SELECT cantidad_item FROM items_boleta WHERE id = $1`;
    const itemResult = await pool.query(itemQuery, [item_id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }
    let nuevaCantidad = itemResult.rows[0].cantidad_item;
    if (accion === "incrementar") {
      nuevaCantidad += 1;
    } else if (accion === "disminuir" && nuevaCantidad > 1) {
      nuevaCantidad -= 1;
    } else {
      return res
        .status(400)
        .json({ message: "Acción no válida o cantidad mínima alcanzada." });
    }
    // Actualizar la cantidad del item en la base de datos
    const updateQuery = `
      UPDATE items_boleta
      SET cantidad_item = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updateResult = await pool.query(updateQuery, [
      nuevaCantidad,
      item_id,
    ]);
    res.status(200).json({
      message: "Cantidad actualizada",
      item: updateResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la cantidad del item" });
  }
};

//para eliminar item de publicaciones agregadas al carrito
const eliminarItem = async (req, res) => {
  const { item_id } = req.params; // ID del ítem en la boleta
  const { email } = req.user; // Email del usuario autenticado (desde el token)
  try {
    // Obtener el usuario autenticado
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    // Verificar que el ítem pertenece al usuario autenticado
    const boletaQuery = `
      SELECT b.id 
      FROM boletas b
      JOIN items_boleta ib ON b.id = ib.boleta_id
      WHERE ib.id = $1 AND b.usuario_id = $2
    `;
    const boletaResult = await pool.query(boletaQuery, [item_id, usuario_id]);
    if (boletaResult.rows.length === 0) {
      return res.status(403).json({ message: "Acceso no autorizado al ítem" });
    }
    // Eliminar el ítem de la base de datos
    const deleteQuery = `DELETE FROM items_boleta WHERE id = $1`;
    await pool.query(deleteQuery, [item_id]);
    res.status(200).json({ message: "Ítem eliminado del carrito con éxito" });
  } catch (error) {
    console.error("Error al eliminar el ítem:", error);
    res.status(500).json({ error: "Error al eliminar el ítem" });
  }
};

module.exports = {
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
};
