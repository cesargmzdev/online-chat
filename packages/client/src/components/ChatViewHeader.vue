<script setup>
import { onMounted, ref } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import ShowRoomsButton from '@/components/ShowRoomsButton.vue';
import getCurrentUser from '@/utils/getCurrentUser';
import { socket } from '@/utils/clientSocket';

let user = ref('');
onMounted(async () => {
  user.value = await getCurrentUser();
});

socket.on('room', (room) => {
  console.log(`header room: ${room}`);
  return room;
});
</script>

<template>
  <section class="flex justify-between p-5 border-b-2">
    <ShowRoomsButton />
    <p class="self-center">Logged in as: {{ user }}</p>
    <p>Actual room: {{ room }}</p>
    <LogoutButton />
  </section>
  <h3 class="font-tech text-[var(--myGreenColor)] self-center text-lg">Chats</h3>
</template>
