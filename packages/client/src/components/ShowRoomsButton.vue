<script setup>
import { inject } from 'vue';

let show = inject('show');

const showRooms = () => {
  show.value = !show.value;
};
</script>

<template>
  <button type="button" class="m-2 rounded-md border-2 p-1" @click="showRooms">Rooms</button>
</template>
