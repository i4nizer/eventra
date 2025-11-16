<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-96">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">View Attendace</h2>

        <div class="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {{ attendance?.name }}</p>
          <p><strong>RFID Tag:</strong> {{ attendance?.tag }}</p>
          <p><strong>Activity:</strong> {{ attendance?.activity }}</p>
          <p><strong>Date:</strong> {{ attendance?.date }}</p>
        </div>

        <div class="flex justify-end pt-4">
          <button
            @click="onClose"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  onClose: Function,
  attendance: Object,
});
</script>
