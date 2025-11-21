<template>
  <div class="container mx-auto p-4 md:p-12 bg-gray-50 text-gray-800">

    <section class="text-center mb-16">
      <h1 class="text-5xl font-extrabold text-blue-400 mb-4 tracking-tight">
        Discover the World Through Art
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        **Artistry Gallery** is more than just a marketplace; it is a vibrant digital hub dedicated to connecting passionate **artists** with discerning **collectors** worldwide.
      </p>
    </section>

    <hr class="border-t-2 border-gray-200 mb-16">

    <section class="grid md:grid-cols-2 gap-12 items-center mb-16">
      <div class="md:order-2">
        <h2 class="text-4xl font-bold text-blue-300 mb-4">Our Vision</h2>
        <p class="text-lg mb-4 leading-relaxed">
          We believe art has the power to transform spaces and enrich lives. Our vision is to **democratize the art world**, making original, high-quality artwork accessible to everyone, regardless of their location or collecting experience. We are committed to fostering a global community where creativity thrives.
        </p>
        <p class="text-md font-semibold text-gray-700">
          "Every masterpiece begins with a single brushstroke, and every collection with a single piece."
        </p>
      </div>
      <div class="md:order-1">
        <div class="bg-gray-200 h-64 rounded-xl shadow-lg flex items-center justify-center">
            <span class="text-gray-500 text-xl font-medium">Image Placeholder: Global Art Community</span>
        </div>
      </div>
    </section>

    <section class="mb-16">
      <h2 class="text-4xl font-bold text-center text-blue-300 mb-8">What We Offer</h2>
      <div class="grid md:grid-cols-3 gap-8">
        
        <div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">🎨 Diverse Collections</h3>
          <p class="text-gray-600">
            Explore thousands of original works across all mediums—from oil paintings and sculptures to digital art and photography. Our curation emphasizes **quality and diversity**.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">🧑‍🎨 Support for Artists</h3>
          <p class="text-gray-600">
            We empower emerging and established artists by providing a platform with **fair compensation** and direct access to collectors. We handle the logistics so artists can focus on **creation**.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">✨ Effortless Collecting</h3>
          <p class="text-gray-600">
            Our platform features intuitive searching, secure payment options, and **authenticated artwork tracking**, ensuring a smooth and trustworthy process from discovery to delivery.
          </p>
        </div>
      </div>
    </section>

    <section class="text-center p-10 bg-blue-100 rounded-xl">
        <h2 class="text-3xl font-bold text-blue-300 mb-4">Join Our Community</h2>
        <p class="text-lg text-blue-600 mb-6">
            Whether you are here to browse, collect, or exhibit, we welcome you to the Artistry Gallery experience.
        </p>
        <div class="space-x-4">
            <button class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                Explore Artworks
            </button>
            <button class="bg-white text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-50 transition duration-300">
                Meet Our Artists
            </button>
        </div>
    </section>

  </div>
</template>

<script setup>
// The script setup is clean as this page is purely informational and doesn't require fetching data.
</script>

<style>
/* You can add specific styles here if needed, but Tailwind handles most of the layout */
</style>