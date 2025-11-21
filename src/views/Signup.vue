<template>
  <div class="justify-center p-2 flex flex-col sm:w-[550px] w-[90%] rounded-2xl bg-white">
    <form @submit.prevent="handleSignup" class="flex flex-col gap-2 p-4">
      <h2 class="font-bold text-3xl mb-3">Sign up</h2>
      
      <div v-if="successMessage" class="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {{ errorMessage }}
      </div>

      <div class="sm:flex gap-3">
        <InputTab class="flex-1" id="firstName" type="text" label="First Name" v-model="firstName" :isPasswordTab="false"/>
        <InputTab class="flex-1" id="lastName" type="text" label="Last Name" v-model="lastName" :isPasswordTab="false"/>
      </div>
      <InputTab id="username" type="text" label="Username" label-small="Visible publicly" v-model="username" :isPasswordTab="false"/>
      <InputTab id="dateOfBirth" type="date" label="Date of Birth" v-model="dateOfBirth" :isPasswordTab="false"/>
      <label for="bio" class="py-2 text-md text-gray-700 font-bold">Bio</label>
      <textarea
        id="bio"
        v-model="bio" 
        rows="4" 
        placeholder="Type your bio here..."
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      <InputTab id="email" type="email" label="Email" v-model="email" :isPasswordTab="false"/>
      <InputTab id="password" type="password" label="Password" v-model="password" :isPasswordTab="true"/>
      <InputTab id="websiteUrl" type="url" label="Website URL (Optional)" v-model="websiteUrl" :isPasswordTab="false"/>

      <label for="socialMedia" class="py-2 text-md text-gray-700 font-bold">Social Media Links</label>
      <div class="flex flex-col gap-4 p-2 border border-dashed border-gray-300 rounded-md">
        <div v-for="(link, index) in socialMediaLinks" :key="index" class="relative">
          <InputTab :id="'socialMediaLink-' + index" type="url" label="Social Media Link" v-model="link.url" :isPasswordTab="false" />
          <div class="absolute right-0 p-2 top-5">
            <button
              @click="removeItem(index)"
              type="button"
              class="size-5 text-sm bg-red-400 cursor-pointer text-white rounded-md hover:bg-red-500 transition duration-150"
            >
              <font-awesome-icon icon="fa-solid fa-minus" />
            </button>
          </div>
        </div>

        <button
          @click="addItem"
          type="button"
          class="w-20 p-2 mt-4 bg-green-800 cursor-pointer text-white rounded-md hover:bg-green-500 transition duration-150"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="rounded-2xl cursor-pointer bg-[#2c8bcf] hover:bg-[#2c8bcf]/80 hover:text-white hover:font-bold p-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import InputTab from '../components/InputTab.vue';

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const dateOfBirth = ref('');
const bio = ref('');
const email = ref('');
const password = ref('');
const websiteUrl = ref('');
const socialMediaLinks = ref([]);

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const addItem = () => {
  socialMediaLinks.value.push({ url: '' });
};
const removeItem = (index) => {
  socialMediaLinks.value.splice(index, 1);
};

const handleSignup = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    loading.value = true;

    if (!firstName.value || !email.value || !password.value || !username.value) {
        errorMessage.value = 'Please fill in all required fields (First Name, Username, Email, Password).';
        loading.value = false;
        return;
    }
    
    const linksArray = socialMediaLinks.value
        .map(link => link.url)
        .filter(url => url.trim() !== '');

    const userData = {
        first_name: firstName.value,
        last_name: lastName.value,
        username: username.value,
        date_of_birth: dateOfBirth.value,
        bio: bio.value,
        email: email.value,
        password: password.value,
        website_url: websiteUrl.value,
        social_media_links: linksArray,
    };

    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            successMessage.value = 'Account created successfully! Redirecting to login...';
            
            firstName.value = '';
            lastName.value = '';

            setTimeout(() => {
                router.push('/login');
            }, 2000); 

        } else {
            const errorData = await response.json();
            errorMessage.value = errorData.message || 'Failed to create account. Please try again.';
        }
    } catch (error) {
        console.error('Signup failed:', error);
        errorMessage.value = 'A network error occurred. Please check your connection.';
    } finally {
        loading.value = false;
    }
};
</script>
