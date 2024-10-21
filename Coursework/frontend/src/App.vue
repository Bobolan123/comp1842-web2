<script setup lang="tsx">
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="mb-24"><Navbar /></header>

  <div class="mx-20">
    <h1 class="text-center font-bold text-2xl to-blue-500 mb-10">
      Current products
    </h1>
    <RouterView />
  </div>
</template>
