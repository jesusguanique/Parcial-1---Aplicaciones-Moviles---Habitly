import { create } from "zustand";
import {
  Habito,
  obtenerHabitos,
  guardarHabitos,
  agregarHabito as agregarHabitoStorage,
  eliminarHabito as eliminarHabitoStorage,
  toggleCompletadoHoy as toggleStorage,
  sincronizarCompletados,
} from "../storage/habitoStorage";

type HabitoStore = {
  habitos: Habito[];
  cargando: boolean;

  cargarHabitos: () => Promise<void>;
  agregarHabito: (
    datos: Omit<
      Habito,
      "id" | "creadoEn" | "completadoHoy" | "ultimaVezCompletado"
    >
  ) => Promise<void>;
  eliminarHabito: (id: string) => Promise<void>;
  toggleCompletado: (id: string) => Promise<void>;
};

export const useHabitoStore = create<HabitoStore>((set, get) => ({
  habitos: [],
  cargando: false,

  cargarHabitos: async () => {
    set({ cargando: true });
    const lista = await obtenerHabitos();
    const sincronizados = sincronizarCompletados(lista);

    // Si hubo cambios por sincronización de día, guardarlos
    const tuvoCambios = sincronizados.some(
      (h, i) => h.completadoHoy !== lista[i]?.completadoHoy
    );
    if (tuvoCambios) await guardarHabitos(sincronizados);

    set({ habitos: sincronizados, cargando: false });
  },

  agregarHabito: async (datos) => {
    await agregarHabitoStorage(datos);
    await get().cargarHabitos();
  },

  eliminarHabito: async (id) => {
    await eliminarHabitoStorage(id);
    set((state) => ({
      habitos: state.habitos.filter((h) => h.id !== id),
    }));
  },

  toggleCompletado: async (id) => {
    const actualizados = await toggleStorage(id);
    set({ habitos: actualizados });
  },
}));
