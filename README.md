# Habitly 

App móvil para registrar y seguir hábitos diarios y semanales, hecha con React Native + Expo.

## Qué hace?

Podés agregar hábitos, marcarlos como completados cada día y ver cuánto avanzaste. Soporta frecuencia diaria o semanal, y el estado se resetea solo al cambiar de día.

## Cómo ejecutar la app?

Necesitás Node.js 18+ y Expo CLI instalado:

```bash
npm install -g expo-cli
```

Después:

```bash
npm install
npm start
```

Escaneás el QR con **Expo Go** (Android o iOS) y listo. (En mi caso)

## Funcionalidades implementadas

- Login y registro con sesión guardada en AsyncStorage
- Rutas protegidas: si no iniciaste sesión no entrás al home
- ABM de hábitos (nombre, descripción, frecuencia diaria/semanal)
- Marcar y desmarcar hábitos completados
- Barra de progreso del día
- Persistencia de datos al cerrar la app
- Reset automático del estado "completado" al día siguiente
- Notificación local de recordatorio

## Estructura

```
src/
├── context/       → AuthContext (manejo de sesión)
├── navigation/    → AppNavigator (Stack Navigation)
├── screens/       → LoginScreen, RegistroScreen, HomeScreen, AgregarHabitoScreen
├── components/    → BotonPrimario, HabitoItem
└── storage/       → habitoStorage (helpers de AsyncStorage)
```


## Enlace del video DEMO

https://youtube.com/shorts/158S-UIxk8s?si=EM9ti3JEqYMfmyTw
