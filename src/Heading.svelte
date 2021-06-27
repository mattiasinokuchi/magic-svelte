<script>
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";
  import { todos, didToken, user } from "./stores";

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
      message = "Welcome!";
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
    message = "Todo for " + $user;
    userLoggedIn = true;
  }

  async function logOut() {
    await m.user.logout();
    message = "Welcome!";
    $user = null;
    userLoggedIn = false;
    $todos = null;
  }
</script>

<header>
  <h1>{message}</h1>
  {#if !userLoggedIn && message !== "Just a moment..."}
    <input
      type="email"
      bind:value={$user}
      placeholder="hello@magic.link"
      size="15"
    />
    <button on:click={logIn}>Log in</button>
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
    top: 5vh;
    left: 0;
    right: 0;
  }

  h1,
  input,
  button {
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
    margin: 1vh;
    /* Set the background color */
    background: linear-gradient(to bottom, orangered 50%, white 100%);
    /* Mask the color to the text, and remove the rest  */
    -webkit-background-clip: text;
    background-clip: text;
    /* Make the text fill color value transparent so the masked background color comes through */
    -webkit-text-fill-color: transparent;
    border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
  }

  input,
  button {
    font-size: 3vh;
    border: 1px solid orangered;
    border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
    height: 5vh;
  }
</style>
