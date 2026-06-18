import { act } from "@testing-library/react-native";
import { useHabitoStore } from "../../src/store/habitoStore";

// Mock completo del storage para aislar el store
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("../../src/storage/habitoStorage", () => ({
  obtenerHabitos: jest.fn().mockResolvedValue([]),
  guardarHabitos: jest.fn().mockResolvedValue(undefined),
  agregarHabito: jest.fn().mockResolvedValue({
    id: "test-1",
    nombre: "Meditar",
    descripcion: "10 minutos",
    frecuencia: "diario",
    creadoEn: new Date().toISOString(),
    completadoHoy: false,
    ultimaVezCompletado: null,
    fotoUri: null,
    ubicacion: null,
    contacto: null,
    eventoCalendarioId: null,
  }),
  eliminarHabito: jest.fn().mockResolvedValue(undefined),
  toggleCompletadoHoy: jest.fn().mockResolvedValue([]),
  sincronizarCompletados: jest.fn().mockImplementation((h) => h),
}));

// Resetear el store entre tests
beforeEach(() => {
  useHabitoStore.setState({ habitos: [], cargando: false });
});

describe("useHabitoStore", () => {
  it("arranca con la lista de hábitos vacía", () => {
    const { habitos } = useHabitoStore.getState();
    expect(habitos).toEqual([]);
  });

  it("cargarHabitos actualiza el estado correctamente", async () => {
    await act(async () => {
      await useHabitoStore.getState().cargarHabitos();
    });

    const { habitos, cargando } = useHabitoStore.getState();
    expect(Array.isArray(habitos)).toBe(true);
    expect(cargando).toBe(false);
  });

  it("eliminarHabito remueve el hábito del estado", async () => {
    // Setear un hábito de prueba en el store
    useHabitoStore.setState({
      habitos: [
        {
          id: "abc",
          nombre: "Leer",
          descripcion: "",
          frecuencia: "diario",
          creadoEn: new Date().toISOString(),
          completadoHoy: false,
          ultimaVezCompletado: null,
          fotoUri: null,
          ubicacion: null,
          contacto: null,
          eventoCalendarioId: null,
        },
      ],
    });

    await act(async () => {
      await useHabitoStore.getState().eliminarHabito("abc");
    });

    const { habitos } = useHabitoStore.getState();
    expect(habitos.find((h) => h.id === "abc")).toBeUndefined();
  });
});
