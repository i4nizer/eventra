<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <form @submit.prevent="handleSubmit" class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title">Create Student</h3>
          <p class="modal-subtitle">Add a new student to the system.</p>
        </div>
        <button type="button" @click="onClose" class="close-btn">
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

      <!-- Form content -->
       <div class="space-y-4">
        <div>
          <label class="input-label">Student ID</label>
          <input
            v-model="sid"
            class="input-field"
            :class="{ 'input-error': errors.sid }"
            placeholder="e.g. 2024-00001"
            autofocus
          />
          <p v-if="errors.sid" class="error-message">{{ errors.sid }}</p>
        </div>

        <!-- RFID Input + Available Tag Selector -->
        <div>
          <label class="input-label">RFID</label>
          <div class="flex gap-2">
            <input
              v-model="rfid"
              class="input-field flex-1"
              :class="{ 'input-error': errors.rfid }"
              placeholder="e.g. 1234567890"
            />

            <select
              v-if="availableTags && availableTags.length"
              v-model="rfid"
              class="input-field w-40"
            >
              <option value="">Select tag</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          <p v-if="errors.rfid" class="error-message">{{ errors.rfid }}</p>
        </div>

        <div>
          <label class="input-label">Name</label>
          <input
            v-model="name"
            class="input-field"
            :class="{ 'input-error': errors.name }"
            placeholder="e.g. Juan Dela Cruz"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <div>
          <label class="input-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            :class="{ 'input-error': errors.email }"
            placeholder="e.g. student@example.com"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <!-- Photo Upload -->
        <div>
          <label class="input-label">Photo</label>
          <div
            class="file-upload-box"
            :class="{ 'has-error': errors.photo }"
            @click="triggerFileInput"
          >
            <input
              type="file"
              ref="photoInput"
              @change="handlePhotoChange"
              accept="image/jpeg,image/jpg,image/png"
              style="display: none"
            />

            <div v-if="photoPreview" class="photo-preview-container">
              <img
                :src="photoPreview"
                alt="Photo preview"
                class="preview-img"
              />
            </div>

            <div v-else class="upload-placeholder">
              <div class="plus-sign">+</div>
              <p class="upload-label">Upload Photo</p>
            </div>
          </div>

          <!-- ✅ New persistent remove button -->
          <div v-if="photoPreview" class="mt-2 flex justify-end">
            <button
              type="button"
              @click.stop="removePhoto"
              class="btn-remove-photo"
            >
              Remove Photo
            </button>
          </div>

          <p v-if="errors.photo" class="error-message">{{ errors.photo }}</p>
        </div>

        <div>
          <label class="input-label">Section</label>
          <select
            v-if="sections && sections.length"
            v-model="sectionId"
            class="input-field"
            :class="{ 'input-error': errors.sectionId }"
          >
            <option value="">Select a section</option>
            <option v-for="s in sections" :key="s.id" :value="s.id">
              {{ s.label }}
            </option>
          </select>
          <input
            v-else
            v-model="sectionId"
            placeholder="e.g. 1"
            class="input-field"
            :class="{ 'input-error': errors.sectionId }"
          />
          <p v-if="errors.sectionId" class="error-message">
            {{ errors.sectionId }}
          </p>
        </div>

        <p v-if="errors.submit" class="error-message-submit">
          {{ errors.submit }}
        </p>
      </div>
      
      <footer class="modal-footer-inline">
        <button type="button" @click="onClose" class="btn-cancel" :disabled="submitting">
          Cancel
        </button>
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "Creating..." : "Create Student" }}
        </button>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: Boolean,
  onClose: Function,
  onCreate: Function,
  sections: { type: Array, default: () => [] },
  availableTags: { type: Array, default: () => [] }, // ✅ added
});

const sid = ref("");
const rfid = ref("");
const name = ref("");
const email = ref("");
const photo = ref(null);
const photoPreview = ref("");
const photoInput = ref(null);
const sectionId = ref("");
const errors = ref({});
const submitting = ref(false);

watch(
  () => props.open,
  (val) => {
    if (val) {
      sid.value = "";
      rfid.value = "";
      name.value = "";
      email.value = "";
      photo.value = null;
      photoPreview.value = "";
      sectionId.value = "";
      errors.value = {};
      submitting.value = false;
    }
  }
);

function triggerFileInput() {
  if (photoInput.value) {
    photoInput.value.click();
  }
}

function handlePhotoChange(event) {
  const file = event.target.files[0];
  if (file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      errors.value.photo = "Please select a JPG, JPEG or PNG image.";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.value.photo = "Image size should not exceed 5MB.";
      return;
    }

    photo.value = file;
    errors.value.photo = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  photo.value = null;
  photoPreview.value = "";
  if (photoInput.value) {
    photoInput.value.value = "";
  }
}

function validate() {
  const err = {};
  if (!sid.value.trim()) err.sid = "Student ID is required.";
  if (!rfid.value.trim()) err.rfid = "RFID is required.";
  if (!name.value.trim()) err.name = "Name is required.";
  if (!email.value.trim()) {
    err.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    err.email = "Please enter a valid email address.";
  }
  if (!photo.value) err.photo = "Photo is required.";
  if (!sectionId.value) err.sectionId = "Please select a section.";
  return err;
}

async function handleSubmit() {
  const err = validate();
  errors.value = err;
  if (Object.keys(err).length) return;
  submitting.value = true;

  const payload = {
    sid: sid.value.trim(),
    rfid: rfid.value.trim(),
    name: name.value.trim(),
    email: email.value.trim(),
    photo: photo.value,
    sectionId: sectionId.value,
  };

  try {
    if (props.onCreate) await props.onCreate(payload);
    submitting.value = false;
    props.onClose && props.onClose();
  } catch (e) {
    submitting.value = false;
    errors.value.submit = e.message || "Failed to create student";
  }
}
</script>

<style scoped>
.file-upload-box {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 0.5rem;
  border: 2px dashed var(--border);
  background: var(--surface);
  transition: all 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.file-upload-box:hover {
  border-color: var(--accent);
  background: var(--bg);
}

.file-upload-box.has-error {
  border-color: #ef4444;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
}

.plus-sign {
  font-size: 4rem;
  font-weight: 300;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.upload-label {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

.photo-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* ✅ New Remove Photo Button */
.btn-remove-photo {
  font-size: 0.875rem;
  color: #ef4444;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}

.btn-remove-photo:hover {
  text-decoration: underline;
}

</style>
