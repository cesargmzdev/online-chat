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
  alert('All added rooms cleared');
};

const newRoomAdded = () => {
  const roomsListUl = document.querySelector('#roomsListUl');
  roomsListUl.scrollTop = roomsListUl.scrollHeight;
};
</script>

<template>
  <div class="grid h-full w-full place-items-center">
    <div class="flex w-full items-center justify-between px-5">
      <h2 class="text-2xl text-[var(--myGreenColor)]">Rooms</h2>
      <button type="button" class="m-2 rounded-md border-2 p-1" @click="leaveAllAddedRooms">
        Leave all added rooms
      </button>
      <button type="button" class="m-2 rounded-md border-2 p-1" @click="toggleJoinRoomForm">
        Join Room
      </button>
    </div>
    <transition-group
      name="list"
      id="roomsListUl"
      tag="ul"
      class="scrollbar max-h-[70%] w-full overflow-y-auto overflow-x-hidden"
      @change="newRoomAdded"
    >
      <li
        v-for="(room, index) in reversedArrayRooms"
        :key="room"
        class="list-item flex-col gap-4 py-4"
        :style="{ 'animation-delay': `${index * 0.15}s` }"
      >
        <button type="button" @click="setRoom(room)" class="text-lg">
          {{ room }}
        </button>
        <hr
          v-if="
            reversedArrayRooms.length > 1 &&
            room !== reversedArrayRooms[reversedArrayRooms.length - 1]
          "
          class="mt-3 flex w-1/3 self-center"
        />
      </li>
    </transition-group>
    <JoinRoomDialog :show="showJoinRoomForm" :toggle="toggleJoinRoomForm" />
  </div>
</template>

<style scoped>
.scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--myBlackColor) var(--myGreenColor);
}
.list-item {
  position: relative;
  display: flex;
  animation: fadeIn 0.5s linear both;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    top: 100px;
  }
  75% {
    opacity: 0.5;
    top: 0px;
  }
  100% {
    opacity: 1;
  }
}
</style>
