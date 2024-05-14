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
  <button class="border-2 rounded-md p-1 m-2" @click="clearChatMessages">Clear</button>
</template>
