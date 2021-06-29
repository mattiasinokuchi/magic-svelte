import { writable, readable } from "svelte/store";

export let todos = writable(null);
export let didToken = writable(null);
export let user = writable(null);
export let introList = readable({
    data: [
        {
            data: {
                title: "Log in with your email",
            },
        },
        {
            data: {
                title: "List meaningful things",
            },
        },
        {
            data: {
                title: "Do what you need to do",
            },
        },
        {
            data: {
                title: "Celebrate!",
            },
        },
    ],
}
);