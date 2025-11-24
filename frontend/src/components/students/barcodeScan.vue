<template>
  <div
    class="stat-root shadow-lg rounded-lg p-4 flex flex-col items-center gap-4 w-full max-w-sm"
  >
    <div class="text-xs text-muted mt-1">Quick Find Using Barcode</div>
    <div class="icon-box" aria-hidden="true">
      <i class="fa-solid fa-barcode text-3xl"></i>
    </div>

    <button
      v-if="!isScanning"
      @click="startScan"
      class="btn-submit px-6 py-2 text-lg font-semibold flex items-center gap-3"
      type="button"
    >
      <i class="fa-solid fa-barcode"></i>
      Scan Barcode
    </button>

    <div v-else class="w-full">
      <input
        ref="barcodeInput"
        v-model="barcode"
        type="text"
        placeholder="Enter student barcode or ID..."
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="loading"
        @keydown.enter.prevent="searchBarcode"
        autofocus
      />

      <div class="flex gap-2 mt-3 w-full">
        <button
          @click="cancelScan"
          :disabled="loading"
          class="flex-1 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          type="button"
        >
          Cancel
        </button>
        <button
          @click="searchBarcode"
          :disabled="loading || !barcode.trim()"
          class="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          Search
        </button>
      </div>

      <div v-if="loading" class="mt-4 text-center text-muted">
        <i class="fa-solid fa-spinner fa-spin text-xl"></i>
      </div>
    </div>

    <!-- Modal Popup for Student Info -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="modal-backdrop-simple"
        @click.self="closeModal"
      >
        <div class="modal-simple max-w-md">
          <header class="modal-header-inline">
            <h2 class="modal-title-simple modal-title-center">
              Student Information
            </h2>
            <button
              @click="closeModal"
              class="close-btn"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </header>

          <div class="modal-content mt-4 flex flex-col items-center gap-4">
            <div
              class="photo-preview-container w-32 h-32 rounded-full overflow-hidden shadow-md"
            >
              <img
                :src="studentInfo.photoUrl || defaultPhoto"
                alt="Student Photo"
                class="preview-img w-full h-full object-cover"
              />
            </div>

            <div class="w-full text-left space-y-3">
              <p class="info-label">Student ID</p>
              <p class="info-value">{{ studentInfo.id }}</p>

              <p class="info-label">Name</p>
              <p class="info-value">{{ studentInfo.name }}</p>

              <p class="info-label">Class</p>
              <p class="info-value">{{ studentInfo.class }}</p>

              <p class="info-label">Current Balance</p>
              <p class="info-value balance">
                ₱ {{ studentInfo.balance.toFixed(2) }}
              </p>
            </div>
          </div>

          <footer class="modal-footer-inline modal-footer-center mt-6">
            <button
              @click="closeModal"
              class="btn-close btn-submit px-6 py-2 rounded"
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- Modal Popup for Not Found -->
    <transition name="fade">
      <div
        v-if="showNotFoundModal"
        class="modal-backdrop-simple"
        @click.self="closeNotFoundModal"
      >
        <div class="modal-simple max-w-md">
          <header class="modal-header-inline">
            <h2 class="modal-title-simple modal-title-center text-red-600">
              Student Not Found
            </h2>
            <button
              @click="closeNotFoundModal"
              class="close-btn"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </header>

          <div
            class="modal-content mt-4 text-center text-red-600 font-semibold"
          >
            Sorry, no student was found matching the provided barcode or ID.
          </div>

          <footer class="modal-footer-inline modal-footer-center mt-6">
            <button
              @click="closeNotFoundModal"
              class="btn-close btn-submit px-6 py-2 rounded"
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useApi } from "@/composables/api";
import { ref, nextTick } from "vue";

//

const props = defineProps({
  students: { type: Array, default: () => [] },
  sections: { type: Array, default: () => [] },
})

//

const { api, token } = useApi()
const barcode = ref("");
const loading = ref(false);
const studentInfo = ref(null);
const searched = ref(false);
const isScanning = ref(false);
const showModal = ref(false);
const showNotFoundModal = ref(false);

const defaultPhoto = "/default-profile.png";

const barcodeInput = ref(null);

const startScan = async () => {
  isScanning.value = true;
  barcode.value = "";
  studentInfo.value = null;
  searched.value = false;
  showModal.value = false;
  showNotFoundModal.value = false;
  await nextTick();
  if (barcodeInput.value) {
    barcodeInput.value.focus();
  }
};

const cancelScan = () => {
  isScanning.value = false;
  barcode.value = "";
  studentInfo.value = null;
  searched.value = false;
  loading.value = false;
  showModal.value = false;
  showNotFoundModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  isScanning.value = false;
  barcode.value = "";
  studentInfo.value = null;
};

const closeNotFoundModal = () => {
  showNotFoundModal.value = false;
  isScanning.value = false;
  barcode.value = "";
};

const searchBarcode = async () => {
  if (!barcode.value.trim()) return;
  loading.value = true;
  studentInfo.value = null;
  searched.value = false;
  showModal.value = false;
  showNotFoundModal.value = false;

  const student = props.students.find((s) => s.rfid == barcode.value)
  const section = props.sections.find((s) => s.id == student?.sectionId)

  if (!student) {
    studentInfo.value = null
    showNotFoundModal.value = true
    loading.value = false
    searched.value = true
    return
  }

  const balance = await api.get(`/section/${student.sectionId}/student/${student.id}/balance`)
    .then((res) => res.data?.balance)
    .catch(() => 0)
  const photoUrl = `${location.protocol}//${location.hostname}:4000/uploads/photo/${student.photo}?token=${token}`

  studentInfo.value = {
    id: student.sid,
    name: student.name,
    class: `${section?.year}-${section?.name}`,
    balance,
    photoUrl: !student.photo ? "" : photoUrl,
  };

  loading.value = false
  searched.value = true
  showModal.value = true;
};
</script>

<style scoped>
.stat-root {
  max-width: 24rem;
  min-height: 12rem;
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 0.5rem;
}

.icon-box {
  color: var(--accent);
}

.btn-submit {
  background-color: var(--accent);
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #1e40af;
}

.stat-count {
  font-size: 1.125rem;
}

.text-muted {
  color: var(--muted);
}

.info-label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--accent);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.balance {
  color: #16a34a; /* green accent */
  font-weight: 700;
  font-size: 1.25rem;
}

/* Modal styles from modal.css can be used, but scoped styles added here as fallback */

.modal-backdrop-simple {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-simple {
  background: var(--bg);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 28rem;
  border: 1px solid var(--border);
  color: var(--text);
  display: flex;
  flex-direction: column;
}

.modal-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--muted);
  transition: color 0.2s ease;
  padding: 0;
}

.close-btn:hover {
  color: var(--accent);
}

.modal-title-simple {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  flex-grow: 1;
  user-select: none;
}

.modal-content {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.photo-preview-container {
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  background: var(--bg);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-footer-inline {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.btn-close {
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  background-color: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-close:hover {
  background-color: #1e40af;
}

/* Fade transition for modals */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Make Cancel and Search buttons share full width equally */
.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

.flex-1 {
  flex: 1 1 0%;
}
</style>
