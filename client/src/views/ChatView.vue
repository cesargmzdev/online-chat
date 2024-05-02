<script setup>
import { ref, provide } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import ChatViewHeader from '@/components/ChatViewHeader.vue'
import RoomsList from '@/components/RoomsList.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import ChatComponent from '@/components/ChatComponent.vue'

let show = ref(false)
provide('show', show)

let currentRoom = ref('global')
</script>

<template>
  <div class="h-dvh w-dvw flex flex-col">
    <HeaderComponent customClasses="pt-6" />
    <ChatViewHeader />
    <main class="flex-grow mb-2">
      <RoomsList v-if="show" @room-changed="currentRoom = $event" />
      <ChatComponent v-else :room="currentRoom" />
    </main>
    <FooterComponent />
  </div>
</template>
