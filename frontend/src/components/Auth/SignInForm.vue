<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
    <form
      @submit.prevent="onSubmit"
      class="surface border rounded-2xl shadow-md w-full max-w-sm p-6 flex flex-col gap-4"
    >
      <h2 class="text-xl font-semibold text-center">Login</h2>

      <!-- Email -->
      <div class="flex flex-col gap-1">
        <label for="email" class="text-sm font-medium text-[var(--muted)]">Email</label>
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
        <label for="password" class="text-sm font-medium text-[var(--muted)]">Password</label>
        <input
          id="password"
          v-model="data.password"
          type="password"
          placeholder="Enter your password"
          class="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="mt-2 py-2 rounded-lg font-medium transition-colors bg-[var(--primary)] text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Signing in..." : "Sign In" }}
      </button>

      <!-- Optional footer text -->
      <p class="text-center text-sm text-muted mt-2">
        Don’t have an account? 
        <a href="#" class="text-[var(--primary)] hover:underline" @click.prevent="$emit(`sign-up`)">Sign up</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({ onSubmit: Function })
const emit = defineEmits(["sign-up"])

const data = reactive({ email: '', password: '' })
const loading = ref(false)

const onSubmit = async () => {
    if (!props.onSubmit) return
    loading.value = true
    await props.onSubmit(data.email, data.password)
    loading.value = false
}
</script>

<style scoped>
.surface {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
}
.text-muted {
  color: var(--muted);
}
</style>
