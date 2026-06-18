import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { HabitoItem } from "../../src/components/HabitoItem";
import { Habito } from "../../src/storage/habitoStorage";

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Hábito de prueba base
const habitoBase: Habito = {
  id: "1",
  nombre: "Tomar agua",
  descripcion: "Tomar 2 litros por día",
  frecuencia: "diario",
  creadoEn: new Date().toISOString(),
  completadoHoy: false,
  ultimaVezCompletado: null,
  fotoUri: null,
  ubicacion: null,
  contacto: null,
  eventoCalendarioId: null,
};


describe("HabitoItem", () => {
 it("renderiza el nombre y descripción del hábito correctamente", async () => {
  const { getByText } = await render(
    <HabitoItem
      habito={habitoBase}
      onToggle={() => {}}
      onEliminar={() => {}}
    />
  );

  expect(getByText("Tomar agua")).toBeTruthy();
  expect(getByText("Tomar 2 litros por día")).toBeTruthy();
  expect(getByText("📅 Diario")).toBeTruthy();
});

it("llama a onToggle con el id correcto al presionar el hábito", async () => {
  const mockToggle = jest.fn();

  const { getByText } = await render(
    <HabitoItem
      habito={habitoBase}
      onToggle={mockToggle}
      onEliminar={() => {}}
    />
  );

  fireEvent.press(getByText("Tomar agua"));
  expect(mockToggle).toHaveBeenCalledWith("1");
});

it("muestra la ubicación si el hábito la tiene asociada", async () => {
  const habitoConUbicacion: Habito = {
    ...habitoBase,
    ubicacion: {
      latitud: -34.6037,
      longitud: -58.3816,
      direccion: "Buenos Aires, Argentina",
    },
  };

  const { getByText } = await render(
    <HabitoItem
      habito={habitoConUbicacion}
      onToggle={() => {}}
      onEliminar={() => {}}
    />
  );

  expect(getByText(/Buenos Aires/)).toBeTruthy();
});
});
