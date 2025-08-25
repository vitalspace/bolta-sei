import RAPIER from "@dimforge/rapier3d-compat";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import * as fs from "fs";
import * as path from "path";

async function debugPhysicsLoading() {
  console.log("🔍 Debugging physics loading...");
  
  const gltfPath = path.resolve(process.cwd(), "public/city-transformed.glb");
  console.log(`📁 GLB Path: ${gltfPath}`);
  console.log(`📁 File exists: ${fs.existsSync(gltfPath)}`);
  
  if (!fs.existsSync(gltfPath)) {
    console.log("❌ GLB file not found!");
    return;
  }
  
  try {
    // Load GLB file
    const io = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
        "draco3d.encoder": await draco3d.createEncoderModule(),
      });
    
    const document = await io.read(gltfPath);
    const scene = document.getRoot().listScenes()[0];
    
    if (!scene) {
      console.log("❌ No scenes found in GLB file");
      return;
    }
    
    console.log(`✅ Scene loaded with ${scene.listChildren().length} children`);
    
    // List all node names
    const nodeNames: string[] = [];
    
    function traverseNodes(node: any, depth = 0) {
      const indent = "  ".repeat(depth);
      const nodeName = node.getName() || "(unnamed)";
      nodeNames.push(nodeName);
      console.log(`${indent}📦 Node: "${nodeName}"`);
      
      const mesh = node.getMesh();
      if (mesh) {
        console.log(`${indent}  🔺 Has mesh with ${mesh.listPrimitives().length} primitives`);
      }
      
      node.listChildren().forEach((child: any) => traverseNodes(child, depth + 1));
    }
    
    scene.listChildren().forEach((child: any) => traverseNodes(child));
    
    console.log(`\n🎯 Looking for physics objects: ["road", "parque"]`);
    console.log(`📋 Found "road": ${nodeNames.includes("road")}`);
    console.log(`📋 Found "parque": ${nodeNames.includes("parque")}`);
    
    // Check for similar names
    const similarToParque = nodeNames.filter(name => 
      name.toLowerCase().includes("park") || 
      name.toLowerCase().includes("parque") ||
      name.toLowerCase().includes("ground") ||
      name.toLowerCase().includes("floor")
    );
    
    console.log(`\n🔍 Similar names to 'parque': ${JSON.stringify(similarToParque)}`);
    
    // Test physics creation
    await RAPIER.init();
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    
    let colliders = 0;
    const physicsObjects = ["road", "parque"];
    
    const processNode = (node: any) => {
      if (physicsObjects.includes(node.getName())) {
        console.log(`✅ Processing physics node: "${node.getName()}"`);        
        traverseNodeForMesh(node, (meshNode) => {
          const mesh = meshNode.getMesh();
          if (mesh) {
            console.log(`  🔺 Found mesh with ${mesh.listPrimitives().length} primitives`);
            colliders += mesh.listPrimitives().length;
          }
        });
      }
    };
    
    function traverseNodeForMesh(node: any, callback: (n: any) => void) {
      callback(node);
      node.listChildren().forEach((child: any) => traverseNodeForMesh(child, callback));
    }
    
    scene.listChildren().forEach(processNode);
    
    console.log(`\n🎯 Total colliders that would be created: ${colliders}`);
    
    if (colliders === 0) {
      console.log("❌ No colliders would be created! This explains why car4 falls through.");
      console.log("💡 Suggestion: Check if node names in GLB match exactly: 'road', 'parque'");
    } else {
      console.log("✅ Colliders would be created successfully");
    }
    
  } catch (error) {
    console.error("❌ Error loading GLB:", error);
  }
}

debugPhysicsLoading().catch(console.error);