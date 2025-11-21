import { ref, onMounted, onUnmounted } from "vue";

export function useBreakpoints() {
    const width = ref(window.innerWidth);
    const isSmall = ref(window.innerWidth < 640);
    const updateWidth = () => {
        width.value = window.innerWidth;
        isSmall.value = window.innerWidth < 640; 
    };

  onMounted(() => {
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });
  return {width, isSmall}
}