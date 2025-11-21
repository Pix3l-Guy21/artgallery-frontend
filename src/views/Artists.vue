<template>
  <div class="relative w-full h-auto overflow-scroll p-2 bg-[#ffffff]">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Our Artists</h1>
    
    <p v-if="loading" class="text-center text-xl text-blue-500">
      <font-awesome-icon icon="fa-solid fa-spinner" spin /> Loading artists...
    </p>
    <p v-else-if="error" class="text-center text-red-500">Error loading artists: {{ error }}</p>
    <p v-else-if="artists.length === 0" class="text-center text-gray-500">No artists found to display.</p>

    <div v-else class="px-2 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-x-visible gap-6">
      
      <ArtistSlot 
        v-for="artist in artists" 
        :key="artist.id" 
        :artist-id="artist.id"
        :user-id="artist.user_id"
        :name="artist.name || artist.style" 
        :description="artist.description || artist.speciality"
        :follower-count="artist.followerCount || 0"
        :is-following="artist.isFollowing"
        :follow-id="artist.followId"
        @update-follow-status="updateArtistFollowState"
      ></ArtistSlot>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import ArtistSlot from '../components/ArtistSlot.vue';

const authStore = useAuthStore();
const artists = ref([]);
const loading = ref(true);
const error = ref(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const updateArtistFollowState = (payload) => {
  const artist = artists.value.find(a => String(a.user_id) === String(payload.artistId));
  
  if (!artist) return;

  if (payload.action === 'follow') {
    artist.isFollowing = true;
    artist.followId = payload.newFollowId;
   } else if (payload.action === 'unfollow') {
    artist.isFollowing = false;
    artist.followId = null;
  }
}

const fetchArtists = async () => {
    loading.value = true;
    error.value = null;
    const accessToken = authStore.accessToken;

    try {
        const response = await fetch(`${BACKEND_URL}/artist/`, {
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : ''
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch artists. Status: ${response.status}`);
        }

        const data = await response.json();
        
        artists.value = data.map(artist => ({
          ...artist,
          user_id: artist.user_id || artist.id, 
          followerCount: artist.followerCount || 0,
          isFollowing: artist.isFollowing || 0,
          followId: artist.followId || 0
        }));
        // Artists.vue
console.log('Fetched Artists IDs:', data.map(a => ({ id: a.id, user_id: a.user_id || a.id })));
    } catch (err) {
        console.error("Error fetching artists:", err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchArtists();
});

</script>
