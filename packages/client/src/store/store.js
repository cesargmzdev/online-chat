// src/store/index.js
import { defineStore } from 'pinia';

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    messages: JSON.parse(sessionStorage.getItem('messages')) || {}
  }),
  actions: {
    getMessages(room) {
      return this.messages[room] || [];
    },
    addMessage(room, message) {
      if (!this.messages[room]) {
        this.messages[room] = [];
      }
      this.messages[room].push(message);
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
    },
    clearMessages(room) {
      this.messages[room] = [];
      sessionStorage.setItem('messages', JSON.stringify(this.messages));
    },
    clearAllMessages() {
      this.messages = {};
      sessionStorage.removeItem('messages');
    }
  }
});
