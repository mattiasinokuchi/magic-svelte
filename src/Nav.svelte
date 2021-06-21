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
      text-align: center;
    }
    p, button {
      margin: 1vh;
    }
  </style>
  