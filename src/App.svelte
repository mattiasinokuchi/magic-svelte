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
  main {
    display: flex;
    align-items: center;
    height: 80vh;
  }

  footer {
    position: sticky;
    margin-bottom: 5vh;
  }
</style>
