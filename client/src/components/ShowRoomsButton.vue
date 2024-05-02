<script setup>
import { inject } from 'vue'

let show = inject('show')

const showRooms = () => {
  show.value = !show.value
}
</script>

<template>
  <button type="button" class="border-2 rounded-md p-1 m-2" @click="showRooms">Rooms</button>
</template>
