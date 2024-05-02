// src/store/index.js
import { defineStore } from 'pinia'

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    messages: []
  }),
  getters: {
    getMessages() {
      return this.messages
    }
  },
  actions: {
    addMessage(message) {
      this.messages.push(message)
    }
  }
})
