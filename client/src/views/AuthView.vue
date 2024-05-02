<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import HomeForm from '@/components/HomeForm.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>
<template>
  <div class="h-dvh flex flex-col">
    <HeaderComponent customClasses="pt-24" />
    <main class="grid place-items-center flex-grow">
      <HomeForm />
    </main>
    <FooterComponent />
  </div>
</template>
