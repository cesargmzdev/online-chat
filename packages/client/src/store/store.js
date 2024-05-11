// src/store/index.js
import { defineStore } from 'pinia';

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    messages: JSON.parse(sessionStorage.getItem('messages')) || []
  }),
  getters: {
    getMessages() {
      return this.messages;
    }
  },
  actions: {
    addMessage(message) {
      this.messages.push(message);
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
    },
    clearMessages() {
      this.messages = [];
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
    }
  }
});
