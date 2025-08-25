import { gameState } from "./src/gameState";

console.log("🚗 Testing vehicles in gameState...");
console.log("gameState.vehicles:", gameState.vehicles);
console.log("Number of vehicles:", Object.keys(gameState.vehicles).length);
console.log("Vehicle IDs:", Object.keys(gameState.vehicles));

// También verificar que están en mainRoom
console.log("\n🏠 Testing vehicles in mainRoom...");
console.log("mainRoom vehicles:", gameState.rooms.main.vehicles);
console.log("Same reference?", gameState.vehicles === gameState.rooms.main.vehicles);