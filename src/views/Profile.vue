<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="authStore.isAuthenticated" class="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10">
      
      <header class="flex flex-col md:flex-row items-center border-b pb-6 mb-6">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 mb-4 md:mb-0 md:mr-6">
          <img src="https://via.placeholder.com/150/4C9AFB/FFFFFF?text=P" alt="Profile Avatar" class="w-full h-full object-cover">
        </div>
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-800">
            {{ (userProfile.first_name && userProfile.last_name) ? userProfile.first_name + ' ' + userProfile.last_name : userProfile.username || 'Art Enthusiast' }}
          </h1>
          <button 
              v-if="!userProfile.artist_id" 
              @click="showArtistModal = true" 
              class="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md"
          >
              Become an Artist
          </button>
          <p class="text-md text-gray-500 mt-1">
            {{ userProfile.email || 'No email available' }}
          </p>
          <p v-if="userProfile.bio" class="text-sm text-gray-600 mt-2 italic">
            "{{ userProfile.bio }}"
          </p>
          <div class="mt-3 flex justify-center md:justify-start space-x-4">
            <span class="text-sm font-medium text-gray-600">
                Followers: {{ userProfile.followersCount }}
            </span>
            <span class="text-sm font-medium text-gray-600">
                Following: {{ userProfile.followingCount }}
            </span>
          </div>
        </div>
      </header>

      <nav class="flex border-b mb-6">
        <button 
          @click="activeTab = 'artworks'" 
          :class="{'border-blue-500 text-blue-600': activeTab === 'artworks', 'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'artworks'}"
          class="py-2 px-4 font-semibold text-lg border-b-2 transition duration-150"
        >
          My Artworks
        </button>
        <button 
          @click="activeTab = 'collections'" 
          :class="{'border-blue-500 text-blue-600': activeTab === 'collections', 'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'collections'}"
          class="py-2 px-4 font-semibold text-lg border-b-2 transition duration-150"
        >
          My Collections
        </button>
      </nav>

      <div class="profile-content">
        <section v-if="activeTab === 'artworks'">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">Artworks I've Created (Placeholder)</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="n in userProfile.artworks.length" :key="'artwork-' + n" class="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <p class="text-sm font-medium text-gray-600">Artwork #{{ n }}</p>
            </div>
            <p v-if="userProfile.artworks.length === 0" class="text-gray-500 col-span-4">No artworks found.</p>
          </div>
        </section>

        <section v-if="activeTab === 'collections'">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">My Saved Collections (Placeholder)</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="n in userProfile.collections.length" :key="'collection-' + n" class="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <p class="text-md font-medium text-gray-600">Collection Name {{ n }}</p>
            </div>
             <p v-if="userProfile.collections.length === 0" class="text-gray-500 col-span-3">No collections found.</p>
          </div>
        </section>
      </div>

    </div>
    
    <div v-else class="text-center mt-20 p-8 bg-white shadow-lg rounded-xl max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
      <p class="text-gray-600 mb-6">You must be logged in to view your profile.</p>
      <router-link :to="{ name: 'Login' }" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
        Go to Login / Signup
      </router-link>
    </div>
    <Modal v-if="showArtistModal" @close="showArtistModal = false">
        <template #items>
            <div class="p-4 flex flex-col items-center">
                <h3 class="text-xl font-bold mb-4">Register as an Artist</h3>
                <p class="text-gray-700 text-center mb-6">
                    Tell us a little more about your art. These fields are **optional** but recommended.
                </p>
                
                <div class="w-full max-w-sm mb-4">
                    <label for="artist-style" class="block text-sm font-medium text-gray-700 mb-1 text-left w-full">Primary Art Style (e.g., Abstract, Surrealism)</label>
                    <input 
                        id="artist-style" 
                        type="text" 
                        v-model="artistForm.style" 
                        placeholder="e.g., Renaissance, Pop Art"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                </div>
                
                <div class="w-full max-w-sm mb-6">
                    <label for="artist-speciality" class="block text-sm font-medium text-gray-700 mb-1 text-left w-full">Speciality/Medium (e.g., Oil Painting, Sculpture)</label>
                    <input 
                        id="artist-speciality" 
                        type="text" 
                        v-model="artistForm.speciality" 
                        placeholder="e.g., Oil Painting, Digital Art"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                </div>
                
                <div class="flex space-x-4">
                    <button 
                        @click="showArtistModal = false" 
                        class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button 
                        @click="handleBecomeArtist" 
                        class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
                    >
                        Confirm Registration
                    </button>
                </div>
            </div>
        </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import Modal from '../components/Modal.vue';

const authStore = useAuthStore();
const activeTab = ref('artworks');
const showArtistModal = ref(false);
const artistForm = ref({
    style: '',
    speciality: ''
});

const userProfile = ref({
  user_id: null,
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  bio: '',
  website_url: '',
  social_media_links: {},
  followersCount: 0,
  followingCount: 0,
  artworks: [],
  collections: [],
  artist_id: null,
});

const handleBecomeArtist = async () => {
    if (!authStore.isAuthenticated || !authStore.user) return;

    // The user's ID from the store is the target for the PATCH request
    const userId = authStore.user.user_id;
    const accessToken = authStore.accessToken;
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${BACKEND_URL}/users/artist/${userId}`, {
          method: 'PATCH',
          headers: {
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              style: artistForm.value.style,
              speciality: artistForm.value.speciality
          })
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to become an artist.' }));
          console.error(`Failed to update user status: ${response.statusText}`, errorData);
          alert(`Failed to become an artist: ${errorData.message || response.statusText}`);
          return;
      }

      const updatedUserData = await response.json();
      
      userProfile.value.artist_id = updatedUserData.artist_id;
      
      authStore.setAuthData({ user: { ...authStore.user, ...updatedUserData }, access_token: accessToken }); 

      artistForm.value.style = '';
      artistForm.value.speciality = '';
      showArtistModal.value = false;
      alert('Congratulations! You are now an artist.');
        
    } catch (error) {
      console.error("Error promoting user to artist:", error);
      alert('An unexpected error occurred.');
    }
};

const fetchUserProfile = async () => {
    console.log("first log in the fetcher")
    await authStore.checkAuthStatus();
    console.log("second log in the fetcher", authStore.user.id)
    if (authStore.isAuthenticated && authStore.user && authStore.user.user_id) {
        const userId = authStore.user.user_id;
        const accessToken = authStore.accessToken;
        console.log("third log in the fetcher")
        try {
            const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json'
                }
            });
            console.log("fetching user data");
            if (!response.ok) {
                console.error(`Failed to fetch user profile: ${response.statusText}`);
                return;
            }

            const userData = await response.json();
            
            userProfile.value = {
                ...userProfile.value,
                ...userData,
            };

        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }
};

onMounted(() => {
    fetchUserProfile();
});
</script>
