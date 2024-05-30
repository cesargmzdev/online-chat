<script setup>
import WebSocketLogo from '@/assets/icons/WebSocketLogo.vue';

defineProps({
  customClasses: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <header :class="`flex items-center justify-center gap-6 ${customClasses}`">
    <WebSocketLogo />
    <h1 class="font-tech text-4xl text-[var(--myGreenColor)] lg:text-5xl">ONLINE CHAT</h1>
  </header>
</template>
