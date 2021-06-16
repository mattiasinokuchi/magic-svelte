<script>
    import { todos } from "./stores";
    import { user, didToken } from "./stores";

    let newTodo;
    function submit() {
        try {
            const object = {
                data: {
                    title: newTodo,
                    user: $user,
                    completed: false
                }
            };
            newTodo = "";
            $todos.data = $todos.data.concat(object);
            const response = fetch("/.netlify/functions/create", {
                method: "POST",
                body: JSON.stringify({
                    newTodo: object.data.title,
                    user: object.data.user
                }),
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
