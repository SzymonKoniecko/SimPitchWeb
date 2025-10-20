<script setup lang="ts">

</script>

<template>
  <header class="navbar">
    <router-link to="/" exact-active-class="active">
      <div class="logo">⚽ SimPitch</div>
    </router-link>
    

    <nav class="nav-links">
      <div class="link"><router-link to="/" exact-active-class="active">Home</router-link></div> <hr/>
      <div class="link"><router-link to="/simulation" exact-active-class="active">All simulations</router-link></div> <hr/>
      <div class="link"><router-link to="/prepareSimulation" exact-active-class="active">
        Prepare a new simulation
      </router-link></div> <hr/>
      <div class="link"><router-link to="/about" exact-active-class="active">About</router-link> </div><hr/>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-grid);
  padding: 1rem 2rem;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  margin-bottom: 1.5rem;
}

.logo {
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--color-accent-green);
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 230, 118, 0.4);
  transition: transform 0.2s ease, text-shadow 0.2s ease;
}
.logo:hover {
  transform: scale(1.05);
  text-shadow: 0 0 12px rgba(0, 230, 118, 0.7);
}

/* ---- LINKS ---- */
.nav-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.nav-links a {
  color: var(--color-text-secondary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

.nav-links a.active {
  color: var(--color-accent-green);
  font-weight: 600;
  background: rgba(0, 230, 118, 0.1);
  box-shadow: 0 0 6px rgba(0, 230, 118, 0.3);
}

.nav-links a:hover {
  color: var(--color-accent-blue);
  transform: translateY(-1px);
}

/* ---- PRIMARY BUTTON LINK ---- */
.nav-links .btn-primary {
  background: linear-gradient(135deg, var(--color-button), var(--color-accent-blue));
  color: #fff !important;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 191, 166, 0.4);
  border: none;
}
.nav-links .btn-primary:hover {
  background: linear-gradient(135deg, var(--color-accent-blue), var(--color-button));
  box-shadow: 0 6px 16px rgba(0, 191, 166, 0.6);
  transform: translateY(-2px);
}
.nav-links .btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(0, 191, 166, 0.4);
}

/* ---- SEPARATOR PIONOWY ---- */
hr {
  width: 1px;
  height: 24px;
  background-color: var(--color-grid);
  border: none;
  opacity: 0.6;
  margin: 0 0.5rem;
}
</style>