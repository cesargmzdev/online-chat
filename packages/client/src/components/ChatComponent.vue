<script setup>
import { ref, onMounted, nextTick, watch, TransitionGroup, computed } from 'vue';
import socket from '@/utils/clientSocket';
import getCurrentUser from '@/utils/getCurrentUser';
import { useChatStore } from '@/store/store';
import DownloadIcon from '@/components/icons/DownloadIcon.vue';

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});

const currentUser = ref(null);
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

const fileUrl = ref(null);

const sendMessage = (e) => {
  e.preventDefault();
  const message = e.target[0].value;
  const data = {
    message,
    username: currentUser.value,
    time: new Date().toLocaleTimeString()
  };
  if (fileUrl.value) {
    data.fileUrl = fileUrl.value;
    data.fileName = e.target[1].files[0].name;
  }
  if (props.room !== 'global') {
    data.room = props.room;
    socket.emit('roomChat', data);
  } else {
    socket.emit('globalChat', data);
  }
  // Reset the fileUrl ref
  fileUrl.value = null;
};

const disabled = ref(false);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const blobUrl = URL.createObjectURL(new Blob([e.target.result]));
      // Store the blobUrl in a ref to be used when sending the message
      fileUrl.value = blobUrl;
      // Disable the text input
      disabled.value = true;
    };
    reader.readAsArrayBuffer(file);
  } else {
    // If no file is selected (i.e., the user has removed the file), enable the text input
    disabled.value = false;
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
            <div
              v-if="data.messageData.fileName"
              class="flex gap-5"
              :class="{ 'flex-row-reverse': data.messageData.username === currentUser }"
            >
              <span>{{ data.messageData.fileName }}</span>
              <a :href="data.messageData.fileUrl" :download="data.messageData.fileName"
                ><DownloadIcon
              /></a>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <form class="flex justify-between" @submit="sendMessage">
      <input type="text" :disabled="disabled" required class="flex-grow" />
      <input type="file" ref="inputFile" @change="handleFileUpload" />
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
