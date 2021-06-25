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
    input {
        font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
        margin: 1vh;
        /* Set the background color */
        background: linear-gradient(to bottom, orangered 0%, white 100%);
        /* Mask the color to the text, and remove the rest  */
        -webkit-background-clip: text;
        background-clip: text;
        /* Make the text fill color value transparent so the masked background color comes through */
        -webkit-text-fill-color: transparent;
        border-image: linear-gradient(to bottom, orangered 0%, white 100%) 1;
        font-size: 3vh;
        border: 1px solid orange;
        border-image: linear-gradient(to bottom, orange 0%, white 100%) 1;
    }
</style>
