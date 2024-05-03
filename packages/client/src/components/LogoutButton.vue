<script setup>
import router from '@/router';
import socket from '@/utils/clientSocket.js';

const handleLogout = () => {
  sessionStorage.removeItem('jwt');
  alert('logged out');
  socket.disconnect();
  console.log('disconnected from socket server');
  router.push('/');
};
</script>

<template>
  <button type="button" class="border-2 rounded-md p-1 m-2" @click="handleLogout">log out</button>
</template>
