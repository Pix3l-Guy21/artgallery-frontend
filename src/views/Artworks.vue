<template>
  <div class="w-full flex flex-col text-center p-3">
    
    <div class="w-full">
      <div v-if="authStore.isAuthenticated" class="w-full mb-2">
        <div class="w-full bg-white mt-2 rounded-xl p-3 shadow-md">
          <h2 class="p-2 text-2xl font-semibold">My Artwork ({{ myArtworks.length }})</h2>
          
          <div class="mb-4">
            <button 
              @click="showModal = true" 
              class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
              + Add New Artwork
            </button>
          </div>

          <div v-if="myArtworks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <Card 
              v-for="artwork in myArtworks" 
              :key="artwork.id" 
              :title="artwork.title" 
              :artist="artwork.artist"
              :artworkId="artwork.id"
              :isLikedByCurrentUser="artwork.is_liked_by_current_user || false"
              :style="backgroundImage(artwork.image_url)"
              :hasLikeButton="false"
              :medium="artwork.medium"
              :likes="artwork.likeCount || 0"
              :createdIn="artwork.created_in"
              :commentCount="artwork.commentCount || 0"
              @open-comments-modal="openCommentsModal" 
              @showCommentModal="openCommentModal"
            ></Card>
          </div>
          <p v-else class="text-gray-500 italic">You haven't uploaded any artwork yet.</p>
        </div>
      </div>
      
      <div v-else class="bg-gray-100 p-4 flex flex-col rounded-xl w-full px-3 mb-2 shadow-md">
        <h3 class="text-lg">Please Login to view and add your own artwork</h3>
        <div class="group p-3">
          <router-link :to="{name: 'Login'}" class="bg-green-500 text-white p-2 hover:bg-green-600 rounded-xl transition duration-300">Login</router-link>
        </div>
      </div>
    </div>
    
    <div class="w-full bg-white mt-2 rounded-xl p-3 shadow-md">
      <h2 class="p-2 text-2xl font-semibold">Explore All Artworks ({{ exploreArtworks.length }})</h2>
      <div v-if="exploreArtworks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <Card 
          v-for="artwork in exploreArtworks" 
          :key="artwork.id" 
          :title="artwork.title" 
          :artist="artwork.artist"
          :artworkId="artwork.id"
          :isLikedByCurrentUser="artwork.is_liked_by_current_user || false"
          :style="backgroundImage(artwork.image_url)"
          :hasLikeButton="true"
          :medium="artwork.medium"
          :likes="artwork.likeCount || 0"
          :createdIn="artwork.created_in"
          :commentCount="artwork.commentCount || 0"
          @open-comments-modal="openCommentsModal" 
          @showCommentModal="openCommentModal"
        ></Card>
      </div>
      <p v-else class="text-gray-500 italic">No artworks available to explore.</p>
    </div>

    <Modal v-if="showModal" key="artwork-form" @close="showModal = false">
      <template #items>
        <div class="p-4">
          <h3 class="text-xl font-bold mb-4">Add New Artwork</h3>
          <form @submit.prevent="submitArtwork" class="flex flex-col gap-4">
            
            <InputTab id="title" type="text" label="Title" v-model="newArtwork.title" :isPasswordTab="false"/>
            <InputTab id="medium" type="text" label="Medium" v-model="newArtwork.medium" :isPasswordTab="false"/>
            <InputTab id="image_url" type="text" label="Image URL" v-model="newArtwork.image_url" :isPasswordTab="false"/>
            <InputTab id="created_in" type="number" label="Year Created" v-model="newArtwork.created_in" :isPasswordTab="false"/>

            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
              Submit Artwork
            </button>
            <button type="button" @click="showModal = false" class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300">
              Cancel
            </button>
          </form>
        </div>
      </template>
    </Modal>

    <Modal v-if="isCommentModalOpen" @close="closeCommentModal" key="comment-modal">
      <template #items>
          <h2 class="text-2xl font-bold mb-4 text-gray-800">Add Comment</h2>
          <form @submit.prevent="submitComment">
              <div class="mb-4">
                  <label for="comment" class="block text-gray-700 font-medium mb-2">Your Comment</label>
                  <textarea 
                      id="comment" 
                      v-model="commentText" 
                      rows="4" 
                      required
                      placeholder="Write your thoughts here..."
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                  <button 
                      type="button" 
                      @click="closeCommentModal" 
                      class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-150">
                      Cancel
                  </button>
                  <button type="submit" 
                      class="px-4 py-2 bg-[#2c8bcf] text-white rounded-lg hover:bg-[#2c8bcf]/80 transition duration-150">
                      Submit Comment
                  </button>
              </div>
          </form>
      </template>
  </Modal>

  <Modal v-if="isModalOpen" @close="closeModal" key="list-modal">
    <template #items>
      <CommentList :artworkId="selectedArtworkId" /> 
    </template>
  </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import Card from '../components/Card.vue'; 
import InputTab from '../components/InputTab.vue';
import Modal from '../components/Modal.vue';
import CommentList from '../components/CommentList.vue';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const artworks = ref([]);
const authStore = useAuthStore();
const showModal = ref(false);
const myArtworks = ref([]);
const exploreArtworks = ref([]);
const isModalOpen = ref(false);
const currentArtworkId = ref(null);
const selectedArtworkId = ref(null);
const isCommentModalOpen = ref(false);
const commentText = ref('');

const newArtwork = ref({
  title: '',
  medium: '',
  image_url: '',
  created_in: String(new Date().getFullYear()),
});

const fetchMyArtworks = async () => {
  if (!authStore.isAuthenticated || !authStore.user.artist_id) {
    myArtworks.value = [];
    return;
  }
  
  const artistId = authStore.user.artist_id;
  const accessToken = authStore.accessToken;

  try {
    const response = await fetch(`${BACKEND_URL}/artworks/artist/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (response.ok) {
      myArtworks.value = await response.json();
    } else {
      console.error("Failed to fetch user's artworks:", response.statusText);
      myArtworks.value = [];
    }
  } catch (error) {
    console.error("Error fetching user's artworks:", error);
  }
};

const fetchAllArtworks = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/artworks`); 
    
    if (response.ok) {
      exploreArtworks.value = await response.json();
    } else {
      console.error("Failed to fetch all artworks:", response.statusText);
      exploreArtworks.value = [];
    }
  } catch (error) {
    console.error("Error fetching all artworks:", error);
  }
};

const submitArtwork = async () => {
  if (!authStore.isAuthenticated) return;

  const accessToken = authStore.accessToken;

  const payload = {
        ...newArtwork.value,
        created_in: parseInt(newArtwork.value.created_in, 10), 
    };
  try {
    const response = await fetch(`${BACKEND_URL}/artworks/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      const addedArtwork = await response.json();
      console.log('Artwork added successfully:', addedArtwork);
      
      myArtworks.value.push(addedArtwork); 
      exploreArtworks.value.push(addedArtwork);
      
      Object.assign(newArtwork.value, { title: '', medium: '', image_url: '', created_in: String( new Date().getFullYear()) });
      showModal.value = false;
    } else {
      const errorData = await response.json();
      alert(`Failed to add artwork: ${errorData.message}`);
      console.error("Error response:", errorData);
    }
  } catch (error) {
    console.error("Error submitting artwork:", error);
    alert("An unexpected error occurred while submitting artwork.");
  }
};

const backgroundImage = (image) => {
  return {
    'background-image': `url('${image}')`,
    'background-position': 'center',
    'background-size': 'cover'
  }
}

const openCommentsModal = (artworkId) => {
  selectedArtworkId.value = artworkId;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedArtworkId.value = null;
};

const openCommentModal = (artworkId) => {
    currentArtworkId.value = artworkId;
    commentText.value = ''; 
    isCommentModalOpen.value = true;
};

const closeCommentModal = () => {
    isCommentModalOpen.value = false;
    currentArtworkId.value = null;
    commentText.value = '';
};

onMounted(() => {
  authStore.checkAuthStatus().then(() => {
    fetchMyArtworks();
  });
  fetchAllArtworks();
});

const submitComment = async () => {
    if (!commentText.value.trim() || !currentArtworkId.value) {
        alert("Comment text is required.");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/comments/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.accessToken}`
            },
            body: JSON.stringify({
                artwork_id: currentArtworkId.value,
                remark: commentText.value.trim()
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                authStore.logout(); 
                alert("Your session has expired. Please log in again.");
            }
            throw new Error(`Failed to submit comment. Status: ${response.status}`);
        }

        closeCommentModal();
        alert("Comment added successfully!");
        const artworkIndex = artworks.value.findIndex(
            (a) => a.id === currentArtworkId.value
        );

        if (artworkIndex !== -1) {
            const currentCount = artworks.value[artworkIndex].commentCount || 0;
            artworks.value[artworkIndex].commentCount = currentCount + 1;
        }
    } catch (err) {
        console.error("Error submitting comment:", err);
        alert(`Failed to add comment: ${err.message}`);
    }
};

</script>
