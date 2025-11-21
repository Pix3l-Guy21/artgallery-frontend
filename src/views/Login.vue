<template>
  <div class="justify-center p-2 flex flex-col sm:w-[550px] w-[90%] rounded-2xl bg-white">
    <div class=" rounded-2xl flex justify-center">
      <form @submit.prevent="handleLogin" class="flex flex-col gap-2 w-[90%] p-4">
        <div class="mb-2">
          <h2 class="font-bold text-3xl mb-3">Log in</h2>
          <p>Need an account? 
            <router-link :to="{name: 'Signup'}" class="text-[#2ebfe7] hover:underline hover:text-[#299cbc]">Create an account</router-link>
          </p>
        </div>
        <InputTab id="email" type="email" label="Email" v-model="email" :isPasswordTab="false"/>
        <InputTab id="password" type="password" label="Password" v-model="password" :isPasswordTab="true" />
        <button type="submit" class="cursor-pointer bg-[#2c8bcf] hover:bg-[#2c8bcf]/80 hover:text-white hover:font-bold p-2 ">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import InputTab from '../components/InputTab.vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const handleLogin = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: email.value,
          password: password.value,
      }),
      credentials: 'include'
    });

    if(!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed.' }));
      console.log("Unable to login", response.status, errorData);
      return;
    }
    const data = await response.json();
    if(data.status === 400) {
      console.log(data);
      return;
    }
    authStore.setAuthData(data);
    router.push({ name: 'Home' });
  } catch (error) {
    console.error("Error in logging in: ", error);
  }
};
</script>

<style>

</style>