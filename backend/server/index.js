// HITO 3 BACKEND PROYECTO FINAL
//para el backend
/* para habilitar los cors */
const cors = require("cors");
// Importar express y se ejecuta para obtener un enrutador (app)
const express = require("express");
const app = express();
const usersRoutes = require("../routes/usersRoutes");
/* const publicacionesRouter = require('./routes/publicacionesRouter'); */ // Importar rutas de publicaciones

// Configuración de CORS para permitir solicitudes con credenciales
const corsOptions = {
  origin: "http://localhost:5173",  // El origen de tu frontend
  credentials: true,
  exposedHeaders:["Authorization"]// Permitir enviar cookies o encabezados de autorización
};

app.use(cors(corsOptions)); // se permite cors para todas las rutas

/* parsear el cuerpo de la consulta */
app.use(express.json());

app.use("/publicaciones", usersRoutes);

app.use(usersRoutes);
/* app.use('/publicaciones', publicacionesRouter); */ // Agregar la ruta para publicaciones

/* Crea un servidor en el puerto 3000  http://localhost:3000 */
app.listen(3000, () => console.log("SERVIDOR ENCENDIDO en el puerto 3000"));

// Solo inicia el servidor si no esta corriendo en un entorno de pruebas
/* if (process.env.NODE_ENV !== "test") {
  const PORT = 3000; // Define el puerto
  app.listen(PORT, () =>
    console.log(`SERVIDOR ENCENDIDO en el puerto ${PORT}`)
  );
} */

module.exports = app; // Exportamos app para los test++++