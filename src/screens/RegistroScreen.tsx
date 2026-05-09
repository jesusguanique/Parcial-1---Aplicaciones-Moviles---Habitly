import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { BotonPrimario } from "../components/BotonPrimario";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Registro">;
};

export default function RegistroScreen({ navigation }: Props) {
  const { registro } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepetida, setPasswordRepetida] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (password !== passwordRepetida) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    setCargando(true);
    const error = await registro(username, password);
    setCargando(false);
    if (error) Alert.alert("Error", error);
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.emoji}>   📨   </Text>
        <Text style={styles.titulo}>¡Únete a Habitly!</Text>
        <Text style={styles.subtitulo}>Empieza a organizar tus hábitos hoy</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#95A5A6"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña (mín. 4 caracteres)"
          placeholderTextColor="#95A5A6"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Ingresa nuevamente la contraseña"
          placeholderTextColor="#95A5A6"
          value={passwordRepetida}
          onChangeText={setPasswordRepetida}
          secureTextEntry
        />

        <BotonPrimario
          titulo="Registrarse"
          onPress={handleRegistro}
          cargando={cargando}
          estilo={styles.boton}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkVolver}>
            ← Volver al <Text style={styles.linkNegrita}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  emoji: {
    fontSize: 52,
    textAlign: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 40,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 36,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 14,
    color: "#2C3E50",
    borderWidth: 1,
    borderColor: "#DDE3E8",
  },
  boton: {
    marginTop: 8,
    marginBottom: 20,
  },
  linkVolver: {
    textAlign: "center",
    color: "#7F8C8D",
    fontSize: 14,
  },
  linkNegrita: {
    color: "#4A90E2",
    fontWeight: "600",
  },
});
