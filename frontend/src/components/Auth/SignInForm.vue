<template>
  <div
    class="flex items-center justify-center bg-gray-100 text-gray-800 overflow-hidden"
    style="height: 90vh"
  >
    <form
      @submit.prevent="onSubmit"
      class="bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-sm p-8 flex flex-col gap-6"
    >
      <p class="text-center text-gray-500 text-sm">
        Please sign in to continue
      </p>

      <!-- Email -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-gray-600"
          >Email</label
        >
        <input
          id="email"
          v-model="data.email"
          type="email"
          placeholder="Enter your email"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#32cc7d]"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-2">
        <label for="password" class="text-sm font-medium text-gray-600"
          >Password</label
        >
        <input
          id="password"
          v-model="data.password"
          type="password"
          placeholder="Enter your password"
          class="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#32cc7d]"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="mt-4 py-2.5 rounded-lg font-medium transition-all bg-[#32cc7d] text-white hover:bg-[#28b06d] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Signing in..." : "Sign In" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const props = defineProps({ onSubmit: Function });
const emit = defineEmits(["sign-up"]);

const data = reactive({ email: "", password: "" });
const loading = ref(false);

const onSubmit = async () => {
  if (!props.onSubmit) return;
  loading.value = true;
  await props.onSubmit(data.email, data.password);
  loading.value = false;
};
</script>

<style scoped>
/* Aesthetic improvements */
body {
  background-color: #f9fafb; /* Light gray background for the page */
  font-family: "Poppins", sans-serif;
}

form {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for the form */
}

input {
  transition: border-color 0.2s, box-shadow 0.2s; /* Smooth focus effect */
}

button {
  transition: background-color 0.2s, transform 0.2s; /* Smooth hover effect */
}

button:hover {
  transform: translateY(-2px); /* Slight lift on hover */
}
</style>
