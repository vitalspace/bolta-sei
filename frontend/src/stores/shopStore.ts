import { writable } from "svelte/store";

export const isInShop = writable<boolean>(false);
export const showShop = writable<boolean>(false);
