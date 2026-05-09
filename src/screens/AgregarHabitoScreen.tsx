import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { agregarHabito } from "../storage/habitoStorage";
import { BotonPrimario } from "../components/BotonPrimario";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AgregarHabito">;
};

type Frecuencia = "diario" | "semanal";

export default function AgregarHabitoScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState<Frecuencia>("diario");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Atención", "El nombre del hábito es obligatorio");
      return;
    }
    setGuardando(true);
    await agregarHabito({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      frecuencia,
    });
    setGuardando(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Cabecera con botón cerrar */}
        <View style={styles.cabecera}>
          <Text style={styles.titulo}>Agrega un hábito</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cerrar}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Entrenar 40 minutos"
          placeholderTextColor="#95A5A6"
          value={nombre}
          onChangeText={setNombre}
          maxLength={60}
        />

        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinea]}
          placeholder="Ej: Entrenar minimo 4 dias por semana"
          placeholderTextColor="#95A5A6"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={3}
          maxLength={150}
        />

        <Text style={styles.label}>Frecuencia</Text>
        <View style={styles.selectorFrecuencia}>
          {(["diario", "semanal"] as Frecuencia[]).map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.opcionFrecuencia,
                frecuencia === op && styles.opcionSeleccionada,
              ]}
              onPress={() => setFrecuencia(op)}
            >
              <Text
                style={[
                  styles.textoFrecuencia,
                  frecuencia === op && styles.textoSeleccionado,
                ]}
              >
                {op === "diario" ? "📅 Diario" : "📆 Semanal"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <BotonPrimario
          titulo="Guardar hábito"
          onPress={handleGuardar}
          cargando={guardando}
          estilo={styles.boton}
        />
        <BotonPrimario
          titulo="Cancelar"
          onPress={() => navigation.goBack()}
          variante="secundario"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  cerrar: {
    fontSize: 20,
    color: "#7F8C8D",
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#3A3A4A",
  },
  inputMultilinea: {
    textAlignVertical: "top",
    minHeight: 80,
  },
  selectorFrecuencia: {
    flexDirection: "row",
    gap: 10,
  },
  opcionFrecuencia: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDE3E8",
  },
  opcionSeleccionada: {
    borderColor: "#A78BFA ",
    backgroundColor: "#A78BFA",
  },
  textoFrecuencia: {
    fontSize: 14,
    color: "#6a7778",
    fontWeight: "500",
  },
  textoSeleccionado: {
    color: "#7C3AED ",
    fontWeight: "700",
  },
  boton: {
    marginTop: 32,
    marginBottom: 12,
  },
});
