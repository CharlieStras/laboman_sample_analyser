import { writable } from "svelte/store";

export const searched = writable(false);
export const samples = writable([]);
export const processes = writable([]);
export const needInit = writable(false);
