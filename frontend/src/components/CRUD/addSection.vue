<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Add Section</h2>

      <div class="mb-3">
        <label class="text-sm text-gray-600">Name</label>
        <input
          type="text"
          v-model="localData.name"
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div class="mb-5">
        <label class="text-sm text-gray-600">Description</label>
        <textarea
          v-model="localData.description"
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          @click="submit"
        >
          Add
        </button>
      </div>
    </div>
  </div>
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
        description: "",
      },
    };
  },
  methods: {
    submit() {
      if (!this.localData.name) return;

      this.$emit("add", {
        name: this.localData.name,
        description: this.localData.description,
      });

      this.localData = { name: "", description: "" };
    },
  },
};
</script>
