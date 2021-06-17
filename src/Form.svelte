<script>
    import { todos } from "./stores";
    import { user, didToken } from "./stores";

    let title;
    function submit() {
        try {
            const object = {
                data: {
                    title: title,
                    user: $user,
                    completed: false
                }
            };
            title = "";
            $todos.data = $todos.data.concat(object);
            fetch("/.netlify/functions/create", {
                method: "POST",
                body: JSON.stringify({
                    title: object.data.title,
                    user: object.data.user,
                    completed: object.data.completed
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
        bind:value={title}
        name="newTodo"
        placeholder="Type here and..."
        maxlength="35"
        size="15"
    />
    <input type="submit" value="Add it" />
</form>

<style>
    input {
        margin: 2vh;
    }
</style>
