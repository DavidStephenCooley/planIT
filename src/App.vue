<script setup>
import Login from './components/Login.vue'
import Register from "./components/Register.vue"
</script>

<template>
  <header></header>

  <main>
    <Register/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

/* ✅ Centers the <Login> component */
  main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures it takes full screen height */
  width: 100%; /* Makes sure it's full width */
}


@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
