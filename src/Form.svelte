<script>
    import { todos } from "./stores";
    import { didToken } from "./stores";

    let newTodo;
    async function submit() {
        try {
            const object = { data: { title: newTodo } };
            newTodo = "";
            $todos.data = $todos.data.concat(object);
            const response = await fetch("/.netlify/functions/create", {
                method: "POST",
                body: JSON.stringify({ newTodo: object.data.title }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${$didToken}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
</script>

<form on:submit|preventDefault={submit}>
    <input
        type="text"
        bind:value={newTodo}
        name="newTodo"
        placeholder="Type here and..."
        maxlength="35"
        size="15"
    />
    <input type="submit" value="Add it" />
</form>

<style>
</style>
