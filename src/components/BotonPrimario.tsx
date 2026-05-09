import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";

// ─BotonPrimario 
type BotonPrimarioProps = {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  estilo?: ViewStyle;
  variante?: "primario" | "secundario" | "peligro";
};

export function BotonPrimario({
  titulo,
  onPress,
  cargando = false,
  estilo,
  variante = "primario",
}: BotonPrimarioProps) {
  const colorFondo =
    variante === "peligro"
      ? "#E74C3C"
      : variante === "secundario"
      ? "#ECF0F1"
      : "#7C3AED";
  const colorTexto = variante === "secundario" ? "#2C3E50" : "#fff";

  return (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: colorFondo }, estilo]}
      onPress={onPress}
      disabled={cargando}
      activeOpacity={0.8}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[styles.texto, { color: colorTexto }]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    
  },
  texto: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
