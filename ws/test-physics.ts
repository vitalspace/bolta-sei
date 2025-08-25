import { setupPhysicsWorld } from "./src/physics/worldSetup";

async function testPhysicsSetup() {
  try {
    console.log("🚀 Testing physics world setup...");
    const world = await setupPhysicsWorld();
    console.log("✅ Physics world created successfully!");
    console.log(`📊 World has ${world.bodies.len()} rigid bodies`);
    console.log(`📊 World has ${world.colliders.len()} colliders`);
  } catch (error) {
    console.error("❌ Error setting up physics world:", error);
  }
}

testPhysicsSetup();