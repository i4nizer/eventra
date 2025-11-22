<template>
  <div
    class="flex items-center justify-center bg-[var(--bg)] text-[var(--text)]"
    style="height: 90vh"
  >
    <form
      @submit.prevent="onSubmit"
      class="surface border rounded-2xl shadow-md w-full max-w-sm p-6 flex flex-col gap-4"
    >
      <h2 class="text-xl font-semibold text-center">Create Account</h2>

      <!-- Name -->
      <div class="flex flex-col gap-1">
        <label for="name" class="text-sm font-medium text-[var(--muted)]"
          >Name</label
        >
        <input
          id="name"
          v-model="data.name"
          type="text"
          placeholder="Enter your name"
          class="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-1">
        <label for="email" class="text-sm font-medium text-[var(--muted)]"
          >Email</label
        >
        <input
          id="email"
          v-model="data.email"
          type="email"
          placeholder="Enter your email"
          class="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1">
        <label for="password" class="text-sm font-medium text-[var(--muted)]"
          >Password</label
        >
        <input
          id="password"
          v-model="data.password"
          type="password"
          placeholder="Enter your password"
          class="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="mt-2 py-2 rounded-lg font-medium transition-colors bg-[var(--primary)] text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Submitting..." : "Submit" }}
      </button>

      <!-- Optional footer text -->
      <p class="text-center text-sm text-muted mt-2">
        Already have an account?
        <a
          href="#"
          class="text-[var(--primary)] hover:underline"
          @click.prevent="$emit(`sign-in`)"
          >Sign in</a
        >
      </p>
    </form>
  </div>
</template>

<script setup lang="js">
import { reactive, ref } from 'vue'

const props = defineProps({ onSubmit: Function })
const emit = defineEmits(["sign-in"])

const data = reactive({ name: '', email: '', password: '' })
const loading = ref(false)

const onSubmit = async () => {
    if (!props.onSubmit) return
    loading.value = true
    await props.onSubmit(data.name, data.email, data.password)
    loading.value = false
}
</script>

<style scoped>
.surface {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
}
</style>
