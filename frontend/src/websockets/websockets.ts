import { writable, type Readable } from "svelte/store";
import type { SocketMessage } from "#types/types";
import { WS_BAESE } from "../contants/constants";

export class WebsocketService {
  private socket: WebSocket;
  private messageStore = writable<SocketMessage | null>(null);
  private statusStore = writable<"connecting" | "open" | "closed" | "error">(
    "connecting"
  );

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.socket.addEventListener("open", () => this.statusStore.set("open"));
    this.socket.addEventListener("close", () => this.statusStore.set("closed"));
    this.socket.addEventListener("error", () => this.statusStore.set("error"));

    this.socket.addEventListener("message", (event) => {
      try {
        const rawData = event.data;
        if (typeof rawData !== "string") return;

        const message = JSON.parse(rawData);

        // Debug log for vehicle messages
        if (
          message.type === "vehiclePositions" ||
          message.type === "vehicleSync"
        ) {
          // console.log("📨 Received vehicle message:", message.type, message);
        }

        if (message && typeof message === "object" && message.type) {
          this.messageStore.set(message as SocketMessage);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  }

  public send(message: object): boolean {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  public get messages(): Readable<SocketMessage | null> {
    return this.messageStore;
  }

  public get status() {
    return this.statusStore;
  }

  public close() {
    this.socket.close();
  }
}

export const wsService = new WebsocketService(WS_BAESE);
