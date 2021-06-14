<script>
    import { todos } from "./stores";

    const update = (num) =>
        function () {
            try {
                fetch("/.netlify/functions/update", {
                    method: "POST",
                    body: JSON.stringify({
                        id: $todos[num - 1]["ref"]["@ref"]["id"],
                        data: $todos[num - 1]["data"]["name"],
                    }),
                    headers: {
                        "Content-Type": "application/json",
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
                        id: $todos[num - 1]["ref"]["@ref"]["id"],
                        data: $todos[num - 1]["data"]["name"],
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                $todos = [...$todos.slice(0, num - 1), ...$todos.slice(num)];
            } catch (error) {
                console.log(error);
            }
        };
</script>

<form>
    {#if $todos}
        {#each $todos.data as { data }, i}
            <div id="todo">
                <button on:click|preventDefault={remove(i + 1)}>🗑</button>
                <input
                    bind:value={data.title}
                    on:change={update(i + 1)}
                    size={data.title.length}
                    maxlength="35"
                />
            </div>
        {/each}
    {/if}
</form>
