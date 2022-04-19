import { writable } from "svelte/store";

export let Title = writable("");

export function setTitle(value?: string) {
	if (value) {
		Title.set(value);
	} else {
		Title.set("Red Panda LMS");
	}
}
