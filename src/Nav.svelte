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
      message = "Welcome to my Magic Link demo!";
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
    message = "Logged in as " + $user;
    userLoggedIn = true;
  }

  async function logOut() {
    await m.user.logout();
    message = "Welcome to my Magic Link demo!";
    $user = null;
    userLoggedIn = false;
    $todos = null;
  }
</script>

<header>
  <p>{message}</p>
  {#if !userLoggedIn && message !== "Just a moment..."}
    <input type="email" bind:value={$user} placeholder="hello@magic.link" />
    <button on:click={logIn}>Log in</button>
  {/if}
  {#if userLoggedIn}
    <button on:click={logOut}>Log out</button>
  {/if}
</header>

<style>
  header {
    display: flex;
    justify-content: center;
  }

  p,
  button {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 3vh;
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

  button {
    border: 1px solid orangered;
    border-image: linear-gradient(to bottom, orangered 50%, white 100%) 1;
  }
</style>
