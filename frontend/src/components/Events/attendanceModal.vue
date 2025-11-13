<template>
  <transition name="fade">
    <div
      v-if="event"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-[#27c08d] p-5 text-center rounded-t-2xl">
          <h2 class="text-2xl font-bold text-white">
            Attendance: {{ event.name }}
          </h2>
          <p class="text-gray-200 mt-1 text-sm">
            Section: {{ event.section }} | Date: {{ event.eventDate }}
          </p>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[70vh] overflow-y-auto text-gray-700 space-y-5">
          <p class="text-gray-600">
            Scanning students... ({{ scannedCount }}/{{ localStudents.length }})
          </p>
          <div
            class="w-12 h-12 border-4 border-[#a0e5d3] border-t-[#27c08d] rounded-full animate-spin mx-auto"
          ></div>

          <div class="flex justify-between border-b pb-3">
            <div>
              <p class="text-gray-600">Expected</p>
              <p class="font-semibold">{{ localStudents.length }}</p>
            </div>
            <div>
              <p class="text-[#27c08d]">Present</p>
              <p class="font-semibold text-[#27c08d]">
                {{ presentStudents.length }}
              </p>
            </div>
            <div>
              <p class="text-red-500">Absent</p>
              <p class="font-semibold text-red-500">
                {{ absentStudents.length }}
              </p>
            </div>
          </div>

          <div class="max-h-64 overflow-y-auto border rounded-xl p-3 space-y-1">
            <div
              v-for="student in localStudents"
              :key="student.id"
              class="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span
                :class="student.isPresent ? 'text-[#27c08d]' : 'text-red-500'"
              >
                {{ student.name }}
              </span>
              <span
                class="text-sm font-semibold"
                :class="student.isPresent ? 'text-[#27c08d]' : 'text-red-500'"
              >
                {{ student.isPresent ? "Present" : "Absent" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div
          class="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
        >
          <button
            class="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-300 transition font-medium"
            @click="$emit('close')"
          >
            Close
          </button>
          <button
            class="bg-[#27c08d] text-white px-5 py-2 rounded-xl hover:bg-[#1fa77a] transition font-medium"
            @click="endAttendance"
          >
            End Attendance
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";

const props = defineProps({
  event: Object,
  students: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["close", "update"]);

const scannedCount = ref(0);
const localStudents = reactive((props.students || []).map((s) => ({ ...s })));

const presentStudents = computed(() =>
  localStudents.filter((s) => s.isPresent)
);
const absentStudents = computed(() =>
  localStudents.filter((s) => !s.isPresent)
);

onMounted(() => {
  simulateRFIDScan();
});

function simulateRFIDScan() {
  let index = 0;
  const interval = setInterval(() => {
    if (index >= localStudents.length) {
      clearInterval(interval);
      return;
    }
    localStudents[index].isPresent = Math.random() > 0.3;
    scannedCount.value = index + 1;
    index++;
  }, 1000);
}

function endAttendance() {
  emit("update", localStudents);
  emit("close");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
