<script setup>
import router from '@/router';
import socket from '@/utils/clientSocket.js';
import { useChatStore } from '@/store/store';

const chatStore = useChatStore();

const handleLogout = async () => {
  const storedRooms = JSON.parse(sessionStorage.getItem('rooms') || '[]');
  await storedRooms.forEach(({ roomName, loggedUserToken, currentTime }) => {
    if (roomName === 'global') {
      return;
    }
    socket.emit('leaveRoom', roomName, loggedUserToken, currentTime);
  });
  sessionStorage.removeItem('rooms');
  chatStore.clearAllMessages();
  sessionStorage.removeItem('jwt');
  chatStore.clearAllNotifications();
  socket.disconnect();
  alert('logged out');
  router.push('/');
};
</script>

<template>
  <button type="button" class="m-2 rounded-md border-2 p-1" @click="handleLogout">log out</button>
</template>
