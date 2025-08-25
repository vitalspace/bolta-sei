import { MathUtils, Vector3, Object3D, Clock, Quaternion } from "three";

type Config = {
  yaw?: number;
  pitch?: number;
  minPitch?: number;
  maxPitch?: number;
  camLerpSpeed?: number;
  rotSpeed?: number;
  player: Object3D;
  camera: Object3D;
  cameraAxis: Object3D;
  cameraTrack: Object3D;
  body: Object3D;
  objectRef?: Object3D;
};

export class Controls {
  private player: Object3D;
  private camera: Object3D;
  private cameraAxis: Object3D;
  private cameraTrack: Object3D;

  private yaw: number;
  private pitch: number;
  private minPitch: number;
  private maxPitch: number;
  private camLerpSpeed: number;
  private rotSpeed: number;
  private clock: Clock;
  private body: Object3D;
  private objectRef: Object3D;

  constructor(config: Config) {
    const {
      yaw = 0,
      pitch = 0,
      minPitch = MathUtils.degToRad(-45),
      maxPitch = MathUtils.degToRad(45),
      camLerpSpeed = 5,
      rotSpeed = 0.005,
      player,
      camera,
      cameraAxis,
      cameraTrack,
      body,
      objectRef,
    } = config;

    this.body = body;
    this.player = player;
    this.objectRef = objectRef;
    this.camera = camera;
    this.cameraAxis = cameraAxis;
    this.cameraTrack = cameraTrack;
    this.yaw = yaw;
    this.pitch = pitch;
    this.minPitch = minPitch;
    this.maxPitch = maxPitch;
    this.camLerpSpeed = camLerpSpeed;
    this.rotSpeed = rotSpeed;
    this.clock = new Clock();
  }

  update(deltaX: number, deltaY: number) {
    // Actualizar yaw y pitch
    this.yaw -= deltaX * this.rotSpeed;
    this.pitch += deltaY * this.rotSpeed; // Mantener el signo original
    this.pitch = MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);

    // Aplicar rotaciones a los objetos 3D (esto es lo más importante)
    this.player.rotation.y = this.yaw;
    this.cameraAxis.rotation.x = this.pitch;
    this.objectRef.rotation.y = this.yaw;
    // this.cameraAxis.rotation.y = this.yaw;

    // Si tienes física, aplicar velocidad angular al cuerpo físico
    // Nota: esto podría estar interfiriendo con las rotaciones manuales
    // if (this.body.setAngvel) {
    //   // Aplicar solo la rotación en Y (yaw) al cuerpo físico
    //   this.body.setAngvel({ x: 0, y: this.yaw, z: 0 }, true);
    // }

    const delta = this.clock.getDelta();

    // Lerp de posición de cámara
    const targetPos = new Vector3();
    this.cameraTrack.getWorldPosition(targetPos);
    this.camera.position.lerp(targetPos, delta * this.camLerpSpeed);

    // Lerp de rotación de cámara
    const targetQuat = new Quaternion();
    this.cameraTrack.getWorldQuaternion(targetQuat);
    this.camera.quaternion.slerp(targetQuat, delta * this.camLerpSpeed);

    // Hacer que la cámara mire hacia el punto objetivo
    const lookPoint = new Vector3();
    this.cameraAxis.getWorldPosition(lookPoint);
    this.camera.lookAt(lookPoint);
  }
}
