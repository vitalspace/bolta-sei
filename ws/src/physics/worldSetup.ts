import RAPIER from "@dimforge/rapier3d-compat";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import * as fs from "fs";
import * as path from "path";

interface PhysicsConfig {
  gltfPath?: string;
  physicsObjects?: string[];
}

export async function setupPhysicsWorld(config?: PhysicsConfig) {
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

  const defaultConfig: Required<PhysicsConfig> = {
    gltfPath: path.resolve(process.cwd(), "public/city-transformed.glb"),
  };

  const finalConfig = { ...defaultConfig, ...config };

  try {
    if (!fs.existsSync(finalConfig.gltfPath)) {
      throw new Error(`GLB file not found: ${finalConfig.gltfPath}`);
    }

    const document = await loadGLB(finalConfig.gltfPath);
    const scene = document.getRoot().listScenes()[0];
    if (!scene) throw new Error("No scenes found in GLB file");

    const collidersCreated = createPhysicsFromScene(
      world,
      scene,
      finalConfig.physicsObjects
    );

    if (collidersCreated === 0) {
      throw new Error(
        `No meshes found in groups: ${finalConfig.physicsObjects.join(", ")}`
      );
    }
  } catch (error) {
    console.error("❌ Error loading GLB file:", error);
    createFallbackGround(world);
  }

  return world;
}

/* -------------------- Helpers -------------------- */

// Carga un GLB con soporte para DRACO
async function loadGLB(filePath: string) {
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
    });

  return io.read(filePath);
}

// Procesa todos los nodos relevantes de la escena y crea colisionadores
function createPhysicsFromScene(
  world: RAPIER.World,
  scene: any,
  physicsObjects: string[]
): number {
  let colliders = 0;

  const processNode = (node: any) => {
    if (physicsObjects.includes(node.getName())) {
      traverseNode(node, (meshNode) => {
        const mesh = meshNode.getMesh();
        if (mesh) {
          for (const primitive of mesh.listPrimitives()) {
            colliders += createColliderFromPrimitive(world, meshNode, primitive);
          }
        }
      });
    }
  };

  scene.listChildren().forEach(processNode);
  return colliders;
}

// Recorre recursivamente un nodo y sus hijos
function traverseNode(node: any, callback: (n: any) => void) {
  callback(node);
  node.listChildren().forEach((child: any) => traverseNode(child, callback));
}

// Crea un collider de tipo trimesh a partir de un primitive
function createColliderFromPrimitive(
  world: RAPIER.World,
  node: any,
  primitive: any
): number {
  const posAttr = primitive.getAttribute("POSITION");
  if (!posAttr) return 0;

  const vertices = posAttr.getArray();
  const indices = primitive.getIndices()?.getArray() ?? generateIndices(vertices.length / 3);

  if (!vertices?.length || !indices?.length) return 0;

  const rigidBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed()
      .setTranslation(...node.getTranslation())
      .setRotation(toQuaternion(node.getRotation()))
  );

  const scaledVertices = applyScale(vertices, node.getScale());
  world.createCollider(
    RAPIER.ColliderDesc.trimesh(scaledVertices, new Uint32Array(indices)),
    rigidBody
  );

  return 1;
}

// Convierte arreglo de rotación a cuaternión
function toQuaternion(rotation: number[]) {
  return { x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] };
}

// Aplica escala a todos los vértices
function applyScale(vertices: Float32Array, scale: number[]) {
  const scaled = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i += 3) {
    scaled[i] = vertices[i] * scale[0];
    scaled[i + 1] = vertices[i + 1] * scale[1];
    scaled[i + 2] = vertices[i + 2] * scale[2];
  }
  return scaled;
}

// Crea un plano de fallback si no se pudo cargar la escena
function createFallbackGround(world: RAPIER.World) {
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
  );
  world.createCollider(RAPIER.ColliderDesc.cuboid(500, 0.1, 500), body);
  console.log("✅ Created fallback ground plane");
}

// Genera índices cuando no existen
function generateIndices(count: number) {
  return Array.from({ length: count }, (_, i) => i);
}
