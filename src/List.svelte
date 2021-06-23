<script>
    import { todos, didToken } from "./stores";

    const update = (num) =>
        function () {
            try {
                fetch("/.netlify/functions/update", {
                    method: "POST",
                    body: JSON.stringify({
                        id: $todos.data[num - 1]["ref"]["@ref"]["id"],
                        title: $todos.data[num - 1]["data"]["title"],
                        completed: $todos.data[num - 1]["data"]["completed"],
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${$didToken}`,
                    },
                });
            } catch (error) {
                console.log(error);
            }
        };
    const remove = (num) =>
        function () {
            try {
                fetch("/.netlify/functions/delete", {
                    method: "POST",
                    body: JSON.stringify({
                        id: $todos.data[num - 1]["ref"]["@ref"]["id"],
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${$didToken}`,
                    },
                });
                $todos.data = [
                    ...$todos.data.slice(0, num - 1),
                    ...$todos.data.slice(num),
                ];
            } catch (error) {
                console.log(error);
            }
        };
</script>

<form>
    {#if $todos}
        {#each $todos.data as { data }, i}
            <div id="todo">
                <input
                    type="checkbox"
                    bind:checked={data.completed}
                    on:change={update(i + 1)}
                />
                <input
                    bind:value={data.title}
                    on:change={update(i + 1)}
                    disabled={data.completed}
                    maxlength="100"
                />
                <button on:click|preventDefault={remove(i + 1)}>🗑</button>
            </div>
        {/each}
    {/if}
</form>

<style>
    form {
        height: 50vh;
        margin-top: 20vh;
    }

    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input,
    button {
        font-size: 3vh;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        margin: 1vh;
        /* Set the background color */
        background: linear-gradient(to bottom, orangered 50%, white 100%);
        /* Mask the color to the text, and remove the rest  */
        -webkit-background-clip: text;
        background-clip: text;
        /* Make the text fill color value transparent so the masked background color comes through */
        -webkit-text-fill-color: transparent;
        border: 1px solid orange;
        border-image: linear-gradient(to bottom, orange 50%, white 100%) 1;
    }

    input[type=checkbox] {
        appearance: none;
        border: 1px solid orange;
        padding: 9px;
        border-image: linear-gradient(to bottom, orange 50%, white 100%) 1;
    }

    input:checked {
        border: none;
        background: linear-gradient(to bottom, orangered 50%, white 100%);
    }

    input:disabled {
        text-decoration: line-through;
        /* Set the background color */
        background: linear-gradient(to bottom, orange 0%, white 100%);
        /* Mask the color to the text, and remove the rest  */
        -webkit-background-clip: text;
        background-clip: text;
        /* Make the text fill color value transparent so the masked background color comes through */
        -webkit-text-fill-color: transparent;
        border-image: linear-gradient(to bottom, orange 0%, white 100%) 1;
    }
</style>
