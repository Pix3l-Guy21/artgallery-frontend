<template>
  <div class="p-4 flex flex-col items-center">
  <h3 class="font-bold text-lg">{{ name }}</h3>
  <p class="text-sm text-gray-600 mb-4">{{ description }}</p>

  <div class="flex space-x-6 mb-4">
    <div class="text-center">
      <p class="font-bold text-xl text-blue-600">{{ followersLocal }}</p>
      <p class="text-xs text-gray-500">Followers</p>
    </div>
    <div class="text-center">
      <p class="font-bold text-xl text-blue-600">XX</p> 
      <p class="text-xs text-gray-500">Following</p>
    </div>
  </div>

  <button 
    v-if="authStore.user?.user_id !== userId"
    @click="toggleFollow" 
    :class="[
      isFollowingLocal ? 'bg-gray-400 hover:bg-gray-500' : 'bg-[#ed876e] hover:bg-[#ed876e]/80',
      'text-white font-semibold py-2 px-4 rounded-full transition duration-200'
    ]">
    <font-awesome-icon :icon="isFollowingLocal ? 'fa-solid fa-check' : 'fa-solid fa-user-plus'" class="mr-2" />
    {{ isFollowingLocal ? 'Following' : 'Follow' }}
  </button>
  <p v-else class="text-sm text-gray-500 mt-2">This is you!</p>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
const props = defineProps({
  artistId: Number, 
  userId: { type: [Number, String], required: true},   
  name: String,
  description: String,
  followerCount: {type: Number, required: true},
  isFollowing: {type: Boolean, required: true},
  followId: {type: [Number, String, null],default: null}
});
const emit = defineEmits(['updateFollowStatus']);


const authStore = useAuthStore();
const isFollowingLocal = ref(props.isFollowing);
const followersLocal = ref(props.followerCount);
const currentFollowId = ref(props.followId);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

watch(() => props.isFollowing, (newStatus) => isFollowingLocal.value = newStatus);
watch(() => props.followerCount, (newCount) => followersLocal.value = newCount);
watch(() => props.followId, (newId) => currentFollowId.value = newId);

const toggleFollow = async () => {
    const accessToken = authStore.accessToken;
    if (!accessToken) {
        alert('You must be logged in to follow an artist.');
        return;
    }

    const targetUserId = props.userId;
    const isCurrentlyFollowing = isFollowingLocal.value;

    isFollowingLocal.value = !isCurrentlyFollowing;
    followersLocal.value += isCurrentlyFollowing ? -1 : 1;

    try {
        if (!isCurrentlyFollowing) {
            const response = await fetch(`${BACKEND_URL}/follows/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ followed_id: targetUserId }),
            });

            if (!response.ok) throw new Error('Failed to follow artist.');

            const data = await response.json();
            currentFollowId.value = data.id;

            emit('updateFollowStatus', { 
              artistId: props.userId, 
              action: 'follow',
              newFollowId: data.id,
            });

        } else {
            if (!currentFollowId.value) {
                throw new Error('Cannot unfollow: Follow ID is unknown.'); 
            }
            const response = await fetch(`${BACKEND_URL}/follow/${currentFollowId.value}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to unfollow artist.');

            currentFollowId.value = null;
            emit('updateFollowStatus', { 
              artistId: props.userId, 
              action: 'unfollow',
            });
        }

    } catch (error) {
        console.error('Follow action failed:', error);
        isFollowingLocal.value = isCurrentlyFollowing;
        followersLocal.value += isCurrentlyFollowing ? 1 : -1;
        alert(`Error: ${error.message}`);
    }
};
</script>

<style>

</style>