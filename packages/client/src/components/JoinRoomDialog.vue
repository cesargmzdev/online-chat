<script setup>
import { TransitionRoot, Dialog, DialogTitle, DialogPanel, TransitionChild } from '@headlessui/vue';
import { defineProps } from 'vue';
import socket from '@/utils/clientSocket';

const props = defineProps({
  show: Boolean,
  toggle: {
    type: Function,
    default: () => {}
  }
});

const time = new Date().toLocaleTimeString();

const joinRoom = (e) => {
  e.preventDefault();
  const user = e.target[0].value;
  const loggedUserToken = sessionStorage.getItem('jwt');
  socket.emit('joinRoom', user, loggedUserToken, time);

  // Remove old listeners
  socket.off('room');
  socket.off('error');

  socket.on('room', (room) => {
    console.log(room);
    alert(`${room} joined successfully!`);
    props.toggle();
  });
  socket.on('error', (error) => {
    console.log(error);
    alert(error);
  });
};
</script>

<template>
  <TransitionRoot as="template" :show="props.show">
    <Dialog class="relative z-10" @close="props.toggle">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <form @submit="joinRoom">
                <div class="bg-[var(--myBlackColor)] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <DialogTitle class="text-lg font-semibold text-white pb-3">Join Room</DialogTitle>
                  <input
                    type="text"
                    placeholder="Enter user to chat with"
                    class="w-full"
                    required
                  />
                </div>
                <div
                  class="bg-[var(--myBlackColor)] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 w-full justify-between"
                >
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md bg-[var(--myGreenColor)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-[white] px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="props.toggle"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>