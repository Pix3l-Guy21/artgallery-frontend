<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Explore Artworks</h1>
    
    <p v-if="loading" class="text-center text-xl text-blue-500">
        <font-awesome-icon icon="fa-solid fa-spinner" spin /> Loading artworks...
    </p>
    <p v-else-if="error" class="text-center text-red-500">Error loading artworks: {{ error }}</p>
    <p v-else-if="artworks.length === 0" class="text-center text-gray-500">No artworks found to display.</p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card 
        v-for="artwork in artworks" 
        :key="artwork.id" :title="artwork.title" 
        :style="backgroundImage(artwork.image_url)"
        :artworkId="artwork.id"
        :isLikedByCurrentUser="artwork.is_liked_by_current_user || false" 
        :likes="artwork.likeCount" 
        :createdIn="artwork.created_in" 
        :medium="artwork.medium" 
        :hasLikeButton="true" 
        :artist="artwork.artist_name || 'Unknown Artist'"
        :commentCount="artwork.commentCount || 0"
        @open-comments-modal="openCommentsModal" 
        @showCommentModal="openCommentModal" />
    </div>
  </div>
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
                <button 
                    type="submit" 
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from '../components/Card.vue';
import Modal from'../components/Modal.vue';
import { useAuthStore } from '../stores/authStore.js';
import CommentList from '../components/CommentList.vue';

const artworks = ref([]);
const loading = ref(true);
const error = ref(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const isCommentModalOpen = ref(false);
const currentArtworkId = ref(null);
const commentText = ref('');
const authStore = useAuthStore();
const isModalOpen = ref(false);
const selectedArtworkId = ref(null);

const fetchArtworks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`${BACKEND_URL}/artworks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch artworks. Status: ${response.status}`);
    }

    const data = await response.json();
    artworks.value = data;
    
  } catch (err) {
    console.error("Error fetching artworks:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
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
        const artworkToUpdate = artworks.value.find(
            (a) => String(a.id) === String(currentArtworkId.value)
        );

        if (artworkToUpdate) {
            artworkToUpdate.commentCount = (artworkToUpdate.commentCount || 0) + 1;
        }
    } catch (err) {
        console.error("Error submitting comment:", err);
        alert(`Failed to add comment: ${err.message}`);
    }
};

onMounted(fetchArtworks);
</script>