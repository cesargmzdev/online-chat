<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import ChatViewHeader from '@/components/ChatViewHeader.vue';
import RoomsList from '@/components/RoomsList.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import ChatComponent from '@/components/ChatComponent.vue';
import socket from '@/utils/clientSocket';
import { useChatStore } from '@/store/store';

let show = ref(false);
provide('show', show);
let currentRoom = ref('global');
let chatStore = useChatStore();

const handleGlobalChat = (data) => {
  chatStore.addMessage(data); // add global message to the store
};

const handleRoomChat = (data) => {
  chatStore.addMessage(data); // add room message to the store
};

onMounted(() => {
  // Set up event listeners
  socket.on('globalChat', handleGlobalChat);
  socket.on('roomChat', handleRoomChat);
  if (!sessionStorage.getItem('rooms')) {
    sessionStorage.setItem(
      'rooms',
      JSON.stringify([{ roomName: 'global', roomMember: null, user: null, currentTime: null }])
    );
    return;
  }
  // Rejoin each room stored in sessionStorage
  const rooms = JSON.parse(sessionStorage.getItem('rooms') || '[]');
  rooms.forEach(({ roomName, roomMember, loggedUserToken, currentTime }) => {
    if (roomName === 'global') {
      return;
    }
    socket.emit('joinRoom', roomMember, loggedUserToken, currentTime);
  });
});

onUnmounted(() => {
  // Remove event listeners
  socket.off('globalChat', handleGlobalChat);
  socket.off('roomChat', handleRoomChat);
});
</script>

<template>
  <div class="h-dvh w-dvw flex flex-col px-[20dvw]">
    <HeaderComponent custom-classes="pt-6" />
    <ChatViewHeader :room="currentRoom" />
    <main class="flex-grow mb-2">
      <RoomsList v-if="show" @room-changed="currentRoom = $event" />
      <ChatComponent v-else :room="currentRoom" />
    </main>
    <FooterComponent />
  </div>
</template>
