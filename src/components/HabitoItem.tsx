import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Habito } from "../storage/habitoStorage";

type HabitoItemProps = {
  habito: Habito;
  onToggle: (id: string) => void;
  onEliminar: (id: string) => void;
};

export function HabitoItem({ habito, onToggle, onEliminar }: HabitoItemProps) {
  const confirmarEliminar = () => {
    Alert.alert(
      "Borrar hábito",
      `¿Seguro que quieres eliminar este hábito? "${habito.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onEliminar(habito.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, habito.completadoHoy && styles.cardCompletado]}>
      {/* Checkbox + nombre */}
      <TouchableOpacity
        style={styles.fila}
        onPress={() => onToggle(habito.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.check, habito.completadoHoy && styles.checkActivo]}>
          {habito.completadoHoy && <Text style={styles.checkMarca}>✓</Text>}
        </View>
        <View style={styles.infoTexto}>
          <Text
            style={[
              styles.nombre,
              habito.completadoHoy && styles.nombreTachado,
            ]}
          >
            {habito.nombre}
          </Text>
          {habito.descripcion ? (
            <Text style={styles.descripcion}>{habito.descripcion}</Text>
          ) : null}
          <Text style={styles.frecuencia}>
            {habito.frecuencia === "diario" ? "📅 Diario" : "📆 Semanal"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón eliminar */}
      <TouchableOpacity style={styles.btnEliminar} onPress={confirmarEliminar}>
        <Text style={styles.txtEliminar}>✖️ </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f4fa",
    borderRadius: 15,
    padding: 14,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#2A2A38'
  },
  cardCompletado: {
    backgroundColor: "#c9e0fb",
    borderLeftWidth: 4,
    borderLeftColor: "#08a1ee",
  },
  fila: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#BDC3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkActivo: {
    backgroundColor: "#08a1ee",
    borderColor: "#0bebff",
  },
  checkMarca: {
    color: "#1A1A24 ",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoTexto: {
    flex: 1,
  },
  nombre: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2C3E50",
  },
  nombreTachado: {
    textDecorationLine: "line-through",
    color: "#7F8C8D",
  },
  descripcion: {
    fontSize: 13,
    color: "#7F8C8D",
    marginTop: 2,
  },
  frecuencia: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 4,
  },
  btnEliminar: {
    padding: 8,
    marginLeft: 6,
  },
  txtEliminar: {
    fontSize: 15,
  },
});
