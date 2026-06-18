import {
  sincronizarCompletados,
  validarCredenciales,
} from "../../src/storage/habitoStorage";
import { Habito } from "../../src/storage/habitoStorage";

// Mock de AsyncStorage para que no falle en entorno de test
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const habitoBase: Habito = {
  id: "1",
  nombre: "Correr",
  descripcion: "",
  frecuencia: "diario",
  creadoEn: new Date().toISOString(),
  completadoHoy: true,
  ultimaVezCompletado: null,
  fotoUri: null,
  ubicacion: null,
  contacto: null,
  eventoCalendarioId: null,
};

describe("sincronizarCompletados", () => {
  it("no resetea el hábito si fue completado hoy", () => {
    const hoy = new Date().toISOString();
    const habito: Habito = {
      ...habitoBase,
      completadoHoy: true,
      ultimaVezCompletado: hoy,
    };

    const resultado = sincronizarCompletados([habito]);
    expect(resultado[0].completadoHoy).toBe(true);
  });

  it("resetea completadoHoy si el último completado fue ayer", () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const habito: Habito = {
      ...habitoBase,
      completadoHoy: true,
      ultimaVezCompletado: ayer.toISOString(),
    };

    const resultado = sincronizarCompletados([habito]);
    expect(resultado[0].completadoHoy).toBe(false);
  });

  it("no toca un hábito que nunca fue completado", () => {
    const habito: Habito = {
      ...habitoBase,
      completadoHoy: false,
      ultimaVezCompletado: null,
    };

    const resultado = sincronizarCompletados([habito]);
    expect(resultado[0].completadoHoy).toBe(false);
  });
});

describe("validarCredenciales", () => {
  it("retorna false si no hay usuarios guardados", async () => {
    const valido = await validarCredenciales("usuario", "clave");
    expect(valido).toBe(false);
  });
});
