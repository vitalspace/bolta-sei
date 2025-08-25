# Sistema de Locaciones/Sub-Rooms

Este sistema permite crear locaciones dentro de rooms, donde los players pueden ser asignados automáticamente basado en su posición 3D o manualmente a través de eventos.

## Características

- **Locaciones dentro de rooms**: Cada room puede tener múltiples locaciones
- **Asignación automática**: Players se asignan a locaciones basado en su posición 3D
- **Asignación manual**: Players pueden unirse/salir de locaciones manualmente
- **Tracking en tiempo real**: Seguimiento de cuántos players hay en cada locación
- **Comunicación**: Broadcast de cambios a todos los players de la room
- **Tipos de locación**: Racing, Social, Combat, Exploration, Custom

## Estructura de Datos

### ILocation
```typescript
interface ILocation {
  id: string;
  name: string;
  description?: string;
  roomId: string; // Room padre
  players: Record<string, IPlayer>;
  vehicles: Record<string, IVehicle>;
  maxPlayers: number;
  bounds?: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  type: "racing" | "social" | "combat" | "exploration" | "custom";
  isActive: boolean;
  createdAt: Date;
}
```

## Uso Básico

### 1. Crear una Locación

```typescript
import { locationManager } from "../physics/gameState";

const racingZone = locationManager.createLocation("main", "Racing Zone", "racing", {
  description: "Zona de carreras con pista circular",
  maxPlayers: 50,
  bounds: {
    min: { x: 200, y: 0, z: 150 },
    max: { x: 300, y: 50, z: 250 }
  }
});
```

### 2. Mover Player a Locación

```typescript
// Automático (basado en posición)
locationManager.autoAssignPlayersByPosition("main");

// Manual
const success = locationManager.movePlayerToLocation("player123", "location456");
```

### 3. Obtener Estado de Locación

```typescript
const locationState = locationManager.getLocationState("location456");
console.log(`Players en ${locationState.name}: ${locationState.playerCount}`);
```

### 4. Listar Locaciones de una Room

```typescript
const locations = locationManager.listRoomLocations("main");
locations.forEach(loc => {
  console.log(`${loc.name}: ${loc.playerCount}/${loc.maxPlayers} players`);
});
```

## Eventos WebSocket

### Cliente → Servidor

#### Obtener Locaciones de Room
```json
{
  "type": "get_room_locations",
  "data": {
    "roomId": "main"
  }
}
```

#### Obtener Estado de Locación
```json
{
  "type": "get_location_state",
  "data": {
    "locationId": "location123"
  }
}
```

#### Unirse a Locación
```json
{
  "type": "join_location",
  "data": {
    "playerId": "player123",
    "locationId": "location456"
  }
}
```

#### Salir de Locación
```json
{
  "type": "leave_location",
  "data": {
    "playerId": "player123",
    "locationId": "location456"
  }
}
```

### Servidor → Cliente

#### Lista de Locaciones
```json
{
  "type": "room_locations",
  "data": {
    "roomId": "main",
    "locations": [
      {
        "id": "location123",
        "name": "Racing Zone",
        "type": "racing",
        "playerCount": 5,
        "maxPlayers": 50,
        "isActive": true
      }
    ]
  }
}
```

#### Estado de Locación
```json
{
  "type": "location_state",
  "data": {
    "id": "location123",
    "name": "Racing Zone",
    "type": "racing",
    "players": [
      {
        "id": "player123",
        "position": { "x": 250, "y": 10, "z": 200 }
      }
    ],
    "playerCount": 1,
    "maxPlayers": 50
  }
}
```

#### Actualización de Locación
```json
{
  "type": "location_update",
  "data": {
    "id": "location123",
    "name": "Racing Zone",
    "playerCount": 6,
    "players": [...]
  }
}
```

## Configuración Predefinida

El sistema viene con locaciones predefinidas en la room "main":

1. **Racing Zone** (200,0,150) → (300,50,250)
2. **Social Hub** (0,0,0) → (100,50,100)  
3. **City Center** (100,0,100) → (200,100,200)

## Integración con Frontend

### 1. Escuchar Cambios de Locación

```typescript
// En tu componente Svelte
websocket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'location_update') {
    updateLocationUI(message.data);
  }
});
```

### 2. Mostrar Players en Locación

```typescript
function updateLocationUI(locationData) {
  const playersInLocation = locationData.players;
  
  // Actualizar UI para mostrar lista de players
  playersInLocation.forEach(player => {
    console.log(`Player ${player.id} está en ${locationData.name}`);
  });
}
```

### 3. Unirse a Locación Manualmente

```typescript
function joinRacingZone(playerId) {
  websocket.send(JSON.stringify({
    type: 'join_location',
    data: {
      playerId: playerId,
      locationId: 'racing-zone-id'
    }
  }));
}
```

## Casos de Uso

### 1. Sistema de Carreras
- Crear locación tipo "racing"
- Players se unen automáticamente al entrar al área
- Iniciar carrera cuando hay suficientes players
- Mostrar leaderboard en tiempo real

### 2. Zona Social
- Locación tipo "social" en el centro de la ciudad
- Chat local solo para players en la locación
- Eventos especiales (fiestas, reuniones)

### 3. Arena de Combate
- Locación tipo "combat" con límite de players
- Sistema de matchmaking automático
- Espectadores pueden ver desde fuera del área

### 4. Exploración
- Múltiples locaciones tipo "exploration"
- Recompensas por visitar diferentes áreas
- Misiones específicas por locación

## Monitoreo y Debug

```typescript
// Ver estadísticas en tiempo real
setInterval(() => {
  const locations = locationManager.listRoomLocations("main");
  console.log("Active locations:", locations);
}, 5000);

// Verificar player específico
const player = gameState.players["player123"];
console.log(`Player location: ${player.currentLocation}`);
```

## Próximas Mejoras

- [ ] Persistencia de locaciones en base de datos
- [ ] Sistema de permisos por locación
- [ ] Locaciones privadas/públicas
- [ ] Eventos programados por locación
- [ ] Integración con sistema de logros
- [ ] Locaciones temporales con auto-eliminación
- [ ] Sistema de reservas para locaciones