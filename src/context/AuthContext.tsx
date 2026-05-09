import React, { createContext, useContext, useEffect, useState } from "react";
import {
  cerrarSesion,
  guardarSesion,
  obtenerSesion,
  validarCredenciales,
  guardarUsuario,
} from "../storage/habitoStorage";

type AuthContextType = {
  usuarioActual: string | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  registro: (username: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // para ver si hay sesion guardada al iniciar
  useEffect(() => {
    (async () => {
      const sesion = await obtenerSesion();
      setUsuarioActual(sesion);
      setCargando(false);
    })();
  }, []);

  // Retorna null si ok, o un string con el mensaje de error
  const login = async (username: string, password: string): Promise<string | null> => {
    if (!username.trim() || !password.trim()) {
      return "Completá todos los campos";
    }
    const ok = await validarCredenciales(username.trim(), password);
    if (!ok) return "Usuario o contraseña incorrectos";
    await guardarSesion(username.trim());
    setUsuarioActual(username.trim());
    return null;
  };

  const registro = async (username: string, password: string): Promise<string | null> => {
    if (!username.trim() || !password.trim()) {
      return "Completá todos los campos";
    }
    if (password.length < 4) {
      return "La contraseña debe tener al menos 4 caracteres";
    }
    const ok = await guardarUsuario({ username: username.trim(), password });
    if (!ok) return "Ese nombre de usuario ya existe";
    await guardarSesion(username.trim());
    setUsuarioActual(username.trim());
    return null;
  };

  const logout = async () => {
    await cerrarSesion();
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
