// src/store/index.js
import { defineStore } from 'pinia';

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    messages: JSON.parse(sessionStorage.getItem('messages')) || {},
    notificationCount: JSON.parse(sessionStorage.getItem('notificationCount')) || 0,
    notificationsMessages: JSON.parse(sessionStorage.getItem('notificationsMessages')) || []
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
    },

    incrementNotificationCount() {
      this.notificationCount++;
      sessionStorage.setItem('notificationCount', JSON.stringify(this.notificationCount));
    },

    decrementNotificationCount() {
      this.notificationCount--;
      sessionStorage.setItem('notificationCount', JSON.stringify(this.notificationCount));
    },

    addNotificationMessage(message) {
      this.notificationsMessages.push(message);
      sessionStorage.setItem('notificationsMessages', JSON.stringify(this.notificationsMessages));
    },

    deleteNotificationMessage(key) {
      this.notificationsMessages.splice(key, 1);
      this.decrementNotificationCount();
      sessionStorage.setItem('notificationsMessages', JSON.stringify(this.notificationsMessages));
    },

    clearAllNotifications() {
      this.notificationsMessages = [];
      this.notificationCount = 0;
      sessionStorage.removeItem('notificationsMessages');
      sessionStorage.removeItem('notificationCount');
    }
  }
});
