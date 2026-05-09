import AsyncStorage from "@react-native-async-storage/async-storage";


const USERS_KEY = "habito_tracker_users";
const HABITS_KEY = "habito_tracker_habits";
const SESSION_KEY = "habito_tracker_session";


export type Usuario = {
  username: string;
  password: string;
};

export type Habito = {
  id: string;
  nombre: string;
  descripcion: string;
  frecuencia: "diario" | "semanal";
  creadoEn: string; // ISO date string
  completadoHoy: boolean;
  ultimaVezCompletado: string | null; // ISO date string or null
};

// ─Usuarios -
export async function obtenerUsuarios(): Promise<Usuario[]> {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function guardarUsuario(nuevo: Usuario): Promise<boolean> {
  try {
    const usuarios = await obtenerUsuarios();
    const yaExiste = usuarios.some((u) => u.username === nuevo.username);
    if (yaExiste) return false;
    usuarios.push(nuevo);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
    return true;
  } catch {
    return false;
  }
}

export async function validarCredenciales(
  username: string,
  password: string
): Promise<boolean> {
  const usuarios = await obtenerUsuarios();
  return usuarios.some(
    (u) => u.username === username && u.password === password
  );
}

// ─ Sesión ─
export async function guardarSesion(username: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, username);
}

export async function obtenerSesion(): Promise<string | null> {
  return await AsyncStorage.getItem(SESSION_KEY);
}

export async function cerrarSesion(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ── Habitos ─
export async function obtenerHabitos(): Promise<Habito[]> {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function guardarHabitos(habitos: Habito[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habitos));
}

export async function agregarHabito(habito: Omit<Habito, "id" | "creadoEn" | "completadoHoy" | "ultimaVezCompletado">): Promise<Habito> {
  const habitos = await obtenerHabitos();
  const nuevo: Habito = {
    ...habito,
    id: Date.now().toString(),
    creadoEn: new Date().toISOString(),
    completadoHoy: false,
    ultimaVezCompletado: null,
  };
  habitos.push(nuevo);
  await guardarHabitos(habitos);
  return nuevo;
}

export async function eliminarHabito(id: string): Promise<void> {
  const habitos = await obtenerHabitos();
  await guardarHabitos(habitos.filter((h) => h.id !== id));
}

export async function toggleCompletadoHoy(id: string): Promise<Habito[]> {
  const hoy = new Date().toDateString();
  const habitos = await obtenerHabitos();
  const actualizados = habitos.map((h) => {
    if (h.id !== id) return h;
    const yaCompletadoHoy =
      h.ultimaVezCompletado !== null &&
      new Date(h.ultimaVezCompletado).toDateString() === hoy;
    return {
      ...h,
      completadoHoy: !yaCompletadoHoy,
      ultimaVezCompletado: !yaCompletadoHoy ? new Date().toISOString() : null,
    };
  });
  await guardarHabitos(actualizados);
  return actualizados;
}

// Resetea el estado si cambio el día
export function sincronizarCompletados(habitos: Habito[]): Habito[] {
  const hoy = new Date().toDateString();
  return habitos.map((h) => {
    if (
      h.ultimaVezCompletado &&
      new Date(h.ultimaVezCompletado).toDateString() !== hoy
    ) {
      return { ...h, completadoHoy: false };
    }
    return h;
  });
}
