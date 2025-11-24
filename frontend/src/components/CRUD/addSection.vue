<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-form">
        <div class="modal-header-inline">
          <h2 class="modal-title">Add Section</h2>
          <button class="close-btn" @click="$emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body-simple">
          <div style="margin-bottom: 1rem">
            <label class="input-label">Name</label>
            <input
              type="text"
              v-model="localData.name"
              placeholder="Enter section name"
              class="input-field"
            />
          </div>

          <div style="margin-bottom: 1.5rem">
            <label class="input-label">Year</label>
            <input
              min="1"
              max="4"
              type="number"
              v-model="localData.year"
              placeholder="Enter year (1-4)"
              class="input-field"
            />
          </div>
        </div>

        <div class="modal-footer-inline">
          <button class="btn-close" @click="$emit('close')">
            Cancel
          </button>
          <button class="btn-submit" @click="submit">
            Add
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "AddSectionModal",
  props: {
    show: Boolean,
  },
  data() {
    return {
      localData: {
        name: "",
        year: 1,
      },
    };
  },
  methods: {
    submit() {
      if (!this.localData.name) return;

      this.$emit("add", {
        name: this.localData.name,
        year: this.localData.year,
      });

      this.localData = { name: "", year: 1 };
    },
  },
};
</script>

<style scoped>
/* No custom styles needed - all using global CSS */
</style>