<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-96">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Edit Student</h2>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name</label
            >
            <input
              v-model="name"
              type="text"
              class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >RFID Tag</label
            >
            <select
              v-model="rfid"
              class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select RFID tag</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Section</label
            >
            <select
              v-model="section"
              class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select section</option>
              <option v-for="s in sections" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="onClose"
              class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm text-white bg-green-500 rounded-xl"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  open: Boolean,
  onClose: Function,
  onUpdate: Function,
  student: Object,
  sections: Array,
  availableTags: Array,
});
const name = ref("");
const rfid = ref("");
const section = ref("");

watch(
  () => props.student,
  (s) => {
    if (s) {
      name.value = s.name;
      rfid.value = s.tag;
      section.value = s.section;
    }
  },
  { immediate: true }
);

function handleUpdate() {
  props.onUpdate({
    ...props.student,
    name: name.value,
    tag: rfid.value,
    section: section.value,
  });
}
</script>
