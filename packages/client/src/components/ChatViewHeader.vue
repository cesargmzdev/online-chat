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
  },
  show: {
    type: Boolean
  }
});
</script>

<template>
  <section class="flex items-center justify-between border-b-2 p-5">
    <ShowRoomsButton />
    <p class="self-center">Logged in as: {{ user }}</p>
    <p>Actual room: {{ props.room }}</p>
    <LogoutButton />
  </section>
  <transition name="fade" mode="out-in">
    <section class="flex justify-between" v-if="props.show">
      <h3 class="font-tech self-center text-lg text-[var(--myGreenColor)]">Chats</h3>
      <ClearChatMessagesButton :room="props.room" />
    </section>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
