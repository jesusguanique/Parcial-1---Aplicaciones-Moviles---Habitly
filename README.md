# Habitly 〰️

App de seguimiento de hábitos desarrollada con React Native + Expo + TypeScript.

---

## ¿Qué hace la app?

Permite crear hábitos personales, marcarlos como completados cada día y hacer un seguimiento del progreso diario. Cada hábito puede tener asociada una foto, una ubicación, un contacto y un recordatorio en el calendario del dispositivo.

---

## Funcionalidades

### Entrega 1
- Registro e inicio de sesión de usuarios (almacenado localmente con AsyncStorage)
- Crear, listar y eliminar hábitos
- Marcar hábitos como completados
- Progreso diario con barra de porcentaje
- Notificaciones locales con expo-notifications
- Navegación entre pantallas con React Navigation

### Entrega 2 (nuevas funcionalidades)
- **Estado global con Zustand:** el estado de los hábitos se maneja a través de un store global (`habitoStore`), eliminando el uso de useState y prop drilling
- **Cámara y galería:** al crear un hábito se puede tomar una foto con la cámara o elegir una desde la galería. La imagen queda asociada al hábito y se muestra en la lista
- **Ubicación GPS:** se puede obtener la ubicación actual del dispositivo al crear un hábito, guardando coordenadas y dirección aproximada
- **Contactos:** se puede seleccionar un contacto de la agenda y asociarlo al hábito (ej: compañero de entrenamiento)
- **Calendario:** se puede crear un recordatorio en el calendario del dispositivo vinculado al hábito, programado para el día siguiente a las 9:00 AM
- **Permisos:** todos los recursos del dispositivo solicitan permiso antes de usarse, con mensajes claros si el permiso es rechazado
- **Tests automatizados:** configuración de Jest con React Native Testing Library y 3 tests que cubren componente, lógica de negocio y store global

---

## Cómo correr la app

```bash
# Instalar dependencias
npm install

# Iniciar la app
npx expo start
```

Luego escaneá el QR con la app Expo Go en tu celular, o presioná `a` para Android / `i` para iOS en el emulador.

---

## Cómo correr los tests

```bash
npm test
```

Los tests se encuentran en la carpeta `__tests__/` con la siguiente estructura:

```
__tests__/
├── components/
│   └── HabitoItem.test.tsx     # Test del componente HabitoItem
├── storage/
│   └── habitoStorage.test.ts   # Test de lógica de negocio (sincronizarCompletados)
└── store/
    └── habitoStore.test.ts     # Test del store Zustand (acciones y estado)
```

### ¿Qué testea cada archivo?

**HabitoItem.test.tsx**
- Que el componente renderiza nombre, descripción y frecuencia correctamente
- Que al presionar el hábito se llama a `onToggle` con el id correcto
- Que muestra la ubicación si el hábito la tiene asociada

**habitoStorage.test.ts**
- Que `sincronizarCompletados` no resetea un hábito completado hoy
- Que `sincronizarCompletados` resetea `completadoHoy` si fue completado ayer
- Que `validarCredenciales` retorna false si no hay usuarios guardados

**habitoStore.test.ts**
- Que el store arranca con la lista vacía
- Que `cargarHabitos` actualiza el estado y termina con `cargando: false`
- Que `eliminarHabito` remueve correctamente el hábito del estado

---

## Estructura del proyecto

```
HabitlyApp/
├── src/
│   ├── components/
│   │   ├── BotonPrimario.tsx
│   │   └── HabitoItem.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegistroScreen.tsx
│   │   └── AgregarHabitoScreen.tsx
│   ├── storage/
│   │   └── habitoStorage.ts
│   └── store/
│       └── habitoStore.ts
├── __tests__/
│   ├── components/
│   ├── storage/
│   └── store/
├── App.tsx
└── package.json
```

---

## Dependencias principales

| Paquete | Uso |
|---|---|
| expo | Framework base |
| react-navigation | Navegación entre pantallas |
| zustand | Estado global |
| expo-image-picker | Cámara y galería |
| expo-location | GPS y geocodificación |
| expo-contacts | Acceso a contactos del dispositivo |
| expo-calendar | Creación de eventos en el calendario |
| expo-notifications | Notificaciones locales |
| @react-native-async-storage/async-storage | Persistencia local |
| jest-expo | Testing |
| @testing-library/react-native | Testing de componentes |

---

## Punto extra — IA aplicada al desarrollo

Esta app fue desarrollada con asistencia de **Claude (Anthropic)** como herramienta de IA para generación y refactorización de código.

### Herramientas utilizadas
- **Claude (claude.ai)** — generación de código, migración a Zustand, implementación de permisos y tests

### Ejemplos de prompts utilizados

**Prompt para migración a Zustand:**
> "Sesión 1 de HabitlyApp. Tengo una app React Native con Expo y TypeScript. El estado de los hábitos se maneja con useState y llamadas directas al storage. Necesito migrar el estado global a Zustand. Te paso App.tsx, habitoStorage.ts, HomeScreen.tsx, AgregarHabitoScreen.tsx y HabitoItem.tsx para que lo implementes manteniendo mis estilos y estructura."

**Prompt para recursos del dispositivo:**
> "Sesión 2 de HabitlyApp. Ya tenemos Zustand funcionando. Ahora implementá: cámara con expo-image-picker, galería, y ubicación con expo-location. Asociar foto y ubicación a cada hábito. Manejar permisos correctamente con mensajes claros al usuario."

**Prompt para testing:**
> "Sesión 4 de HabitlyApp — última sesión. Necesito: configurar Jest + React Native Testing Library, escribir los 3 tests mínimos requeridos por la consigna (componente, lógica de negocio y store Zustand), y actualizar el README."

### Comparación código generado vs código final

El código generado por IA fue integrado con ajustes menores: se mantuvieron los nombres de variables en español, los estilos originales de la app (colores, tipografías, bordes) y la estructura de carpetas existente. La IA respetó el contexto dado en cada prompt, lo que redujo significativamente el tiempo de implementación de funcionalidades como permisos y manejo de errores.
