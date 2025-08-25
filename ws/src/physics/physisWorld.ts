import RAPIER from "@dimforge/rapier3d-compat";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import * as fs from "fs";

import { type PhysicsConfig } from "../types/types";

export class PhysicsWorld {
  private world: RAPIER.World;
  private config: PhysicsConfig;

  constructor(world: RAPIER.World, config: PhysicsConfig) {
    if (!config.gltfPath) {
      throw new Error("❌ Missing gltfPath in PhysicsConfig");
    }
    if (
      !Array.isArray(config.physicsObjects) ||
      config.physicsObjects.length === 0
    ) {
      throw new Error("❌ physicsObjects must be a non-empty array");
    }
    this.world = world;
    this.config = config;
  }

  async init() {
    try {
      if (!fs.existsSync(this.config.gltfPath)) {
        throw new Error(`GLB file not found: ${this.config.gltfPath}`);
      }

      const document = await this.loadGLB(this.config.gltfPath);
      const scene = document.getRoot().listScenes()[0];
      if (!scene) throw new Error("No scenes found in GLB file");

      const colliders = this.createPhysicsFromScene(scene);

      if (colliders === 0) {
        throw new Error(
          `No meshes found in: ${this.config.physicsObjects.join(", ")}`
        );
      }
    } catch (error) {
      console.error("❌ Error loading GLB file:", error);
      this.createFallbackGround();
    }
  }

  private async loadGLB(filePath: string) {
    const io = new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({
        "draco3d.decoder": await draco3d.createDecoderModule(),
      });

    return io.read(filePath);
  }

  private createPhysicsFromScene(scene: any): number {
    let colliders = 0;

    const processNode = (node: any) => {
      if (this.config.physicsObjects.includes(node.getName())) {
        this.traverseNode(node, (meshNode) => {
          const mesh = meshNode.getMesh();
          if (mesh) {
            for (const primitive of mesh.listPrimitives()) {
              colliders += this.createColliderFromPrimitive(
                meshNode,
                primitive
              );
            }
          }
        });
      }
    };

    scene.listChildren().forEach(processNode);
    return colliders;
  }

  private traverseNode(node: any, callback: (n: any) => void) {
    callback(node);
    node
      .listChildren()
      .forEach((child: any) => this.traverseNode(child, callback));
  }

  private createColliderFromPrimitive(node: any, primitive: any): number {
    const posAttr = primitive.getAttribute("POSITION");
    if (!posAttr) return 0;

    const vertices = posAttr.getArray();
    const indices =
      primitive.getIndices()?.getArray() ??
      this.generateIndices(vertices.length / 3);

    if (!vertices?.length || !indices?.length) return 0;

    const translation = node.getTranslation() || [0, 0, 0];
    const rotation = node.getRotation() || [0, 0, 0, 1];

    const rigidBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed()
        .setTranslation(translation[0], translation[1], translation[2])
        .setRotation(this.toQuaternion(rotation))
    );

    const scaledVertices = this.applyScale(
      vertices,
      node.getScale() || [1, 1, 1]
    );
    this.world.createCollider(
      RAPIER.ColliderDesc.trimesh(scaledVertices, new Uint32Array(indices)),
      rigidBody
    );

    return 1;
  }

  private toQuaternion(rotation: number[]) {
    return {
      x: rotation[0] || 0,
      y: rotation[1] || 0,
      z: rotation[2] || 0,
      w: rotation[3] || 1,
    };
  }

  private applyScale(vertices: Float32Array, scale: number[]): Float32Array {
    if (!vertices || !scale || scale.length < 3) {
      return vertices;
    }

    const scaled = new Float32Array(vertices.length);
    for (let i = 0; i < vertices.length; i += 3) {
      //@ts-ignore
      scaled[i] = vertices[i] * (scale[0] || 1);
      //@ts-ignore
      scaled[i + 1] = vertices[i + 1] * (scale[1] || 1);
      //@ts-ignore
      scaled[i + 2] = vertices[i + 2] * (scale[2] || 1);
    }
    return scaled;
  }

  private createFallbackGround() {
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
    );
    this.world.createCollider(RAPIER.ColliderDesc.cuboid(500, 0.1, 500), body);
    console.log("✅ Created fallback ground plane");
  }

  private generateIndices(count: number) {
    return Array.from({ length: count }, (_, i) => i);
  }
}
