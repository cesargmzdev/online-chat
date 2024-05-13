<script setup>
import router from '@/router';
import socket from '@/utils/clientSocket.js';

const handleLogout = () => {
  const storedRooms = JSON.parse(sessionStorage.getItem('rooms') || '[]');
  storedRooms.forEach(({ roomName, loggedUserToken, currentTime }) => {
    if (roomName === 'global') {
      return;
    }
    socket.emit('leaveRoom', roomName, loggedUserToken, currentTime);
  });
  sessionStorage.removeItem('rooms');
  sessionStorage.removeItem('messages');
  sessionStorage.removeItem('jwt');
  socket.disconnect();
  console.log('disconnected from socket server');
  alert('logged out');
  router.push('/');
};
</script>

<template>
  <button type="button" class="border-2 rounded-md p-1 m-2" @click="handleLogout">log out</button>
</template>
