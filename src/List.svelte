<script>
    import { todos } from "./stores";

    let remove;
    let update;
</script>

<form>
    {#if $todos}
        {#each $todos.data as { data }}
            <p>{data.title}</p>
        {/each}
    {/if}
</form>
