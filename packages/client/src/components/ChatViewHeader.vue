<script setup>
import { onMounted, ref } from 'vue';
import LogoutButton from '@/components/LogoutButton.vue';
import ShowRoomsButton from '@/components/ShowRoomsButton.vue';
import getCurrentUser from '@/utils/getCurrentUser';
import ClearChatMessagesButton from './ClearChatMessagesButton.vue';
// import { socket } from '@/utils/clientSocket';

let user = ref('');
onMounted(async () => {
  user.value = await getCurrentUser();
});

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <section class="flex justify-between p-5 border-b-2 items-center">
    <ShowRoomsButton />
    <p class="self-center">Logged in as: {{ user }}</p>
    <p>Actual room: {{ props.room }}</p>
    <LogoutButton />
  </section>
  <section class="flex justify-between">
    <h3 class="font-tech text-[var(--myGreenColor)] self-center text-lg">Chats</h3>
    <ClearChatMessagesButton />
  </section>
</template>
