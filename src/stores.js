import { writable } from "svelte/store";

export let todos = writable(null);
export let didToken = writable(null);