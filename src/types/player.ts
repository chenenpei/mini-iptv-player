export type PlayerStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "error";

export interface PlayerState {
  status: PlayerStatus;
  isFullscreen: boolean;
  isMuted: boolean;
  error: string | null;
}
