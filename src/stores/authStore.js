// authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    
    const user = ref(null);
    const accessToken = ref(null);
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const isAuthenticated = computed(() => !!user.value && !!accessToken.value);
    
    function setAuthData(data) {
        const userData = data.user || data;
        const idField = userData.id || userData.user_id;

        user.value = {
            ...userData,
            user_id: idField
        }; 
        accessToken.value = data.access_token || null; 
    }

    function logout() {
        user.value = null;
        accessToken.value = null;
        // fetch(`'${BACKEND_URL}/auth/logout'`, { method: 'POST', credentials: 'include' });
        
    }
    async function checkAuthStatus() {
        if (isAuthenticated.value) {
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/auth/status`, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (response.ok) {
                const data = await response.json();
                setAuthData(data); 
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) { 
            console.error("Auth status check failed:", error);
            logout();
            return false;
        }
    }

    return { user, accessToken, isAuthenticated, setAuthData, logout, checkAuthStatus };
});