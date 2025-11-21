<template>
  <nav ref="navRef" class="flex justify-between items-center h-[50px] md:h-[60px] w-[98.5%] p-0 bg-linear-to-r from-[#487fa4ca] to-[#26a5cb] rounded-md mb-2 z-40 fixed">
    <div class="w-[50%] md:w-[30%] flex justify-between text-center text-[10px] md:justify-self-center flex-none mr-[9%] p-3 m-0 text-white">
        <img src="/src/assets/paint-palette.png" alt="art-gallerylogo" class="size-8 scale-110 mask-alpha fill-yellow-400">
        <h1 class="w-[50%] text-[#e8b870] scale-110 text-lg text-bold">Artistry Gallery</h1>
    </div>
    
    <ul v-if="!isSmall" class="h-[50%] text-white font-sans font-bold flex items-center overflow-clip md:mr-5">
        <li v-for="item in menuItems" :key="item.id" class="w-auto p-1 mx-1 text-sm md:text-lg hover:scale-110 duration-400 ease-in-out hover:text-[#195784]">
            <router-link class="border-l pl-2" :key="item.id + '-guest'" v-if="!authStore.isAuthenticated && item.title === 'Profile'" :to="{name: 'Login'}">Login/ Signup</router-link>
            <router-link :key="item.id + '-auth'" v-else :to="{name: item.linkName}">{{ item.title }}</router-link>
        </li>
        <li v-if="authStore.isAuthenticated" class="w-auto p-1 mx-1 text-sm md:text-lg hover:scale-110 duration-400 ease-in-out hover:text-red-500 cursor-pointer">
            <span class="border-l pl-2" @click="openModal">Logout</span>
        </li>
    </ul>
    <ul
        v-if="isSmall"
        :class="{
            'translate-y-0': isMenuOpen, 
            '-translate-y-full': !isMenuOpen,
            'invisible': !isMenuOpen
        }"
        class="
            absolute top-[45px] left-0 w-full bg-white text-black border-x-2 border-[#195784] rounded-b-lg flex flex-col items-center shadow-lg z-20
            transition-transform transform duration-400 ease-in-out
        "
    >
        <li v-for="item in menuItems" :key="item.id" class="w-full cursor-pointer">
            <router-link :key="item.id + '-guest'" v-if="!authStore.isAuthenticated && item.title === 'Profile'" class=" w-full block text-center p-3 text-sm hover:scale-120 hover:text-[#195784] font-bold transition-[color,scale] duration-300 ease-in" 
                :to="{name: 'Login'}" 
                @click="toggleMenu">Login/ Signup</router-link>
            <router-link :key="item.id + '-auth'" v-else class="block text-center p-3 text-sm hover:scale-120 hover:text-[#195784] transition-[color,scale] font-bold duration-300 ease-in" :to="{name: item.linkName}" @click="toggleMenu">{{ item.title }}</router-link>
        </li>
        <li v-if="authStore.isAuthenticated" class="w-full cursor-pointer border-t">
            <span class="block text-center p-3 text-sm hover:scale-120 hover:text-red-500 font-bold transition-[color,scale] duration-300 ease-in"
                @click="toggleMenu; openModal()">Logout</span>
        </li>
    </ul>
    <button v-if="isSmall" class="h-10 w-10 mr-2 text-white text-xl cursor-pointer"
        @click="toggleMenu">
        <font-awesome-icon icon="fa-solid fa-bars"/>
    </button>
  </nav>
  <Modal v-if="isModalOpen" @close="closeModal">
    <template #items>
        <div class="text-center p-4">
            <h2 class="text-xl font-bold mb-4 text-[#195784]">Confirm Logout</h2>
            <p class="mb-6">Are you sure you want to log out of your account?</p>
            <div class="flex justify-around">
                <button 
                    @click="handleLogout" 
                    class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Yes, Logout
                </button>
                <button 
                    @click="closeModal" 
                    class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    </template>
  </Modal>
</template>

<script setup>
import { useBreakpoints } from '../assets/useBreakpoints.js';
import { useAuthStore } from '../stores/authStore.js';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Modal from './Modal.vue';

// const auth = ref(false);
const {isSmall} = useBreakpoints();
const authStore = useAuthStore();
const isModalOpen = ref(false);
const isMenuOpen = ref(false);
const navRef = ref(null);
const menuItems = ref([
    {title: "Home", linkName: "Home"},
    {title: "Artist", linkName: "Artists"},
    {title: "Artwork", linkName: "Artworks"},
    {title: "About", linkName: "About"},
    {title: "Profile", linkName: "Profile"}
]);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
}

const openModal = () => {
    isModalOpen.value = true;
}

const closeModal = () => {
    isModalOpen.value = false;
}

const handleLogout = async () => {
    await authStore.logout();
    closeModal();
}

const handleClickOutside = (event) => {
    
    if (!isMenuOpen.value) return;

    if (navRef.value && !navRef.value.contains(event.target)) {
        isMenuOpen.value = false;
    }
};

onMounted(async () => {
    await authStore.checkAuthStatus();
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});


onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<style>

</style>