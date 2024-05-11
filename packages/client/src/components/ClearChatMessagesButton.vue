<script setup>
import { useChatStore } from '@/store/store';

const chatStore = useChatStore();

const clearChatMessages = () => {
  chatStore.clearMessages();
};
</script>

<template>
  <button class="border-2 rounded-md p-1 m-2" @click="clearChatMessages">Clear</button>
</template>
