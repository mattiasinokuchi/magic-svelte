<script>
    import { todos } from "./stores";
    import { didToken } from "./stores";

    const update = (num) =>
        function () {
            try {
                fetch("/.netlify/functions/update", {
                    method: "POST",
                    body: JSON.stringify({
                        id: $todos.data[num - 1]["ref"]["@ref"]["id"],
                        data: $todos.data[num - 1]["data"]["title"],
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
                $todos.data = [...$todos.data.slice(0, num - 1), ...$todos.data.slice(num)];
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
