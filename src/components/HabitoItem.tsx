import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
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
        <View
          style={[styles.check, habito.completadoHoy && styles.checkActivo]}
        >
          {habito.completadoHoy && (
            <Text style={styles.checkMarca}>✓</Text>
          )}
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

          {/* Foto asociada */}
          {habito.fotoUri ? (
            <Image
              source={{ uri: habito.fotoUri }}
              style={styles.fotoMiniatura}
            />
          ) : null}

          {/* Ubicación asociada */}
          {habito.ubicacion ? (
            <Text style={styles.txtUbicacion}>
              📍{" "}
              {habito.ubicacion.direccion
                ? habito.ubicacion.direccion
                : `${habito.ubicacion.latitud.toFixed(4)}, ${habito.ubicacion.longitud.toFixed(4)}`}
            </Text>
          ) : null}

          {/* Contacto asociado */}
          {habito.contacto ? (
            <Text style={styles.txtContacto}>
              👤 {habito.contacto.nombre}
              {habito.contacto.telefono ? ` · ${habito.contacto.telefono}` : ""}
            </Text>
          ) : null}

          {/* Evento de calendario */}
          {habito.eventoCalendarioId ? (
            <Text style={styles.txtCalendario}>📆 Recordatorio en calendario</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Botón eliminar */}
      <TouchableOpacity style={styles.btnEliminar} onPress={confirmarEliminar}>
        <Text style={styles.txtEliminar}>✖️</Text>
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
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#2A2A38",
  },
  cardCompletado: {
    backgroundColor: "#c9e0fb",
    borderLeftWidth: 4,
    borderLeftColor: "#08a1ee",
  },
  fila: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: 2,
  },
  checkActivo: {
    backgroundColor: "#08a1ee",
    borderColor: "#0bebff",
  },
  checkMarca: {
    color: "#1A1A24",
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
  fotoMiniatura: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  txtUbicacion: {
    fontSize: 12,
    color: "#5B21B6",
    marginTop: 5,
  },
  txtContacto: {
    fontSize: 12,
    color: "#065F46",
    marginTop: 4,
  },
  txtCalendario: {
    fontSize: 12,
    color: "#1D4ED8",
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
