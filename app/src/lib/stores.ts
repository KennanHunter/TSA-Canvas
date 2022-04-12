import { writable } from "svelte/store";

export let Title = writable("");

export function setTitle(value: string) {
	Title.set(value);
}
