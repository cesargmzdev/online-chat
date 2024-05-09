<script setup>
import { ref } from 'vue';
import socket from '@/utils/clientSocket';
import JoinRoomDialog from './JoinRoomDialog.vue';

const arrayRooms = ref([]);

socket.emit('listRooms');
socket.on('roomCount', (rooms) => {
  if (rooms.length <= 0) {
    arrayRooms.value = ['No rooms'];
    console.log(arrayRooms.value);
  } else {
    arrayRooms.value = rooms;
  }
});

const currentRoom = ref('global');

const emit = defineEmits(['room-changed']);

const setRoom = (room) => {
  currentRoom.value = room;
  emit('room-changed', room);
  console.log(room);
};

const showJoinRoomForm = ref(true);
const toggleJoinRoomForm = () => {
  showJoinRoomForm.value = !showJoinRoomForm.value;
};
</script>

<template>
  <div class="w-full h-full grid place-items-center">
    <div class="flex w-full px-5 items-center justify-between">
      <h2 class="text-2xl text-[var(--myGreenColor)]">Rooms</h2>
      <button type="button" class="border-2 rounded-md p-1 m-2" @click="toggleJoinRoomForm">
        Join Room
      </button>
    </div>
    <ul>
      <li v-for="room in arrayRooms" :key="room">
        <button type="button" @click="setRoom(room)">{{ room }}</button>
      </li>
    </ul>
    <JoinRoomDialog :show="showJoinRoomForm" :toggle="toggleJoinRoomForm" />
  </div>
</template>
