<script setup>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Main (obsługiwany przez router) -->
    <div class="flex-grow">
      <RouterView />
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
