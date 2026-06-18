import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";

import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { HabitoItem } from "../components/HabitoItem";
import { useHabitoStore } from "../store/habitoStore";

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  const { usuarioActual, logout } = useAuth();

  // Zustand store — reemplaza useState<Habito[]>
  const habitos = useHabitoStore((state) => state.habitos);
  const cargando = useHabitoStore((state) => state.cargando);
  const cargarHabitos = useHabitoStore((state) => state.cargarHabitos);
  const toggleCompletado = useHabitoStore((state) => state.toggleCompletado);
  const eliminarHabito = useHabitoStore((state) => state.eliminarHabito);

  // Recarga la lista cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      cargarHabitos();
    }, [])
  );

  const handleRefresh = async () => {
    await cargarHabitos();
  };

  const handleToggle = async (id: string) => {
    await toggleCompletado(id);
  };

  const handleEliminar = async (id: string) => {
    await eliminarHabito(id);
  };

  const programarNotificacion = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Recordatorio Habitly",
        body: "¡No te olvides completar tus hábitos!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    alert("Notificación programada en 10 segundos 🔔");
  };

  const completadosHoy = habitos.filter((h) => h.completadoHoy).length;
  const porcentaje =
    habitos.length > 0
      ? Math.round((completadosHoy / habitos.length) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>HABITLY 〰️</Text>
          <Text style={styles.saludo}>Hola!, {usuarioActual} </Text>
          <Text style={styles.fecha}>
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.btnLogout}>
          <Text style={styles.txtLogout}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.resumen}>
        <Text style={styles.resumenTitulo}>Progreso de hoy</Text>
        <Text style={styles.resumenNumero}>
          {completadosHoy}/{habitos.length}
        </Text>
        <View style={styles.barraFondo}>
          <View
            style={[
              styles.barraProgreso,
              { width: `${porcentaje}%` as any },
            ]}
          />
        </View>
        <Text style={styles.resumenPorcentaje}>{porcentaje}% completado</Text>
      </View>

      {/* Boton de recordatorio */}
      <TouchableOpacity
        style={styles.btnRecordatorio}
        onPress={programarNotificacion}
      >
        <Text style={styles.txtRecordatorio}>🕜 Añadir recordatorio (10s)</Text>
      </TouchableOpacity>

      {/* Lista de habitos */}
      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitoItem
            habito={item}
            onToggle={handleToggle}
            onEliminar={handleEliminar}
          />
        )}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioEmoji}>🌱</Text>
            <Text style={styles.vacioTexto}>
              Todavía no tienes hábitos pendientes.{"\n"}¡Agrega uno para
              empezar!
            </Text>
          </View>
        }
      />

      {/* FAB para agregar hábito */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AgregarHabito")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
  },
  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#A78BFA",
    marginBottom: 6,
    letterSpacing: -1.5,
    fontStyle: "italic",
  },
  saludo: {
    fontSize: 25,
    fontWeight: "800",
    color: "#2C3E50",
    letterSpacing: -1,
  },
  fecha: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 2,
    textTransform: "capitalize",
  },
  btnLogout: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: "#7C3AED",
    borderRadius: 8,
  },
  txtLogout: {
    color: "#ededed",
    fontWeight: "600",
    fontSize: 13,
  },
  resumen: {
    backgroundColor: "#e6dff1",
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
  },
  resumenTitulo: {
    color: "#5B21B6",
    fontSize: 13,
    marginBottom: 4,
  },
  resumenNumero: {
    color: "#3B0764",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  barraFondo: {
    height: 6,
    backgroundColor: "rgba(33, 96, 243, 0.5)",
    borderRadius: 3,
    overflow: "hidden",
    flexDirection: "row",
  },
  barraProgreso: {
    height: 6,
    backgroundColor: "#7C3AED",
    borderRadius: 3,
  },
  resumenPorcentaje: {
    color: "#5B21B6",
    fontSize: 12,
    marginTop: 6,
  },
  btnRecordatorio: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "rgb(124, 120, 246)",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C3E50",
  },
  txtRecordatorio: {
    color: "#f0f0f0",
    fontSize: 14,
    fontWeight: "500",
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  vacio: {
    alignItems: "center",
    marginTop: 60,
  },
  vacioEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  vacioTexto: {
    color: "#7F8C8D",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  fabTexto: {
    color: "#7C3AED",
    fontSize: 45,
    lineHeight: 34,
  },
});
