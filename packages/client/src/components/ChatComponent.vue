<script setup>
import { ref, onMounted, nextTick, watch, TransitionGroup, computed } from 'vue';
import socket from '@/utils/clientSocket';
import getCurrentUser from '@/utils/getCurrentUser';
import { useChatStore } from '@/store/store';
import DownloadIcon from '@/assets/icons/DownloadIcon.vue';

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});

const currentUser = ref(null);
const chatStore = useChatStore();

const messageRequired = ref(true);
const fileRequired = ref(true);

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
    data.fileUrl = fileUrl.value.url;
    data.fileType = fileUrl.value.type;
    // Check if a file is selected before trying to access its name property
    if (e.target[1].files[0]) {
      data.fileName = e.target[1].files[0].name;
    }
  }
  if (props.room !== 'global') {
    data.room = props.room;
    socket.emit('roomChat', data);
  } else {
    socket.emit('globalChat', data);
  }
  // Reset the fileUrl ref
  // fileUrl.value = null;
};

const inputTextChanges = (e) => {
  if (e.target.value !== '') {
    fileRequired.value = false;
  } else {
    fileRequired.value = true;
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    messageRequired.value = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      const blobUrl = URL.createObjectURL(new Blob([e.target.result]));
      // Store the blobUrl and file type in a ref to be used when sending the message
      fileUrl.value = { url: blobUrl, type: file.type };
      // Disable the text input
    };
    reader.readAsArrayBuffer(file);
  } else {
    messageRequired.value = true;
  }
};

defineExpose({ TransitionGroup });
</script>

<template>
  <div class="relative flex h-full w-full flex-col rounded-md border-2">
    <div class="h-48 flex-grow overflow-y-auto" id="chatDiv">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="data in messages"
          :key="data.messageData"
          class="m-1 w-fit max-w-[50%] break-all rounded-bl-2xl rounded-tr-2xl border-b-2 p-2"
          :class="{
            'ml-auto bg-[var(--myGreenColor)] text-black':
              data.messageData.username === currentUser,
            'mr-auto border text-white': data.messageData.username !== currentUser
          }"
        >
          <div
            class="flex flex-col"
            :class="{
              'items-end': data.messageData.username === currentUser,
              'items-start': data.messageData.username !== currentUser
            }"
          >
            <div class="flex w-full justify-between gap-3 pb-1">
              <span>{{ data.messageData.username }}</span>
              <span>{{ data.messageData.time }}</span>
            </div>
            <hr class="w-full pb-3 text-white" />
            <span v-if="!data.messageData.fileName">
              {{ data.messageData.message }}
            </span>
            <div
              v-if="data.messageData.fileName"
              class="flex items-center gap-5"
              :class="{ 'flex-row-reverse': data.messageData.username !== currentUser }"
            >
              <a :href="data.messageData.fileUrl" :download="data.messageData.fileName">
                <DownloadIcon />
              </a>
              <span
                v-if="data.messageData.fileName && !data.messageData.fileType.startsWith('image/')"
                >{{ data.messageData.fileName }}
              </span>
              <img
                v-if="data.messageData.fileType && data.messageData.fileType.startsWith('image/')"
                :src="data.messageData.fileUrl"
                alt="Image preview"
                class="h-20 w-20 object-cover"
              />
            </div>
            <span v-if="data.messageData.fileName" class="pt-2">{{
              data.messageData.message
            }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <form class="flex justify-between" @submit="sendMessage">
      <input type="text" @change="inputTextChanges" :required="messageRequired" class="flex-grow" />
      <input type="file" @change="handleFileUpload" :required="fileRequired" />
      <button type="submit" class="rounded-md border-2 px-4">Send</button>
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
