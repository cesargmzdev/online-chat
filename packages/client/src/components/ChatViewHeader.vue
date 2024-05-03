<script setup>
import { onMounted, ref } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import ShowRoomsButton from '@/components/ShowRoomsButton.vue';
import getCurrentUser from '@/utils/getCurrentUser';

let user = ref('');
onMounted(async () => {
  user.value = await getCurrentUser();
});
</script>

<template>
  <section class="flex justify-between p-5 border-b-2">
    <ShowRoomsButton />
    <p class="self-center">Logged in as: {{ user }}</p>
    <LogoutButton />
  </section>
  <h3 class="font-tech text-[var(--myGreenColor)] self-center text-lg">Chats</h3>
</template>
