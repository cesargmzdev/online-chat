<script setup>
import { ref } from 'vue'
import socket from '@/utils/clientSocket'

let showForm = ref(true)
const time = new Date().toLocaleTimeString()

const joinRoom = (e) => {
  e.preventDefault()
  const user = e.target[0].value
  const loggedUserToken = sessionStorage.getItem('jwt')
  socket.emit('joinRoom', user, loggedUserToken, time)
  socket.on('room', (room) => {
    console.log(room)
    alert(`You joined room: ${room}`)
  })
  showForm.value = false
}
</script>

<template>
  <form v-if="showForm" @submit="joinRoom" class="absolute z-10 flex flex-col">
    <input type="text" placeholder="Enter user to chat with" required />
    <button type="submit">Join Room</button>
  </form>
</template>
