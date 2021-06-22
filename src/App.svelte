<script>
  import Nav from "./Nav.svelte";
  import List from "./List.svelte";
  import Form from "./Form.svelte";
</script>

<header>
  <Nav />
</header>
<main>
  <List />
</main>
<footer>
  <Form />
</footer>

<style>
  header {
    height: 10vh;
  }

  main {
    height: 80vh;
  }

  footer {
    height: 10vh;
    position: fixed;
  }
</style>
