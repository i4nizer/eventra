<template>
  <div v-if="open" class="modal-backdrop-simple">
    <div class="modal-backdrop" @click="onClose"></div>

    <form @submit.prevent="handleSubmit" class="modal-form scrollable">
      <header class="modal-header-inline">
        <div>
          <h3 class="modal-title">Update Student</h3>
          <p class="modal-subtitle">Update the student's information.</p>
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

        <!-- RFID Input only -->
        <div>
          <label class="input-label">RFID</label>
          <input
            v-model="rfid"
            class="input-field"
            :class="{ 'input-error': errors.rfid }"
            placeholder="e.g. 1234567890"
          />
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
              {{ s.name }} {{ formatYear(s.year) }}
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
        <button
          type="button"
          @click="onClose"
          class="btn-cancel"
          :disabled="submitting"
        >
          Cancel
        </button>
        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "Updating..." : "Update Student" }}
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
  onUpdate: Function,
  student: Object,
  sections: { type: Array, default: () => [] },
  availableTags: { type: Array, default: () => [] },
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
      sid.value = props.student?.sid || "";
      rfid.value = props.student?.rfid || "";
      name.value = props.student?.name || "";
      email.value = props.student?.email || "";
      sectionId.value = props.student?.sectionId || "";
      photo.value = null;
      photoPreview.value = props.student?.photoUrl || "";
      errors.value = {};
      submitting.value = false;
    }
  }
);

function formatYear(year) {
  const y = parseInt(year);
  const lastDigit = y % 10;
  const lastTwoDigits = y % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return y + "th year";

  switch (lastDigit) {
    case 1:
      return y + "st year";
    case 2:
      return y + "nd year";
    case 3:
      return y + "rd year";
    default:
      return y + "th year";
  }
}

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
  if (photo.value) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(photo.value.type)) {
      err.photo = "Please select a JPG, JPEG or PNG image.";
    }
    if (photo.value.size > 5 * 1024 * 1024) {
      err.photo = "Image size should not exceed 5MB.";
    }
  }
  if (!sectionId.value) err.sectionId = "Please select a section.";
  return err;
}

async function handleSubmit() {
  const err = validate();
  errors.value = err;
  if (Object.keys(err).length) return;
  submitting.value = true;

  const payload = new FormData();
  payload.append("sid", sid.value.trim());
  payload.append("rfid", rfid.value.trim());
  payload.append("name", name.value.trim());
  payload.append("email", email.value.trim());
  payload.append("sectionId", sectionId.value);
  if (photo.value) {
    payload.append("photo", photo.value);
  }

  try {
    if (props.onUpdate) await props.onUpdate({ id: props.student.id, payload });
    submitting.value = false;
    props.onClose && props.onClose();
  } catch (e) {
    submitting.value = false;
    errors.value.submit = e.message || "Failed to update student";
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

/* Remove Photo Button */
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
