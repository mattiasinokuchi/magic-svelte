<script>
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";
  import { todos, didToken, user, introList } from "./stores";

  let message = "Just a moment...";
  let userLoggedIn;
  const m = new Magic("pk_live_B052D18BE29678DC");

  onMount(async () => {
    try {
      const { email } = await m.user.getMetadata();
      $user = email;
      logIn();
    } catch {
      userLoggedIn = false;
      message = "List it!";
      $todos = $introList;
    }
  });

  async function logIn() {
    /* Generate Magic token... */
    $didToken = await m.auth.loginWithMagicLink({ email: $user });
    /* ...read todos... */
    const response = await fetch("/.netlify/functions/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$didToken}`,
      },
    });
    $todos = await response.json();
    message = $user;
    userLoggedIn = true;
  }

  async function logOut() {
    await m.user.logout();
    message = "Welcome!";
    $user = null;
    userLoggedIn = false;
    message = "List it!";
    $todos = $introList;
  }
</script>

<header>
  <h1>{message}</h1>
  {#if !userLoggedIn && message !== "Just a moment..."}
    <form on:submit|preventDefault={logIn}>
      <input
        type="email"
        bind:value={$user}
        placeholder="hello@magic.link"
        size="15"
      />
      <input type="submit" value="Log in" on:click />
    </form>
  {/if}
  {#if userLoggedIn}
    <button on:click={logOut}>Log out</button>
  {/if}
</header>

<style>
  header {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: fixed;
    height: 20vh;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      rgba(255, 166, 0, 1) 0%,
      rgb(255, 255, 255, 1) 50%,
      rgb(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  h1,
  input,
  button {
    appearance: none;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
    color: orangered;
    margin: 1vh;
    /* Set the background color */
    background: linear-gradient(to bottom, orangered 0%, white 100%);
    /* Mask the color to the text, and remove the rest  */
    -webkit-background-clip: text;
    background-clip: text;
    /* Make the text fill color value transparent so the masked background color comes through */
    -webkit-text-fill-color: transparent;
    margin-top: 5vh;
    height: 5vh;
  }

  input,
  button {
    appearance: none;
    font-size: 3vh;
    color: orangered;
    border: 1px solid orangered;
    border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
  }

  h1 {
    font-size: 4vh;
    max-width: 60vw;
  }
</style>
