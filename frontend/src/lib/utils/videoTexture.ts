import { VideoTexture, LinearFilter, RGBAFormat } from "three";

export const videoConfigs: {
  src: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}[] = [
  {
    src: "/add1.webm",
    position: [40, 26.5, -28.2],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [0.9, 0, 0.65],
  },
  {
    src: "/add2.webm",
    position: [50, 9.5, -29.9],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1, 0, 1.1],
  },
  {
    src: "/add3.webm",
    position: [10.2, 13.6, -40],
    rotation: [Math.PI * 1.5, Math.PI * 2, Math.PI / 2],
    scale: [0.9, 0.86, 1.9],
  },
  {
    src: "/add4.webm",
    position: [64, 12.1, -30.2],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1.7, 0, 1.6],
  },
  {
    src: "/add5.webm",
    position: [-55, 20.15, 12.01],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1.3, 0, 2.6],
  },
  {
    src: "/add6.webm",
    position: [-45, 30.1, -0],
    rotation: [Math.PI / 2, Math.PI * 2, Math.PI / 2],
    scale: [1.9, 0, 2],
  },
  {
    src: "/add7.webm",
    position: [74.6, 12, -40],
    rotation: [Math.PI / 2, Math.PI * 2, Math.PI / 2],
    scale: [1.7, 0, 1.7],
  },
  {
    src: "/add8.webm",
    position: [64, 11.5, -49.5],
    rotation: [Math.PI / 2, 0, 0],
    scale: [1.7, 0, 1.6],
  },
  {
    src: "/add9.webm",
    position: [40, 19.5, -42.01],
    rotation: [Math.PI / 2, 0, 0],
    scale: [0.8, 0, 1.41],
  },
  {
    src: "/add10.webm",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [0, 0, 0],
  },
];

export const items = videoConfigs.map((cfg) => {
  const vid = document.createElement("video");
  vid.src = cfg.src;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.crossOrigin = "anonymous";

  vid.preload = "metadata";
  vid.controls = false;

  vid.addEventListener("loadeddata", () => {
    vid.play();
  });

  const tex = new VideoTexture(vid);

  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;

  tex.format = RGBAFormat;

  tex.colorSpace = "srgb";

  tex.anisotropy = 16;

  tex.wrapS = tex.wrapT = 1001; // ClampToEdgeWrapping

  tex.generateMipmaps = true;

  tex.repeat.x = -1;
  tex.offset.x = 1;

  return { ...cfg, video: vid, texture: tex };
});
