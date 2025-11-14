<template>
  <div class="Authentication">
    <SignUpForm 
      v-if="isSignUp"
      @submit="onSignUp" 
      @sign-in="isSignUp = false"
    ></SignUpForm>
    <SignInForm 
      v-else
      @submit="onSignIn" 
      @sign-up="isSignUp = true"
    ></SignInForm>
  </div>
</template>

<script setup>
import SignUpForm from '@/components/Auth/SignUpForm.vue';
import SignInForm from '@/components/Auth/SignInForm.vue';
import api from '@/utils/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//

const router = useRouter()
const isSignUp = ref(false)

const onSignUp = async (name, email, password) => {
  const res = await api.post("/api/auth/sign-up", { name, email, password })

  if (!res.ok) return console.info(await res.text())
  const user = await res.json()
  console.info("User signed-up: ", user)
}

const onSignIn = async (email, password) => {
  const res = await api.post("/api/auth/sign-in", { email, password })

  if (!res.ok) return console.info(await res.text())
  const user = await res.json()
  console.info("User signed-in: ", user)

  router.push("/dashboard")
  /**
   * Access cookie is attached to the browser marking user as signed-in.
   * Do I need to manually manage signed-in state? No
   * Am I detected signed-in wherever whenever I used fetch? Yes, cookie is attached to every request.
   */
}

//

</script>
