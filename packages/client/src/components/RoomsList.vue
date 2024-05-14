<script setup>
import { ref, computed, onMounted } from 'vue';
import socket from '@/utils/clientSocket';
import JoinRoomDialog from './JoinRoomDialog.vue';

const emit = defineEmits(['room-changed', 'unmount']);

const arrayRooms = ref([]);
const reversedArrayRooms = computed(() => [...arrayRooms.value].reverse());

onMounted(() => {
  socket.emit('listRooms');

  socket.on('roomCount', (rooms) => {
    arrayRooms.value = [...new Set([...arrayRooms.value, ...rooms])];
  });
});

const setRoom = (room) => {
  emit('room-changed', room);
  emit('unmount');
  alert(`room set to: ${room}`);
  console.log(`room changed to: ${room}`);
};

const showJoinRoomForm = ref(false);
const toggleJoinRoomForm = () => {
  showJoinRoomForm.value = !showJoinRoomForm.value;
};

const leaveAllAddedRooms = async () => {
  // Emit 'leaveRoom' event for each room
  const storedRooms = JSON.parse(sessionStorage.getItem('rooms') || '[]');
  await storedRooms.forEach(({ roomName, loggedUserToken, currentTime }) => {
    if (roomName === 'global') {
      return;
    }
    socket.emit('leaveRoom', roomName, loggedUserToken, currentTime);
  });

  // remove rooms from sessionStorage and UI except the first one (global room)
  sessionStorage.setItem('rooms', JSON.stringify([storedRooms[0]]));

  // Update arrayRooms.value after 'roomCount' event is received
  socket.on('roomCount', (rooms) => {
    arrayRooms.value = [...new Set([...rooms])];
  });
};
</script>

<template>
  <div class="w-full h-full grid place-items-center">
    <div class="flex w-full px-5 items-center justify-between">
      <h2 class="text-2xl text-[var(--myGreenColor)]">Rooms</h2>
      <button type="button" class="border-2 rounded-md p-1 m-2" @click="leaveAllAddedRooms">
        Leave all added rooms
      </button>
      <button type="button" class="border-2 rounded-md p-1 m-2" @click="toggleJoinRoomForm">
        Join Room
      </button>
    </div>
    <ul>
      <li v-for="room in reversedArrayRooms" :key="room">
        <button type="button" @click="setRoom(room)">{{ room }}</button>
      </li>
    </ul>
    <JoinRoomDialog :show="showJoinRoomForm" :toggle="toggleJoinRoomForm" />
  </div>
</template>
