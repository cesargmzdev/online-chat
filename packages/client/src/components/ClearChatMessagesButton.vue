<script setup>
import { useChatStore } from '@/store/store';

const props = defineProps({
  room: {
    type: String,
    default: ''
  }
});

const chatStore = useChatStore();

const clearChatMessages = () => {
  chatStore.clearMessages(props.room);
};
</script>

<template>
  <button class="m-2 rounded-md border-2 p-1" @click="clearChatMessages">Clear</button>
</template>
