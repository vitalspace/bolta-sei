import { writable } from "svelte/store";
export const isOnStage = writable<boolean>(false);
export const showYouTubeDialog = writable(false);
export const currentSongUrl = writable<string | null>(null);
export const hideHtmlElements = writable(false);
