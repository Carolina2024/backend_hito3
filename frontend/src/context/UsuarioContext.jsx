import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UsuarioContext = createContext();

/* const BASE_URL = import.meta.env.VITE_BASE_URL; */

const initialUsuario = JSON.parse(localStorage.getItem("usuario")) || {
nombre: '',
email: '',
};

const UsuariosProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null); //para backend
  /* const initialStateToken = localStorage.getItem("token") || ""; */
  /* const [token, setToken] = useState(initialStateToken); */
  const [activeMenu, setActiveMenu] = useState("");
  const [showCerrarSesion, setShowCerrarSesion] = useState(false);
  const [usuario, setUsuario] = useState(initialUsuario); //initialUsuario es el valor del estado inicial del estado usuario
  const [publicaciones, setPublicaciones] = useState([]); //para todas las publicaciones
  const [MisPublicaciones, setMisPublicaciones] = useState([]);
  const [MisFavoritos, setMisFavoritos] = useState([]);

  const logout = () => {
    setUsuario(null);
    setActiveMenu(null);
    setShowCerrarSesion(false);
    sessionStorage.removeItem("token"); // Eliminar el token de sessionStorage
    localStorage.removeItem("usuario"); // eliminar usuario de localStorage
  };

  const handleMenuChange = (menuName) => {
    setActiveMenu(menuName);
    if (menuName === "Tienda") {
      setShowCerrarSesion(true);
    } else {
      setShowCerrarSesion(false);
    }
  };

  //para backend inicio sesion se ocupa credenciales email y password creados en registro
  // con autorizacion de token pasa a vista perfil
  const loginWithEmailAndPassword = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      // se almacena el token
      const { token } = response.data;
      sessionStorage.setItem("token", token);
      setToken(token);

      const userResponse = await axios.get("http://localhost:3000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Respuesta de usuario:", userResponse.data);
      console.log(userResponse.data);
      setUsuario(userResponse.data); // ACA SE GUARDA EL USUARIO EN EL ESTADO

      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // para que se ocupen en otros componentes o vistas
  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        loginWithEmailAndPassword,
        token,
        setToken,
        activeMenu,
        setActiveMenu: handleMenuChange,
        showCerrarSesion,
        setShowCerrarSesion,
       /*  crearPublicacion, */
        MisPublicaciones,
        setMisPublicaciones,
        publicaciones,
        setPublicaciones,
        MisFavoritos,
        setMisFavoritos,
        logout,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuariosProvider;
