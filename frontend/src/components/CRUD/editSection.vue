<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="handleClose">
      <div class="modal-form">
        <!-- Header -->
        <div class="modal-header-inline">
          <h2 class="modal-title with-icon">
            <i class="fa-solid fa-pen-to-square"></i>
            Edit Section
          </h2>
          <button class="close-btn" @click="handleClose">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit">
          <!-- Section Name -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Section Name</label>
            <input
              v-model="form.sectionName"
              type="text"
              class="input-field"
              :class="{ 'input-error': errors.sectionName }"
              placeholder="Enter section name"
            />
            <p v-if="errors.sectionName" class="error-message">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errors.sectionName }}
            </p>
          </div>

          <!-- Year Level -->
          <div style="margin-bottom: 1rem">
            <label class="input-label">Year Level</label>
            <select
              v-model="form.yearLevel"
              class="input-field select-input"
              :class="{ 'input-error': errors.yearLevel }"
              style="width: 100%"
            >
              <option value="" disabled>Select year level</option>
              <option
                v-for="level in yearLevels"
                :key="level.value"
                :value="level.value"
              >
                {{ level.label }}
              </option>
            </select>
            <p v-if="errors.yearLevel" class="error-message">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errors.yearLevel }}
            </p>
          </div>

          <!-- Error Banner -->
          <div v-if="submitError" class="error-message-banner">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{ submitError }}
          </div>

          <!-- Footer -->
          <div class="modal-footer-inline">
            <button type="button" class="btn-close" @click="handleClose">
              Cancel
            </button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "EditSectionModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    section: {
      type: Object,
      default: () => ({
        id: null,
        name: "",
        year: "",
      }),
    },
    yearLevels: {
      type: Array,
      required: true,
    },
  },
  emits: ["close", "submit"],
  data() {
    return {
      form: {
        sectionName: "",
        yearLevel: "",
      },
      errors: {
        sectionName: "",
        yearLevel: "",
      },
      submitError: "",
      isSubmitting: false,
    };
  },
  watch: {
    section: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form.sectionName = val.name || "";
          this.form.yearLevel = val.year ? String(val.year) : "";
        } else {
          this.form.sectionName = "";
          this.form.yearLevel = "";
        }
      },
    },
    show(val) {
      if (val) {
        this.resetErrors();
      }
    },
  },
  methods: {
    resetErrors() {
      this.errors.sectionName = "";
      this.errors.yearLevel = "";
      this.submitError = "";
    },
    validate() {
      this.resetErrors();
      let isValid = true;

      if (!this.form.sectionName.trim()) {
        this.errors.sectionName = "Section name is required";
        isValid = false;
      }

      if (!this.form.yearLevel) {
        this.errors.yearLevel = "Year level is required";
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validate()) return;

      this.isSubmitting = true;
      try {
        this.$emit("submit", {
          id: this.section.id,
          name: this.form.sectionName,
          year: parseInt(this.form.yearLevel, 10),
        });
      } catch {
        this.submitError = "Failed to update section. Please try again.";
      } finally {
        this.isSubmitting = false;
      }
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
