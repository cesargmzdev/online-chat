<script setup>
import WebSocketLogo from '@/components/icons/WebSocketLogo.vue';

defineProps({
  customClasses: String
});
</script>

<template>
  <header :class="`flex justify-center items-center gap-6 ${customClasses}`">
    <WebSocketLogo />
    <h1 class="text-[var(--myGreenColor)] font-tech text-4xl lg:text-5xl">ONLINE CHAT</h1>
  </header>
</template>
