<script setup>
import { ref, onMounted, nextTick, TransitionGroup } from 'vue';
import socket from '@/utils/clientSocket';
import getCurrentUser from '@/utils/getCurrentUser';
import { useChatStore } from '@/store/store';

let currentUser = ref(null);
let chatStore = useChatStore();

onMounted(async () => {
  currentUser.value = await getCurrentUser();
  nextTick(() => {
    const chatDiv = document.querySelector('#chatDiv');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  });
});

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});

const sendMessage = (e) => {
  e.preventDefault();
  const message = e.target[0].value;
  console.log(props.room);
  console.log(message);
  if (props.room !== 'global') {
    socket.emit('roomChat', {
      message,
      username: currentUser.value,
      room: props.room,
      time: new Date().toLocaleTimeString()
    });
    console.log(message, props.room, currentUser.value);
  } else {
    socket.emit('globalChat', {
      message,
      username: currentUser.value,
      time: new Date().toLocaleTimeString()
    });
  }
  // e.target.reset()
};

socket.on('globalChat', (data) => {
  chatStore.addMessage(data); // add message to the store
  console.log(data);

  nextTick(() => {
    const chatDiv = document.querySelector('#chatDiv');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  });
});

socket.on('roomChat', (data) => {
  chatStore.addMessage(data); // add message to the store
  console.log(`${data.message} from ${data.username}`);

  nextTick(() => {
    const chatDiv = document.querySelector('#chatDiv');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  });
});

defineExpose({ TransitionGroup });
</script>

<template>
  <div class="border-2 rounded-md relative w-full h-full flex flex-col">
    <div class="flex-grow h-48 overflow-y-scroll" id="chatDiv">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="data in chatStore.getMessages"
          :key="data.message"
          class="p-2 border-b-2"
          :class="{
            'bg-[var(--myGreenColor)] text-white': data.message.username === currentUser,
            'text-white': data.message.username !== currentUser
          }"
        >
          <div
            class="flex flex-col"
            :class="{
              'items-end': data.message.username === currentUser,
              'items-start': data.message.username !== currentUser
            }"
          >
            <div class="flex justify-between w-full pb-1">
              <span>{{ data.message.username }}</span>
              <span>{{ data.message.time }}</span>
            </div>
            <hr class="w-full text-white pb-3" />
            <span>{{ data.message.message }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <form class="flex justify-between" @submit="sendMessage">
      <input type="text" required class="flex-grow" />
      <button type="submit" class="px-4 rounded-md border-2">Send</button>
    </form>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
