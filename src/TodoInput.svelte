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
        <input
            type="text"
            bind:value={title}
            name="newTodo"
            placeholder="An idea...the name of a song..."
                maxlength="35"
            size="20"
        />
        <input type="submit" value="Add" />
    </form>
{/if}

<style>
    form {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: fixed;
        height: 20vh;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
            rgba(255, 255, 255, 0) 0%,
            rgb(255, 255, 255, 1) 25%,
            rgba(255, 255, 255, 1) 100%
        );
    }

    input {
        font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
        /* Set the background color */
        background: linear-gradient(to bottom, orangered 50%, white 100%);
        /* Mask the color to the text, and remove the rest  */
        -webkit-background-clip: text;
        background-clip: text;
        /* Make the text fill color value transparent so the masked background color comes through */
        -webkit-text-fill-color: transparent;
        border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
        font-size: 3vh;
        border: 1px solid orangered;
        border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
        margin: 1vh;
        margin-bottom: 5vh;
    }
</style>
