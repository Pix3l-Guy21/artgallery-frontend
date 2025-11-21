<template>
  <div class="fixed top-0 inset-0 z-50 bg-black/50 flex items-center justify-center" @click.self="closeModal">
    <div class="w-full max-w-lg p-4 bg-white rounded-xl shadow-2xl relative">
        <button 
            @click="closeModal" 
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold p-1">
            &times;
        </button>
        
        <slot name="items"></slot> 
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
}
</script>