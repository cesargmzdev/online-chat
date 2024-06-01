<script setup>
import socket from '@/utils/clientSocket';
import { ref, onUnmounted } from 'vue';
import { useChatStore } from '@/store/store';

const chatStore = useChatStore();

const showMessages = ref(false);

const newRoomNotificationHandler = (message) => {
  console.log('newRoomNotification', message);
  chatStore.incrementNotificationCount();
  chatStore.addNotificationMessage(message);
};

socket.on('newRoomNotification', newRoomNotificationHandler);

onUnmounted(() => {
  socket.off('newRoomNotification', newRoomNotificationHandler);
});

const deleteNotification = (index) => {
  const originalIndex = chatStore.notificationsMessages.length - 1 - index;
  console.log('deleteNotification', originalIndex);
  chatStore.deleteNotificationMessage(originalIndex);
};
</script>

<template>
  <div class="relative">
    <button type="button" class="relative" @click="showMessages = !showMessages">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="mr-1 size-7"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
      <span
        class="absolute right-0 top-0 rounded-full bg-white px-1 text-xs text-[var(--myBlackColor)]"
        >{{ chatStore.notificationCount }}</span
      >
    </button>
    <transition name="bubble">
      <div
        v-if="chatStore.notificationsMessages.length > 0 && showMessages"
        class="scrollbar notifications max-h-64 max-w-72 overflow-y-auto"
      >
        <ul>
          <li
            v-for="(message, index) in chatStore.notificationsMessages.slice().reverse()"
            :key="index"
            class="flex gap-x-10"
          >
            <p>{{ message }}</p>
            <span class="h-10 self-center border-l"></span>
            <button type="button" class="pr-7" @click="deleteNotification(index)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}

.scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--myBlackColor) var(--myGreenColor);
}

.notifications {
  position: absolute;
  top: 100%;
  right: 15px;
  width: 400px;
  background-color: var(--myBlackColor);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transform-origin: top right;
}

.notifications ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications li {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.notifications li:last-child {
  border-bottom: none;
}

.bubble-enter-active {
  animation: bubble-in 0.3s ease forwards;
}

.bubble-leave-active {
  animation: bubble-out 0.3s ease forwards;
}

@keyframes bubble-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bubble-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
