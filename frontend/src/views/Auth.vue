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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/api';

//

const router = useRouter()
const { signUp, signIn } = useApi()
const isSignUp = ref(false)

//

const onSignUp = async (name, email, password) => {
  const user = await signUp(name, email, password)
}

const onSignIn = async (email, password) => {
  await signIn(email, password)
  router.push("/dashboard")
}

//

</script>
