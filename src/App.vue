<script>
import NavBar from './components/NavBar.vue';
export default {
    components: {
        NavBar
    }
}
</script>

<template>
    <div class="font-[Georgia,serif] text-gray-700 w-full pl-1 gap-0 flex flex-col items-center bg-[#efefef] h-screen overflow-scroll">
        <header class="h-[50px] md:h-[60px] w-full fixed z-20">
            <NavBar />
        </header>
        <main class="grow flex p-2 w-full h-auto mt-[50px] md:mt-[60px] justify-center">
            <router-view/>
        </main>
        <footer class="grow-0 w-full bg-[#34495e] text-white p-6 md:p-10 shadow-lg mt-auto">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                
                <div class="mb-6 md:mb-0">
                    <h4 class="text-xl font-bold mb-2 text-[#ed876e]">Get In Touch</h4>
                    <p class="text-sm">
                        <font-awesome-icon icon="fa-solid fa-envelope" class="mr-2 text-[#ed876e]" />
                        Email: <a href="mailto:info@artistrygallery.com" class="hover:text-[#ed876e] transition duration-300">info@artistrygallery.com</a>
                    </p>
                    <p class="text-sm">
                        <font-awesome-icon icon="fa-solid fa-phone" class="mr-2 text-[#ed876e]" />
                        Phone: <a href="tel:+1234567890" class="hover:text-[#ed876e] transition duration-300">(123) 456-7890</a>
                    </p>
                    <p class="text-sm">
                        <font-awesome-icon icon="fa-solid fa-location-dot" class="mr-2 text-[#ed876e]" />
                        123 Art Street, Gallery City, CA 90210
                    </p>
                </div>

                <div class="mb-6 md:mb-0">
                    <h3 class="text-2xl font-extrabold text-[#ed876e] mb-1">Artistry Gallery</h3>
                    <p class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} All rights reserved.</p>
                </div>
                
                <div>
                    <h4 class="text-xl font-bold mb-3 text-[#ed876e]">Connect with Us</h4>
                    <div class="flex justify-center md:justify-start space-x-4">
                        <a href="https://facebook.com" target="_blank" aria-label="Facebook" class="text-gray-300 hover:text-blue-500 transition duration-300 text-2xl">
                            <font-awesome-icon icon="fa-brands fa-facebook" />
                        </a>
                        <a href="https://instagram.com" target="_blank" aria-label="Instagram" class="text-gray-300 hover:text-pink-500 transition duration-300 text-2xl">
                            <font-awesome-icon icon="fa-brands fa-instagram" />
                        </a>
                        <a href="https://twitter.com" target="_blank" aria-label="Twitter" class="text-gray-300 hover:text-blue-400 transition duration-300 text-2xl">
                            <font-awesome-icon icon="fa-brands fa-twitter" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn" class="text-gray-300 hover:text-blue-700 transition duration-300 text-2xl">
                            <font-awesome-icon icon="fa-brands fa-linkedin" />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    </div>
</template>

<style scoped>

</style>
