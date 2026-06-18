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
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Contacts from "expo-contacts";
import * as Calendar from "expo-calendar";

import { RootStackParamList } from "../navigation/AppNavigator";
import { BotonPrimario } from "../components/BotonPrimario";
import { useHabitoStore } from "../store/habitoStore";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AgregarHabito">;
};

type Frecuencia = "diario" | "semanal";

export default function AgregarHabitoScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState<Frecuencia>("diario");
  const [guardando, setGuardando] = useState(false);

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<{
    latitud: number;
    longitud: number;
    direccion?: string;
  } | null>(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  // Estados nuevos sesión 3
  const [contacto, setContacto] = useState<{
    nombre: string;
    telefono?: string;
  } | null>(null);
  const [eventoCalendarioId, setEventoCalendarioId] = useState<string | null>(null);
  const [cargandoCalendario, setCargandoCalendario] = useState(false);

  const agregarHabito = useHabitoStore((state) => state.agregarHabito);

  // ── Cámara ──
  const handleTomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la cámara para tomar la foto. Podés habilitarlo desde la configuración del dispositivo."
      );
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  // ── Galería ──
  const handleSeleccionarGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la galería para seleccionar una foto. Podés habilitarlo desde la configuración del dispositivo."
      );
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const handleFoto = () => {
    Alert.alert("Agregar foto", "¿De dónde querés sacar la foto?", [
      { text: "📷 Cámara", onPress: handleTomarFoto },
      { text: "🖼️ Galería", onPress: handleSeleccionarGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // ── Ubicación GPS ──
  const handleObtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la ubicación para guardar dónde realizaste el hábito. Podés habilitarlo desde la configuración del dispositivo."
      );
      return;
    }
    setCargandoUbicacion(true);
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      let direccion = "";
      try {
        const geo = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (geo[0]) {
          const g = geo[0];
          direccion = [g.street, g.city, g.region].filter(Boolean).join(", ");
        }
      } catch {
        // Si falla el geocoding igual guardamos las coordenadas
      }
      setUbicacion({
        latitud: pos.coords.latitude,
        longitud: pos.coords.longitude,
        direccion: direccion || undefined,
      });
    } catch {
      Alert.alert("Error", "No se pudo obtener la ubicación. Intentá de nuevo.");
    } finally {
      setCargandoUbicacion(false);
    }
  };

  // ── Contactos ──
  const handleSeleccionarContacto = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tus contactos para asociar uno al hábito. Podés habilitarlo desde la configuración del dispositivo."
      );
      return;
    }

    // Pedimos los contactos y mostramos los primeros 20 para elegir
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    if (data.length === 0) {
      Alert.alert("Sin contactos", "No encontramos contactos en tu dispositivo.");
      return;
    }

    // Tomamos los primeros 5 para el Alert (limitación de Alert.alert)
    const primeros = data.slice(0, 5);
    const opciones = primeros.map((c) => ({
      text: c.name || "Sin nombre",
      onPress: () => {
        const telefono = c.phoneNumbers?.[0]?.number;
        setContacto({
          nombre: c.name || "Sin nombre",
          telefono: telefono || undefined,
        });
      },
    }));

    Alert.alert(
      "Seleccionar contacto",
      "Elegí un contacto para asociar al hábito:",
      [
        ...opciones,
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  // ── Calendario ──
  const handleCrearEvento = async () => {
    if (!nombre.trim()) {
      Alert.alert("Atención", "Primero ingresá el nombre del hábito para crear el recordatorio.");
      return;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso al calendario para crear el recordatorio. Podés habilitarlo desde la configuración del dispositivo."
      );
      return;
    }

    setCargandoCalendario(true);
    try {
      // Obtener calendarios disponibles
      const calendarios = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      // Buscar el calendario por defecto según plataforma
      let calId: string | undefined;
      if (Platform.OS === "ios") {
        const defecto = calendarios.find((c) => c.allowsModifications);
        calId = defecto?.id;
      } else {
        // En Android buscamos el calendario primario
        const primario = calendarios.find(
          (c) => c.isPrimary || c.accessLevel === "owner"
        );
        calId = primario?.id ?? calendarios[0]?.id;
      }

      if (!calId) {
        Alert.alert("Error", "No encontramos un calendario disponible en tu dispositivo.");
        setCargandoCalendario(false);
        return;
      }

      // Crear evento para mañana a las 9am
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      manana.setHours(9, 0, 0, 0);

      const fin = new Date(manana);
      fin.setMinutes(fin.getMinutes() + 30);

      const eventoId = await Calendar.createEventAsync(calId, {
        title: `Habitly: ${nombre.trim()}`,
        notes: descripcion.trim() || `Recordatorio para completar el hábito: ${nombre.trim()}`,
        startDate: manana,
        endDate: fin,
        alarms: [{ relativeOffset: -10 }], // Recordatorio 10 minutos antes
      });

      setEventoCalendarioId(eventoId);
      Alert.alert(
        "Recordatorio creado ✅",
        `Se agendó "${nombre.trim()}" para mañana a las 9:00 AM en tu calendario.`
      );
    } catch {
      Alert.alert("Error", "No se pudo crear el evento. Intentá de nuevo.");
    } finally {
      setCargandoCalendario(false);
    }
  };

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
      fotoUri: fotoUri,
      ubicacion: ubicacion,
      contacto: contacto,
      eventoCalendarioId: eventoCalendarioId,
    });
    setGuardando(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabecera */}
        <View style={styles.cabecera}>
          <Text style={styles.titulo}>Agrega un hábito</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cerrar}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Nombre */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Entrenar 40 minutos"
          placeholderTextColor="#95A5A6"
          value={nombre}
          onChangeText={setNombre}
          maxLength={60}
        />

        {/* Descripción */}
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

        {/* Frecuencia */}
        <Text style={styles.label}>Frecuencia*</Text>
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

        {/* Foto */}
        <Text style={styles.label}>Foto del hábito o seguimiento (opcional)</Text>
        <TouchableOpacity style={styles.btnRecurso} onPress={handleFoto}>
          <Text style={styles.txtRecurso}>
            📷 {fotoUri ? "Cambiar foto" : "Agregar foto"}
          </Text>
        </TouchableOpacity>
        {fotoUri && (
          <View style={styles.contenedorFoto}>
            <Image source={{ uri: fotoUri }} style={styles.fotoPrevia} />
            <TouchableOpacity
              style={styles.btnQuitarFoto}
              onPress={() => setFotoUri(null)}
            >
              <Text style={styles.txtQuitarFoto}>✕ Quitar foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ubicación */}
        <Text style={styles.label}>Ubicación (opcional)</Text>
        <TouchableOpacity
          style={styles.btnRecurso}
          onPress={handleObtenerUbicacion}
          disabled={cargandoUbicacion}
        >
          {cargandoUbicacion ? (
            <ActivityIndicator color="#7C3AED" size="small" />
          ) : (
            <Text style={styles.txtRecurso}>
              📍 {ubicacion ? "Actualizar ubicación" : "Obtener ubicación actual"}
            </Text>
          )}
        </TouchableOpacity>
        {ubicacion && (
          <View style={styles.infoRecurso}>
            <Text style={styles.txtInfoRecurso}>
              {ubicacion.direccion
                ? `📍 ${ubicacion.direccion}`
                : `📍 ${ubicacion.latitud.toFixed(5)}, ${ubicacion.longitud.toFixed(5)}`}
            </Text>
            <TouchableOpacity onPress={() => setUbicacion(null)}>
              <Text style={styles.txtQuitar}>Quitar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contacto */}
        <Text style={styles.label}>Sumá a alguien a tu hábito (opcional)</Text>
        <TouchableOpacity
          style={styles.btnRecurso}
          onPress={handleSeleccionarContacto}
        >
          <Text style={styles.txtRecurso}>
            👤 {contacto ? "Cambiar contacto" : "Añadir contacto"}
          </Text>
        </TouchableOpacity>
        {contacto && (
          <View style={styles.infoRecurso}>
            <Text style={styles.txtInfoRecurso}>
              👤 {contacto.nombre}
              {contacto.telefono ? `  ·  ${contacto.telefono}` : ""}
            </Text>
            <TouchableOpacity onPress={() => setContacto(null)}>
              <Text style={styles.txtQuitar}>Quitar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Calendario */}
        <Text style={styles.label}>Recordatorio en calendario (opcional)</Text>
        <TouchableOpacity
          style={[styles.btnRecurso, eventoCalendarioId ? styles.btnRecursoActivo : null]}
          onPress={eventoCalendarioId ? undefined : handleCrearEvento}
          disabled={cargandoCalendario || !!eventoCalendarioId}
        >
          {cargandoCalendario ? (
            <ActivityIndicator color="#7C3AED" size="small" />
          ) : (
            <Text style={[styles.txtRecurso, eventoCalendarioId ? styles.txtRecursoActivo : null]}>
              {eventoCalendarioId
                ? "✅ Recordatorio creado"
                : "📆 Crear recordatorio para mañana"}
            </Text>
          )}
        </TouchableOpacity>
        {eventoCalendarioId && (
          <View style={styles.infoRecurso}>
            <Text style={styles.txtInfoRecurso}>
              📆 Agendado para mañana a las 9:00 AM
            </Text>
            <TouchableOpacity onPress={() => setEventoCalendarioId(null)}>
              <Text style={styles.txtQuitar}>Quitar</Text>
            </TouchableOpacity>
          </View>
        )}

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
  contenedor: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { padding: 24, paddingBottom: 40 },
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  titulo: { fontSize: 24, fontWeight: "700", color: "#2C3E50" },
  cerrar: { fontSize: 20, color: "#7F8C8D", padding: 4 },
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
  inputMultilinea: { textAlignVertical: "top", minHeight: 80 },
  selectorFrecuencia: { flexDirection: "row", gap: 10 },
  opcionFrecuencia: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDE3E8",
  },
  opcionSeleccionada: { borderColor: "#A78BFA", backgroundColor: "#A78BFA" },
  textoFrecuencia: { fontSize: 14, color: "#6a7778", fontWeight: "500" },
  textoSeleccionado: { color: "#7C3AED", fontWeight: "700" },
  btnRecurso: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#A78BFA",
    alignItems: "center",
  },
  btnRecursoActivo: {
    backgroundColor: "#EDE9FE",
    borderColor: "#7C3AED",
  },
  txtRecurso: { color: "#7C3AED", fontWeight: "600", fontSize: 14 },
  txtRecursoActivo: { color: "#5B21B6" },
  contenedorFoto: { marginTop: 10, alignItems: "center" },
  fotoPrevia: { width: "100%", height: 180, borderRadius: 10, marginBottom: 6 },
  btnQuitarFoto: { alignSelf: "flex-end" },
  txtQuitarFoto: { color: "#E74C3C", fontSize: 13, fontWeight: "500" },
  infoRecurso: {
    marginTop: 8,
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtInfoRecurso: { color: "#5B21B6", fontSize: 13, flex: 1, marginRight: 8 },
  txtQuitar: { color: "#E74C3C", fontSize: 13, fontWeight: "500" },
  boton: { marginTop: 32, marginBottom: 12 },
});
