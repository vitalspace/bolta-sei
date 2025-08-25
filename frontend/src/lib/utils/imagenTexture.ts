import { Texture, TextureLoader, LinearFilter, RGBAFormat } from "three";

export const imageConfigs: {
  src: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}[] = [
  {
    src: "/adImg1.webp", // o .png, .webp, etc.
    position: [40, 26.5, -28.2],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [0.9, 0, 0.65],
  },
  {
    src: "/adImg2.webp",
    position: [50, 9.5, -29.9],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1, 0, 1.1],
  },
  {
    src: "/adImg3.webp",
    position: [10.2, 13.6, -40],
    rotation: [Math.PI * 1.5, Math.PI * 2, Math.PI / 2],
    scale: [0.9, 0.86, 1.9],
  },
  {
    src: "/adImg4.webp",
    position: [64, 12.1, -30.2],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1.7, 0, 1.6],
  },
  {
    src: "/adImg5.webp",
    position: [-55, 20.15, 12.01],
    rotation: [Math.PI * 1.5, Math.PI, 0],
    scale: [1.3, 0, 2.6],
  },
  {
    src: "/adImg6.webp",
    position: [-45, 30.1, -0],
    rotation: [Math.PI / 2, Math.PI * 2, Math.PI / 2],
    scale: [1.9, 0, 2],
  },
  {
    src: "/adImg7.webp",
    position: [74.6, 12, -40],
    rotation: [Math.PI / 2, Math.PI * 2, Math.PI / 2],
    scale: [1.7, 0, 1.7],
  },
  {
    src: "/adImg8.webp",
    position: [40, 26.5, -28.2],
    rotation: [0, 0, 0],
    scale: [0.9, 0, 0.65],
  },
];

const textureLoader = new TextureLoader();

export const items = imageConfigs.map((cfg) => {
  const tex = textureLoader.load(cfg.src);

  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;

  tex.format = RGBAFormat;

  tex.colorSpace = "srgb";

  tex.anisotropy = 16;

  tex.wrapS = tex.wrapT = 1001; // ClampToEdgeWrapping

  tex.generateMipmaps = true;

  tex.repeat.x = -1;
  tex.offset.x = 1;

  return { ...cfg, texture: tex };
});

export const loadImageItems = async (): Promise<typeof items> => {
  const promises = imageConfigs.map((cfg) => {
    return new Promise<{ texture: Texture } & typeof cfg>((resolve, reject) => {
      const tex = textureLoader.load(
        cfg.src,
        // onLoad
        (texture) => {
          // Configurar la textura una vez cargada
          texture.minFilter = LinearFilter;
          texture.magFilter = LinearFilter;
          texture.format = RGBAFormat;
          texture.colorSpace = "srgb";
          texture.anisotropy = 16;
          texture.wrapS = texture.wrapT = 1001;
          texture.generateMipmaps = true;
          texture.repeat.x = -1;
          texture.offset.x = 1;

          resolve({ ...cfg, texture });
        },
        // onProgress (opcional)
        undefined,
        // onError
        (error) => {
          console.error(`Error cargando imagen ${cfg.src}:`, error);
          reject(error);
        }
      );
    });
  });

  return Promise.all(promises);
};
