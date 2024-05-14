<script setup>
import { ref, onMounted, nextTick, watch, TransitionGroup, computed } from 'vue';
import socket from '@/utils/clientSocket';
import getCurrentUser from '@/utils/getCurrentUser';
import { useChatStore } from '@/store/store';

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});

let currentUser = ref(null);
const chatStore = useChatStore();

const messages = computed(() => chatStore.getMessages(props.room));

onMounted(async () => {
  currentUser.value = await getCurrentUser();
  nextTick(() => {
    const chatDiv = document.querySelector('#chatDiv');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  });
});

watch(chatStore.$state, () => {
  nextTick(() => {
    const chatDiv = document.querySelector('#chatDiv');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  });
});

const sendMessage = (e) => {
  e.preventDefault();
  const message = e.target[0].value;
  if (props.room !== 'global') {
    socket.emit('roomChat', {
      message,
      username: currentUser.value,
      room: props.room,
      time: new Date().toLocaleTimeString()
    });
  } else {
    socket.emit('globalChat', {
      message,
      username: currentUser.value,
      time: new Date().toLocaleTimeString()
    });
  }
};

defineExpose({ TransitionGroup });
</script>

<template>
  <div class="border-2 rounded-md relative w-full h-full flex flex-col">
    <div class="flex-grow h-48 overflow-y-auto" id="chatDiv">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="data in messages"
          :key="data.messageData"
          class="p-2 border-b-2"
          :class="{
            'bg-[var(--myGreenColor)] text-white': data.messageData.username === currentUser,
            'text-white': data.messageData.username !== currentUser
          }"
        >
          <div
            class="flex flex-col"
            :class="{
              'items-end': data.messageData.username === currentUser,
              'items-start': data.messageData.username !== currentUser
            }"
          >
            <div class="flex justify-between w-full pb-1">
              <span>{{ data.messageData.username }}</span>
              <span>{{ data.messageData.time }}</span>
            </div>
            <hr class="w-full text-white pb-3" />
            <span>{{ data.messageData.message }}</span>
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

#chatDiv {
  background-color: var(--myBlackColor);
  scrollbar-width: thin;
  scrollbar-color: var(--myBlackColor) var(--myGreenColor);
}
</style>
