<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
        <h2 class="text-lg font-semibold mb-3 text-gray-800">Delete Payment Log</h2>
        <p class="text-sm text-gray-600">
          Are you sure you want to delete
          <strong>{{ payment?.name }}</strong
          >?
        </p>

        <div class="flex justify-end gap-2 pt-6">
          <button
            @click="onClose"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="onConfirm"
            class="px-4 py-2 text-sm text-white bg-red-500 rounded-xl"
          >
            Delete
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
  onConfirm: Function,
  payment: Object,
});
</script>
