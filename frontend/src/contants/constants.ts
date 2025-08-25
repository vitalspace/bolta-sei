export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://localhost:5000/api/v2" ||
  "https://bolta.world/api/v2";

export const WS_BAESE =
  import.meta.env.VITE_WS_BASE ||
  "ws://localhost:4000/v2/ws" ||
  "wss://bolta.world/v2/ws";

export const VIP_ADDRESS = "0xd932fBC45e79cFd6CA39c25613a4c6cAA20688Ee";