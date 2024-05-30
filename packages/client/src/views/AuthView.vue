<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import HomeForm from '@/components/HomeForm.vue';
import FooterComponent from '@/components/FooterComponent.vue';
</script>
<template>
  <div class="flex h-dvh flex-col">
    <HeaderComponent custom-classes="pt-24" />
    <main class="grid flex-grow place-items-center">
      <HomeForm />
    </main>
    <FooterComponent />
  </div>
</template>
