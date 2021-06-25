<script>
    import { todos, user, didToken } from "./stores";

    let title;
    async function submit() {
        try {
            const object = {
                data: {
                    title: title,
                    user: $user,
                    completed: false,
                },
            };
            title = "";
            $todos.data = $todos.data.concat(object);
            const response = await fetch("/.netlify/functions/create", {
                method: "POST",
                body: JSON.stringify({
                    title: object.data.title,
                    user: object.data.user,
                    completed: object.data.completed,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${$didToken}`,
                },
            });
            $todos = await response.json();
        } catch (error) {
            console.log(error);
        }
    }
</script>

{#if $todos}
    <form on:submit|preventDefault={submit}>
        <input type="submit" value="Add another" />
    </form>
{/if}

<style>
    form {
        display: flex;
        justify-content: center;
        width: 100vw;
        position: fixed;
    }

    input {
        margin: 3vh;
        font-size: 3vh;
        color: orange;
        background-color: white;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        margin: 1vh;
        border: 1px solid orange;
    }
</style>
