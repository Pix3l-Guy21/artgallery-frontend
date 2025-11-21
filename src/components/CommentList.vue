<template>
  <div class="p-2">
    <h3 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Comments</h3>

    <p v-if="loading" class="text-center text-blue-500">
        Loading comments...
    </p>
    <p v-else-if="error" class="text-center text-red-500">Error: {{ error }}</p>
    <p v-else-if="comments.length === 0" class="text-center text-gray-500">No comments yet. Be the first!</p>

    <div v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
      <div v-for="comment in comments" :key="comment.id" class="p-3 bg-gray-50 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-sm text-gray-600">
            @{{ comment.user.username || `${comment.user.first_name} ${comment.user.last_name}` }}
          </p>
          <p class="text-xs text-gray-400">
            {{ new Date(comment.createdAt).toLocaleDateString() }}
          </p>
        </div>
        <p class="text-gray-700 mt-1 wrap-break-word whitespace-pre-wrap">{{ comment.remark }}</p>
      </div>
    </div>
    
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  artworkId: {
    type: [Number, String],
    required: true,
  },
});

const comments = ref([]);
const loading = ref(true);
const error = ref(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchComments = async (id) => {
  if (!id) return;
  
  loading.value = true;
  error.value = null;

  try {
    // Uses the new backend route
    const response = await fetch(`${BACKEND_URL}/comments/artwork/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch comments. Status: ${response.status}`);
    }

    const data = await response.json();
    comments.value = data;
    
  } catch (err) {
    console.error("Error fetching comments:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

watch(() => props.artworkId, (newId) => {
  fetchComments(newId);
}, { immediate: true });

defineExpose({
    fetchComments
});
</script>