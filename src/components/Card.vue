<template>
  <div :style="background" class="group w-full h-70 flex flex-col items-center rounded-xl bg-[#5dc8d4d8] overflow-clip relative my-2 cursor-pointer">
    <div v-if="hasLikeButton" class="absolute top-2 right-4 text-white text-2xl hover:scale-120 group-hover:translate-y-0 group transition-[translate] duration-300" :class="{'translate-y-0': liked, '-translate-y-10': !liked}">
        <font-awesome-icon v-if="!liked" icon="fa-regular fa-heart" @click.stop="toggleLike"/>
        <font-awesome-icon v-if="liked" icon="fa-solid fa-heart" class="text-[#FF8787]" @click.stop="toggleLike"/>
    </div>
    <div class="group-hover:-translate-y-full translate-y-0 transition-transform absolute top-full w-full duration-300 p-4 bg-[#bfe2bf]/80 flex rounded-b-xl flex-col justify-center items-center">
        <h1 class="font-bold z-10 text-xl">{{ title }}</h1>
        <p class="z-10">{{ artist }}</p>
        <div class="grid grid-cols-2 justify-between items-center border-t pt-3">
          <div class="inline items-center space-x-2 text-gray-700">
            <font-awesome-icon icon="fa-solid fa-heart" class="text-red-500" />
            <span class="font-semibold">{{ likes }} Likes</span>
          </div>
          <div class="flex items-center space-x-2 ml-4 text-gray-700 hover:text-blue-600 cursor-pointer" 
            @click.stop="$emit('open-comments-modal', artworkId)">
            <font-awesome-icon icon="fa-solid fa-comment"/>
            <p>{{ commentCount }}</p>
          </div>
          <button 
                v-if="hasLikeButton" 
                @click.stop="handleCommentClick" 
                class="col-span-2 flex justify-center w-full items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer transition duration-150">
                <font-awesome-icon icon="fa-solid fa-comment" />
                <span>Comment</span>
            </button>
          <p class="text-xs text-gray-500">{{ medium }} ({{ createdIn }})</p>
        </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore.js';

const props = defineProps({
  artworkId: {type: [String, Number], required: true},
  isLikedByCurrentUser: {type: Boolean, default: false},
  title: {type: String, required: false},
  artist: {type: String, required: false},
  background: {type: String, required: false},
  hasLikeButton: {type: Boolean, required: true},
  likes: {type: Number, required: true},
  medium: {type: String, required: true},
  createdIn: {type: Number, required: true},
  commentCount: {type: [Number, String], default: 0}
})

const emit = defineEmits(['showCommentModal', 'open-comments-modal']);

const liked = ref(props.isLikedByCurrentUser);
const likesCount = ref(props.likes);
const likeId = ref(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const authStore = useAuthStore();
const { isAuthenticated, accessToken } = authStore;

const toggleLike = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
        alert("You must be logged in to like artwork.");
        return;
    }

    const accessToken = authStore.accessToken;
    const previousLiked = liked.value;
    const previousLikesCount = likesCount.value;

    liked.value = !liked.value;
    likesCount.value += liked.value ? 1 : -1;

    try {
        if (liked.value) {
            const response = await fetch(`${BACKEND_URL}/likes/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                },
                body: JSON.stringify({ artwork_id: props.artworkId })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authStore.logout();
                    alert("Your session has expired. Please log in again. ", response);
                }
                throw new Error('Failed to add like.');
            }

            const data = await response.json();
            likeId.value = data.id; 

        } else {
            if (!likeId.value) {
                 console.error("Cannot unlike: Like ID is unknown.");
                 throw new Error('Cannot unlike: Like ID is unknown.');
            }
            
            const response = await fetch(`${BACKEND_URL}/likes/${likeId.value}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authStore.logout(); // Clear bad token and state
                    alert("Your session has expired. Please log in again. response not ok");
                }
                throw new Error('Failed to remove like.');
            }
            
            likeId.value = null;
        }
    } catch (error) {
        console.error("Like/Unlike failed:", error);
        liked.value = previousLiked;
        likesCount.value = previousLikesCount;
        alert(`Action failed: ${error.message}. Please check console for details.`);
    }
}

const handleCommentClick = () => {
    if (!isAuthenticated) {
        alert("You must be logged in to add a comment.");
        return;
    }
    emit('showCommentModal', props.artworkId); 
};
</script>
<style>

</style>