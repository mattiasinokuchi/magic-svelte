<script>
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";

  let message = "Just a moment...";
  let user;
  let userLoggedIn;
  const m = new Magic("pk_live_B052D18BE29678DC");

  onMount(async () => {
    try {
      const { email } = await m.user.getMetadata();
      user = email;
      userLoggedIn = true;
      message = "Welcome " + user;
    } catch {
      userLoggedIn = false;
      message = "Welcome to my Magic Link demo!";
    }
  });

  async function logIn() {
    /* Generate token with Magic... */
    const didToken = await m.auth.loginWithMagicLink({ email: user });
    /* ...read todos... */
    const response = await fetch("/.netlify/functions/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${didToken}`,
      }
    });
    let object = await response.json();
    message = "Logged in as " + user;
    console.log(object.data[0].data.user);
    userLoggedIn = true;
  }

  async function logOut() {
    await m.user.logout();
    message = user + " logged out";
    user = null;
    userLoggedIn = false;
  }
</script>

<main>
  <h2>{message}</h2>
  {#if !userLoggedIn}
    <input type="email" bind:value={user} placeholder="name@domain.tld" />
    <button on:click={logIn}>Log in</button>
  {/if}
  {#if userLoggedIn}
    <button on:click={logOut}>Log out</button>
  {/if}
</main>
