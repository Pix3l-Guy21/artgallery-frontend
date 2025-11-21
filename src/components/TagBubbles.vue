<template>
  <div class="mx-1 rounded-2xl px-3 py-1 hover:bg-[#fd9a00] hover:text-white hover:scale-110 transition-all duration-200 ease-in cursor-pointer">
    <h3>{{ tagName }}</h3>
  </div>
</template>

<script>
export default {
    props: {
        tagName: {
            type: String,
            required: true
        }
    }
}
</script>

<style>

</style>