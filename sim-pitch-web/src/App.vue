<template>
  <div class="app">
    <NavBar :isDark="true" />
    <router-view />
  </div>

  <!-- Przycisk Scroll to Top -->
  <transition name="fade">
    <button 
      v-show="showScrollButton" 
      @click="scrollToTop" 
      class="scroll-to-top"
      title="Wróć na górę"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  </transition>
</template>

<!-- Używamy <script setup> - to kluczowa zmiana -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "./components/Main/NavBar.vue";

// Zmienne i funkcje są teraz automatycznie dostępne w template
const showScrollButton = ref(false);

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Style dla przycisku */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  
  background-color: var(--color-accent-blue); /* Upewnij się, że masz tę zmienną lub wpisz kolor np. #007bff */
  color: white;
  border: none;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  background-color: var(--color-button-primary-hover-bg); /* Opcjonalnie */
}

/* Animacja pojawiania się */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
